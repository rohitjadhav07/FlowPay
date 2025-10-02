module flowpay::compliance_oracle {
    use std::signer;
    use std::vector;
    use aptos_framework::timestamp;
    use aptos_framework::table::{Self, Table};
    use aptos_framework::event;

    /// Error codes
    const E_UNAUTHORIZED: u64 = 1;
    const E_USER_NOT_VERIFIED: u64 = 2;
    const E_VERIFICATION_EXPIRED: u64 = 3;
    const E_INVALID_DOCUMENT: u64 = 4;
    const E_COMPLIANCE_CHECK_FAILED: u64 = 5;

    /// Constants
    const VERIFICATION_VALIDITY_PERIOD: u64 = 31536000000000; // 1 year in microseconds
    const MAX_TRANSACTION_AMOUNT_UNVERIFIED: u64 = 100000000; // $1000 in smallest unit
    const RISK_SCORE_THRESHOLD: u64 = 75; // Out of 100

    struct KYCDocument has store {
        document_type: u8, // 1: ID, 2: Passport, 3: Utility Bill, etc.
        document_hash: vector<u8>,
        verification_status: u8, // 0: pending, 1: approved, 2: rejected
        verified_at: u64,
        expires_at: u64,
    }

    struct UserCompliance has store {
        user_address: address,
        kyc_level: u8, // 0: none, 1: basic, 2: enhanced
        documents: vector<KYCDocument>,
        risk_score: u64, // 0-100, higher is riskier
        last_updated: u64,
        verification_provider: address,
        country_code: vector<u8>,
        is_sanctioned: bool,
        transaction_limits: TransactionLimits,
    }

    struct TransactionLimits has store {
        daily_limit: u64,
        monthly_limit: u64,
        single_transaction_limit: u64,
        daily_spent: u64,
        monthly_spent: u64,
        last_reset_day: u64,
        last_reset_month: u64,
    }

    struct ComplianceRegistry has key {
        users: Table<address, UserCompliance>,
        authorized_providers: vector<address>,
        sanctioned_addresses: Table<address, bool>,
        high_risk_countries: vector<vector<u8>>,
        total_verifications: u64,
    }

    struct AMLAlert has store {
        user_address: address,
        alert_type: u8, // 1: suspicious pattern, 2: high risk country, 3: sanctions match
        description: vector<u8>,
        severity: u8, // 1: low, 2: medium, 3: high
        created_at: u64,
        resolved: bool,
    }

    /// Events
    struct KYCSubmitted has drop, store {
        user_address: address,
        document_type: u8,
        timestamp: u64,
    }

    struct KYCApproved has drop, store {
        user_address: address,
        kyc_level: u8,
        timestamp: u64,
    }

    struct ComplianceAlert has drop, store {
        user_address: address,
        alert_type: u8,
        severity: u8,
        timestamp: u64,
    }

    /// Initialize compliance system
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        assert!(!exists<ComplianceRegistry>(admin_addr), E_UNAUTHORIZED);
        
        move_to(admin, ComplianceRegistry {
            users: table::new(),
            authorized_providers: vector::singleton(admin_addr),
            sanctioned_addresses: table::new(),
            high_risk_countries: vector::empty(),
            total_verifications: 0,
        });
    }

    /// Submit KYC documents
    public entry fun submit_kyc_document(
        user: &signer,
        document_type: u8,
        document_hash: vector<u8>,
    ) acquires ComplianceRegistry {
        let user_addr = signer::address_of(user);
        let registry = borrow_global_mut<ComplianceRegistry>(@flowpay);
        
        let document = KYCDocument {
            document_type,
            document_hash,
            verification_status: 0, // pending
            verified_at: 0,
            expires_at: 0,
        };
        
        if (table::contains(&registry.users, user_addr)) {
            let user_compliance = table::borrow_mut(&mut registry.users, user_addr);
            vector::push_back(&mut user_compliance.documents, document);
        } else {
            let limits = TransactionLimits {
                daily_limit: MAX_TRANSACTION_AMOUNT_UNVERIFIED,
                monthly_limit: MAX_TRANSACTION_AMOUNT_UNVERIFIED * 30,
                single_transaction_limit: MAX_TRANSACTION_AMOUNT_UNVERIFIED / 10,
                daily_spent: 0,
                monthly_spent: 0,
                last_reset_day: get_current_day(),
                last_reset_month: get_current_month(),
            };
            
            let user_compliance = UserCompliance {
                user_address: user_addr,
                kyc_level: 0,
                documents: vector::singleton(document),
                risk_score: 50, // Default medium risk
                last_updated: timestamp::now_microseconds(),
                verification_provider: @0x0,
                country_code: vector::empty(),
                is_sanctioned: false,
                transaction_limits: limits,
            };
            
            table::add(&mut registry.users, user_addr, user_compliance);
        };
        
        event::emit(KYCSubmitted {
            user_address: user_addr,
            document_type,
            timestamp: timestamp::now_microseconds(),
        });
    }

    /// Verify KYC documents (called by authorized provider)
    public entry fun verify_kyc_document(
        provider: &signer,
        user_address: address,
        document_index: u64,
        approved: bool,
        kyc_level: u8,
        country_code: vector<u8>,
    ) acquires ComplianceRegistry {
        let provider_addr = signer::address_of(provider);
        let registry = borrow_global_mut<ComplianceRegistry>(@flowpay);
        
        // Verify provider is authorized
        assert!(vector::contains(&registry.authorized_providers, &provider_addr), E_UNAUTHORIZED);
        assert!(table::contains(&registry.users, user_address), E_USER_NOT_VERIFIED);
        
        let user_compliance = table::borrow_mut(&mut registry.users, user_address);
        let document = vector::borrow_mut(&mut user_compliance.documents, document_index);
        
        let current_time = timestamp::now_microseconds();
        
        if (approved) {
            document.verification_status = 1; // approved
            document.verified_at = current_time;
            document.expires_at = current_time + VERIFICATION_VALIDITY_PERIOD;
            
            user_compliance.kyc_level = kyc_level;
            user_compliance.country_code = country_code;
            user_compliance.verification_provider = provider_addr;
            user_compliance.last_updated = current_time;
            
            // Update transaction limits based on KYC level
            update_transaction_limits(user_compliance, kyc_level);
            
            registry.total_verifications = registry.total_verifications + 1;
            
            event::emit(KYCApproved {
                user_address,
                kyc_level,
                timestamp: current_time,
            });
        } else {
            document.verification_status = 2; // rejected
        };
    }

    /// Check if user can perform transaction
    public fun check_transaction_compliance(
        user_address: address,
        amount: u64,
        recipient_address: address,
    ): bool acquires ComplianceRegistry {
        let registry = borrow_global<ComplianceRegistry>(@flowpay);
        
        // Check if user exists in compliance registry
        if (!table::contains(&registry.users, user_address)) {
            return false
        };
        
        let user_compliance = table::borrow(&registry.users, user_address);
        
        // Check if user is sanctioned
        if (user_compliance.is_sanctioned) {
            return false
        };
        
        // Check if recipient is sanctioned
        if (table::contains(&registry.sanctioned_addresses, recipient_address)) {
            return false
        };
        
        // Check transaction limits
        if (!check_transaction_limits(user_compliance, amount)) {
            return false
        };
        
        // Check risk score
        if (user_compliance.risk_score > RISK_SCORE_THRESHOLD) {
            return false
        };
        
        true
    }

    /// Update user's transaction spending
    public entry fun update_transaction_spending(
        user_address: address,
        amount: u64,
    ) acquires ComplianceRegistry {
        let registry = borrow_global_mut<ComplianceRegistry>(@flowpay);
        
        if (table::contains(&registry.users, user_address)) {
            let user_compliance = table::borrow_mut(&mut registry.users, user_address);
            let limits = &mut user_compliance.transaction_limits;
            
            let current_day = get_current_day();
            let current_month = get_current_month();
            
            // Reset daily spending if new day
            if (current_day > limits.last_reset_day) {
                limits.daily_spent = 0;
                limits.last_reset_day = current_day;
            };
            
            // Reset monthly spending if new month
            if (current_month > limits.last_reset_month) {
                limits.monthly_spent = 0;
                limits.last_reset_month = current_month;
            };
            
            limits.daily_spent = limits.daily_spent + amount;
            limits.monthly_spent = limits.monthly_spent + amount;
        };
    }

    /// Helper functions
    fun update_transaction_limits(user_compliance: &mut UserCompliance, kyc_level: u8) {
        let limits = &mut user_compliance.transaction_limits;
        
        if (kyc_level == 0) {
            // No KYC - very limited
            limits.daily_limit = 100000000; // $1,000
            limits.monthly_limit = 1000000000; // $10,000
            limits.single_transaction_limit = 50000000; // $500
        } else if (kyc_level == 1) {
                // Basic KYC
            // Basic KYC
            limits.daily_limit = 1000000000; // $10,000
            limits.monthly_limit = 10000000000; // $100,000
            limits.single_transaction_limit = 500000000; // $5,000
        } else if (kyc_level == 2) {
            // Enhanced KYC
            limits.daily_limit = 10000000000; // $100,000
            limits.monthly_limit = 100000000000; // $1,000,000
            limits.single_transaction_limit = 5000000000; // $50,000
        };
        // Invalid level, keep current limits
    }

    fun check_transaction_limits(user_compliance: &UserCompliance, amount: u64): bool {
        let limits = &user_compliance.transaction_limits;
        
        // Check single transaction limit
        if (amount > limits.single_transaction_limit) {
            return false
        };
        
        // Check daily limit
        if (limits.daily_spent + amount > limits.daily_limit) {
            return false
        };
        
        // Check monthly limit
        if (limits.monthly_spent + amount > limits.monthly_limit) {
            return false
        };
        
        true
    }

    fun get_current_day(): u64 {
        timestamp::now_microseconds() / (24 * 60 * 60 * 1000000)
    }

    fun get_current_month(): u64 {
        timestamp::now_microseconds() / (30 * 24 * 60 * 60 * 1000000)
    }

    /// View functions
    #[view]
    public fun get_user_kyc_level(user_address: address): u8 acquires ComplianceRegistry {
        let registry = borrow_global<ComplianceRegistry>(@flowpay);
        
        if (table::contains(&registry.users, user_address)) {
            let user_compliance = table::borrow(&registry.users, user_address);
            user_compliance.kyc_level
        } else {
            0
        }
    }

    #[view]
    public fun get_user_risk_score(user_address: address): u64 acquires ComplianceRegistry {
        let registry = borrow_global<ComplianceRegistry>(@flowpay);
        
        if (table::contains(&registry.users, user_address)) {
            let user_compliance = table::borrow(&registry.users, user_address);
            user_compliance.risk_score
        } else {
            100 // Maximum risk for unknown users
        }
    }

    #[view]
    public fun get_transaction_limits(user_address: address): (u64, u64, u64) acquires ComplianceRegistry {
        let registry = borrow_global<ComplianceRegistry>(@flowpay);
        
        if (table::contains(&registry.users, user_address)) {
            let user_compliance = table::borrow(&registry.users, user_address);
            let limits = &user_compliance.transaction_limits;
            (limits.daily_limit, limits.monthly_limit, limits.single_transaction_limit)
        } else {
            (0, 0, 0)
        }
    }
}