// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxt/eslint', '@nuxt/fonts'],
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Tsegaselassie Tadesse — Senior Software Architect',
      link: [
        {
          rel: 'icon',
          href: '/favicon.ico',
          sizes: '32x32'
        },
        {
          rel: 'icon',
          href: '/favicon.svg',
          type: 'image/svg+xml'
        },
        {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.png'
        }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  nitro: {
    preset: 'static',
    prerender: {
      // Nothing links to the blog index yet; posts are crawled from it.
      routes: ['/blog']
    }
  },
  vite: {
    plugins: [tailwindcss()]
  },
  eslint: {
    config: {
      stylistic: {
        semi: true,
        quotes: 'single',
        commaDangle: 'never'
      }
    }
  },
  fonts: {
    families: [
      {
        // Same weights as the design: 500 renders as 400 and 700 as 800.
        name: 'Archivo',
        weights: [400, 600, 800]
      },
      {
        name: 'Pinyon Script',
        weights: [400]
      }
    ]
  }
});
