module flowpay::forex_engine {
    use std::signer;
    use std::vector;
    use aptos_framework::timestamp;
    use aptos_framework::table::{Self, Table};
    use aptos_framework::type_info::{Self, TypeInfo};
    use aptos_framework::coin;
    use aptos_framework::event;

    /// Error codes
    const E_PAIR_NOT_FOUND: u64 = 1;
    const E_INSUFFICIENT_LIQUIDITY: u64 = 2;
    const E_SLIPPAGE_EXCEEDED: u64 = 3;
    const E_STALE_PRICE: u64 = 4;
    const E_UNAUTHORIZED: u64 = 5;

    /// Constants
    const PRICE_PRECISION: u64 = 100000000; // 8 decimal places
    const MAX_PRICE_AGE: u64 = 30000000; // 30 seconds in microseconds
    const MIN_LIQUIDITY_THRESHOLD: u64 = 1000000; // Minimum liquidity for trading

    struct CurrencyPair has store {
        base: TypeInfo,
        quote: TypeInfo,
        current_rate: u64, // Price with 8 decimal precision
        last_updated: u64,
        daily_volume: u64,
        total_liquidity: u64,
        bid_price: u64,
        ask_price: u64,
        spread_bps: u64, // Spread in basis points
    }

    struct ForexRegistry has key {
        pairs: Table<vector<u8>, CurrencyPair>,
        supported_currencies: vector<TypeInfo>,
        total_daily_volume: u64,
        oracle_sources: vector<address>,
    }

    struct LiquidityPool<phantom Base, phantom Quote> has key {
        base_reserve: u64,
        quote_reserve: u64,
        total_shares: u64,
        fee_rate: u64, // Fee in basis points
        last_price: u64,
    }

    /// Events
    struct PriceUpdate has drop, store {
        base_currency: TypeInfo,
        quote_currency: TypeInfo,
        old_price: u64,
        new_price: u64,
        timestamp: u64,
    }

    struct ForexSwap has drop, store {
        trader: address,
        base_currency: TypeInfo,
        quote_currency: TypeInfo,
        input_amount: u64,
        output_amount: u64,
        execution_price: u64,
        fees_paid: u64,
    }

    /// Initialize FOREX engine
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        assert!(!exists<ForexRegistry>(admin_addr), E_UNAUTHORIZED);
        
        move_to(admin, ForexRegistry {
            pairs: table::new(),
            supported_currencies: vector::empty(),
            total_daily_volume: 0,
            oracle_sources: vector::empty(),
        });
    }

    /// Add a new currency pair
    public entry fun add_currency_pair<Base, Quote>(
        admin: &signer,
        initial_rate: u64,
        spread_bps: u64,
    ) acquires ForexRegistry {
        assert!(signer::address_of(admin) == @flowpay, E_UNAUTHORIZED);
        
        let registry = borrow_global_mut<ForexRegistry>(@flowpay);
        let pair_key = generate_pair_key<Base, Quote>();
        
        let pair = CurrencyPair {
            base: type_info::type_of<Base>(),
            quote: type_info::type_of<Quote>(),
            current_rate: initial_rate,
            last_updated: timestamp::now_microseconds(),
            daily_volume: 0,
            total_liquidity: 0,
            bid_price: initial_rate - ((initial_rate * spread_bps) / 20000), // Half spread
            ask_price: initial_rate + ((initial_rate * spread_bps) / 20000), // Half spread
            spread_bps,
        };
        
        table::add(&mut registry.pairs, pair_key, pair);
    }

    /// Get real-time exchange rate (integrates with external oracles)
    public fun get_real_time_rate<Base, Quote>(): u64 acquires ForexRegistry {
        let registry = borrow_global<ForexRegistry>(@flowpay);
        let pair_key = generate_pair_key<Base, Quote>();
        
        assert!(table::contains(&registry.pairs, pair_key), E_PAIR_NOT_FOUND);
        
        let pair = table::borrow(&registry.pairs, pair_key);
        
        // Check if price is stale
        let current_time = timestamp::now_microseconds();
        assert!(current_time - pair.last_updated <= MAX_PRICE_AGE, E_STALE_PRICE);
        
        // In production, this would aggregate prices from multiple sources:
        // 1. Merkle Trade CLOB
        // 2. Hyperion price feeds
        // 3. External CEX APIs
        // 4. On-chain AMM prices
        
        pair.current_rate
    }

    /// Execute atomic FOREX swap
    public fun execute_forex_swap<From, To>(
        amount: u64,
        min_output: u64,
    ): u64 acquires ForexRegistry {
        let registry = borrow_global_mut<ForexRegistry>(@flowpay);
        let pair_key = generate_pair_key<From, To>();
        
        assert!(table::contains(&registry.pairs, pair_key), E_PAIR_NOT_FOUND);
        
        let pair = table::borrow_mut(&mut registry.pairs, pair_key);
        
        // Calculate output amount with current rate
        let output_amount = (amount * pair.current_rate) / PRICE_PRECISION;
        
        // Apply spread (use ask price for buying)
        let final_output = (output_amount * (10000 - pair.spread_bps)) / 10000;
        
        // Check slippage protection
        assert!(final_output >= min_output, E_SLIPPAGE_EXCEEDED);
        
        // Update pair statistics
        pair.daily_volume = pair.daily_volume + amount;
        registry.total_daily_volume = registry.total_daily_volume + amount;
        
        // In production, this would:
        // 1. Execute trade on Merkle Trade CLOB
        // 2. Update liquidity pools
        // 3. Rebalance reserves
        // 4. Update price based on trade impact
        
        final_output
    }

    /// Update price from oracle (called by price feed)
    public entry fun update_price<Base, Quote>(
        oracle: &signer,
        new_price: u64,
    ) acquires ForexRegistry {
        // In production, verify oracle is authorized
        let registry = borrow_global_mut<ForexRegistry>(@flowpay);
        let pair_key = generate_pair_key<Base, Quote>();
        
        if (table::contains(&registry.pairs, pair_key)) {
            let pair = table::borrow_mut(&mut registry.pairs, pair_key);
            let old_price = pair.current_rate;
            
            pair.current_rate = new_price;
            pair.last_updated = timestamp::now_microseconds();
            
            // Update bid/ask prices with spread
            pair.bid_price = new_price - ((new_price * pair.spread_bps) / 20000);
            pair.ask_price = new_price + ((new_price * pair.spread_bps) / 20000);
            
            // Emit price update event
            event::emit(PriceUpdate {
                base_currency: type_info::type_of<Base>(),
                quote_currency: type_info::type_of<Quote>(),
                old_price,
                new_price,
                timestamp: timestamp::now_microseconds(),
            });
        };
    }

    /// Create liquidity pool for a currency pair
    public entry fun create_liquidity_pool<Base, Quote>(
        provider: &signer,
        base_amount: u64,
        quote_amount: u64,
    ) {
        let provider_addr = signer::address_of(provider);
        
        // Ensure pool doesn't already exist
        assert!(!exists<LiquidityPool<Base, Quote>>(provider_addr), E_UNAUTHORIZED);
        
        let initial_price = (quote_amount * PRICE_PRECISION) / base_amount;
        let initial_shares = base_amount; // Simple share calculation
        
        move_to(provider, LiquidityPool<Base, Quote> {
            base_reserve: base_amount,
            quote_reserve: quote_amount,
            total_shares: initial_shares,
            fee_rate: 30, // 0.3% fee
            last_price: initial_price,
        });
    }

    /// Helper function to generate pair key
    fun generate_pair_key<Base, Quote>(): vector<u8> {
        let base_info = type_info::type_of<Base>();
        let quote_info = type_info::type_of<Quote>();
        
        // Create simple key using type info
        let key = vector::empty<u8>();
        vector::append(&mut key, b"pair_");
        // Use a simple hash-like approach for now
        let base_name = type_info::struct_name(&base_info);
        let quote_name = type_info::struct_name(&quote_info);
        vector::append(&mut key, base_name);
        vector::append(&mut key, b"_");
        vector::append(&mut key, quote_name);
        key
    }

    /// View functions
    #[view]
    public fun get_pair_info<Base, Quote>(): (u64, u64, u64, u64) acquires ForexRegistry {
        let registry = borrow_global<ForexRegistry>(@flowpay);
        let pair_key = generate_pair_key<Base, Quote>();
        
        if (table::contains(&registry.pairs, pair_key)) {
            let pair = table::borrow(&registry.pairs, pair_key);
            (pair.current_rate, pair.bid_price, pair.ask_price, pair.spread_bps)
        } else {
            (0, 0, 0, 0)
        }
    }

    #[view]
    public fun get_daily_volume<Base, Quote>(): u64 acquires ForexRegistry {
        let registry = borrow_global<ForexRegistry>(@flowpay);
        let pair_key = generate_pair_key<Base, Quote>();
        
        if (table::contains(&registry.pairs, pair_key)) {
            let pair = table::borrow(&registry.pairs, pair_key);
            pair.daily_volume
        } else {
            0
        }
    }

    #[view]
    public fun calculate_swap_output<From, To>(input_amount: u64): u64 acquires ForexRegistry {
        let rate = get_real_time_rate<From, To>();
        let output = (input_amount * rate) / PRICE_PRECISION;
        
        // Apply spread for estimation
        let registry = borrow_global<ForexRegistry>(@flowpay);
        let pair_key = generate_pair_key<From, To>();
        
        if (table::contains(&registry.pairs, pair_key)) {
            let pair = table::borrow(&registry.pairs, pair_key);
            (output * (10000 - pair.spread_bps)) / 10000
        } else {
            output
        }
    }
}