// Tailwind v3: presets: [require('./tailwind.preset.js')] — depende de tokens.css carregado globalmente
const v = (n) => `var(--color-${n})`;
module.exports = {
  theme: {
    extend: {
      colors: Object.fromEntries([
        'bg','surface-1','surface-2','surface-3','line','line-strong','text','text-2','text-3',
        'primary','on-primary','shu','shu-fill','kanji','kanji-ink','vocab','vocab-ink',
        'q-meaning','q-reading','q-writing','ok','ok-bg','ok-ink','err','err-bg','err-ink',
        'srs-1','srs-2','srs-3','srs-4','srs-5',
      ].map((n) => [n, v(n)])),
      fontFamily: { ui: 'var(--font-ui)', jp: 'var(--font-jp)', kanji: 'var(--font-kanji)' },
      borderRadius: { sm: '6px', md: '12px', lg: '16px', xl: '24px' },
      boxShadow: { card: 'var(--shadow-1)', toast: 'var(--shadow-2)' },
      keyframes: {
        shake: { '0%,100%': { transform: 'translateX(0)' }, '20%,60%': { transform: 'translateX(-6px)' }, '40%,80%': { transform: 'translateX(6px)' } },
        stamp: { '0%': { transform: 'scale(1.15) rotate(-4deg)', opacity: 0 }, '100%': { transform: 'scale(1) rotate(-4deg)', opacity: 1 } },
      },
      animation: { shake: 'shake 280ms ease-in-out', stamp: 'stamp 320ms cubic-bezier(.3,1.4,.5,1) both' },
    },
  },
};
