/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                davus: {
                    primary: '#f97316', // Orange-500 (More vibrant)
                    secondary: '#ea580c', // Orange-600
                    accent: '#fb923c', // Orange-400
                    dark: '#0f172a', // Slate-900
                    darker: '#020617', // Slate-950
                    light: '#f8fafc', // Slate-50
                    surface: '#ffffff',
                    'surface-dark': '#1e293b', // Slate-800
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.5s ease-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'pulse-soft': 'pulseSoft 2s infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideIn: {
                    '0%': { transform: 'translateX(-20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                }
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'glow': '0 0 15px rgba(249, 115, 22, 0.3)',
            }
        },
    },
    plugins: [],
}
