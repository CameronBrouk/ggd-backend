import { onRequest } from 'firebase-functions/v2/https'
import * as logger from 'firebase-functions/logger'
import { getStripeWebhookEvent, stripe } from '../../payment/stripe.helpers'
import Stripe from 'stripe'
import { environment } from '../../environment'

export const onPaymentIntentSuccess = onRequest((req, res) => {
  const { data, type } = getStripeWebhookEvent<Stripe.PaymentIntent>(
    req,
    environment.WEBHOOK_SECRET,
  )
  res.send(200)

  if (type !== 'payment_intent.succeded') {
    console.log('SUCCESS', data)
    logger.info(data)
    data.payment_method
    const customerId = data.customer
    const paymentMethodId = data.payment_method
    if (typeof customerId === 'string') {
      if (typeof paymentMethodId === 'string') {
        stripe.customers.update(customerId, {
          default_source: paymentMethodId,
        })
      } else {
        logger.error('Payment method property did not give an id')
        logger.error('PaymentMethodId:', paymentMethodId)
      }
    } else {
      logger.error('Customer property did not give an id', customerId)
      logger.error('CustomerID', customerId)
    }
  }
})
