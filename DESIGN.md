---
name: Vyora
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#564338'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#897266'
  outline-variant: '#ddc1b3'
  surface-tint: '#9b4500'
  primary: '#9b4500'
  on-primary: '#ffffff'
  primary-container: '#ff8c42'
  on-primary-container: '#6a2d00'
  inverse-primary: '#ffb68d'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#5d5f5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#aaabab'
  on-tertiary-container: '#3e3f40'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbc9'
  primary-fixed-dim: '#ffb68d'
  on-primary-fixed: '#331200'
  on-primary-fixed-variant: '#763300'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style

The brand identity focuses on clarity, intentionality, and the joy of organized exploration. It is designed for travelers who value efficiency and aesthetic calm over chaotic visual stimulation. 

This design system employs a **Minimalist** style with heavy influences from digital productivity tools. The core philosophy is "content as interface," where the data of the trip—itineraries, maps, and bookings—takes center stage. The interface uses expansive whitespace, high-contrast typography, and a restrained color palette to reduce cognitive load during the often-stressful process of travel planning. Visual interest is generated through precise alignment and a single, high-energy accent color rather than decorative ornaments.

## Colors

The palette is anchored in a high-contrast foundation to ensure maximum legibility under various lighting conditions (e.g., planning a trip outdoors).

- **Primary (#FF8C42):** A vibrant tangerine used exclusively for primary actions, active states, and critical path highlights.
- **Secondary (#1A1A1A):** A deep, "off-black" used for primary text and iconography to ensure soft yet high contrast against the white background.
- **Neutral (#F7F7F7):** A subtle light gray for large surface areas like sidebar backgrounds or secondary containers.
- **Tertiary (#E1E1E1):** A medium gray reserved for hairline borders and disabled states.
- **Background (#FFFFFF):** The primary canvas for all main content areas.

## Typography

This design system utilizes **Inter** for all roles to maintain a systematic, utilitarian aesthetic. 

- **Hierarchy:** Use bold weights and negative letter-spacing for headlines to create a "blocky," structural feel. 
- **Body Text:** Standard body text is set at 14px (md) for density, while 16px (lg) is used for long-form descriptions or notes.
- **Labels:** Small labels use a medium or semi-bold weight with slight letter spacing to maintain readability at small scales.
- **Utility:** Monospaced numerals (available within Inter) should be used for dates, times, and flight numbers to ensure vertical alignment in lists.

## Layout & Spacing

The layout philosophy is based on a **Fixed Grid** for desktop and a **Fluid Grid** for mobile devices. 

- **Grid System:** A 12-column grid is used for desktop layouts with a 24px gutter. For planning dashboards, a "narrow center" layout (800px max-width) is preferred to mimic the feel of a document.
- **Rhythm:** Spacing follows a 4px baseline. Use 16px (md) for standard padding within cards and 48px (xl) to separate major sections.
- **Mobile Adaption:** On mobile, sidebars collapse into bottom sheets or "hamburger" menus. Margins reduce to 16px to maximize screen real estate for map and list views.

## Elevation & Depth

To maintain a "flat" minimalist aesthetic, this design system avoids heavy shadows. 

- **Low-contrast Outlines:** Depth is primarily established through `1px` solid borders using the Tertiary color (#E1E1E1). 
- **Tonal Layering:** Use the Neutral background (#F7F7F7) to distinguish sidebars or secondary navigation areas from the white (#FFFFFF) primary content area.
- **Floating Elements:** Only high-priority interactive elements (like a "Add New Trip" Floating Action Button) may use a very soft, 10% opacity black shadow with a 12px blur to indicate they sit above the content plane.

## Shapes

The shape language is "Soft-Modern." 

- **Standard Radius:** 8px (`rounded-md`) is the default for buttons, input fields, and small cards. 
- **Large Radius:** 16px (`rounded-xl`) is used for primary containers or image thumbnails.
- **Interactive States:** Clickable elements should not change their corner radius on hover; instead, use a subtle background color shift (from white to #F7F7F7).

## Components

- **Buttons:** 
  - **Primary:** Tangerine (#FF8C42) background, white text, 8px radius. 
  - **Secondary:** White background, 1px border (#E1E1E1), deep black text.
- **Input Fields:** Minimalist design with a 1px bottom border by default, or a full 1px border on all sides for search bars. Focus state is indicated by a 2px tangerine bottom border.
- **Cards:** White background with a 1px (#E1E1E1) border. No shadow. Use internal padding of 24px for a spacious, "Notion-like" feel.
- **Chips/Tags:** Used for categories (e.g., "Flight," "Hotel"). Light gray (#F7F7F7) background with 12px semi-bold text. Use tangerine text for "active" or "selected" chips.
- **Lists:** High-density rows with 1px bottom dividers. Use simple 20px line-art icons (2px stroke weight) for list items.
- **Status Indicators:** Use small 8px solid circles. Tangerine for "upcoming," medium gray for "past," and a soft green (optional utility color) for "completed."