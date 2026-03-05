/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            colors: {
                primary: '#004AAD',
                secondary: '#1C2B4E',
                accent: '#6B7A99',
                background: '#F8FAFC',
            }
        },
    },
    plugins: [],
}
