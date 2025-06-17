import tailwind from "@astrojs/tailwind"
import vue from "@astrojs/vue"

export default {
  integrations: [tailwind(), vue()],
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
