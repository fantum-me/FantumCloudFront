// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    modules: ['@nuxt/image', '@nuxt/ui'],

    tailwindcss: {
        cssPath: ["~/assets/css/main.css", {injectPosition: "first"}],
    },

    app: {
        head: {
            link: [{rel: 'icon', type: 'image/svg+xml', href: "/favicon.svg"}]
        }
    },

    runtimeConfig: {
        baseUrlForOnlyoffice: '',
        oauthEndpoint: '',
        logoutEndpoint: '',
        oauth: {
            serviceId: '',
            clientId: '',
            clientSecret: ''
        },
        onlyofficeJwtSecret: '',
        docsApiAccessKey: '',
        public: {
            baseUrl: '',
            onlyofficeUrl: '',
            defaultRoleColor: '#555555',
            userinfoEndpoint: '',
            apiEndpoint: '',
        }
    },

    compatibilityDate: '2025-02-04'
})
