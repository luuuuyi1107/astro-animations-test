import { createPinia } from 'pinia'
import { createApp } from 'vue'

export function initPinia() {
  const pinia = createPinia()
  const app = createApp({})
  app.use(pinia)
  return { app, pinia }
} 