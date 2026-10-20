import Stripe from "stripe";

// Called only by server routes, at request time, so missing local configuration
// does not prevent the storefront from building or displaying its catalog.
export function getTestStripe() {
    const key = process.env.STRIPE_SK;

    if (!key || !/^sk_test_[A-Za-z0-9]+$/.test(key)) {
        throw new Error(
            "Stripe configuration error: STRIPE_SK must be a Stripe test secret key (sk_test_...). Live payments are disabled for this demo."
        );
    }

    return new Stripe(key);
}
