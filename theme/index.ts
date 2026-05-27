/**
 * Charte graphique CoHabitat — source unique pour couleurs, typo et espacements.
 * Style : fond clair, en-tête sombre, actions noires, bordures légères.
 */

export const colors = {
  background: "#fff",
  surface: "#fff",
  surfaceMuted: "#f9fafb",
  surfaceSubtle: "#f9f9f9",

  header: "#161616",
  primary: "#000",
  primaryContrast: "#fff",

  text: "#000",
  textMuted: "#666",
  textSubtle: "#00000080",
  textOnDark: "#fff",

  border: "#0000001A",
  borderLight: "#e1e1e1",

  danger: "#d32f2f",
  dangerContrast: "#fff",

  placeholder: "#888",
  imagePlaceholder: "#e1e1e1",

  /** Accents dashboard (raccourcis home) — conservés pour lisibilité */
  accentOrange: "#ff8c00",
  accentMint: "#65ddb7",
  accentPink: "#f54888",
  accentGold: "#e0b115",
} as const;

/** Couleurs sémantiques des statuts d'incident */
export const incidentStatusColors = {
  nouveau: "#ff9500",
  en_cours: "#000",
  resolu: "#34c759",
  ferme: "#8e8e93",
} as const;

export type IncidentStatusKey = keyof typeof incidentStatusColors;

export function getIncidentStatusColor(status: string): string {
  return (
    incidentStatusColors[status as IncidentStatusKey] ?? colors.textMuted
  );
}

export const typography = {
  h1: { fontSize: 28, fontWeight: "700" as const },
  h2: { fontSize: 24, fontWeight: "700" as const },
  h3: { fontSize: 18, fontWeight: "600" as const },
  body: { fontSize: 16, fontWeight: "400" as const },
  bodySemibold: { fontSize: 16, fontWeight: "600" as const },
  caption: { fontSize: 14, fontWeight: "400" as const },
  small: { fontSize: 13, fontWeight: "400" as const },
  button: { fontSize: 16, fontWeight: "600" as const },
} as const;

export const spacing = {
  xs: 6,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,

  radius: 12,
  radiusSm: 8,
  radiusFull: 999,

  inputHeight: 48,
  headerHeight: 120,
  navbarHeight: 70,

  screenPaddingH: 24,
  screenPaddingBottom: 100,
} as const;

/** Styles de champ / bouton réutilisables (référence pour les hooks) */
export const field = {
  borderWidth: 1,
  borderColor: colors.border,
  backgroundColor: colors.surfaceMuted,
  borderRadius: spacing.radius,
  height: spacing.inputHeight,
  paddingHorizontal: spacing.md,
} as const;

export const button = {
  height: spacing.inputHeight,
  borderRadius: spacing.radius,
  primaryBg: colors.primary,
  primaryText: colors.primaryContrast,
  secondaryBg: colors.surface,
  secondaryText: colors.text,
  secondaryBorder: colors.primary,
} as const;
