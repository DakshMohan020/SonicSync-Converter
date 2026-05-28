/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#1e100c',
        surface: {
          DEFAULT: '#1e100c',
          dim: '#1e100c',
          bright: '#483530',
          containerLowest: '#180b07',
          containerLow: '#271813',
          container: '#2c1c17',
          containerHigh: '#372621',
          containerHighest: '#43302b',
        },
        onSurface: '#fadcd4',
        onSurfaceVariant: '#e4beb4',
        outline: '#ab8980',
        outlineVariant: '#5b4039',
        primary: {
          DEFAULT: '#ff5722',
          hover: '#ff5e5b',
          container: '#ff5722',
          onContainer: '#541200',
          inverse: '#b02f00',
        },
        secondary: {
          DEFAULT: '#ffb3ae',
          container: '#940b19',
        },
        mutedText: '#8A8A93'
      },
      backdropBlur: {
        glass: '20px',
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
      }
    },
  },
  plugins: [],
}