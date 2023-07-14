import { Request, Response } from 'express'
import { ZodError, ZodObject } from 'zod'
import * as logger from 'firebase-functions/logger'

const badRequestBody = {
  status: 400,
  level: 'Client Request',
  title: 'Request Body Incorrect',
  message:
    'The information provided had errors, please edit the information and try again.',
}
export const getZodError = (zodError: ZodError) => ({
  ...badRequestBody,
  description: zodError.issues
    .map((issue) => {
      if (issue.message.includes('Required')) {
        return `The ${issue.path[0] || 'unknown'} property is ${issue.message}${
          // @ts-ignore
          issue?.expected
            ? ''
            : // @ts-ignore
              `(expected ${issue?.expected || 'unkown'}, recieved ${
                // @ts-ignore
                issue?.received || 'unkown'
              })`
        }`
      }

      if (issue.message.includes('Unrecognized Key')) {
        return `There are ${issue.message}`
      }

      return issue.message
    })
    .join('. '),
  meta: zodError,
})

export const hasValidBody = (
  req: Request,
  res: Response,
  zodValidator?: ZodObject<any>,
) => {
  if (!zodValidator) return true
  const validation = zodValidator.safeParse(req.body)
  if (validation.success) return true
  const error = {
    ...badRequestBody,
    ...('error' in validation ? getZodError(validation.error) : {}),
  }
  logger.error(error)
  res.status(400).json(error)
  return false
}
