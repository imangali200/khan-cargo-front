
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@vite-pwa/nuxt"],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  plugins: [
    '~/plugins/toast.client.ts'
  ],


  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Khan Cargo',
      short_name: 'Khan Cargo',
      description: 'Khan Cargo - cargo tracking and logistics management',
      theme_color: '#0d1117',
      background_color: '#0d1117',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      id: '/',
      icons: [
        {
          src: '/logo.jpg',
          sizes: '192x192',
          type: 'image/jpeg',
          purpose: 'any'
        },
        {
          src: '/logo.jpg',
          sizes: '512x512',
          type: 'image/jpeg',
          purpose: 'any'
        },
        {
          src: '/logo.jpg',
          sizes: '512x512',
          type: 'image/jpeg',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      globIgnores: ['google1ccc272df3e5873a.html']
    },
    client: {
      installPrompt: false
    },
    devOptions: {
      enabled: false,
      type: 'module'
    }
  },


  app: {
    head: {
      title: 'Khan Cargo',
      meta: [
        { name: 'description', content: 'Khan Cargo - Professional cargo tracking and logistics management. Track your shipments from China to Kazakhstan in real-time.' },
        { name: 'keywords', content: 'khan cargo, cargo, tracking, logistics, china, kazakhstan, shipping, carrier' },

        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://khancargo.kz/' },
        { property: 'og:title', content: 'Khan Cargo - Professional Cargo Tracking' },
        { property: 'og:description', content: 'Track your cargo with Khan Cargo. Efficient delivery from China to Kazakhstan.' },
        { property: 'og:image', content: 'https://khancargo.kz/logo.jpg' },

        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: 'https://khancargo.kz/' },
        { name: 'twitter:title', content: 'Khan Cargo - Professional Cargo Tracking' },
        { name: 'twitter:description', content: 'Track your cargo with Khan Cargo.' },
        { name: 'twitter:image', content: '/logo-preview.jpg' },
        { name: 'google-site-verification', content: 'google1ccc272df3e5873a' },

        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Khan Cargo' },
        { name: 'theme-color', content: '#0d1117' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700;800;900&display=swap' },
        { rel: 'icon', type: 'image/jpeg', href: '/logo.jpg' },
        { rel: 'shortcut icon', type: 'image/jpeg', href: '/logo.jpg' },
        { rel: 'apple-touch-icon', href: '/logo.jpg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/logo.jpg' },
        { rel: 'apple-touch-icon', sizes: '167x167', href: '/logo.jpg' },
        { rel: 'apple-touch-icon', sizes: '152x152', href: '/logo.jpg' },
        { rel: 'manifest', href: '/manifest.webmanifest' }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Khan Cargo",
            "url": "https://khancargo.kz",
            "logo": "https://khancargo.kz/logo.png",
            "sameAs": [
              "https://khancargo.kz"
            ]
          })
        }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080'
    }
  }
});
