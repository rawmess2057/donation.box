export const colors = {
  bg: "#000000",
  bgCard: "#0a0a0a",
  bgMuted: "#1a1a1a",
  bgElevated: "#111111",
  fg: "#f0f0f0",
  fgMuted: "#a0a0a0",
  fgSubtle: "#707070",
  primary: "#7fbf7f",
  primaryHover: "#DC1FFF",
  primarySoft: "rgba(127, 191, 127, 0.12)",
  accent: "#03E1FF",
  accentHover: "#DC1FFF",
  accentSoft: "rgba(3, 225, 255, 0.12)",
  success: "#7fbf7f",
  successSoft: "rgba(127, 191, 127, 0.1)",
  border: "rgba(255, 255, 255, 0.08)",
  borderFocus: "#DC1FFF",
  glow: "rgba(127, 191, 127, 0.15)",
  glowAccent: "rgba(3, 225, 255, 0.15)",
} as const;

export const fonts = {
  heading: "'Plus Jakarta Sans', sans-serif",
  body: "'Literata', Georgia, serif",
  mono: "'JetBrains Mono', monospace",
} as const;

export const fontSizes = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
  "7xl": "4.5rem",
  "8xl": "6rem",
} as const;

export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export const spacing = {
  0: "0px",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  32: "8rem",
} as const;

export const radii = {
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  full: "9999px",
} as const;

export const shadows = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.4)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.5)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.55)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.6)",
  glow: "0 0 20px rgba(127, 191, 127, 0.15)",
  glowAccent: "0 0 20px rgba(3, 225, 255, 0.15)",
} as const;

export const animation = {
  duration: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
    slower: "800ms",
    slowest: "1200ms",
  },
  easing: {
    easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
    easeInOut: "cubic-bezier(0.76, 0, 0.24, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
} as const;

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type ThemeMode = "light" | "dark";
