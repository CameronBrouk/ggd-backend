import { getFirestore } from 'firebase-admin/firestore'
import { onCall } from 'firebase-functions/v2/https'
import { z } from 'zod'
import { stripe } from '../payment/stripe.helpers'

const bodyValidator = z
  .object({
    id: z.string(),
    email: z.string(),
    phone: z.string(),
    name: z.string(),
  })
  .strict()

export type User = z.TypeOf<typeof bodyValidator>

export const createBackendUser = onCall<User>(async (request) => {
  const { id, ...body } = request.data

  const database = getFirestore()

  const stripeCustomer = await stripe.customers.create(body)

  const currentDate = new Date()

  const user = {
    id,
    ...body,
    stripeCustomerId: stripeCustomer.id,
    createdAt: currentDate,
    updatedAt: currentDate,
  }

  const permissions = {
    id,
    clearance: 1,
    role: 'customer',
    groups: [],
  }

  try {
    // Create User Document
    await database.collection('users').doc(id).set(user)
    // Create Permissions Document
    await database.collection('permissions').doc(id).set(permissions)

    return {
      user,
      permissions,
    }
  } catch (err) {
    return {
      error: err,
    }
  }
})
