import Stripe from 'stripe'
import { environment } from '../environment'

export const stripe = new Stripe(environment.STRIPE_KEY, {
  apiVersion: '2022-11-15',
})

import * as functions from 'firebase-functions'

export const getStripeWebhookEvent = <T extends Stripe.Event['data']['object']>(
  request: functions.https.Request,
  secret: string,
) => {
  const signature = request.headers['stripe-signature']
  if (!signature) throw new Error('No stripe-signature Header')

  const { data, type } = stripe.webhooks.constructEvent(
    request.rawBody,
    signature,
    secret,
  )

  return {
    data: data.object as T,
    type: type,
  }
}
