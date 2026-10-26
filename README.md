# Ecommerce Storefront

An e-commerce storefront built with Next.js, React, and MongoDB, featuring product browsing, persistent shopping carts, and Stripe test checkout. I recently revisited the project to improve checkout reliability, server-side validation, and error handling.

This is a demo, not a real business. Payments run in Stripe test mode and no real money is charged.

## What you can do

- Browse the full product catalog and the ten newest arrivals.
- View a product's description and photos.
- Add products to the cart, change quantities, and remove items.
- Keep the cart after refreshing the page.
- Check out without creating an account.
- Complete a Stripe test payment and see its payment status.
- Retry product requests if something goes wrong.

The storefront works with my separate `ecommerce-admin` project, where products are managed. Both projects use the same MongoDB database.

## Built with

- Next.js and React for the website and server routes.
- Tailwind CSS for styling.
- MongoDB and Mongoose for storing products and orders.
- Stripe Checkout for test payments.
- Formik and Yup for the checkout form.

## What I improved

When revisiting the project, I focused on making the existing features work reliably:

- Fixed a bug that charged quantities twice.
- Made the server check product prices instead of trusting prices from the browser.
- Added checks for invalid checkout details and unavailable products.
- Made checkout retries reuse the same order and payment session.
- Checked payment confirmation with Stripe before clearing the cart.
- Added loading, error, empty, and missing-product messages.
- Fixed cart loading and limited quantities to 20 per product.
- Added tests for checkout calculations, payment handling, and product fetching.

## Run locally

You need Node.js, a MongoDB database with products, and a Stripe account with test keys. I used Node.js 24 on Windows; Node.js 22 was also tested in Ubuntu.

1. Install the project's packages:

   ```bash
   npm ci
   ```

2. Copy `.env.example` to `.env.local` and fill in your own values:

   | Variable | What it is for |
   | --- | --- |
   | `MONGODB_URI` | Connection to your MongoDB database |
   | `STRIPE_SK` | Stripe test secret key, starting with `sk_test_` |
   | `WEBHOOK_SK` | Secret used to check payment messages sent by Stripe |
   | `PUBLIC_URL` | Website address; use `http://localhost:3000` locally |

   Keep these values private. Environment files are ignored by Git, apart from the blank example file. Your database account must be allowed to create the index that prevents duplicate checkout attempts.

3. Start the website:

   ```bash
   npm run dev
   ```

4. Open http://localhost:3000.

An empty database will show an empty catalog. Add products through the admin project or use an existing demo database. The homepage currently uses a specific featured-product ID; if that product is missing, it shows a welcome message instead.

## Try a test purchase

For payments to be confirmed locally, Stripe needs to send payment updates to the running website. This is called a webhook.

After installing the Stripe CLI, log in and select the test environment that matches your project keys:

```powershell
stripe.cmd login
stripe.cmd switch
```

In a second terminal, start the listener:

```powershell
stripe.cmd listen --events checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.async_payment_failed,checkout.session.expired --forward-to http://localhost:3000/api/webhooks/stripe
```

Copy the listener's signing secret into `WEBHOOK_SK` in your private environment file. Restart Next.js after saving it. Keep both the website and the listener running while testing. Do not use `--live`.

On macOS or Linux, use `stripe` instead of `stripe.cmd`.

Add a product to the cart and enter fictional contact details. On the Stripe payment page, use:

- Card number: `4242 4242 4242 4242`
- Any future expiry date
- Any three-digit CVC

Do not enter real card details. After payment is confirmed, the website shows a success message and clears the cart. Cancelling checkout leaves the cart in place. Confirmation may take a few seconds.

## Checks

```bash
npm test
npm run lint
npm run build
```

To run the built version locally:

```bash
npm start
```

Some image-related lint warnings remain. The build tools also have a known dependency warning involving `braces`; see the [advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). Check `npm audit` and framework security updates before deploying.

## Deployment

The project can be hosted on Vercel. Add the same environment variables in the project settings, but set `PUBLIC_URL` to the deployed website address.

Set up a Stripe test webhook at `https://YOUR-WEBSITE/api/webhooks/stripe`, using the same four event types listed in the listener command. Put that endpoint's signing secret in Vercel's `WEBHOOK_SK`; it is separate from the local listener's secret.

Make sure MongoDB allows connections from the deployed website, then test browsing, the cart, and a complete test purchase on the public address.

## Scope

This project demonstrates a guest shopping journey. It does not include customer accounts, shipping, stock management, or receipt emails. It is intended for portfolio use and test payments only.
