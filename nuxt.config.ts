// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    modules: ['@nuxt/ui'],
    css: ["~/assets/css/main.css"],
    app: {
        head: {
            link: [{ rel: 'icon', type: 'image/svg+xml', href: "/favicon.svg" }]
        }
    },
    tailwindcss: {
        cssPath: false,
    },
    runtimeConfig: {
        baseUrl: '',
        oauthEndpoint: '',
        logoutEndpoint: '',
        oauth: {
            serviceId: '',
            clientId: '',
            clientSecret: ''
        },
        public: {
            defaultRoleColor: '#555555',
            userinfoEndpoint: '',
            apiEndpoint: '',
        }
    }
})
