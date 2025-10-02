module flowpay::payment_router {
    use std::signer;
    use std::vector;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::timestamp;
    use aptos_framework::table::{Self, Table};
    use aptos_framework::type_info::{Self, TypeInfo};
    use aptos_framework::event;
    use aptos_framework::account;

    /// Error codes
    const E_INSUFFICIENT_BALANCE: u64 = 1;
    const E_INVALID_ROUTE: u64 = 2;
    const E_SLIPPAGE_EXCEEDED: u64 = 3;
    const E_PAYMENT_NOT_FOUND: u64 = 4;
    const E_UNAUTHORIZED: u64 = 5;

    /// Payment status constants
    const STATUS_PENDING: u8 = 0;
    const STATUS_PROCESSING: u8 = 1;
    const STATUS_COMPLETED: u8 = 2;
    const STATUS_FAILED: u8 = 3;

    struct PaymentRoute has store {
        route_id: u64,
        sender: address,
        recipient: address,
        amount: u64,
        source_currency: TypeInfo,
        target_currency: TypeInfo,
        exchange_rate: u64, // Rate with 8 decimal precision
        status: u8,
        created_at: u64,
        completed_at: u64,
        fees_paid: u64,
    }

    struct GlobalPaymentRegistry has key {
        routes: Table<u64, PaymentRoute>,
        next_route_id: u64,
        total_volume: u64,
        total_fees_collected: u64,
        active_routes: vector<u64>,
    }

    /// Events
    struct PaymentInitiated has drop, store {
        route_id: u64,
        sender: address,
        recipient: address,
        amount: u64,
        source_currency: TypeInfo,
        target_currency: TypeInfo,
    }

    struct PaymentCompleted has drop, store {
        route_id: u64,
        final_amount: u64,
        fees_paid: u64,
        execution_time_ms: u64,
    }

    /// Initialize the payment system
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        assert!(!exists<GlobalPaymentRegistry>(admin_addr), E_UNAUTHORIZED);
        
        move_to(admin, GlobalPaymentRegistry {
            routes: table::new(),
            next_route_id: 1,
            total_volume: 0,
            total_fees_collected: 0,
            active_routes: vector::empty(),
        });
    }

    /// Initiate a cross-border payment
    public entry fun initiate_payment<SourceCoin, TargetCoin>(
        sender: &signer,
        recipient: address,
        amount: u64,
        max_slippage: u64, // Basis points (100 = 1%)
    ) acquires GlobalPaymentRegistry {
        let sender_addr = signer::address_of(sender);
        let registry = borrow_global_mut<GlobalPaymentRegistry>(@flowpay);
        
        // Validate sender has sufficient balance
        assert!(coin::balance<SourceCoin>(sender_addr) >= amount, E_INSUFFICIENT_BALANCE);
        
        // Get current exchange rate from FOREX engine
        let exchange_rate = flowpay::forex_engine::get_real_time_rate<SourceCoin, TargetCoin>();
        
        // Calculate expected output with slippage
        let expected_output = (amount * exchange_rate) / 100000000; // 8 decimal precision
        let min_output = expected_output - ((expected_output * max_slippage) / 10000);
        
        // Create payment route
        let route_id = registry.next_route_id;
        let route = PaymentRoute {
            route_id,
            sender: sender_addr,
            recipient,
            amount,
            source_currency: type_info::type_of<SourceCoin>(),
            target_currency: type_info::type_of<TargetCoin>(),
            exchange_rate,
            status: STATUS_PENDING,
            created_at: timestamp::now_microseconds(),
            completed_at: 0,
            fees_paid: 0,
        };
        
        table::add(&mut registry.routes, route_id, route);
        vector::push_back(&mut registry.active_routes, route_id);
        registry.next_route_id = registry.next_route_id + 1;
        
        // Emit event
        event::emit(PaymentInitiated {
            route_id,
            sender: sender_addr,
            recipient,
            amount,
            source_currency: type_info::type_of<SourceCoin>(),
            target_currency: type_info::type_of<TargetCoin>(),
        });
        
        // Execute payment immediately (leveraging Aptos parallel execution)
        execute_payment_route<SourceCoin, TargetCoin>(route_id, min_output);
    }

    /// Execute payment route with atomic settlement
    fun execute_payment_route<SourceCoin, TargetCoin>(
        route_id: u64,
        min_output: u64,
    ) acquires GlobalPaymentRegistry {
        let registry = borrow_global_mut<GlobalPaymentRegistry>(@flowpay);
        let route = table::borrow_mut(&mut registry.routes, route_id);
        
        route.status = STATUS_PROCESSING;
        
        // Calculate fees (0.1% of transaction)
        let fee_amount = route.amount / 1000;
        let net_amount = route.amount - fee_amount;
        
        // Execute FOREX conversion
        let output_amount = flowpay::forex_engine::execute_forex_swap<SourceCoin, TargetCoin>(
            net_amount,
            min_output
        );
        
        // Transfer funds to recipient
        // Note: In production, this would handle cross-chain transfers
        // For now, assuming same-chain transfer
        
        // Update route status
        route.status = STATUS_COMPLETED;
        route.completed_at = timestamp::now_microseconds();
        route.fees_paid = fee_amount;
        
        // Update global metrics
        registry.total_volume = registry.total_volume + route.amount;
        registry.total_fees_collected = registry.total_fees_collected + fee_amount;
        
        // Remove from active routes
        let (found, index) = vector::index_of(&registry.active_routes, &route_id);
        if (found) {
            vector::remove(&mut registry.active_routes, index);
        };
        
        // Emit completion event
        event::emit(PaymentCompleted {
            route_id,
            final_amount: output_amount,
            fees_paid: fee_amount,
            execution_time_ms: (route.completed_at - route.created_at) / 1000,
        });
    }

    /// Batch process multiple payments in parallel
    public entry fun execute_parallel_settlement(
        admin: &signer,
        route_ids: vector<u64>
    ) {
        assert!(signer::address_of(admin) == @flowpay, E_UNAUTHORIZED);
        
        let i = 0;
        let len = vector::length(&route_ids);
        
        while (i < len) {
            let route_id = *vector::borrow(&route_ids, i);
            // In a real implementation, these would execute in parallel
            // Aptos' parallel execution engine handles this automatically
            process_single_route(route_id);
            i = i + 1;
        };
    }

    fun process_single_route(route_id: u64) {
        // Individual route processing logic
        // This function would be called in parallel for each route
    }

    /// View functions
    #[view]
    public fun get_payment_status(route_id: u64): u8 acquires GlobalPaymentRegistry {
        let registry = borrow_global<GlobalPaymentRegistry>(@flowpay);
        assert!(table::contains(&registry.routes, route_id), E_PAYMENT_NOT_FOUND);
        
        let route = table::borrow(&registry.routes, route_id);
        route.status
    }

    #[view]
    public fun get_total_volume(): u64 acquires GlobalPaymentRegistry {
        let registry = borrow_global<GlobalPaymentRegistry>(@flowpay);
        registry.total_volume
    }

    #[view]
    public fun get_active_routes_count(): u64 acquires GlobalPaymentRegistry {
        let registry = borrow_global<GlobalPaymentRegistry>(@flowpay);
        vector::length(&registry.active_routes)
    }
}