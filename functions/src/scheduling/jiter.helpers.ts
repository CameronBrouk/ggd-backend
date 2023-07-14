import Jiter, { JiterConfig } from '@jiter/node'
import { environment } from '../environment'

const config: JiterConfig = {
  apiKey: environment.JITER_API_KEY,
  signingSecret: environment.JITER_SIGNING_SECRET,
}
Jiter.init(config)

export const scheduleEndpointCall = async (
  endpoint: string,
  data: object,
  timeToTrigger: string,
) => {
  return await Jiter.Events.createEvent({
    destination: `${environment.BASE_URL}/${endpoint}`,
    payload: JSON.stringify(data),
    scheduledTime: timeToTrigger,
  })
}
