/** @type {import('tailwindcss').Config} */
module.exports = {
darkMode: 'class',
content: [
"./src/**/*.{js,jsx,ts,tsx,html}",
"./public/index.html"
],
theme: {
extend: {},
},
plugins: [
// add Tailwind plugins here, for example:
// require('@tailwindcss/forms'),
],
};
