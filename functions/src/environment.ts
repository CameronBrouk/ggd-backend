import { z } from 'zod'
import * as dotenv from 'dotenv'

export const environment = z
  .object({
    OPENAI_KEY: z.string(),
    SENDGRID_KEY: z.string(),
    TWILIO_ACCOUNT_SID: z.string(),
    TWILIO_AUTH_TOKEN: z.string(),
  })
  .parse(dotenv.config().parsed)
