const { initializeApp } = require('firebase-admin/app')

initializeApp()

export * from './email'
export * from './user'
export * from './payment'
export * from './scheduling'
export * from './webhooks/stripe'
