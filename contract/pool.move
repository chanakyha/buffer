module 0x0::donation_manager {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::event;


    const ENotAuthorized: u64 = 0;
    const EInsufficientBalance: u64 = 1;
    const EPoolNotFound: u64 = 2;


    public struct DonationReceived has copy, drop {
        streamer_id: address,
        donor: address,
        amount: u64,
    }

    public struct PayoutProcessed has copy, drop {
        streamer_id: address,
        amount: u64,
    }


    public struct AdminCap has key {
        id: UID
    }


    public struct DonationPool has key {
        id: UID,
        streamer_id: address,
        balance: Balance<SUI>,
    }


    fun init(ctx: &mut TxContext) {
        transfer::transfer(
            AdminCap { id: object::new(ctx) },
            tx_context::sender(ctx)
        );
    }


    public entry fun create_donation_pool(
        _admin: &AdminCap,
        streamer_id: address,
        ctx: &mut TxContext
    ) {
        let donation_pool = DonationPool {
            id: object::new(ctx),
            streamer_id,
            balance: balance::zero(),
        };
        transfer::share_object(donation_pool);
    }


    public entry fun donate(
        pool: &mut DonationPool,
        payment: Coin<SUI>,
        ctx: &TxContext
    ) {
        let amount = coin::value(&payment);
        let donor = tx_context::sender(ctx);
        

        let donation_balance = coin::into_balance(payment);
        balance::join(&mut pool.balance, donation_balance);


        event::emit(DonationReceived {
            streamer_id: pool.streamer_id,
            donor,
            amount
        });
    }


    public entry fun process_payout(
        pool: &mut DonationPool,
        amount: u64,
        ctx: &mut TxContext
    ) {

        assert!(tx_context::sender(ctx) == pool.streamer_id, ENotAuthorized);
        

        assert!(balance::value(&pool.balance) >= amount, EInsufficientBalance);


        let payout = coin::from_balance(balance::split(&mut pool.balance, amount), ctx);
        transfer::public_transfer(payout, pool.streamer_id);


        event::emit(PayoutProcessed {
            streamer_id: pool.streamer_id,
            amount
        });
    }


    public fun get_streamer_balance(pool: &DonationPool, streamer_id: address): u64 {

        assert!(pool.streamer_id == streamer_id, EPoolNotFound);
        balance::value(&pool.balance)
    }


    public fun get_pool_balance(pool: &DonationPool): u64 {
        balance::value(&pool.balance)
    }

    public fun get_streamer_id(pool: &DonationPool): address {
        pool.streamer_id
    }
}