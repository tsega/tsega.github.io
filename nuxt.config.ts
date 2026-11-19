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
      // Write blog.html rather than blog/index.html. GitHub Pages redirects
      // /blog to /blog/ for a folder, but serves blog.html at /blog, which
      // matches the canonical URLs and the sitemap.
      autoSubfolderIndex: false,
      // Nothing links to the blog index yet; posts are crawled from it.
      routes: ['/blog', '/rss.xml', '/sitemap.xml', '/404']
    }
  },
  vite: {
    plugins: [tailwindcss()]
  },
  hooks: {
    // Nuxt always renders /404.html as an empty shell filled in by
    // JavaScript. Drop it, and save the prerendered /404 page in its place,
    // so the 404 that GitHub Pages serves is readable without JavaScript.
    'nitro:init'(nitro) {
      nitro.hooks.hook('prerender:generate', (route) => {
        if (route.route === '/404.html') {
          route.skip = true;
        }
        else if (route.route === '/404') {
          route.fileName = '/404.html';
        }
      });
    }
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
  // Each family is preloaded, so text paints in its own font rather than
  // shifting when it swaps in. Only one file per family is preloaded, so:
  // Latin only (other subsets would fall back anyway, unpreloaded), and
  // Archivo upright only, or the italic gets the preload; the browser
  // slants the upright face for <em>.
  fonts: {
    families: [
      {
        // Same weights as the design: 500 renders as 400 and 700 as 800.
        name: 'Archivo',
        weights: [400, 600, 800],
        styles: ['normal'],
        subsets: ['latin'],
        preload: true
      },
      {
        // The hero name, the homepage's largest paint.
        name: 'Pinyon Script',
        weights: [400],
        subsets: ['latin'],
        preload: true
      }
    ]
  }
});
