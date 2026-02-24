
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
      name: 'Ai-Market',
      short_name: 'Ai-Market',
      description: 'Товарларды бақылау қосымшасы',
      theme_color: '#000000',
      background_color: '#000000',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      id: '/',
      icons: [
        {
          src: '/images/ai-market-logo-square-orig.jpg',
          sizes: '192x192',
          type: 'image/jpeg',
          purpose: 'any'
        },
        {
          src: '/images/ai-market-logo-square-orig.jpg',
          sizes: '512x512',
          type: 'image/jpeg',
          purpose: 'any'
        },
        {
          src: '/images/ai-market-logo-square-orig.jpg',
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
      title: 'Ai-Market',
      meta: [
        { name: 'description', content: 'Ai-Market - Қытайдан Қазақстанға тауарларды жылдам әрі сенімді жеткізу. Трэк-номер арқылы тауарларды бақылау жүйесі. Быстрая доставка грузов из Китая.' },
        { name: 'keywords', content: 'aimarket, аймаркет, aimar, ai, Aimarket, ai-market, cargo, market, aicargo, Aicargo, карго, Қытайдан жеткізу, тауар бақылау, Ai-Market, логистика, доставка из Китая, отслеживание посылок' },

        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://ai-market.kz/' },
        { property: 'og:title', content: 'Ai-Market - Карго тасымалдау' },
        { property: 'og:description', content: 'Тауарларыңызды бізбен бірге бақылаңыз. Қытайдан Қазақстанға тиімді жеткізу.' },
        { property: 'og:image', content: 'https://ai-market.kz/images/ai-market-logo-square-orig.jpg' },

        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: 'https://ai-market.kz/' },
        { name: 'twitter:title', content: 'Ai-Market - Карго тасымалдау' },
        { name: 'twitter:description', content: 'Тауарларыңызды бізбен бірге бақылаңыз.' },
        { name: 'twitter:image', content: 'https://ai-market.kz/images/ai-market-logo-square-orig.jpg' },
        { name: 'google-site-verification', content: 'google1ccc272df3e5873a' },

        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Ai-Market' },
        { name: 'theme-color', content: '#000000' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/jpeg', href: '/images/ai-market-logo-square-orig.jpg' },
        { rel: 'shortcut icon', type: 'image/jpeg', href: '/images/ai-market-logo-square-orig.jpg' },
        { rel: 'apple-touch-icon', href: '/images/ai-market-logo-square-orig.jpg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/images/ai-market-logo-square-orig.jpg' },
        { rel: 'apple-touch-icon', sizes: '167x167', href: '/images/ai-market-logo-square-orig.jpg' },
        { rel: 'apple-touch-icon', sizes: '152x152', href: '/images/ai-market-logo-square-orig.jpg' },
        { rel: 'manifest', href: '/manifest.webmanifest' }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Ai-Market",
            "url": "https://ai-market.kz",
            "logo": "https://ai-market.kz/images/ai-market-logo-square-orig.jpg",
            "sameAs": [
              "https://ai-market.kz"
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
