import svgLoader from 'vite-svg-loader';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      baseURL: process.env.API_BASE_URL,
    },
  },
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.css',
    '@fortawesome/fontawesome-svg-core/styles.css',
  ],
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@vee-validate/nuxt',
    '@nuxtjs/tailwindcss',
    '@formkit/auto-animate/nuxt',
    '@vueuse/nuxt',
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          Poppins: true,
          download: true,
          inject: true,
        },
      },
    ],
  ],
  plugins: ['./plugins/storeUserAuth.js'],
  pinia: {
    autoImports: ['defineStore', ['defineStore', 'definePiniaStore']],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vite: {
    plugins: [svgLoader()],
  },
  ssr: false,
});
