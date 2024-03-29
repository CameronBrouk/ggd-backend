import { z } from 'zod'
import * as logger from 'firebase-functions/logger'
import { hasValidBody } from '../helpers/error-handling'
import { onCall, onRequest } from 'firebase-functions/v2/https'
import { createPaymentPlan } from './payment.helpers'

const bodyValidator = z.object({
  priceId: z.string(),
  customerId: z.string(),
  unixDateToCancel: z.number(),
})

export const getPaymentPlanSecret = onRequest(async (req, res) => {
  if (!hasValidBody(req, res, bodyValidator)) return
  const body = req.body as z.TypeOf<typeof bodyValidator>

  try {
    const { latest_invoice } = await createPaymentPlan(
      body.priceId,
      body.customerId,
      body.unixDateToCancel,
    )

    res.send(latest_invoice.payment_intent.client_secret)
  } catch (err: any) {
    res.status(400).json({ error: { message: err?.message } })
  }
})

export const getPaymentPlanClientSecret = onCall(async (req) => {
  const { priceId, customerId, unixDateToCancel } = req.data
  const response = await createPaymentPlan(
    priceId,
    customerId,
    unixDateToCancel,
  )

  logger.debug(response)
  console.log(response)

  return { secret: response.latest_invoice.payment_intent.client_secret }
})
