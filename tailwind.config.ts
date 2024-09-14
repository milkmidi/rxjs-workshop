import daisyui from 'daisyui';
import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
  content: ['./src/*.html', './src/*.ts', './src/**/*.html', './src/**/*.ts'],
  theme: {
    data: {
      active: 'active~="true"', // data-active="true"
    },
    extend: {},
  },
  plugins: [
    daisyui,
    plugin(({ addUtilities, addComponents, addVariant, e }) => {
      addVariant('child', '& > *');
      addUtilities({
        '.flex-center': {
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center',
        },
        '.absolute-center-x': {
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
        },
        '.absolute-center-y': {
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
        },
        '.absolute-center': {
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        },
      });
    }),
  ],
} satisfies Config;
