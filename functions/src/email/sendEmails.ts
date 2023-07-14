import { onRequest } from 'firebase-functions/v2/https'
import { z } from 'zod'
import { hasValidBody } from '../helpers/error-handling'
import { sendSendgridEmail } from './sendgrid.helpers'

const bodyValidator = z
  .object({
    to: z.array(z.string()),
    subject: z.string(),
    html: z.string().optional(),
    text: z.string(),
  })
  .strict()

type Body = z.TypeOf<typeof bodyValidator>

export const sendEmails = onRequest(async (request, response) => {
  const body = request.body as Body
  if (!hasValidBody(request, response, bodyValidator)) return

  sendSendgridEmail(body)
    .then((value) => response.send(value))
    .catch((error) => response.send(400).json(error))
})
