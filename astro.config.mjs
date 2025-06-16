import tailwind from "@astrojs/tailwind"

export default {
  integrations: [tailwind()],
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
