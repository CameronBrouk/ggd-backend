// import { z } from 'zod'
// import { hasValidBody } from '../helpers/error-handling'
// import { onRequest } from 'firebase-functions/v2/https'
import { onCall } from 'firebase-functions/v2/https'
import { stripe } from './stripe.helpers'

// const bodyValidator = z.object({
//   amount: z.number(),
//   currency: z.string(),
//   stripeCustomerId: z.string(),
// })
// export const getSinglePaymentSecret = onRequest(async (req, res) => {
//   if (!hasValidBody(req, res, bodyValidator)) return
//   const { amount, currency, stripeCustomerId } = req.body as z.TypeOf<
//     typeof bodyValidator
//   >

//   const paymentIntent = await stripe.paymentIntents.create({
//     amount,
//     currency,
//     customer: stripeCustomerId,
//     setup_future_usage: 'off_session',
//     automatic_payment_methods: {
//       enabled: true,
//     },
//   })

//   res.send(paymentIntent.client_secret)
// })

export const getSinglePaymentClientSecret = onCall(async (request) => {
  // // if (!hasValidBody(req, res, bodyValidator)) return
  const { amount, currency, stripeCustomerId } = request.data

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    customer: stripeCustomerId,
    setup_future_usage: 'off_session',
    automatic_payment_methods: {
      enabled: true,
    },
  })

  return { secret: paymentIntent.client_secret }
})
