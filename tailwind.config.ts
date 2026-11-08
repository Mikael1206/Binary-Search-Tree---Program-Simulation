import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F0DAC2',
        ink: '#20201C',
        card: '#FFFCF6',
        panel: '#FFF9EE',
        strip: '#F0E9DC',
        accent: {
          lime: '#DFFF60',
          yellow: '#FFE070',
          coral: '#FF947F',
          pink: '#FF9DB6',
          purple: '#C8B5FF',
          mint: '#A8DFC3',
          sky: '#B9DFF1',
        },
        tint: {
          pink: '#FFE3EB',
          sky: '#DDEEF6',
          mint: '#D9EFE2',
          purple: '#E9E0FF',
        },
        muted: {
          divider: '#B7AFA0',
          text: '#716A60',
        },
      },
      boxShadow: {
        // Named "pop" instead of "card" because a shadow token named after a
        // color would collide with Tailwind's generated `shadow-card` color
        // utility (#FFFCF6), turning the hard outline shadow white.
        pop: '6px 6px 0px #20201C',
        btn: '3px 3px 0px #20201C',
        node: '4px 4px 0px #20201C',
      },
      borderWidth: {
        '3': '3px',
      },
      borderRadius: {
        card: '16px',
        'header-card': '24px',
        node: '14px',
      },
      fontFamily: {
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config

