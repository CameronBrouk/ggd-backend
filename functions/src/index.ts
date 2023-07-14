const { initializeApp } = require('firebase-admin/app')

initializeApp()

export * from './email'
export * from './user'
