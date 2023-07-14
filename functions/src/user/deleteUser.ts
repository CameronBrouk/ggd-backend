import { onRequest } from 'firebase-functions/v2/https'
import { z } from 'zod'
import { hasValidBody } from '../helpers/error-handling'
import { getFirestore } from 'firebase-admin/firestore'

const bodyValidator = z
  .object({
    id: z.string(),
  })
  .strict()

export const deleteUser = onRequest(async (request, response) => {
  const { id } = request.body as z.TypeOf<typeof bodyValidator>
  if (!hasValidBody(request, response, bodyValidator)) return

  const database = getFirestore()

  try {
    // Create User Document
    await database.collection('users').doc(id).delete()
    // Create Permissions Document
    await database.collection('permissions').doc(id).delete()

    response.send('success')
  } catch (err) {
    response.status(400).json(err)
  }
})
