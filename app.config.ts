export default defineAppConfig({
    ui: {
        primary: 'primary-color',
        gray: 'gray-color',
        contextMenu: {
            base: "context-menu"
        },
        popover: {
            rounded: "rounded-lg",
            ring: 'ring-1 ring-gray-200 dark:ring-gray-700',
        },
        card: {
            ring: "dark:ring-gray-700"
        },
        divider: {
            border: {
                base: "dark:border-gray-700"
            }
        },
        button: {
            base: "transition-colors",
            variant: {
                solid: "dark:text-gray-100"
            },
            color: {
                gray: {
                    active: "bg-gray-100 text-black dark:bg-gray-700 dark:text-white"
                },
                white: {
                    soft: "bg-transparent text-gray-100 hover:bg-gray-200 hover:bg-opacity-25 " +
                        "dark:bg-transparent dark:hover:bg-gray-200 dark:hover:bg-opacity-25"
                }
            }
        }
    }
})
