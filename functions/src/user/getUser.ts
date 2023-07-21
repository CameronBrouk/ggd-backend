import { getFirestore } from 'firebase-admin/firestore'
import { onCall } from 'firebase-functions/v2/https'

export const getUser = onCall<{ id: string }>(async (request) => {
  const { id } = request.data

  const database = getFirestore()

  try {
    const user = await database.collection('users').doc(id).get()
    const permissions = await database.collection('permissions').doc(id).get()

    return {
      user: user.data(),
      permissions: permissions.data(),
    }
  } catch (err) {
    return {
      error: err,
    }
  }
})
