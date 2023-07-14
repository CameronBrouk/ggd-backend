import { onRequest } from 'firebase-functions/v2/https'
import * as logger from 'firebase-functions/logger'
// import { hasValidBody } from '../helpers/error-handling'
// import { sendSendgridEmail } from './sendgrid.helpers'
// import { createEvent } from '@jiter/node'
// import { scheduleEndpointCall } from './jiter.helpers'

// const bodyValidator = z
//   .object({
//     to: z.array(z.string()),
//     subject: z.string(),
//     html: z.string().optional(),
//     text: z.string(),
//   })
//   .strict()

// type Body = z.TypeOf<typeof bodyValidator>

export const scheduleTest = onRequest(async (request, response) => {
  const data = {
    raw: request.body,
    parsed: JSON.parse(request.body),
  }

  response.send(data)
  logger.info(data)
})
