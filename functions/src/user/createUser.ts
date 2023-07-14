import { onRequest } from 'firebase-functions/v2/https'
import { z } from 'zod'
import { hasValidBody } from '../helpers/error-handling'
import { stripe } from '../payment/stripe.helpers'
import { getFirestore } from 'firebase-admin/firestore'

const bodyValidator = z
  .object({
    id: z.string(),
    email: z.string(),
    phone: z.string(),
    name: z.string(),
  })
  .strict()

export const createUser = onRequest(async (request, response) => {
  const { id, ...body } = request.body as z.TypeOf<typeof bodyValidator>
  if (!hasValidBody(request, response, bodyValidator)) return

  const database = getFirestore()

  const stripeCustomer = await stripe.customers.create(body)

  const currentDate = new Date()

  const user = {
    id,
    ...body,
    position: 'undecided',
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

    response.send({
      user,
      permissions,
    })
  } catch (err) {
    response.status(200).json(err)
  }
})
