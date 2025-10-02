module flowpay::treasury_vault {
    use std::signer;
    use std::vector;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::timestamp;
    use aptos_framework::table::{Self, Table};
    use aptos_framework::type_info::{Self, TypeInfo};
    use aptos_framework::event;
    use aptos_framework::account;

    /// Error codes
    const E_VAULT_NOT_FOUND: u64 = 1;
    const E_INSUFFICIENT_BALANCE: u64 = 2;
    const E_UNAUTHORIZED: u64 = 3;
    const E_INVALID_SCHEDULE: u64 = 4;
    const E_RISK_LIMIT_EXCEEDED: u64 = 5;

    /// Constants
    const MAX_EMPLOYEES: u64 = 10000;
    const MIN_PAYMENT_INTERVAL: u64 = 86400000000; // 1 day in microseconds
    const MAX_SINGLE_PAYMENT: u64 = 1000000000000; // 1M tokens max

    struct RiskConfig has store {
        max_daily_outflow: u64,
        max_single_payment: u64,
        auto_hedge_threshold: u64, // Percentage of exposure to hedge
        allowed_currencies: vector<TypeInfo>,
        require_multi_sig: bool,
    }

    struct ScheduledPayment has store {
        recipient: address,
        amount: u64,
        currency: TypeInfo,
        frequency: u64, // Interval in microseconds
        next_execution: u64,
        total_payments: u64,
        remaining_payments: u64, // 0 = infinite
        is_active: bool,
    }

    struct CorporateVault has key {
        owner: address,
        balances: Table<TypeInfo, u64>,
        auto_hedge_enabled: bool,
        risk_parameters: RiskConfig,
        payment_schedules: Table<u64, ScheduledPayment>,
        next_schedule_id: u64,
        daily_outflow: u64,
        last_reset_day: u64,
        authorized_signers: vector<address>,
        pending_transactions: Table<u64, PendingTransaction>,
        next_tx_id: u64,
    }

    struct PendingTransaction has store {
        tx_id: u64,
        initiator: address,
        recipient: address,
        amount: u64,
        currency: TypeInfo,
        approvals: vector<address>,
        required_approvals: u64,
        created_at: u64,
        expires_at: u64,
    }

    struct VaultRegistry has key {
        vaults: Table<address, bool>,
        total_vaults: u64,
        total_assets_managed: u64,
    }

    /// Events
    struct VaultCreated has drop, store {
        owner: address,
        initial_currencies: vector<TypeInfo>,
        timestamp: u64,
    }

    struct PaymentScheduled has drop, store {
        vault_owner: address,
        schedule_id: u64,
        recipient: address,
        amount: u64,
        currency: TypeInfo,
        frequency: u64,
    }

    struct PaymentExecuted has drop, store {
        vault_owner: address,
        schedule_id: u64,
        recipient: address,
        amount: u64,
        currency: TypeInfo,
        execution_time: u64,
    }

    struct HedgeExecuted has drop, store {
        vault_owner: address,
        base_currency: TypeInfo,
        hedge_currency: TypeInfo,
        amount_hedged: u64,
        hedge_rate: u64,
    }

    /// Initialize treasury system
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        assert!(!exists<VaultRegistry>(admin_addr), E_UNAUTHORIZED);
        
        move_to(admin, VaultRegistry {
            vaults: table::new(),
            total_vaults: 0,
            total_assets_managed: 0,
        });
    }

    /// Create a new corporate vault
    public entry fun create_vault(
        company: &signer,
        max_daily_outflow: u64,
        max_single_payment: u64,
        auto_hedge_threshold: u64,
        require_multi_sig: bool,
    ) acquires VaultRegistry {
        let company_addr = signer::address_of(company);
        assert!(!exists<CorporateVault>(company_addr), E_UNAUTHORIZED);
        
        let risk_config = RiskConfig {
            max_daily_outflow,
            max_single_payment,
            auto_hedge_threshold,
            allowed_currencies: vector::empty(),
            require_multi_sig,
        };
        
        let vault = CorporateVault {
            owner: company_addr,
            balances: table::new(),
            auto_hedge_enabled: false,
            risk_parameters: risk_config,
            payment_schedules: table::new(),
            next_schedule_id: 1,
            daily_outflow: 0,
            last_reset_day: get_current_day(),
            authorized_signers: vector::singleton(company_addr),
            pending_transactions: table::new(),
            next_tx_id: 1,
        };
        
        move_to(company, vault);
        
        // Update registry
        let registry = borrow_global_mut<VaultRegistry>(@flowpay);
        table::add(&mut registry.vaults, company_addr, true);
        registry.total_vaults = registry.total_vaults + 1;
        
        event::emit(VaultCreated {
            owner: company_addr,
            initial_currencies: vector::empty(),
            timestamp: timestamp::now_microseconds(),
        });
    }

    /// Deposit funds into vault
    public entry fun deposit<CoinType>(
        company: &signer,
        amount: u64,
    ) acquires CorporateVault {
        let company_addr = signer::address_of(company);
        assert!(exists<CorporateVault>(company_addr), E_VAULT_NOT_FOUND);
        
        let vault = borrow_global_mut<CorporateVault>(company_addr);
        let currency_type = type_info::type_of<CoinType>();
        
        // Update balance
        if (table::contains(&vault.balances, currency_type)) {
            let current_balance = table::borrow_mut(&mut vault.balances, currency_type);
            *current_balance = *current_balance + amount;
        } else {
            table::add(&mut vault.balances, currency_type, amount);
        };
        
        // Transfer coins to vault (in production, this would be handled properly)
        // coin::transfer<CoinType>(company, @flowpay, amount);
    }

    /// Setup automated payroll
    public entry fun setup_payroll_automation(
        company: &signer,
        employees: vector<address>,
        salaries: vector<u64>,
        currency: TypeInfo,
        payment_frequency: u64, // e.g., monthly = 30 * 24 * 60 * 60 * 1000000 microseconds
    ) acquires CorporateVault {
        let company_addr = signer::address_of(company);
        assert!(exists<CorporateVault>(company_addr), E_VAULT_NOT_FOUND);
        
        let vault = borrow_global_mut<CorporateVault>(company_addr);
        assert!(vector::length(&employees) == vector::length(&salaries), E_INVALID_SCHEDULE);
        assert!(vector::length(&employees) <= MAX_EMPLOYEES, E_INVALID_SCHEDULE);
        
        let i = 0;
        let len = vector::length(&employees);
        let current_time = timestamp::now_microseconds();
        
        while (i < len) {
            let employee = *vector::borrow(&employees, i);
            let salary = *vector::borrow(&salaries, i);
            
            let schedule = ScheduledPayment {
                recipient: employee,
                amount: salary,
                currency,
                frequency: payment_frequency,
                next_execution: current_time + payment_frequency,
                total_payments: 0,
                remaining_payments: 0, // Infinite payments
                is_active: true,
            };
            
            let schedule_id = vault.next_schedule_id;
            table::add(&mut vault.payment_schedules, schedule_id, schedule);
            vault.next_schedule_id = vault.next_schedule_id + 1;
            
            event::emit(PaymentScheduled {
                vault_owner: company_addr,
                schedule_id,
                recipient: employee,
                amount: salary,
                currency,
                frequency: payment_frequency,
            });
            
            i = i + 1;
        };
    }

    /// Execute scheduled payments (called by automation system)
    public entry fun execute_scheduled_payments(
        vault_owner: address,
    ) acquires CorporateVault {
        assert!(exists<CorporateVault>(vault_owner), E_VAULT_NOT_FOUND);
        
        let vault = borrow_global_mut<CorporateVault>(vault_owner);
        let current_time = timestamp::now_microseconds();
        
        // Reset daily outflow if new day
        let current_day = get_current_day();
        if (current_day > vault.last_reset_day) {
            vault.daily_outflow = 0;
            vault.last_reset_day = current_day;
        };
        
        // Process all scheduled payments
        let schedule_ids = get_all_schedule_ids(vault);
        let i = 0;
        let len = vector::length(&schedule_ids);
        
        while (i < len) {
            let schedule_id = *vector::borrow(&schedule_ids, i);
            if (table::contains(&vault.payment_schedules, schedule_id)) {
                let schedule = table::borrow_mut(&mut vault.payment_schedules, schedule_id);
                
                if (schedule.is_active && current_time >= schedule.next_execution) {
                    execute_single_payment(vault, schedule_id, current_time);
                };
            };
            i = i + 1;
        };
    }

    fun execute_single_payment(
        vault: &mut CorporateVault,
        schedule_id: u64,
        current_time: u64,
    ) {
        let schedule = table::borrow_mut(&mut vault.payment_schedules, schedule_id);
        
        // Check risk limits
        assert!(vault.daily_outflow + schedule.amount <= vault.risk_parameters.max_daily_outflow, E_RISK_LIMIT_EXCEEDED);
        assert!(schedule.amount <= vault.risk_parameters.max_single_payment, E_RISK_LIMIT_EXCEEDED);
        
        // Check balance
        if (table::contains(&vault.balances, schedule.currency)) {
            let balance = table::borrow_mut(&mut vault.balances, schedule.currency);
            assert!(*balance >= schedule.amount, E_INSUFFICIENT_BALANCE);
            
            // Execute payment
            *balance = *balance - schedule.amount;
            vault.daily_outflow = vault.daily_outflow + schedule.amount;
            
            // Update schedule
            schedule.next_execution = current_time + schedule.frequency;
            schedule.total_payments = schedule.total_payments + 1;
            
            if (schedule.remaining_payments > 0) {
                schedule.remaining_payments = schedule.remaining_payments - 1;
                if (schedule.remaining_payments == 0) {
                    schedule.is_active = false;
                };
            };
            
            // In production: transfer funds to recipient
            // This would integrate with the payment router
            
            event::emit(PaymentExecuted {
                vault_owner: vault.owner,
                schedule_id,
                recipient: schedule.recipient,
                amount: schedule.amount,
                currency: schedule.currency,
                execution_time: current_time,
            });
        };
    }

    /// Auto-hedge currency exposure
    public entry fun auto_hedge_exposure(
        vault_owner: address,
    ) acquires CorporateVault {
        assert!(exists<CorporateVault>(vault_owner), E_VAULT_NOT_FOUND);
        
        let vault = borrow_global_mut<CorporateVault>(vault_owner);
        
        if (!vault.auto_hedge_enabled) {
            return
        };
        
        // Calculate exposure for each currency
        let currencies = get_vault_currencies(vault);
        let i = 0;
        let len = vector::length(&currencies);
        
        while (i < len) {
            let currency = *vector::borrow(&currencies, i);
            if (table::contains(&vault.balances, currency)) {
                let balance = *table::borrow(&vault.balances, currency);
                let exposure_threshold = (balance * vault.risk_parameters.auto_hedge_threshold) / 100;
                
                if (balance > exposure_threshold) {
                    // Execute hedge (simplified - would integrate with derivatives)
                    let hedge_amount = balance - exposure_threshold;
                    execute_hedge(vault, currency, hedge_amount);
                };
            };
            i = i + 1;
        };
    }

    fun execute_hedge(
        vault: &mut CorporateVault,
        base_currency: TypeInfo,
        amount: u64,
    ) {
        // In production, this would:
        // 1. Create derivative position
        // 2. Execute on prediction markets
        // 3. Use FOREX forwards
        // 4. Integrate with external hedging protocols
        
        event::emit(HedgeExecuted {
            vault_owner: vault.owner,
            base_currency,
            hedge_currency: type_info::type_of<u64>(), // Placeholder
            amount_hedged: amount,
            hedge_rate: 100000000, // Placeholder rate
        });
    }

    /// Helper functions
    fun get_current_day(): u64 {
        timestamp::now_microseconds() / (24 * 60 * 60 * 1000000)
    }

    fun get_all_schedule_ids(vault: &CorporateVault): vector<u64> {
        // In production, this would efficiently iterate through table keys
        vector::empty<u64>() // Placeholder
    }

    fun get_vault_currencies(vault: &CorporateVault): vector<TypeInfo> {
        // In production, this would return all currency types in the vault
        vector::empty<TypeInfo>() // Placeholder
    }

    /// View functions
    #[view]
    public fun get_vault_balance<CoinType>(vault_owner: address): u64 acquires CorporateVault {
        if (!exists<CorporateVault>(vault_owner)) {
            return 0
        };
        
        let vault = borrow_global<CorporateVault>(vault_owner);
        let currency_type = type_info::type_of<CoinType>();
        
        if (table::contains(&vault.balances, currency_type)) {
            *table::borrow(&vault.balances, currency_type)
        } else {
            0
        }
    }

    #[view]
    public fun get_daily_outflow(vault_owner: address): u64 acquires CorporateVault {
        if (!exists<CorporateVault>(vault_owner)) {
            return 0
        };
        
        let vault = borrow_global<CorporateVault>(vault_owner);
        vault.daily_outflow
    }

    #[view]
    public fun get_active_schedules_count(vault_owner: address): u64 acquires CorporateVault {
        if (!exists<CorporateVault>(vault_owner)) {
            return 0
        };
        
        let vault = borrow_global<CorporateVault>(vault_owner);
        // In production, count active schedules
        0 // Placeholder
    }
}