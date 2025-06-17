import tailwind from "@astrojs/tailwind"
import vue from "@astrojs/vue"
import { pinia } from './src/plugins/pinia'

export default {
  integrations: [
    tailwind(),
    vue({
      jsx: true,
      plugins: [pinia]
    })
  ],
  vite: {
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@utils': '/src/utils'
      }
    }
  }
}
