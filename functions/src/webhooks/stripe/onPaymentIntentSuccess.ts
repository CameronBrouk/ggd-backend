import { onRequest } from 'firebase-functions/v2/https'
import { getStripeWebhookEvent } from '../../payment/stripe.helpers'

const webhookSecret = 'whsec_wlXAokhNsHUB3qCVbIrlINSnKU22mBcQ'

const onPaymentIntentSuccess = onRequest((req, res) => {
  const { data, type } = getStripeWebhookEvent<any>(req, webhookSecret)
})
