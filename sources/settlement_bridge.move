module flowpay::settlement_bridge {
    use std::signer;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::timestamp;
    use aptos_framework::table::{Self, Table};
    use aptos_framework::type_info::{Self, TypeInfo};
    use aptos_framework::event;

    /// Error codes
    const E_UNAUTHORIZED: u64 = 1;
    const E_BRIDGE_NOT_FOUND: u64 = 2;
    const E_INSUFFICIENT_LIQUIDITY: u64 = 3;
    const E_INVALID_BANK_DETAILS: u64 = 4;
    const E_SETTLEMENT_FAILED: u64 = 5;
    const E_BRIDGE_PAUSED: u64 = 6;

    /// Constants
    const SETTLEMENT_TIMEOUT: u64 = 3600000000; // 1 hour in microseconds
    const MIN_SETTLEMENT_AMOUNT: u64 = 1000000; // $10 minimum
    const MAX_SETTLEMENT_AMOUNT: u64 = 100000000000; // $1M maximum

    struct BankDetails has store, copy {
        bank_name: vector<u8>,
        account_number: vector<u8>,
        routing_number: vector<u8>,
        swift_code: vector<u8>,
        account_holder_name: vector<u8>,
        country_code: vector<u8>,
    }

    struct SettlementRequest has store {
        request_id: u64,
        user_address: address,
        amount: u64,
        currency: TypeInfo,
        bank_details: BankDetails,
        status: u8, // 0: pending, 1: processing, 2: completed, 3: failed
        created_at: u64,
        processed_at: u64,
        settlement_reference: vector<u8>,
        fees_charged: u64,
    }

    struct BridgeProvider has store {
        provider_id: u64,
        name: vector<u8>,
        supported_countries: vector<vector<u8>>,
        supported_currencies: vector<TypeInfo>,
        fee_rate: u64, // Basis points
        min_amount: u64,
        max_amount: u64,
        liquidity_pool: u64,
        is_active: bool,
        settlement_time_avg: u64, // Average settlement time in microseconds
    }

    struct SettlementBridge has key {
        providers: Table<u64, BridgeProvider>,
        settlement_requests: Table<u64, SettlementRequest>,
        user_bank_details: Table<address, vector<BankDetails>>,
        next_request_id: u64,
        next_provider_id: u64,
        total_settled: u64,
        total_fees_collected: u64,
        is_paused: bool,
    }

    /// Events
    struct SettlementRequested has drop, store {
        request_id: u64,
        user_address: address,
        amount: u64,
        currency: TypeInfo,
        provider_id: u64,
        timestamp: u64,
    }

    struct SettlementCompleted has drop, store {
        request_id: u64,
        user_address: address,
        amount: u64,
        fees_charged: u64,
        settlement_reference: vector<u8>,
        processing_time: u64,
    }

    struct ProviderAdded has drop, store {
        provider_id: u64,
        name: vector<u8>,
        supported_countries: vector<vector<u8>>,
        timestamp: u64,
    }

    /// Initialize settlement bridge
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        assert!(!exists<SettlementBridge>(admin_addr), E_UNAUTHORIZED);
        
        move_to(admin, SettlementBridge {
            providers: table::new(),
            settlement_requests: table::new(),
            user_bank_details: table::new(),
            next_request_id: 1,
            next_provider_id: 1,
            total_settled: 0,
            total_fees_collected: 0,
            is_paused: false,
        });
    }

    /// Add settlement provider
    public entry fun add_settlement_provider(
        admin: &signer,
        name: vector<u8>,
        supported_countries: vector<vector<u8>>,
        supported_currencies: vector<TypeInfo>,
        fee_rate: u64,
        min_amount: u64,
        max_amount: u64,
        initial_liquidity: u64,
    ) acquires SettlementBridge {
        assert!(signer::address_of(admin) == @flowpay, E_UNAUTHORIZED);
        
        let bridge = borrow_global_mut<SettlementBridge>(@flowpay);
        
        let provider = BridgeProvider {
            provider_id: bridge.next_provider_id,
            name: copy name,
            supported_countries,
            supported_currencies,
            fee_rate,
            min_amount,
            max_amount,
            liquidity_pool: initial_liquidity,
            is_active: true,
            settlement_time_avg: 1800000000, // 30 minutes default
        };
        
        table::add(&mut bridge.providers, bridge.next_provider_id, provider);
        bridge.next_provider_id = bridge.next_provider_id + 1;
        
        event::emit(ProviderAdded {
            provider_id: bridge.next_provider_id - 1,
            name,
            supported_countries: copy supported_countries,
            timestamp: timestamp::now_microseconds(),
        });
    }

    /// Save user bank details
    public entry fun save_bank_details(
        user: &signer,
        bank_name: vector<u8>,
        account_number: vector<u8>,
        routing_number: vector<u8>,
        swift_code: vector<u8>,
        account_holder_name: vector<u8>,
        country_code: vector<u8>,
    ) acquires SettlementBridge {
        let user_addr = signer::address_of(user);
        let bridge = borrow_global_mut<SettlementBridge>(@flowpay);
        
        let bank_details = BankDetails {
            bank_name,
            account_number,
            routing_number,
            swift_code,
            account_holder_name,
            country_code,
        };
        
        if (table::contains(&bridge.user_bank_details, user_addr)) {
            let user_banks = table::borrow_mut(&mut bridge.user_bank_details, user_addr);
            vector::push_back(user_banks, bank_details);
        } else {
            table::add(&mut bridge.user_bank_details, user_addr, vector::singleton(bank_details));
        };
    }

    /// Request settlement to traditional bank
    public entry fun request_settlement<CoinType>(
        user: &signer,
        amount: u64,
        bank_details_index: u64,
        preferred_provider_id: u64,
    ) acquires SettlementBridge {
        let user_addr = signer::address_of(user);
        let bridge = borrow_global_mut<SettlementBridge>(@flowpay);
        
        assert!(!bridge.is_paused, E_BRIDGE_PAUSED);
        assert!(amount >= MIN_SETTLEMENT_AMOUNT, E_INVALID_BANK_DETAILS);
        assert!(amount <= MAX_SETTLEMENT_AMOUNT, E_INVALID_BANK_DETAILS);
        
        // Get user's bank details
        assert!(table::contains(&bridge.user_bank_details, user_addr), E_INVALID_BANK_DETAILS);
        let user_banks = table::borrow(&bridge.user_bank_details, user_addr);
        assert!(vector::length(user_banks) > bank_details_index, E_INVALID_BANK_DETAILS);
        let bank_details = vector::borrow(user_banks, bank_details_index);
        
        // Find suitable provider
        let provider_id = if (table::contains(&bridge.providers, preferred_provider_id)) {
            let provider = table::borrow(&bridge.providers, preferred_provider_id);
            if (provider.is_active && 
                amount >= provider.min_amount && 
                amount <= provider.max_amount &&
                provider.liquidity_pool >= amount) {
                preferred_provider_id
            } else {
                find_best_provider(bridge, amount, &bank_details.country_code)
            }
        } else {
            find_best_provider(bridge, amount, &bank_details.country_code)
        };
        
        assert!(provider_id > 0, E_BRIDGE_NOT_FOUND);
        
        // Calculate fees
        let provider = table::borrow(&bridge.providers, provider_id);
        let fees = (amount * provider.fee_rate) / 10000;
        
        // Create settlement request
        let request = SettlementRequest {
            request_id: bridge.next_request_id,
            user_address: user_addr,
            amount,
            currency: type_info::type_of<CoinType>(),
            bank_details: *bank_details,
            status: 0, // pending
            created_at: timestamp::now_microseconds(),
            processed_at: 0,
            settlement_reference: vector::empty(),
            fees_charged: fees,
        };
        
        table::add(&mut bridge.settlement_requests, bridge.next_request_id, request);
        bridge.next_request_id = bridge.next_request_id + 1;
        
        // Reserve liquidity
        let provider_mut = table::borrow_mut(&mut bridge.providers, provider_id);
        provider_mut.liquidity_pool = provider_mut.liquidity_pool - amount;
        
        event::emit(SettlementRequested {
            request_id: bridge.next_request_id - 1,
            user_address: user_addr,
            amount,
            currency: type_info::type_of<CoinType>(),
            provider_id,
            timestamp: timestamp::now_microseconds(),
        });
        
        // In production, this would trigger external settlement process
        // For now, we'll mark it as processing
        process_settlement_request(bridge.next_request_id - 1);
    }

    /// Process settlement request (called by settlement service)
    fun process_settlement_request(request_id: u64) acquires SettlementBridge {
        let bridge = borrow_global_mut<SettlementBridge>(@flowpay);
        
        if (table::contains(&bridge.settlement_requests, request_id)) {
            let request = table::borrow_mut(&mut bridge.settlement_requests, request_id);
            request.status = 1; // processing
            
            // Simulate settlement processing
            // In production, this would integrate with banking APIs
        };
    }

    /// Complete settlement (called by settlement service)
    public entry fun complete_settlement(
        admin: &signer,
        request_id: u64,
        settlement_reference: vector<u8>,
        success: bool,
    ) acquires SettlementBridge {
        assert!(signer::address_of(admin) == @flowpay, E_UNAUTHORIZED);
        
        let bridge = borrow_global_mut<SettlementBridge>(@flowpay);
        assert!(table::contains(&bridge.settlement_requests, request_id), E_BRIDGE_NOT_FOUND);
        
        let request = table::borrow_mut(&mut bridge.settlement_requests, request_id);
        let current_time = timestamp::now_microseconds();
        
        if (success) {
            request.status = 2; // completed
            request.settlement_reference = settlement_reference;
            request.processed_at = current_time;
            
            bridge.total_settled = bridge.total_settled + request.amount;
            bridge.total_fees_collected = bridge.total_fees_collected + request.fees_charged;
            
            event::emit(SettlementCompleted {
                request_id,
                user_address: request.user_address,
                amount: request.amount,
                fees_charged: request.fees_charged,
                settlement_reference,
                processing_time: current_time - request.created_at,
            });
        } else {
            request.status = 3; // failed
            request.processed_at = current_time;
            
            // Return liquidity to provider
            // In production, would need to track which provider was used
        };
    }

    /// Helper function to find best provider
    fun find_best_provider(
        bridge: &SettlementBridge,
        amount: u64,
        country_code: &vector<u8>,
    ): u64 {
        // Simplified provider selection logic
        // In production, would consider fees, settlement time, success rate, etc.
        1 // Return first provider for now
    }

    /// View functions
    #[view]
    public fun get_settlement_status(request_id: u64): u8 acquires SettlementBridge {
        let bridge = borrow_global<SettlementBridge>(@flowpay);
        
        if (table::contains(&bridge.settlement_requests, request_id)) {
            let request = table::borrow(&bridge.settlement_requests, request_id);
            request.status
        } else {
            255 // Not found
        }
    }

    #[view]
    public fun get_settlement_fees(amount: u64, provider_id: u64): u64 acquires SettlementBridge {
        let bridge = borrow_global<SettlementBridge>(@flowpay);
        
        if (table::contains(&bridge.providers, provider_id)) {
            let provider = table::borrow(&bridge.providers, provider_id);
            (amount * provider.fee_rate) / 10000
        } else {
            0
        }
    }

    #[view]
    public fun get_available_providers(): vector<u64> acquires SettlementBridge {
        let bridge = borrow_global<SettlementBridge>(@flowpay);
        // In production, would return list of active provider IDs
        vector::singleton(1)
    }

    #[view]
    public fun get_total_settled(): u64 acquires SettlementBridge {
        let bridge = borrow_global<SettlementBridge>(@flowpay);
        bridge.total_settled
    }
}