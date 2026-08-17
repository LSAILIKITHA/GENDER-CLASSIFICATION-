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
        // Theme: "Developer Intelligence" with Accent #C7ED3D
        dev: {
          bg: '#0D1117',
          surface: '#161B22',
          surface2: '#21262D',
          surface3: '#30363D',
          border: '#30363D',
          borderMuted: '#21262D',
          text: '#F0F6FC',
          muted: '#8B949E',
          accent: '#C7ED3D',
          accentHover: '#D4F455',
          accentDark: '#A6C828',
          accentMuted: 'rgba(199, 237, 61, 0.15)',
          success: '#3FB950',
          successHover: '#56D364',
          successMuted: 'rgba(63, 185, 80, 0.15)',
          warning: '#D29922',
          danger: '#F85149',
          purple: '#BC8CFF',
        },
        brand: {
          50: '#FBFDEB',
          100: '#F4FCCB',
          200: '#E9F998',
          300: '#DDF664',
          400: '#D4F455',
          500: '#C7ED3D',
          600: '#A6C828',
          700: '#86A31E',
          800: '#677E17',
          900: '#495910',
        },
        male: '#58A6FF',
        female: '#F778BA',
        neutral: '#C7ED3D',
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
