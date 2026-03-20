export interface Theme {
  accentColor: string;
  accentColorDark: string;
  bgMain: string;
  fontHeading: string;
  fontBody: string;
  borderRadius: string;
}

export const DEFAULT_THEME: Theme = {
  accentColor: '#f59e0b',
  accentColorDark: '#d97706',
  bgMain: '#0f172a',
  fontHeading: 'Inter',
  fontBody: 'Inter',
  borderRadius: '28px',
};

export const FONT_OPTIONS = [
  'Inter', 'Plus Jakarta Sans', 'Poppins', 'DM Sans', 'Outfit',
  'Nunito', 'Raleway', 'Space Grotesk', 'Lato', 'Roboto',
];

export const BG_PRESETS = [
  { label: 'Slate Dark', value: '#0f172a' },
  { label: 'Navy', value: '#0a0f1e' },
  { label: 'Charcoal', value: '#111827' },
  { label: 'Warm Dark', value: '#1a1208' },
  { label: 'Dark Purple', value: '#0f0a1e' },
  { label: 'Dark Green', value: '#0a1a0f' },
];

export const RADIUS_PRESETS = [
  { label: 'Tajam', value: '12px' },
  { label: 'Normal', value: '20px' },
  { label: 'Rounded', value: '28px' },
  { label: 'Bulat', value: '40px' },
];

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '245 158 11';
  return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`;
}

function loadGoogleFont(font: string) {
  if (font === 'Inter') return;
  const id = `gfont-${font.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;500;600;700;800;900&display=swap`;
  document.head.appendChild(link);
}

let baseInjected = false;

function injectBaseCSS() {
  if (baseInjected) return;
  baseInjected = true;
  const style = document.createElement('style');
  style.id = 'adc-theme-base';
  style.textContent = `
    /* === Accent color overrides === */
    .text-amber-400 { color: rgb(var(--adc-acc)) !important; }
    .text-amber-500 { color: rgb(var(--adc-acc)) !important; }
    .bg-amber-500 { background-color: rgb(var(--adc-acc)) !important; }
    .bg-amber-600 { background-color: rgb(var(--adc-acc-dk)) !important; }
    .hover\\:bg-amber-600:hover { background-color: rgb(var(--adc-acc-dk)) !important; }
    .hover\\:bg-amber-500:hover { background-color: rgb(var(--adc-acc)) !important; }
    .bg-amber-500\\/10 { background-color: rgb(var(--adc-acc) / 0.1) !important; }
    .bg-amber-500\\/20 { background-color: rgb(var(--adc-acc) / 0.2) !important; }
    .border-amber-500\\/20 { border-color: rgb(var(--adc-acc) / 0.2) !important; }
    .border-amber-500\\/30 { border-color: rgb(var(--adc-acc) / 0.3) !important; }
    .from-amber-400 { --tw-gradient-from: rgb(var(--adc-acc)) var(--tw-gradient-from-position) !important; }
    .from-amber-500 { --tw-gradient-from: rgb(var(--adc-acc)) var(--tw-gradient-from-position) !important; }
    .to-amber-600 { --tw-gradient-to: rgb(var(--adc-acc-dk)) var(--tw-gradient-to-position) !important; }
    .shadow-amber-500\\/20 { --tw-shadow-color: rgb(var(--adc-acc) / 0.2) !important; }
    .shadow-amber-500\\/30 { --tw-shadow-color: rgb(var(--adc-acc) / 0.3) !important; }
    .shadow-amber-500\\/40 { --tw-shadow-color: rgb(var(--adc-acc) / 0.4) !important; }
    .accent-amber-500 { accent-color: rgb(var(--adc-acc)) !important; }
    .focus\\:border-amber-500\\/50:focus { border-color: rgb(var(--adc-acc) / 0.5) !important; }
    .ring-1.focus\\:ring-amber-500\\/20 { --tw-ring-color: rgb(var(--adc-acc) / 0.2) !important; }

    /* === Background overrides === */
    .bg-slate-900 { background-color: rgb(var(--adc-bg)) !important; }
    .bg-slate-900\\/80 { background-color: rgb(var(--adc-bg) / 0.8) !important; }
    .bg-slate-900\\/95 { background-color: rgb(var(--adc-bg) / 0.95) !important; }
    .bg-slate-900\\/90 { background-color: rgb(var(--adc-bg) / 0.9) !important; }
    .bg-slate-900\\/50 { background-color: rgb(var(--adc-bg) / 0.5) !important; }

    /* === Font overrides === */
    h1, h2, h3, h4, h5, h6, .font-black, .font-bold {
      font-family: var(--adc-font-h), system-ui, sans-serif !important;
    }
    body { font-family: var(--adc-font-b), system-ui, sans-serif !important; }

    /* === Border radius overrides === */
    .rounded-\\[28px\\] { border-radius: var(--adc-radius) !important; }
    .rounded-\\[32px\\] { border-radius: calc(var(--adc-radius) + 4px) !important; }
    .rounded-\\[40px\\] { border-radius: calc(var(--adc-radius) + 12px) !important; }
    .rounded-\\[24px\\] { border-radius: calc(var(--adc-radius) - 4px) !important; }
  `;
  document.head.appendChild(style);
}

export function applyTheme(theme: Theme) {
  injectBaseCSS();

  const root = document.documentElement;
  root.style.setProperty('--adc-acc', hexToRgb(theme.accentColor || '#f59e0b'));
  root.style.setProperty('--adc-acc-dk', hexToRgb(theme.accentColorDark || '#d97706'));
  root.style.setProperty('--adc-bg', hexToRgb(theme.bgMain || '#0f172a'));
  root.style.setProperty('--adc-font-h', theme.fontHeading || 'Inter');
  root.style.setProperty('--adc-font-b', theme.fontBody || 'Inter');
  root.style.setProperty('--adc-radius', theme.borderRadius || '28px');

  loadGoogleFont(theme.fontHeading || 'Inter');
  if (theme.fontBody !== theme.fontHeading) loadGoogleFont(theme.fontBody || 'Inter');
}
