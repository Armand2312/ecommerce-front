# Ecommerce storefront demo

A portfolio storefront using Next.js App Router, React, Tailwind CSS,
MongoDB/Mongoose, and Stripe hosted Checkout. Checkout is guest-only and accepts
Stripe **test secret keys only**. No real payments are supported.

## Local setup

Use Node.js 24 LTS (also select 24.x in Vercel's project settings).

1. Run `npm ci`.
2. Copy `.env.example` to `.env.local` and fill in your own values.
3. Run `npm run dev` and open http://localhost:3000.

On Windows PowerShell with restricted script execution, use `npm.cmd` instead
of `npm`. Never paste credentials into terminal commands, screenshots, or commits.

| Variable | Purpose | Local / Vercel |
| --- | --- | --- |
| `MONGODB_URI` | MongoDB connection string, including the demo database name | Required for catalog and orders; use the intended database shared with ecommerce-admin |
| `STRIPE_SK` | Stripe test secret key beginning with `sk_test_` | Required for checkout; live, restricted, empty, and malformed keys return HTTP 503 before database access |
| `WEBHOOK_SK` | Stripe test endpoint signing secret beginning with `whsec_` | Needed for webhook processing; CLI and deployed endpoints have different secrets |
| `PUBLIC_URL` | Storefront origin used for Checkout redirects | `http://localhost:3000` locally; exact HTTPS deployment origin on Vercel, without a trailing slash |

All four variables are server-side. Do not rename secrets with a `NEXT_PUBLIC_`
prefix. This hosted Checkout flow does not use `STRIPE_PK`. `NEXTAUTH_SECRET` is
no longer used. Existing local values were left untouched; those unused entries
can be removed manually. `PORT` is optional locally and is not needed on Vercel.

Do not use real customer information in this demo. `.env` and `.env.*` are
ignored, except for the deliberately blank `.env.example` template. Git ignore
rules do not protect credentials already committed in the past; if a real secret
was previously published, review and rotate it manually with its provider.

## Verification and Vercel

- `npm run lint`
- `npm test` for focused checkout tests (Node's built-in test runner)
- `npm run build`
- `npm start` to smoke-test the production build locally
- `npm audit` to review current dependency advisories

Use Vercel's Next.js preset, `npm ci`, and the default build/output settings.
Set the variables separately for the environments you deploy, ensuring
`PUBLIC_URL` matches the deployment receiving the Checkout return. MongoDB must
allow connections from the deployed application. Only use Stripe test mode and
test endpoint credentials. Configure service settings manually; this repository
does not provision or change external services.

Next.js and `eslint-config-next` are pinned to `15.5.27`. The Windows native
compiler installed by Next.js is `@next/swc-win32-x64-msvc@15.5.27`.
React remains on 18 and Tailwind on 3. This version was selected after native
SWC 15.5.28 was blocked by Windows Smart App Control on the development machine.
Next.js 15 no longer caches GET route handlers by default; this suits the live
catalog endpoint. No async server `params` migration is needed because the
product page reads params through the client-side `useParams` hook.

Targeted npm overrides keep Next's PostCSS on the patched 8.x line and
Tailwind's selector parser on patched 7.x, avoiding a Tailwind 4 migration.
The dependency audit currently reports no production vulnerabilities. Seven
build/lint dependency findings stem from [`braces` (GHSA-vfj7-8cjw-p6xm)](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm),
for which no patched version is published. The dependency paths are:

- `eslint-config-next -> @next/eslint-plugin-next -> fast-glob -> micromatch -> braces`
- `tailwindcss -> fast-glob -> micromatch -> braces`
- `tailwindcss -> micromatch -> braces`
- `tailwindcss -> chokidar -> braces`

The seven findings count the vulnerable package and affected parent packages,
rather than seven independent vulnerabilities. Crafted, deeply nested glob
patterns can exhaust the stack. These tools process repository-controlled
patterns; the storefront does not expose glob-pattern input to visitors.
There is currently no compatible patched `braces` release to select. No forced
upgrades or additional overrides were applied. Recheck the advisory when updating
dependencies rather than applying `npm audit fix --force`, which proposes
unrelated major changes. A clean production audit is not a guarantee that an
older framework version includes every upstream security fix; review security
releases separately before deployment.

Windows development uses native SWC directly: run `npm.cmd run dev` from the
Windows project directory and open http://localhost:3000. No WSL, WebAssembly
compiler, or Windows security changes are required for this verified setup.
Native SWC loading, the development server, homepage, read-only catalog query,
and production build passed on 15.5.27. Existing lint warnings are deferred with
the cart and UI work. No checkout session or order was created in testing.
`debug.log` is ignored and should not be committed.

## Stripe test checkout

Checkout stays guest-only, in GBP, with at most 20 units per product and 100
distinct products. Only MongoDB product prices are accepted. Prices must have
at most two decimal places; invalid prices are rejected instead of rounded.
All charge calculations use integer pennies. The existing repeated-ID cart
representation is retained.

The browser saves an attempt UUID and a hash of the submitted details in
sessionStorage (no contact details are saved there). Retries reuse that UUID.
MongoDB enforces a unique partial index named `checkout_attempt_unique` on
`checkoutAttemptId`; its database user needs permission to create that index.
The index excludes legacy orders without an attempt ID. Creation stops if the
index cannot be ensured. No existing orders are rewritten. Phone numbers are
stored as strings for new orders; leading zeros previously lost cannot be
recovered automatically.

Each attempt stores its trusted price snapshot and redirect origin before
calling Stripe. Retrying replays those persisted parameters and the same Stripe
idempotency key, including after a lost response or session-save failure. If
Stripe did not return a session ID and the attempt is over 23 hours old, it
cannot be retried: Stripe may prune keys after 24 hours. Start a new attempt
explicitly if prompted. Existing saved sessions are retrieved rather than
recreated. Unsuccessful attempts may remain as unpaid demo orders.

Configure a **test-mode** Stripe webhook pointing to:

```text
https://YOUR-STOREFRONT/api/webhooks/stripe
```

Subscribe to `checkout.session.completed`,
`checkout.session.async_payment_succeeded`,
`checkout.session.async_payment_failed`, and `checkout.session.expired`.
For local testing, after installing and authenticating the Stripe CLI yourself:

```bash
stripe listen --events checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.async_payment_failed,checkout.session.expired --forward-to localhost:3000/api/webhooks/stripe
```

Put the signing secret printed by that listener in your private local
`WEBHOOK_SK`, then restart the dev server. Use the deployed endpoint's own
signing secret on Vercel. Never paste secrets into documentation or Git.
The old `/api/webhook` files were not registered routes and are removed.

The handler verifies the unchanged raw body and rejects live-mode events.
It retrieves current session state, checks its order/attempt link, currency,
amount, and stored session ID when available, then atomically marks an unpaid
order paid. Repeated or out-of-order failure/expiration events cannot undo a
paid order. Database/Stripe failures return retryable server errors.

Stripe returns to `/cart?session_id=...` on success, or
`/cart?cancel=1&attempt_id=...` on cancellation. The latter looks up the saved
session using the attempt ID, without relying on placeholder substitution in
Stripe's cancel URL.
`GET /api/checkout/status?session_id=...` (or `?attempt_id=...`) verifies the session with Stripe and its
MongoDB order and returns only a status, with caching disabled. The opaque test
session/attempt ID acts as a guest capability: do not publish or log return URLs. No
customer details or order-history endpoint is exposed. This endpoint never
marks an order paid. Payment remains processing until the signed webhook has
confirmed the order; after bounded polling the user can check again. Only
server-verified `paid` status clears the cart. Old `success` query flags have
no effect. Declined card attempts can be retried in Stripe Checkout; cancellation
preserves the cart and does not imply that the Stripe session has expired.

Before presenting the flow, complete a test payment using fictional contact
details and Stripe's test card `4242 4242 4242 4242` (future expiry, any CVC).
Verify the webhook reaches the new route, the order becomes paid once, the
success message appears, and the cart clears. Also check cancellation, declined
payments, delayed events, and retrying a webhook. Automated tests use synthetic
sessions and signatures; they do not replace an actual Stripe test payment.
No external Stripe settings or existing credentials are changed by this code.

General catalog/cart loading and responsive UI improvements remain later work.
No receipt email service, customer accounts, inventory, or fulfillment features
are included.
