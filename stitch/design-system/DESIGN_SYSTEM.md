# Design System: Atelier Amber & Charcoal

**Resource Name:** `assets/10da7eccbb0f4e2086137af16d889cbb`

## Brand & Style

This design system targets master barbershops, grooming salons, and their discerning clientele. It translates the tactile elegance of mid-century grooming parlors—oiled walnut, patinated brass hardware, honed steel, and vintage leather—into an exacting, modern desktop interface.

The emotional signature is stoic, warm, disciplined, and unhurried. It avoids the neon lighting and cold blues of tech platforms, as well as the playful, bubble-shaped geometries of modern consumer apps. Structural integrity takes precedence: content blocks operate like bespoke millwork, defined by clean, razor-sharp hairline borders, muted metallic accents, and high-contrast typography. The interaction model is quiet and immediate, evoking the precision of straight-razor craftsmanship.

## Layout & Spacing

The layout is built for desktop productivity, centered within a constrained master canvas (`max-w-6xl` / 1152px) on top of the `#191714` charcoal canvas.

- **Grid Architecture:** 12-column grid system with a 24px (`1.5rem`) gutter and 32px (`2rem`) minimum page margins. 
- **Calendar & Daily Agenda Columns:** Fixed multi-column split (e.g., 4 columns for multiple barbers side-by-side or a 60/40 Split between booking agenda and customer profile card).
- **Rhythm & Gaps:**
  - `space-xs` (4px): Micro-spacing between icon and uppercase label.
  - `space-sm` (8px): Form input inner paddings, status badge gaps.
  - `space-md` (16px): Compact card internal padding, item separation in service lists.
  - `space-lg` (24px): Standard card padding, gap between agenda time blocks.
  - `space-xl` (40px): Section margins, transitions between global navigation and stage area.

## Elevation & Depth

Visual hierarchy does not rely on heavy drop shadows, blurred silhouettes, or generic SaaS float physics. Instead, depth is produced via **Tonal Stacking** and **Hairline Geometry**:

- **Ground Level (`#191714`):** Canvas backing for sidebars, global navigation rails, and page backgrounds.
- **Level 1 Container (`#221F1B`):** Structural panels, appointment grid frames, and service listing containers. Finished with a 1px continuous hairline outline using `#383129`.
- **Level 2 Container (`#282420`):** Modal dialogs, floating context menus, active appointment slots, and time selector hovers. Defined by an accentuated 1px hairline border using `rgba(193, 127, 59, 0.25)`.
- **Shadows:** Restricted strictly to floating overlays and dropdowns: `0 12px 32px rgba(0, 0, 0, 0.65), 0 1px 2px rgba(0, 0, 0, 0.8)`. Always crisp, warm-toned, and close to the edge.

## Components

### Buttons
- **Primary:** Background `#C17F3B`, label text `#191714` (weight 700), radius 6px. Hover shifts to `#D4934E`; active shifts to `#9E6328`. No border or drop shadow.
- **Secondary / Outlined:** Background transparent, border 1px solid `#383129`, text `#F3EDE3`. Hover renders border `rgba(193, 127, 59, 0.5)` and background `rgba(193, 127, 59, 0.05)`.
- **Destructive:** Background transparent, border 1px solid `#8B3A3A`, text `#8B3A3A`. Hover yields background `rgba(139, 58, 58, 0.15)`.

### Price List (Classic Dotted Leader)
- Composed of three horizontal elements:
  1. Service Name & Subtitle (`#F3EDE3`, label-md/body-md).
  2. Dotted Leader: Flex-fill span with `border-bottom: 1px dotted #383129` positioned slightly below the baseline.
  3. Price: High-emphasis Off-White or Brass (`#C17F3B`), tabular numbers, weight 700.

### Appointment Time-Slots & Chips
- Default: `#221F1B`, border 1px solid `#383129`, text `#A39788`.
- Selected: Background `rgba(193, 127, 59, 0.12)`, border 1px solid `#C17F3B`, text `#F3EDE3`.
- Unavailable: Strikethrough text `#6C6255`, border 1px dashed `#282420`, cursor not-allowed.

### Inputs & Date-Pickers
- Background `#191714` inset into `#221F1B` container.
- Border: 1px solid `#383129`.
- Typography: `#F3EDE3`, placeholder in `#6C6255`.
- Focus state: Border transitions to `#C17F3B` with zero outer glowing rings; maintains a crisp hairline outline.

### Status Indicators
- **Available / Finished:** Olive capsule (`#4E8752`) at 15% opacity with solid text `#4E8752` and a 1px border.
- **Cancelled / Absent:** Oxblood capsule (`#8B3A3A`) at 15% opacity with solid text `#8B3A3A` and a 1px border.

### Service Cards & Summary Blocks
- Background `#221F1B` with 1px hairline `#383129`. Header separated by a 1px internal rule (`#282420`). Hover states subtly highlight the frame outline to `rgba(193, 127, 59, 0.3)`.

## Theme Configuration

```json
{
  "colorMode": "DARK",
  "font": "PLUS_JAKARTA_SANS",
  "roundness": "ROUND_FOUR",
  "customColor": "#c17f3b",
  "headlineFont": "PLUS_JAKARTA_SANS",
  "bodyFont": "PLUS_JAKARTA_SANS",
  "labelFont": "PLUS_JAKARTA_SANS",
  "namedColors": {
    "on_primary_fixed_variant": "#6a3b00",
    "surface_dim": "#151310",
    "tertiary_container": "#d67573",
    "on_tertiary_container": "#531014",
    "surface_container_low": "#1d1b18",
    "surface_container_high": "#2c2a26",
    "on_error_container": "#ffdad6",
    "on_surface": "#e8e1dc",
    "outline": "#9f8e80",
    "outline_variant": "#524439",
    "secondary_fixed": "#b4f2b3",
    "surface_container": "#211f1c",
    "on_tertiary": "#5d171a",
    "tertiary_fixed": "#ffdad8",
    "on_surface_variant": "#d7c3b4",
    "surface_variant": "#373431",
    "surface_tint": "#ffb873",
    "background": "#151310",
    "secondary": "#98d599",
    "on_secondary_container": "#8bc78b",
    "on_tertiary_fixed_variant": "#7a2d2e",
    "primary_fixed": "#ffdcbf",
    "inverse_on_surface": "#33302d",
    "surface_container_lowest": "#100e0b",
    "tertiary_fixed_dim": "#ffb3b0",
    "surface_bright": "#3b3935",
    "error_container": "#93000a",
    "primary_fixed_dim": "#ffb873",
    "primary_container": "#c5823e",
    "surface": "#151310",
    "inverse_primary": "#89510e",
    "error": "#ffb4ab",
    "on_primary_fixed": "#2d1600",
    "secondary_container": "#1b5425",
    "on_background": "#e8e1dc",
    "tertiary": "#ffb3b0",
    "surface_container_highest": "#373431",
    "inverse_surface": "#e8e1dc",
    "on_secondary_fixed_variant": "#185123",
    "on_primary": "#4b2800",
    "on_secondary": "#003910",
    "on_secondary_fixed": "#002107",
    "on_error": "#690005",
    "secondary_fixed_dim": "#98d599",
    "primary": "#ffb873",
    "on_tertiary_fixed": "#3f0207",
    "on_primary_container": "#412200"
  },
  "designMd": "---\nname: Atelier Amber & Charcoal\ncolors:\n  surface: '#151310'\n  surface-dim: '#151310'\n  surface-bright: '#3b3935'\n  surface-container-lowest: '#100e0b'\n  surface-container-low: '#1d1b18'\n  surface-container: '#211f1c'\n  surface-container-high: '#2c2a26'\n  surface-container-highest: '#373431'\n  on-surface: '#e8e1dc'\n  on-surface-variant: '#d7c3b4'\n  inverse-surface: '#e8e1dc'\n  inverse-on-surface: '#33302d'\n  outline: '#9f8e80'\n  outline-variant: '#524439'\n  surface-tint: '#ffb873'\n  primary: '#ffb873'\n  on-primary: '#4b2800'\n  primary-container: '#c5823e'\n  on-primary-container: '#412200'\n  inverse-primary: '#89510e'\n  secondary: '#98d599'\n  on-secondary: '#003910'\n  secondary-container: '#1b5425'\n  on-secondary-container: '#8bc78b'\n  tertiary: '#ffb3b0'\n  on-tertiary: '#5d171a'\n  tertiary-container: '#d67573'\n  on-tertiary-container: '#531014'\n  error: '#ffb4ab'\n  on-error: '#690005'\n  error-container: '#93000a'\n  on-error-container: '#ffdad6'\n  primary-fixed: '#ffdcbf'\n  primary-fixed-dim: '#ffb873'\n  on-primary-fixed: '#2d1600'\n  on-primary-fixed-variant: '#6a3b00'\n  secondary-fixed: '#b4f2b3'\n  secondary-fixed-dim: '#98d599'\n  on-secondary-fixed: '#002107'\n  on-secondary-fixed-variant: '#185123'\n  tertiary-fixed: '#ffdad8'\n  tertiary-fixed-dim: '#ffb3b0'\n  on-tertiary-fixed: '#3f0207'\n  on-tertiary-fixed-variant: '#7a2d2e'\n  background: '#151310'\n  on-background: '#e8e1dc'\n  surface-variant: '#373431'\ntypography:\n  display-lg:\n    fontFamily: Plus Jakarta Sans\n    fontSize: 44px\n    fontWeight: '800'\n    lineHeight: 52px\n    letterSpacing: -0.03em\n  headline-xl:\n    fontFamily: Plus Jakarta Sans\n    fontSize: 32px\n    fontWeight: '700'\n    lineHeight: 40px\n    letterSpacing: -0.025em\n  headline-md:\n    fontFamily: Plus Jakarta Sans\n    fontSize: 24px\n    fontWeight: '700'\n    lineHeight: 32px\n    letterSpacing: -0.02em\n  headline-sm:\n    fontFamily: Plus Jakarta Sans\n    fontSize: 18px\n    fontWeight: '600'\n    lineHeight: 26px\n    letterSpacing: -0.015em\n  body-lg:\n    fontFamily: Plus Jakarta Sans\n    fontSize: 16px\n    fontWeight: '400'\n    lineHeight: 24px\n    letterSpacing: 0em\n  body-md:\n    fontFamily: Plus Jakarta Sans\n    fontSize: 14px\n    fontWeight: '400'\n    lineHeight: 22px\n    letterSpacing: 0em\n  body-sm:\n    fontFamily: Plus Jakarta Sans\n    fontSize: 13px\n    fontWeight: '400'\n    lineHeight: 18px\n    letterSpacing: 0.01em\n  label-caps:\n    fontFamily: Plus Jakarta Sans\n    fontSize: 11px\n    fontWeight: '700'\n    lineHeight: 16px\n    letterSpacing: 0.08em\n  label-data:\n    fontFamily: Plus Jakarta Sans\n    fontSize: 12px\n    fontWeight: '600'\n    lineHeight: 16px\n    letterSpacing: 0.04em\nrounded:\n  sm: 0.125rem\n  DEFAULT: 0.25rem\n  md: 0.375rem\n  lg: 0.5rem\n  xl: 0.75rem\n  full: 9999px\nspacing:\n  gutter: 1.5rem\n  margin: 2rem\n  space-xs: 0.25rem\n  space-sm: 0.5rem\n  space-md: 1rem\n  space-lg: 1.5rem\n  space-xl: 2.5rem\n---\n\n## Brand & Style\n\nThis design system targets master barbershops, grooming salons, and their discerning clientele. It translates the tactile elegance of mid-century grooming parlors—oiled walnut, patinated brass hardware, honed steel, and vintage leather—into an exacting, modern desktop interface.\n\nThe emotional signature is stoic, warm, disciplined, and unhurried. It avoids the neon lighting and cold blues of tech platforms, as well as the playful, bubble-shaped geometries of modern consumer apps. Structural integrity takes precedence: content blocks operate like bespoke millwork, defined by clean, razor-sharp hairline borders, muted metallic accents, and high-contrast typography. The interaction model is quiet and immediate, evoking the precision of straight-razor craftsmanship.\n\n## Colors\n\nThe palette operates on a low-key, dark chromatic foundation engineered for high legibility under warm indoor lighting.\n\n- **Primary Accent (Forged Brass / Amber):** `#C17F3B` serves as the focal driver for confirmed actions, active appointments, and key interactive focal points. \n  - Hover state: `#D4934E`\n  - Active/Pressed state: `#9E6328`\n  - Subtle glow/highlight fill: `rgba(193, 127, 59, 0.12)`\n- **Surfaces & Layers:**\n  - Base Canvas (`surface-0`): `#191714` (Warm Charcoal)\n  - Surface Level 1 (`surface-1`): `#221F1B` (Deep Walnut Card)\n  - Surface Level 2 (`surface-2`): `#282420` (Elevated Panel / Active Cell)\n  - Hairline Boundaries (`border-subtle`): `#383129` or `rgba(193, 127, 59, 0.15)`\n- **Typography & Ink:**\n  - High Emphasis: `#F3EDE3` (Warm Bone Off-White)\n  - Medium/Secondary: `#A39788` (Muted Warm Gray)\n  - Tertiary/Muted: `#6C6255` (Deep Silt)\n- **Functional Semantics:**\n  - Available / Confirmed / Active: `#4E8752` (Olive Green)\n  - Cancelled / Danger / Unavailable: `#8B3A3A` (Muted Oxblood / Deep Wine)\n  - Disallowed: All vivid purple, fuchsia, synthetic cyan, and orange tones are strictly excluded to preserve an artisanal, masculine tone.\n\n## Typography\n\nThe type system is powered by Plus Jakarta Sans across all roles to maintain a dense, disciplined, and contemporary aesthetic.\n\n- **Headlines & Display:** Set in Bold (700) and ExtraBold (800) with slight negative tracking (`-0.02em` to `-0.03em`). This condenses the character flow, imparting solidity and editorial presence.\n- **Body:** Standardized at 400 and 500 weights on a relaxed line height to ensure fatigue-free scheduling and reading of detailed service descriptions.\n- **Labels, Metadata, & Statuses:** Set in `label-caps` using full uppercase treatment, weight 700, with expanded tracking (`+0.08em` to `+0.1em`). Used for headers in barber schedules, currency denominations, status tags, and menu section dividers.\n\n## Layout & Spacing\n\nThe layout is built for desktop productivity, centered within a constrained master canvas (`max-w-6xl` / 1152px) on top of the `#191714` charcoal canvas.\n\n- **Grid Architecture:** 12-column grid system with a 24px (`1.5rem`) gutter and 32px (`2rem`) minimum page margins. \n- **Calendar & Daily Agenda Columns:** Fixed multi-column split (e.g., 4 columns for multiple barbers side-by-side or a 60/40 Split between booking agenda and customer profile card).\n- **Rhythm & Gaps:**\n  - `space-xs` (4px): Micro-spacing between icon and uppercase label.\n  - `space-sm` (8px): Form input inner paddings, status badge gaps.\n  - `space-md` (16px): Compact card internal padding, item separation in service lists.\n  - `space-lg` (24px): Standard card padding, gap between agenda time blocks.\n  - `space-xl` (40px): Section margins, transitions between global navigation and stage area.\n\n## Elevation & Depth\n\nVisual hierarchy does not rely on heavy drop shadows, blurred silhouettes, or generic SaaS float physics. Instead, depth is produced via **Tonal Stacking** and **Hairline Geometry**:\n\n- **Ground Level (`#191714`):** Canvas backing for sidebars, global navigation rails, and page backgrounds.\n- **Level 1 Container (`#221F1B`):** Structural panels, appointment grid frames, and service listing containers. Finished with a 1px continuous hairline outline using `#383129`.\n- **Level 2 Container (`#282420`):** Modal dialogs, floating context menus, active appointment slots, and time selector hovers. Defined by an accentuated 1px hairline border using `rgba(193, 127, 59, 0.25)`.\n- **Shadows:** Restricted strictly to floating overlays and dropdowns: `0 12px 32px rgba(0, 0, 0, 0.65), 0 1px 2px rgba(0, 0, 0, 0.8)`. Always crisp, warm-toned, and close to the edge.\n\n## Shapes\n\nThe design uses tight, tailored corner radiuses. No pill shapes, circles (except avatars), or high-radius bubbles are permitted.\n\n- **Base Radius (6px / 0.375rem):** Used for inputs, segmented controls, small buttons, status indicators, and time slot pills.\n- **Container Radius (8px to 10px / 0.5rem - 0.625rem):** Applied to appointment cards, service catalog items, modals, and panel wrappers.\n- **Hairlines:** All shape outlines must render as an unblurred 1px hairline (`border border-[#383129]`).\n\n## Components\n\n### Buttons\n- **Primary:** Background `#C17F3B`, label text `#191714` (weight 700), radius 6px. Hover shifts to `#D4934E`; active shifts to `#9E6328`. No border or drop shadow.\n- **Secondary / Outlined:** Background transparent, border 1px solid `#383129`, text `#F3EDE3`. Hover renders border `rgba(193, 127, 59, 0.5)` and background `rgba(193, 127, 59, 0.05)`.\n- **Destructive:** Background transparent, border 1px solid `#8B3A3A`, text `#8B3A3A`. Hover yields background `rgba(139, 58, 58, 0.15)`.\n\n### Price List (Classic Dotted Leader)\n- Composed of three horizontal elements:\n  1. Service Name & Subtitle (`#F3EDE3`, label-md/body-md).\n  2. Dotted Leader: Flex-fill span with `border-bottom: 1px dotted #383129` positioned slightly below the baseline.\n  3. Price: High-emphasis Off-White or Brass (`#C17F3B`), tabular numbers, weight 700.\n\n### Appointment Time-Slots & Chips\n- Default: `#221F1B`, border 1px solid `#383129`, text `#A39788`.\n- Selected: Background `rgba(193, 127, 59, 0.12)`, border 1px solid `#C17F3B`, text `#F3EDE3`.\n- Unavailable: Strikethrough text `#6C6255`, border 1px dashed `#282420`, cursor not-allowed.\n\n### Inputs & Date-Pickers\n- Background `#191714` inset into `#221F1B` container.\n- Border: 1px solid `#383129`.\n- Typography: `#F3EDE3`, placeholder in `#6C6255`.\n- Focus state: Border transitions to `#C17F3B` with zero outer glowing rings; maintains a crisp hairline outline.\n\n### Status Indicators\n- **Available / Finished:** Olive capsule (`#4E8752`) at 15% opacity with solid text `#4E8752` and a 1px border.\n- **Cancelled / Absent:** Oxblood capsule (`#8B3A3A`) at 15% opacity with solid text `#8B3A3A` and a 1px border.\n\n### Service Cards & Summary Blocks\n- Background `#221F1B` with 1px hairline `#383129`. Header separated by a 1px internal rule (`#282420`). Hover states subtly highlight the frame outline to `rgba(193, 127, 59, 0.3)`.",
  "colorVariant": "FIDELITY",
  "overridePrimaryColor": "#c17f3b",
  "overrideSecondaryColor": "#4e8752",
  "overrideTertiaryColor": "#8b3a3a",
  "overrideNeutralColor": "#191714",
  "spacingScale": 2,
  "typography": {
    "label-data": {
      "fontFamily": "Plus Jakarta Sans",
      "fontSize": "12px",
      "fontWeight": "600",
      "lineHeight": "16px",
      "letterSpacing": "0.04em"
    },
    "body-lg": {
      "fontFamily": "Plus Jakarta Sans",
      "fontSize": "16px",
      "fontWeight": "400",
      "lineHeight": "24px",
      "letterSpacing": "0em"
    },
    "headline-md": {
      "fontFamily": "Plus Jakarta Sans",
      "fontSize": "24px",
      "fontWeight": "700",
      "lineHeight": "32px",
      "letterSpacing": "-0.02em"
    },
    "display-lg": {
      "fontFamily": "Plus Jakarta Sans",
      "fontSize": "44px",
      "fontWeight": "800",
      "lineHeight": "52px",
      "letterSpacing": "-0.03em"
    },
    "headline-sm": {
      "fontFamily": "Plus Jakarta Sans",
      "fontSize": "18px",
      "fontWeight": "600",
      "lineHeight": "26px",
      "letterSpacing": "-0.015em"
    },
    "headline-xl": {
      "fontFamily": "Plus Jakarta Sans",
      "fontSize": "32px",
      "fontWeight": "700",
      "lineHeight": "40px",
      "letterSpacing": "-0.025em"
    },
    "body-md": {
      "fontFamily": "Plus Jakarta Sans",
      "fontSize": "14px",
      "fontWeight": "400",
      "lineHeight": "22px",
      "letterSpacing": "0em"
    },
    "body-sm": {
      "fontFamily": "Plus Jakarta Sans",
      "fontSize": "13px",
      "fontWeight": "400",
      "lineHeight": "18px",
      "letterSpacing": "0.01em"
    },
    "label-caps": {
      "fontFamily": "Plus Jakarta Sans",
      "fontSize": "11px",
      "fontWeight": "700",
      "lineHeight": "16px",
      "letterSpacing": "0.08em"
    }
  },
  "spacing": {
    "space-sm": "0.5rem",
    "space-xs": "0.25rem",
    "space-xl": "2.5rem",
    "margin": "2rem",
    "space-lg": "1.5rem",
    "space-md": "1rem",
    "gutter": "1.5rem"
  },
  "headlineFontFamily": "Plus Jakarta Sans",
  "bodyFontFamily": "Plus Jakarta Sans",
  "labelFontFamily": "Plus Jakarta Sans"
}
```
