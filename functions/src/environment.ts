import { z } from 'zod'
import * as dotenv from 'dotenv'

export const environment = z
  .object({
    OPENAI_KEY: z.string(),
    SENDGRID_KEY: z.string(),
    TWILIO_ACCOUNT_SID: z.string(),
    TWILIO_AUTH_TOKEN: z.string(),
    STRIPE_KEY: z.string(),
    JITER_ORG_NAME: z.string(),
    JITER_API_KEY: z.string(),
    JITER_SIGNING_SECRET: z.string(),
    BASE_URL: z.string(),
    WEBHOOK_SECRET: z.string(),
  })
  .parse(dotenv.config().parsed)
