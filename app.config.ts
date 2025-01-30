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
            size: {
                '4xl': 'text-4xl'
            },
            color: {
                gray: {
                    transparent: "bg-transparent shadow-none text-gray-900 dark:text-white focus:ring-0 dark:focus:ring-0"
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
                    sidebar: "bg-transparent hover:bg-primary-100 hover:bg-opacity-50 dark:bg-transparent dark:hover:bg-gray-800",
                    ghost: "text-primary-500 dark:text-primary-500 hover:bg-primary-50 dark:hover:bg-gray-700/50",
                    soft: "text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 hover:bg-primary-100/60 dark:hover:bg-primary-600/20 dark:border dark:border-primary-700"
                },
                gray: {
                    outline: "text-gray-600 dark:text-gray-300 ring-1 ring-gray-300 hover:ring-gray-400 dark:ring-gray-500 hover:bg-gray-100/50 dark:hover:bg-gray-700/50",
                    ghost: "hover:bg-gray-100",
                    soft: "text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200 dark:border dark:border-gray-700/50 bg-gray-100/75 hover:bg-gray-200/60 dark:bg-gray-700/15 dark:hover:bg-gray-700/50",
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
