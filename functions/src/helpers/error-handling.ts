import { ZodError } from 'zod'

export const getZodError = (zodError: ZodError) => ({
  status: 400,
  level: 'Client Request',
  title: 'Request Body Incorrect',
  message:
    'The information provided had errors, please edit the information and try again.',
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
