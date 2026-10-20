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

## Work deferred to the next phases

Checkout totals, webhook routing/logic, payment confirmation, cart persistence,
and UI/loading/error improvements remain separate tasks. In particular, the
current webhook file is not a registered App Router endpoint, and checkout
quantities are still calculated incorrectly. Do not present the purchase flow
as complete until those phases are verified. No receipt email service, customer
accounts, inventory, or fulfillment features are included.
