import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/icon', '@nuxt/fonts', '@vueuse/nuxt'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }]
    }
  },
  // Content lives in localStorage, so job pages are client-rendered (SPA fallback on Vercel).
  routeRules: {
    '/': { redirect: '/metiers/hotellerie' },
    '/metiers/**': { ssr: false }
  },
  fonts: {
    families: [{ name: 'DM Sans', provider: 'google', weights: [400, 500, 600, 700] }]
  },
  vite: {
    plugins: [tailwindcss()]
  },
  typescript: {
    strict: true,
    typeCheck: false
  },
  icon: {
    serverBundle: { collections: ['lucide'] }
  }
})
