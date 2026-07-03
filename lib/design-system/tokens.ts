export const colors = {
  light: {
    bg: "#FFF9F0",
    bgCard: "#FFFFFF",
    bgMuted: "#F7F3EC",
    bgElevated: "#FFFFFF",
    fg: "#1C1917",
    fgMuted: "#78716C",
    fgSubtle: "#A8A29E",
    primary: "#D97706",
    primaryHover: "#B45309",
    primarySoft: "#FEF3C7",
    accent: "#0D9488",
    accentHover: "#0F766E",
    accentSoft: "#CCFBF1",
    success: "#059669",
    successSoft: "#D1FAE5",
    border: "#E7E5E4",
    borderFocus: "#D97706",
    overlay: "rgba(28, 25, 23, 0.5)",
    glow: "rgba(217, 119, 6, 0.15)",
    glowAccent: "rgba(13, 148, 136, 0.15)",
  },
  dark: {
    bg: "#0C0A09",
    bgCard: "#1C1917",
    bgMuted: "#292524",
    bgElevated: "#292524",
    fg: "#F5F5F4",
    fgMuted: "#A8A29E",
    fgSubtle: "#78716C",
    primary: "#F59E0B",
    primaryHover: "#D97706",
    primarySoft: "#451A03",
    accent: "#14B8A6",
    accentHover: "#0D9488",
    accentSoft: "#022C22",
    success: "#34D399",
    successSoft: "#022C22",
    border: "#292524",
    borderFocus: "#F59E0B",
    overlay: "rgba(12, 10, 9, 0.8)",
    glow: "rgba(245, 158, 11, 0.12)",
    glowAccent: "rgba(20, 184, 166, 0.12)",
  },
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
  light: {
    sm: "0 1px 2px rgba(28, 25, 23, 0.05)",
    md: "0 4px 6px -1px rgba(28, 25, 23, 0.08)",
    lg: "0 10px 15px -3px rgba(28, 25, 23, 0.08)",
    xl: "0 20px 25px -5px rgba(28, 25, 23, 0.1)",
    glow: "0 0 20px rgba(217, 119, 6, 0.15)",
    glowAccent: "0 0 20px rgba(13, 148, 136, 0.15)",
  },
  dark: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.3)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
    glow: "0 0 20px rgba(245, 158, 11, 0.12)",
    glowAccent: "0 0 20px rgba(20, 184, 166, 0.12)",
  },
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
