/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Will add Google Font link later
            },
            colors: {
                'crimson-violet': {
                    '50': '#fce9f4',
                    '100': '#f8d3ea',
                    '200': '#f1a7d5',
                    '300': '#ea7bc0',
                    '400': '#e34faa',
                    '500': '#dd2295',
                    '600': '#b01c77',
                    '700': '#84155a',
                    '800': '#580e3c',
                    '900': '#2c071e',
                    '950': '#1f0515'
                },
                'deep-crimson': {
                    '50': '#fee6ea',
                    '100': '#fecdd6',
                    '200': '#fd9bad',
                    '300': '#fc6984',
                    '400': '#fb375b',
                    '500': '#fa0532',
                    '600': '#c80428',
                    '700': '#96031e',
                    '800': '#640214',
                    '900': '#32010a',
                    '950': '#230107'
                },
                'princeton-orange': {
                    '50': '#fef2e6',
                    '100': '#fee5cd',
                    '200': '#fdca9b',
                    '300': '#fcb069',
                    '400': '#fb9637',
                    '500': '#fa7b05',
                    '600': '#c86304',
                    '700': '#964a03',
                    '800': '#643102',
                    '900': '#321901',
                    '950': '#231101'
                },
                'autumn-leaf': {
                    '50': '#fdf0e8',
                    '100': '#fbe1d0',
                    '200': '#f7c2a1',
                    '300': '#f3a472',
                    '400': '#ef8543',
                    '500': '#eb6714',
                    '600': '#bc5210',
                    '700': '#8d3e0c',
                    '800': '#5e2908',
                    '900': '#2f1504',
                    '950': '#210e03'
                },
                'dark-teal': {
                    '50': '#e9f8fb',
                    '100': '#d3f1f8',
                    '200': '#a7e2f1',
                    '300': '#7bd4ea',
                    '400': '#50c5e2',
                    '500': '#24b7db',
                    '600': '#1d92af',
                    '700': '#156e84',
                    '800': '#0e4958',
                    '900': '#07252c',
                    '950': '#051a1f'
                },
                // Standard shadcn-like vars for compatibility if needed
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            }
        }
    },
    plugins: [],
}
