import Stripe from 'stripe'
import { stripe } from './stripe.helpers'

export const getSinglePaymentSecret = async (
  amount: number,
  currency: string,
  customerId: string,
) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    customer: customerId,
    setup_future_usage: 'off_session',
    automatic_payment_methods: {
      enabled: true,
    },
  })

  return paymentIntent.client_secret
}

export const getPaymentPlanClientSecret = async (
  customerId: string,
  priceId: string,
  unixDateToCancel: number,
) => {
  return createPaymentPlan(priceId, customerId, unixDateToCancel)
    .then(({ latest_invoice }) => latest_invoice.payment_intent.client_secret)
    .catch((err: any) => ({ error: { message: err?.message } }))
}

/** * This function is used when you want to use the react <PaymentMethod /> element on your frontend to charge the user a recurring payment.  */
export const getRecurringPaymentSecret = async (
  customerId: string,
  priceId: string,
) => {
  return createSubscription(priceId, customerId)
    .then(({ latest_invoice }) => latest_invoice.payment_intent.client_secret)
    .catch((err: any) => ({ error: { message: err?.message } }))
}

/** * This function is used when you want to use the react <PaymentMethod /> element on your frontend to charge the user a single time.  */

type SubscriptionReturn = Stripe.Subscription & {
  latest_invoice: Stripe.Invoice & { payment_intent: Stripe.PaymentIntent }
}
/**
 * This creates a subscription object that can be used to charge a user a payment that recurs
 * The recurrence rules are specified in the price itself
 */
export const createSubscription = async (
  priceId: string,
  customerId: string,
) => {
  const sub = (await stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        price: priceId,
      },
    ],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    // we need the payment_intent so we can send the clientSecret to the frontend
    // Unfortunately, this causes type issues with stripe.  Stripe types don't know that this actually return the latest_invoice.payment_intent
    // as a result, we need to
    expand: ['latest_invoice.payment_intent'],
  })) as SubscriptionReturn

  return sub
}

/**
 * This creates a subscription object that can be used to charge a "PaymentPlan"
 * In reality, a payment plan in stripe is just a subscription that ends on a certain date
 * Unfortunately, we can't give a "total amount of money" and an interval and have it "just work".
 * We need to create the price separately that defines an amount and rules of when/how often to charge it.
 * The recurrence rules are specified in the price itself
 */
export const createPaymentPlan = async (
  priceId: string,
  customerId: string,
  unixDateToCancel: number,
  dateToStart?: number,
) => {
  const sub = (await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    billing_cycle_anchor: dateToStart || Math.floor(Date.now() / 1000), // Start billing today if no startDate is given
    cancel_at_period_end: false,
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
    cancel_at: unixDateToCancel,
  })) as SubscriptionReturn

  return sub
}
