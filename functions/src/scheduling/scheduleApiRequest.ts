import { onRequest } from 'firebase-functions/v2/https'
import { z } from 'zod'
import { hasValidBody } from '../helpers/error-handling'
import { scheduleEndpointCall } from './jiter.helpers'

const bodyValidator = z
  .object({
    triggerTime: z.string(),
    endpoint: z.string(),
    data: z.object({}),
  })
  .strict()

export const scheduleApiRequest = onRequest(async (request, response) => {
  if (!hasValidBody(request, response, bodyValidator)) return
  const body = request.body as z.TypeOf<typeof bodyValidator>

  try {
    const jiterResponse = await scheduleEndpointCall(
      body.endpoint,
      body.data,
      body.triggerTime,
    )
    response.send(jiterResponse)
  } catch (err: any) {
    response.status(400).json(err)
  }
})
