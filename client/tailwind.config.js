/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "violet",
        "secondary": "purple",
        "tertiary": "#818FB4",
        "active": "orange",
    }
  },
  plugins: [],
}
}