export default defineAppConfig({
    ui: {
        primary: 'primary-color',
        gray: 'gray-color',
        modal: {
          base: "sm:-mt-12"
        },
        contextMenu: {
            base: "context-menu",
            rounded: "rounded-xl"
        },
        popover: {
            rounded: "rounded-lg",
            ring: 'ring-1 ring-gray-200 dark:ring-gray-700',
        },
        card: {
            ring: "dark:ring-gray-700",
            divide: "divide-gray-100 dark:divide-gray-700",
        },
        divider: {
            border: {
                base: "dark:border-gray-700"
            }
        },
        input: {
            color: {
                gray: {
                    databaseTableEdit: "shadow-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-0 dark:focus:ring-0",
                    databaseSelectMenu: "shadow-none bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-0 dark:focus:ring-0"
                }
            }
        },
        button: {
            base: "transition-colors",
            variant: {
                solid: "dark:text-gray-100"
            },
            color: {
                primary: {
                    inactive: "text-black dark:text-white",

                    active: "bg-primary-100 hover:bg-opacity-75 text-black dark:bg-gray-700 dark:text-white",
                    selected: "bg-primary-100 hover:bg-opacity-75 text-black dark:bg-primary-300 dark:bg-opacity-20 dark:text-white",
                    sidebar: "bg-transparent hover:bg-primary-100 hover:bg-opacity-50 dark:bg-transparent dark:hover:bg-gray-800"
                },
                gray: {
                    outline: "ring-1 ring-gray-300 hover:ring-gray-400 hover:bg-gray-50",
                    ghost: "hover:bg-gray-100",
                    databaseBottom: "text-gray-400 dark:text-gray-400 rounded-none border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                },
                white: {
                    soft: "bg-transparent text-gray-100 hover:bg-gray-200 hover:bg-opacity-25 " +
                        "dark:bg-transparent dark:hover:bg-gray-200 dark:hover:bg-opacity-25"
                },
                black: {
                    solid: "bg-gray-800 dark:bg-gray-50"
                }
            }
        }
    }
})
