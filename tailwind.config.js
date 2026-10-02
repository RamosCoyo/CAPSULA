/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './menu.html',
        './js/*.js',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Rajdhani', 'sans-serif'],
                display: ['Orbitron', 'sans-serif'],
            },
            colors: {
                capsula: {
                    dark: '#0a0a0f',
                    purple: '#4a0072',
                    fuchsia: '#d946ef',
                    cyan: '#22d3ee',
                    bronze: '#c5832b',
                }
            }
        }
    },
    plugins: [],
}
