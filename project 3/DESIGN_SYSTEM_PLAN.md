# Super Recruit — Design System Plan

> **Status: PROPOSED — Awaiting approval before any implementation.**
> No code has been changed. This document is documentation only.

---

## 1. Color Tokens

The current codebase uses hardcoded hex values scattered across components. The plan consolidates them into a named token system.

### Primary Brand
| Token | Hex | Current Usage |
|---|---|---|
| `brand-cyan` | `#0DC2FF` | Active nav, badges, highlights |
| `brand-blue` | `#127EE3` | Primary buttons, links, badge bg |
| `brand-blue-dark` | `#0277a8` | Approached stage label |
| `brand-gradient` | `#01BFF9 → #019EFC` | Primary CTA buttons (per global spec) |

### Neutral / Surface
| Token | Hex | Current Usage |
|---|---|---|
| `surface-bg` | `#F0F2F5` | App background |
| `surface-card` | `#FFFFFF` | Card, panel, modal backgrounds |
| `surface-hover` | `#F0F8FF` | Row hover, dropdown items |
| `surface-input` | `#F0F2F5` | Input field backgrounds |
| `text-primary` | `#1A1A2E` | Headings, labels |
| `text-secondary` | `#6B7280` (gray-500) | Subtext, captions |
| `text-muted` | `#9CA3AF` (gray-400) | Placeholder, tertiary |
| `border-default` | `#E5E7EB` (gray-200) | Card, input borders |
| `border-subtle` | `#F3F4F6` (gray-100) | Dividers, table rows |

### Semantic
| Token | Hex | Purpose |
|---|---|---|
| `success` | `#10b981` (emerald-500) | Hired, positive scores |
| `success-bg` | `#ECFDF5` (emerald-50) | Success badge backgrounds |
| `warning` | `#f59e0b` (amber-500) | Interview 1, nudge states |
| `warning-bg` | `#FFFBEB` (amber-50) | Warning badge backgrounds |
| `danger` | `#ef4444` (red-500) | Rejected, error states |
| `danger-bg` | `#FEF2F2` (red-50) | Danger badge backgrounds |
| `info` | `#127EE3` | Info states |
| `info-bg` | `#EBF5FF` | Info badge backgrounds |

### Pipeline Stage Colors (existing — to be standardized)
| Stage | Text Color | Background |
|---|---|---|
| new | `text-gray-600` | `bg-gray-100` |
| screening | `text-blue-600` | `bg-blue-50` |
| approached | `text-[#0277a8]` | `bg-[#0DC2FF]/10` |
| interview_1 | `text-amber-600` | `bg-amber-50` |
| interview_2 | `text-orange-600` | `bg-orange-50` |
| referred | `text-sky-700` | `bg-sky-50` |
| offer | `text-purple-600` | `bg-purple-50` |
| hired | `text-emerald-600` | `bg-emerald-50` |
| rejected | `text-red-500` | `bg-red-50` |

---

## 2. Typography Scale

Font families follow the global spec:
- **English / Numbers:** `Poppins` (weights: 400, 500, 600) — loaded via Google Fonts
- **Thai text:** `Kanit` (weights: 400, 500, 600) — loaded via Google Fonts

### Scale
| Role | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| H1 | 28px | 600 | 1.2 | Page titles |
| H2 | 22px | 600 | 1.2 | Section headings |
| H3 / Section Title | 18px | 500 | 1.3 | Card headers, tab labels |
| H4 | 16px | 600 | 1.3 | Sub-section, modal title |
| Body | 16px | 400 | 1.5 | General content |
| Body Small | 14px | 400 | 1.5 | Captions, table rows |
| Label | 13px | 500 | 1.4 | Form labels, badges |
| Caption | 12px | 400 | 1.4 | Timestamps, helper text |
| Micro | 11px | 500 | 1.3 | Tags, tiny badges |

### Current Usage Observations
- Most components use `text-[13px]` through `text-[14px]` for body content
- Headers use `text-[22px]` / `text-[18px]` with `font-bold` (700) — to be normalized to 600
- Captions use `text-[11px]` / `text-[11.5px]` / `text-[12px]` inconsistently — to be unified at 11px or 12px

---

## 3. Spacing System

Base unit: **8px**. All spacing values are multiples of 8px (or half-steps at 4px).

| Token | px | Tailwind Equivalent | Usage |
|---|---|---|---|
| `space-1` | 4px | `p-1` / `gap-1` | Micro gaps (icon padding) |
| `space-2` | 8px | `p-2` / `gap-2` | Tight internal spacing |
| `space-3` | 12px | `p-3` / `gap-3` | Compact row padding |
| `space-4` | 16px | `p-4` / `gap-4` | Standard component padding |
| `space-5` | 20px | `p-5` / `gap-5` | Card inner padding |
| `space-6` | 24px | `p-6` / `gap-6` | Page section gaps |
| `space-8` | 32px | `p-8` / `gap-8` | Large section separation |
| `space-10` | 40px | `p-10` | Modal/panel top padding |
| `space-12` | 48px | `p-12` | Full-width section padding |

### Layout Dimensions (existing — to be documented)
| Element | Width |
|---|---|
| Sidebar expanded | 220px |
| Sidebar collapsed | 60px |
| Right panel | ~280px fixed |
| Detail panel (ApplicantDetail) | 75vw |
| Max content width | `max-w-screen-xl` (~1280px) |

---

## 4. Button Styles

### Primary CTA
- Background: gradient `#01BFF9 → #019EFC` (left to right)
- Text: white, 14px, weight 600
- Padding: `px-5 py-2.5`
- Border radius: `rounded-xl` (12px)
- Hover: brightness increase (`hover:brightness-105`) + shadow lift
- Active: `scale-[0.98]`
- Disabled: `opacity-50 cursor-not-allowed`

### Secondary (Outline)
- Background: white
- Border: `1.5px solid #00ADEF`
- Text: `#00ADEF`, 14px, weight 500
- Padding: `px-5 py-2.5`
- Border radius: `rounded-xl`
- Hover: `bg-[#00ADEF]/8` light fill

### Tertiary / Ghost
- Background: transparent
- Text: gray-500, weight 500
- Hover: `bg-gray-100`
- Used for: back buttons, icon-only actions

### Danger
- Background: white
- Border: `1px solid #FCA5A5` (red-300)
- Text: `#ef4444`
- Hover: `bg-red-50`
- Used for: delete, reject actions

### Icon Button
- Size: 32×32px or 36×36px
- Border radius: `rounded-lg` or `rounded-xl`
- Background: transparent or `bg-gray-100`
- Hover: `bg-gray-200`

---

## 5. Card Styles

### Standard Card
- Background: `#FFFFFF`
- Border: `1px solid #F3F4F6` (gray-100)
- Border radius: `rounded-2xl` (16px)
- Shadow: `shadow-[0_2px_12px_rgba(0,0,0,0.06)]`
- Hover shadow: `shadow-[0_4px_20px_rgba(0,0,0,0.10)]`
- Hover border: `border-gray-200`
- Transition: `transition-all duration-200`

### Elevated Card (Top Pick / Featured)
- Border: `1px solid #E0F2FE` (light blue tint)
- Shadow: `shadow-[0_4px_24px_rgba(13,194,255,0.12)]`
- Background: white with subtle top gradient overlay

### Flat Card (table-like rows)
- Background: white
- Border-bottom: `1px solid #F3F4F6`
- No shadow
- Hover: `bg-[#F8FAFF]`

### Stat / KPI Card
- Background: white
- Border radius: `rounded-2xl`
- Shadow: `shadow-sm`
- Internal: icon left, number large (H2), label caption

---

## 6. Table Styles

### Table Container
- Background: white
- Border radius: `rounded-2xl`
- Overflow: hidden
- Shadow: `shadow-sm`

### Table Header Row
- Background: `#F8FAFF` (very light blue-tinted gray)
- Text: 12px, weight 600, `text-gray-500` uppercase
- Border-bottom: `1px solid #F3F4F6`
- Padding: `px-4 py-3`

### Table Data Row
- Background: white
- Text: 13–14px, weight 400, `text-[#1A1A2E]`
- Border-bottom: `1px solid #F3F4F6`
- Padding: `px-4 py-3.5`
- Hover: `bg-[#F8FAFF]`
- Transition: `transition-colors duration-100`

### Table Cell Alignment
- Text cells: left-aligned
- Number / score cells: right-aligned
- Status badges: center-aligned within cell

---

## 7. Form Styles

### Text Input
- Background: `#F0F2F5`
- Border: `1px solid #E5E7EB` (gray-200)
- Border radius: `rounded-xl` (12px)
- Padding: `px-3.5 py-2.5`
- Font: 14px, weight 400
- Placeholder color: `text-gray-400`
- Focus border: `border-[#0DC2FF]`
- Focus background: `#FFFFFF`
- Focus ring: none (border change only)
- Transition: `transition-all`

### Textarea
- Same as text input
- Min height: 80px
- Resize: vertical only

### Select / Dropdown
- Same base as text input
- Trailing: chevron-down icon `text-gray-400`
- Option list: white bg, `rounded-2xl`, `shadow-2xl`, border `gray-100`
- Option hover: `bg-[#F0F8FF]`

### Label
- Size: 13px, weight 500, `text-[#1A1A2E]`
- Margin-bottom: 6px
- Required asterisk: `text-red-400`

### Helper / Error Text
- Size: 11–12px, weight 400
- Helper: `text-gray-400`
- Error: `text-red-500`
- Margin-top: 4px

### Toggle / Switch
- Track: gray-200 (off) → `#0DC2FF` (on)
- Thumb: white circle, shadow
- Size: 36×20px
- Transition: 150ms

### Checkbox
- Size: 16×16px, `rounded-md`
- Border: `1.5px solid #D1D5DB`
- Checked: `bg-[#127EE3]` with white checkmark
- Transition: 100ms

---

## 8. Sidebar Active / Hover States

### Expanded State (220px)
| State | Background | Text | Icon |
|---|---|---|---|
| Default | transparent | `text-gray-500` | `text-gray-500` |
| Hover | `bg-gray-100` | `text-[#1A1A2E]` | `text-[#1A1A2E]` |
| Active | `bg-[#0DC2FF]/12` | `text-[#0DC2FF]` | `text-[#0DC2FF]` |

### Collapsed State (60px)
- Icons only, centered
- Tooltip appears on hover: dark `#1A1A2E` rounded pill, left offset
- Badge: absolute top-right position `top-1 right-1`
- Active: same `bg-[#0DC2FF]/12`

### Sidebar Container
- Background: `#FFFFFF`
- Right border: `1px solid #F3F4F6`
- Width transition: `transition-all duration-300`
- Logo area: gradient text using brand-cyan → brand-blue

### Toggle Button (collapse/expand)
- Position: absolute right edge, vertically centered
- Size: 20×20px circle
- Background: white
- Border: `1px solid #E5E7EB`
- Icon: `ChevronLeft` / `ChevronRight`
- Hover: border `#0DC2FF`, icon `text-[#0DC2FF]`

---

## 9. Modal Styles

### Overlay / Backdrop
- Background: `rgba(0, 0, 0, 0.45)`
- Backdrop blur: `backdrop-blur-[2px]`
- Z-index: 50

### Modal Container
- Background: `#FFFFFF`
- Border radius: `rounded-2xl` (16px)
- Shadow: `shadow-[0_20px_60px_rgba(0,0,0,0.18)]`
- Max width: varies by type (see below)
- Animation: fade-in + scale from 0.95 → 1.0, duration 200ms

### Modal Sizes
| Name | Max Width | Usage |
|---|---|---|
| Small | 480px | Confirm dialogs |
| Medium | 640px | MessageModal, short forms |
| Large | 860px | ResumePanel overlay |
| Full Sheet | 75vw | ApplicantDetailPanel, InterviewScheduler |

### Modal Header
- Padding: `px-6 pt-6 pb-4`
- Title: H2 (22px, weight 600, `text-[#1A1A2E]`)
- Close button: top-right, `rounded-xl`, `hover:bg-gray-100`

### Modal Footer
- Padding: `px-6 pb-6 pt-4`
- Border-top: `1px solid #F3F4F6`
- Layout: flex, right-aligned, `gap-3`
- Cancel (ghost) + Confirm (primary CTA)

### Side Panel / Drawer (used for detail panels)
- Width: 75vw, max-width ~960px
- Background: `#FFFFFF`
- Slides in from right: `.animate-slide-in-right`
- Shadow: `shadow-[-8px_0_40px_rgba(0,0,0,0.12)]`
- Overlay backdrop: same as modal

---

## 10. Implementation Notes (for when approved)

1. **Google Fonts** — Add Poppins + Kanit `<link>` tags to `index.html`
2. **Tailwind theme extension** — Add color tokens, font families, and border-radius values to `tailwind.config.js`
3. **Global CSS** — Add font-face fallbacks and base `font-family` rules to `index.css`
4. **Component pass** — Update components one page at a time, starting with shared components (Header, Sidebar, buttons), then page-level components
5. **No layout changes** — Spacing and structure are preserved; only visual tokens are updated

---

*Document created: 2026-04-27 — Awaiting approval before any code changes.*
