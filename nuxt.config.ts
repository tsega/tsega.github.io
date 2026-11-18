// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxt/eslint', '@nuxt/fonts'],
  components: [
    // Overrides for Nuxt Content's prose elements (ProsePre and so on) keep
    // their bare names; every other component is named after its folder.
    {
      path: '~/components/content',
      pathPrefix: false,
      global: true
    },
    '~/components'
  ],
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Tsegaselassie Tadesse — Senior Software Architect',
      // Pages set their own title through usePageSeo; the homepage opts out.
      titleTemplate: '%s · Tsega.dev',
      meta: [
        {
          name: 'theme-color',
          content: '#1b1109'
        }
      ],
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
        },
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: 'Writing — Tsegaselassie Tadesse',
          href: '/rss.xml'
        }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  content: {
    build: {
      markdown: {
        highlight: {
          // Warm, low-contrast dark theme that sits well on espresso.
          theme: 'gruvbox-dark-medium',
          langs: ['bash', 'css', 'diff', 'html', 'js', 'json', 'php', 'sql', 'ts', 'vue', 'yaml']
        }
      }
    }
  },
  compatibilityDate: '2025-07-15',
  nitro: {
    preset: 'static',
    prerender: {
      // Nothing links to the blog index yet; posts are crawled from it.
      routes: ['/blog', '/rss.xml', '/sitemap.xml']
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
