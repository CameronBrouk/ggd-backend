import { environment } from '../environment'

const accountSid = environment.TWILIO_ACCOUNT_SID
const authToken = environment.TWILIO_AUTH_TOKEN
const twilioClient = require('twilio')(accountSid, authToken)

export const sendText = () => {
  twilioClient.messages
    .create({ body: 'Hi there', from: '+15017122661', to: '+15558675310' })
    .then((message: any) => console.log(message.sid))
}
