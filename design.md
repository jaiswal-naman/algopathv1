# LFA Builder Platform - Complete UI/UX Redesign Document

## Design Vision: "Clarity Through Simplicity"

Transform the LFA Builder from a technical tool into an elegant, professional SaaS platform that makes program design feel intuitive, empowering, and accessible to non-technical users.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design System](#2-design-system)
3. [Site Architecture](#3-site-architecture)
4. [Landing Page Design](#4-landing-page-design)
5. [Authentication & Onboarding](#5-authentication--onboarding)
6. [Dashboard Design](#6-dashboard-design)
7. [LFA Builder Module](#7-lfa-builder-module)
8. [Analysis Tools Design](#8-analysis-tools-design)
9. [Component Library](#9-component-library)
10. [Responsive Design](#10-responsive-design)
11. [Micro-interactions & Animations](#11-micro-interactions--animations)
12. [Implementation Guide](#12-implementation-guide)

---

## 1. Design Philosophy

### Core Principles

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   "Design that disappears"                                                  │
│                                                                             │
│   The interface should feel so natural that users focus entirely on         │
│   their program design, not on figuring out how to use the tool.           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Design Pillars

| Pillar | Description | Implementation |
|--------|-------------|----------------|
| **Clarity** | Every element serves a purpose | Generous whitespace, clear hierarchy |
| **Confidence** | Users feel guided, not lost | Progressive disclosure, smart defaults |
| **Elegance** | Professional without being cold | Subtle animations, warm accents |
| **Accessibility** | Usable by everyone | High contrast, keyboard navigation |

### Visual Identity

**Brand Personality**: Professional, Trustworthy, Empowering, Warm

**Mood Board Keywords**:
- Clean, airy, spacious
- Sophisticated minimalism
- Educational warmth
- Indian cultural subtlety (not overt)
- Progress and growth

---

## 2. Design System

### 2.1 Color Palette

#### Primary Colors (White Theme Foundation)

```css
/* Background Hierarchy */
--bg-primary: #FFFFFF;          /* Main content areas */
--bg-secondary: #FAFBFC;        /* Subtle sections, sidebars */
--bg-tertiary: #F4F6F8;         /* Card backgrounds, inputs */
--bg-elevated: #FFFFFF;         /* Modals, popovers (with shadow) */

/* Text Hierarchy */
--text-primary: #1A1A2E;        /* Headlines, important text */
--text-secondary: #4A5568;      /* Body text */
--text-tertiary: #718096;       /* Captions, hints */
--text-muted: #A0AEC0;          /* Disabled, placeholder */

/* Border & Dividers */
--border-light: #E2E8F0;        /* Subtle borders */
--border-default: #CBD5E0;      /* Standard borders */
--border-focus: #4F46E5;        /* Focus states */
```

#### Accent Colors

```css
/* Primary Accent - Indigo (Trust & Professionalism) */
--accent-primary: #4F46E5;      /* Primary actions */
--accent-primary-hover: #4338CA;
--accent-primary-light: #EEF2FF;
--accent-primary-dark: #3730A3;

/* Secondary Accent - Teal (Growth & Education) */
--accent-secondary: #0D9488;    /* Secondary actions */
--accent-secondary-hover: #0F766E;
--accent-secondary-light: #F0FDFA;

/* Success - Emerald */
--success: #059669;
--success-light: #D1FAE5;
--success-dark: #047857;

/* Warning - Amber */
--warning: #D97706;
--warning-light: #FEF3C7;

/* Error - Rose */
--error: #E11D48;
--error-light: #FFE4E6;

/* Info - Sky */
--info: #0284C7;
--info-light: #E0F2FE;
```

#### Shikshagraha Stakeholder Colors

```css
/* Education System Hierarchy Colors */
--level-district: #7C3AED;      /* Purple - District Level */
--level-district-light: #EDE9FE;

--level-block: #2563EB;         /* Blue - Block Level */
--level-block-light: #DBEAFE;

--level-cluster: #059669;       /* Green - Cluster Level */
--level-cluster-light: #D1FAE5;

--level-school: #EA580C;        /* Orange - School Level */
--level-school-light: #FFEDD5;

--level-community: #0891B2;     /* Cyan - Community Level */
--level-community-light: #CFFAFE;
```

### 2.2 Typography

#### Font Stack

```css
/* Primary Font - Inter (Clean, Modern, Readable) */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Display Font - For Headlines (Optional Enhancement) */
--font-display: 'Plus Jakarta Sans', var(--font-primary);

/* Monospace - For Data, Codes */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

#### Type Scale

```css
/* Headings */
--text-display: 3.5rem;     /* 56px - Landing hero */
--text-h1: 2.5rem;          /* 40px - Page titles */
--text-h2: 2rem;            /* 32px - Section headers */
--text-h3: 1.5rem;          /* 24px - Card titles */
--text-h4: 1.25rem;         /* 20px - Subsections */
--text-h5: 1.125rem;        /* 18px - Labels */

/* Body */
--text-lg: 1.125rem;        /* 18px - Lead paragraphs */
--text-base: 1rem;          /* 16px - Body text */
--text-sm: 0.875rem;        /* 14px - Secondary text */
--text-xs: 0.75rem;         /* 12px - Captions, badges */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Letter Spacing */
--tracking-tight: -0.02em;
--tracking-normal: 0;
--tracking-wide: 0.02em;
```

### 2.3 Spacing System

```css
/* Base: 4px */
--space-0: 0;
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
--space-32: 8rem;      /* 128px */
```

### 2.4 Shadow System

```css
/* Elevation Levels */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.15);

/* Colored Shadows (for primary actions) */
--shadow-primary: 0 4px 14px 0 rgba(79, 70, 229, 0.25);
--shadow-success: 0 4px 14px 0 rgba(5, 150, 105, 0.25);
```

### 2.5 Border Radius

```css
--radius-none: 0;
--radius-sm: 0.25rem;      /* 4px - Badges */
--radius-md: 0.5rem;       /* 8px - Buttons, inputs */
--radius-lg: 0.75rem;      /* 12px - Cards */
--radius-xl: 1rem;         /* 16px - Modals */
--radius-2xl: 1.5rem;      /* 24px - Feature cards */
--radius-full: 9999px;     /* Pills, avatars */
```

---

## 3. Site Architecture

### 3.1 Information Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SITE MAP                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   PUBLIC PAGES                                                              │
│   ├── / (Landing Page)                                                      │
│   │   ├── Hero Section                                                      │
│   │   ├── Problem Statement                                                 │
│   │   ├── How It Works                                                      │
│   │   ├── Features                                                          │
│   │   ├── Testimonials                                                      │
│   │   ├── Pricing (if applicable)                                          │
│   │   └── CTA Section                                                       │
│   │                                                                         │
│   ├── /about                                                                │
│   │   ├── Mission                                                           │
│   │   ├── Shikshagraha Partnership                                         │
│   │   └── Team                                                              │
│   │                                                                         │
│   ├── /features                                                             │
│   │   └── Detailed feature breakdown                                        │
│   │                                                                         │
│   └── /login & /signup                                                      │
│                                                                             │
│   AUTHENTICATED PAGES                                                       │
│   ├── /dashboard                                                            │
│   │   ├── Recent Projects                                                   │
│   │   ├── Quick Actions                                                     │
│   │   └── Progress Overview                                                 │
│   │                                                                         │
│   ├── /projects                                                             │
│   │   ├── Project List                                                      │
│   │   └── Project Search/Filter                                             │
│   │                                                                         │
│   ├── /builder (LFA Builder)                                               │
│   │   ├── Step 1: Define                                                    │
│   │   ├── Step 2: Explore                                                   │
│   │   ├── Step 3: Build                                                     │
│   │   └── Step 4: Analyze                                                   │
│   │                                                                         │
│   ├── /project/:id                                                          │
│   │   ├── Overview                                                          │
│   │   ├── LFA Document                                                      │
│   │   ├── Analysis Tools                                                    │
│   │   └── Export                                                            │
│   │                                                                         │
│   └── /settings                                                             │
│       ├── Profile                                                           │
│       ├── Organization                                                      │
│       └── Preferences                                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Navigation Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  NAVIGATION BAR (Public)                                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  [Logo]  Features  About  Resources  [Login]  [Get Started →]        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  NAVIGATION BAR (Authenticated)                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  [Logo]  Dashboard  Projects  New Project +  [Search]  [Avatar ▼]    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  SIDEBAR (Builder - Optional)                                               │
│  ┌─────────────┐                                                            │
│  │ Progress    │                                                            │
│  │ ─────────── │                                                            │
│  │ ○ Define    │                                                            │
│  │ ● Explore   │ (current)                                                  │
│  │ ○ Build     │                                                            │
│  │ ○ Analyze   │                                                            │
│  │             │                                                            │
│  │ ─────────── │                                                            │
│  │ Quick Help  │                                                            │
│  └─────────────┘                                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Landing Page Design

### 4.1 Hero Section

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                        NAVIGATION BAR                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │  [Shikshagraha Logo]                                                  │  │
│  │                                                                       │  │
│  │  Features   How It Works   About   Resources                          │  │
│  │                                                                       │  │
│  │                                        [Log In]  [Get Started Free →] │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│                                                                             │
│     ┌─────────────────────────────────────────────────────────────────┐     │
│     │                                                                 │     │
│     │            Design Education Programs                            │     │
│     │              That Actually Work                                 │     │
│     │                                                                 │     │
│     │     Transform your ideas into structured, measurable            │     │
│     │     program designs using AI-powered guidance and               │     │
│     │     India's most comprehensive education framework.             │     │
│     │                                                                 │     │
│     │     ┌─────────────────────┐  ┌─────────────────────┐           │     │
│     │     │                     │  │                     │           │     │
│     │     │  Start Building →   │  │  See How It Works   │           │     │
│     │     │                     │  │                     │           │     │
│     │     └─────────────────────┘  └─────────────────────┘           │     │
│     │              ↑                        ↑                        │     │
│     │         Primary CTA              Secondary CTA                 │     │
│     │                                                                 │     │
│     │     Trusted by 150+ organizations in the Shikshagraha network  │     │
│     │                                                                 │     │
│     │     [Logo 1]  [Logo 2]  [Logo 3]  [Logo 4]  [Logo 5]           │     │
│     │                                                                 │     │
│     └─────────────────────────────────────────────────────────────────┘     │
│                                                                             │
│     ┌─────────────────────────────────────────────────────────────────┐     │
│     │                                                                 │     │
│     │              [HERO ILLUSTRATION/ANIMATION]                      │     │
│     │                                                                 │     │
│     │         Animated preview of LFA being built                     │     │
│     │         showing: Problem → Stakeholders → Activities → Impact   │     │
│     │                                                                 │     │
│     └─────────────────────────────────────────────────────────────────┘     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Design Specifications**:
- Background: Pure white (#FFFFFF) with subtle gradient overlay
- Headline: 56px, font-weight 700, letter-spacing -0.02em, color #1A1A2E
- Subheadline: 20px, font-weight 400, color #4A5568, max-width 600px
- Primary CTA: Filled indigo (#4F46E5), 16px semibold, shadow-primary
- Secondary CTA: Ghost button with indigo border
- Trust badges: Grayscale logos, 40% opacity, hover reveals color

### 4.2 Problem Statement Section

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  SECTION: THE CHALLENGE                                                     │
│  Background: #FAFBFC (light gray)                                          │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  "Organizations know what they want to improve, but struggle       │   │
│  │   to connect activities to meaningful change."                     │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│  │                  │  │                  │  │                  │         │
│  │   📊 60%         │  │   💰 ₹5L+        │  │   ⏱️ 3-6 months  │         │
│  │   of programs    │  │   spent on       │  │   to create a    │         │
│  │   lack clear     │  │   external       │  │   basic program  │         │
│  │   logic chains   │  │   consultants    │  │   framework      │         │
│  │                  │  │                  │  │                  │         │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘         │
│                                                                             │
│  Common Pain Points:                                                        │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ✕ Starting from a blank page every time                            │   │
│  │ ✕ Unclear connection between activities and outcomes               │   │
│  │ ✕ Difficulty mapping stakeholder responsibilities                  │   │
│  │ ✕ No standardized way to measure program quality                   │   │
│  │ ✕ Expensive dependence on external experts                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 How It Works Section

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  SECTION: HOW IT WORKS                                                      │
│  Background: #FFFFFF                                                        │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                       │ │
│  │          From Idea to Impact in Four Simple Steps                    │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │    ┌─────┐           ┌─────┐           ┌─────┐           ┌─────┐   │   │
│  │    │  1  │──────────▶│  2  │──────────▶│  3  │──────────▶│  4  │   │   │
│  │    └─────┘           └─────┘           └─────┘           └─────┘   │   │
│  │                                                                     │   │
│  │   DESCRIBE           EXPLORE           BUILD             ANALYZE   │   │
│  │                                                                     │   │
│  │   Tell us about      Answer guided     AI generates      Test and  │   │
│  │   your program       questions about   your complete     refine    │   │
│  │   in plain           stakeholders,     Logical           with      │   │
│  │   language           outcomes, and     Framework         analysis  │   │
│  │                      indicators                          tools     │   │
│  │                                                                     │   │
│  │   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌────────┐ │   │
│  │   │             │   │             │   │             │   │        │ │   │
│  │   │  [Preview   │   │  [Preview   │   │  [Preview   │   │[Preview│ │   │
│  │   │   of Step]  │   │   of Step]  │   │   of Step]  │   │of Step]│ │   │
│  │   │             │   │             │   │             │   │        │ │   │
│  │   └─────────────┘   └─────────────┘   └─────────────┘   └────────┘ │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                    ┌──────────────────────────────────┐                     │
│                    │                                  │                     │
│                    │     Try It Free — No Signup     │                     │
│                    │                                  │                     │
│                    └──────────────────────────────────┘                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.4 Features Grid Section

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  SECTION: POWERFUL FEATURES                                                 │
│  Background: Linear gradient (white to #FAFBFC)                            │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                       │ │
│  │        Everything You Need to Design Impactful Programs              │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌──────────────────────────┐  ┌──────────────────────────┐               │
│  │                          │  │                          │               │
│  │  🤖 AI-Powered Builder   │  │  🎯 Stakeholder Mapping  │               │
│  │                          │  │                          │               │
│  │  Generate complete LFAs  │  │  Visualize the education │               │
│  │  from natural language   │  │  hierarchy from students │               │
│  │  descriptions with GPT-4 │  │  to district officials   │               │
│  │                          │  │                          │               │
│  └──────────────────────────┘  └──────────────────────────┘               │
│                                                                             │
│  ┌──────────────────────────┐  ┌──────────────────────────┐               │
│  │                          │  │                          │               │
│  │  💬 Stakeholder Voices   │  │  ⚡ Logic Challenger     │               │
│  │                          │  │                          │               │
│  │  Interview 8 realistic   │  │  AI devil's advocate     │               │
│  │  personas from teachers  │  │  finds gaps in your      │               │
│  │  to district officials   │  │  program logic           │               │
│  │                          │  │                          │               │
│  └──────────────────────────┘  └──────────────────────────┘               │
│                                                                             │
│  ┌──────────────────────────┐  ┌──────────────────────────┐               │
│  │                          │  │                          │               │
│  │  🔮 What-If Scenarios    │  │  📊 Health Dashboard     │               │
│  │                          │  │                          │               │
│  │  Test program resilience │  │  Score your LFA across   │               │
│  │  against budget cuts,    │  │  5 quality dimensions    │               │
│  │  delays, and more        │  │  with actionable tips    │               │
│  │                          │  │                          │               │
│  └──────────────────────────┘  └──────────────────────────┘               │
│                                                                             │
│  ┌──────────────────────────┐  ┌──────────────────────────┐               │
│  │                          │  │                          │               │
│  │  📄 Export Anywhere      │  │  🇮🇳 India-Focused       │               │
│  │                          │  │                          │               │
│  │  Download as Word, CSV,  │  │  Built specifically for  │               │
│  │  or JSON for funders,    │  │  the Shikshagraha        │               │
│  │  partners, and teams     │  │  education ecosystem     │               │
│  │                          │  │                          │               │
│  └──────────────────────────┘  └──────────────────────────┘               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Feature Card Design**:
```css
.feature-card {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 32px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.1);
  border-color: #4F46E5;
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 4.5 Social Proof Section

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  SECTION: TESTIMONIALS                                                      │
│  Background: #FAFBFC with subtle pattern                                   │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                       │ │
│  │        Trusted by Education Leaders Across India                     │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                       │ │
│  │  ┌──────────────────────────────────────────────────────────────┐    │ │
│  │  │                                                              │    │ │
│  │  │  "We went from a 3-month design process to a 2-week        │    │ │
│  │  │   sprint. The stakeholder interview feature alone saved    │    │ │
│  │  │   us countless hours of field conversations."              │    │ │
│  │  │                                                              │    │ │
│  │  │  ┌──────┐                                                    │    │ │
│  │  │  │[Photo]│  Priya Sharma                                    │    │ │
│  │  │  └──────┘  Program Director, Pratham Education Foundation  │    │ │
│  │  │                                                              │    │ │
│  │  └──────────────────────────────────────────────────────────────┘    │ │
│  │                                                                       │ │
│  │         [ ← ]     ● ○ ○ ○ ○     [ → ]                               │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│                                                                             │
│  Key Stats:                                                                 │
│                                                                             │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐     │
│  │            │    │            │    │            │    │            │     │
│  │   150+     │    │    60%     │    │   1M+      │    │    95%     │     │
│  │            │    │            │    │            │    │            │     │
│  │ Organizations   │ Time Saved │    │  Students  │    │ Satisfaction│     │
│  │   Using     │    │ on Design  │    │  Reached   │    │    Rate    │     │
│  │            │    │            │    │            │    │            │     │
│  └────────────┘    └────────────┘    └────────────┘    └────────────┘     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.6 CTA Section

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  SECTION: FINAL CTA                                                         │
│  Background: Gradient from #4F46E5 to #7C3AED (indigo to purple)          │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                       │ │
│  │                                                                       │ │
│  │        Ready to Transform How You Design Programs?                   │ │
│  │                                                                       │ │
│  │        Join 150+ organizations building better                       │ │
│  │        education programs with structured thinking.                  │ │
│  │                                                                       │ │
│  │                                                                       │ │
│  │                 ┌─────────────────────────────────┐                   │ │
│  │                 │                                 │                   │ │
│  │                 │   Start Building for Free →    │                   │ │
│  │                 │                                 │                   │ │
│  │                 └─────────────────────────────────┘                   │ │
│  │                     White button on gradient                         │ │
│  │                                                                       │ │
│  │                 No credit card required • Free forever              │ │
│  │                                                                       │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.7 Footer

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  FOOTER                                                                     │
│  Background: #1A1A2E (dark)                                                │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                       │ │
│  │  ┌──────────────────────────────────────────────────────────────┐    │ │
│  │  │                                                              │    │ │
│  │  │  [Logo]                                                      │    │ │
│  │  │                                                              │    │ │
│  │  │  Empowering organizations to                                │    │ │
│  │  │  design impactful education                                 │    │ │
│  │  │  programs.                                                   │    │ │
│  │  │                                                              │    │ │
│  │  │  [Twitter] [LinkedIn] [GitHub]                              │    │ │
│  │  │                                                              │    │ │
│  │  └──────────────────────────────────────────────────────────────┘    │ │
│  │                                                                       │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │ │
│  │  │ Product      │  │ Resources    │  │ Company      │               │ │
│  │  │              │  │              │  │              │               │ │
│  │  │ Features     │  │ Documentation│  │ About        │               │ │
│  │  │ Pricing      │  │ API Docs     │  │ Blog         │               │ │
│  │  │ Changelog    │  │ Guides       │  │ Careers      │               │ │
│  │  │ Roadmap      │  │ Templates    │  │ Contact      │               │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │ │
│  │                                                                       │ │
│  │  ─────────────────────────────────────────────────────────────────   │ │
│  │                                                                       │ │
│  │  © 2024 Shikshagraha LFA Builder. Built with ❤️ for Indian education. │ │
│  │                                                                       │ │
│  │  Privacy Policy  •  Terms of Service  •  Cookie Settings             │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Authentication & Onboarding

### 5.1 Login Page

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  TWO-COLUMN LAYOUT                                                          │
│                                                                             │
│  ┌──────────────────────────────┐  ┌──────────────────────────────────────┐│
│  │                              │  │                                      ││
│  │  LEFT PANEL                  │  │  RIGHT PANEL (White)                 ││
│  │  (Gradient Background)       │  │                                      ││
│  │                              │  │  ┌────────────────────────────────┐  ││
│  │  ┌────────────────────────┐  │  │  │                                │  ││
│  │  │                        │  │  │  │  Welcome Back                  │  ││
│  │  │  [Logo]                │  │  │  │                                │  ││
│  │  │                        │  │  │  │  Sign in to continue building  │  ││
│  │  │  "Transforming how     │  │  │  │  your program design.          │  ││
│  │  │   organizations        │  │  │  │                                │  ││
│  │  │   design impact"       │  │  │  │  ┌────────────────────────┐   │  ││
│  │  │                        │  │  │  │  │ Email                  │   │  ││
│  │  │  [Animated Visual]     │  │  │  │  └────────────────────────┘   │  ││
│  │  │                        │  │  │  │                                │  ││
│  │  └────────────────────────┘  │  │  │  ┌────────────────────────┐   │  ││
│  │                              │  │  │  │ Password               │   │  ││
│  │                              │  │  │  └────────────────────────┘   │  ││
│  │                              │  │  │                                │  ││
│  │                              │  │  │  [ ] Remember me   Forgot?    │  ││
│  │                              │  │  │                                │  ││
│  │                              │  │  │  ┌────────────────────────┐   │  ││
│  │                              │  │  │  │                        │   │  ││
│  │                              │  │  │  │      Sign In →         │   │  ││
│  │                              │  │  │  │                        │   │  ││
│  │                              │  │  │  └────────────────────────┘   │  ││
│  │                              │  │  │                                │  ││
│  │                              │  │  │  ──────── or ────────          │  ││
│  │                              │  │  │                                │  ││
│  │                              │  │  │  [G] Continue with Google     │  ││
│  │                              │  │  │                                │  ││
│  │                              │  │  │  Don't have an account?       │  ││
│  │                              │  │  │  Sign up for free →           │  ││
│  │                              │  │  │                                │  ││
│  │                              │  │  └────────────────────────────────┘  ││
│  │                              │  │                                      ││
│  └──────────────────────────────┘  └──────────────────────────────────────┘│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Signup Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  SIGNUP - STEP 1: Account Details                                           │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                       │ │
│  │  Create Your Account                                                  │ │
│  │  ─────────────────                                                    │ │
│  │  Step 1 of 3: Account Details                                        │ │
│  │                                                                       │ │
│  │  ┌─────────────────────────────┐  ┌─────────────────────────────┐    │ │
│  │  │ First Name                  │  │ Last Name                   │    │ │
│  │  └─────────────────────────────┘  └─────────────────────────────┘    │ │
│  │                                                                       │ │
│  │  ┌───────────────────────────────────────────────────────────────┐   │ │
│  │  │ Work Email                                                    │   │ │
│  │  └───────────────────────────────────────────────────────────────┘   │ │
│  │                                                                       │ │
│  │  ┌───────────────────────────────────────────────────────────────┐   │ │
│  │  │ Create Password                                               │   │ │
│  │  └───────────────────────────────────────────────────────────────┘   │ │
│  │                                                                       │ │
│  │  Password strength: ████░░░░░░ Moderate                              │ │
│  │                                                                       │ │
│  │               ┌──────────────────────────────────┐                   │ │
│  │               │       Continue →                 │                   │ │
│  │               └──────────────────────────────────┘                   │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│                                                                             │
│  SIGNUP - STEP 2: Organization Info                                         │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                       │ │
│  │  Tell Us About Your Organization                                      │ │
│  │  ───────────────────────────────                                      │ │
│  │  Step 2 of 3: Organization                                           │ │
│  │                                                                       │ │
│  │  ┌───────────────────────────────────────────────────────────────┐   │ │
│  │  │ Organization Name                                             │   │ │
│  │  └───────────────────────────────────────────────────────────────┘   │ │
│  │                                                                       │ │
│  │  Organization Type                                                    │ │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐        │ │
│  │  │  ○ NGO/CSO      │ │  ○ Foundation   │ │  ○ Government   │        │ │
│  │  └─────────────────┘ └─────────────────┘ └─────────────────┘        │ │
│  │  ┌─────────────────┐ ┌─────────────────┐                             │ │
│  │  │  ○ Corporate    │ │  ○ Individual   │                             │ │
│  │  └─────────────────┘ └─────────────────┘                             │ │
│  │                                                                       │ │
│  │  ┌───────────────────────────────────────────────────────────────┐   │ │
│  │  │ Primary Focus Area ▼                                          │   │ │
│  │  └───────────────────────────────────────────────────────────────┘   │ │
│  │    • Foundational Literacy & Numeracy (FLN)                          │ │
│  │    • Teacher Professional Development                                │ │
│  │    • School Leadership                                               │ │
│  │    • Career Readiness                                                │ │
│  │    • Other                                                           │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│                                                                             │
│  SIGNUP - STEP 3: Get Started                                               │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                       │ │
│  │          🎉 Welcome to LFA Builder!                                  │ │
│  │                                                                       │ │
│  │          Your account is ready. Here's how to get started:           │ │
│  │                                                                       │ │
│  │          ┌───────────────────────────────────────────────────┐       │ │
│  │          │                                                   │       │ │
│  │          │  ○ Take a 2-minute tour                          │       │ │
│  │          │  ○ Start with a sample project                   │       │ │
│  │          │  ● Jump straight to building                     │       │ │
│  │          │                                                   │       │ │
│  │          └───────────────────────────────────────────────────┘       │ │
│  │                                                                       │ │
│  │                 ┌──────────────────────────────────┐                 │ │
│  │                 │       Let's Go →                 │                 │ │
│  │                 └──────────────────────────────────┘                 │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Dashboard Design

### 6.1 Main Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  NAVIGATION BAR                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ [Logo]  Dashboard  Projects  Templates        [🔍]  [🔔]  [Avatar ▼] │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                       │ │
│  │  Good morning, Priya! 👋                                              │ │
│  │                                                                       │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │ │
│  │  │                                                                 │ │ │
│  │  │  ┌───────────────────────────────────────────────────────────┐ │ │ │
│  │  │  │                                                           │ │ │ │
│  │  │  │  + Create New LFA                                         │ │ │ │
│  │  │  │                                                           │ │ │ │
│  │  │  │  Start from scratch or use a template                     │ │ │ │
│  │  │  │                                                           │ │ │ │
│  │  │  │  [ Start Building → ]                                     │ │ │ │
│  │  │  │                                                           │ │ │ │
│  │  │  └───────────────────────────────────────────────────────────┘ │ │ │
│  │  │                                                                 │ │ │
│  │  └─────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  Recent Projects                                         [View All →]       │
│  ────────────────                                                           │
│                                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐  │
│  │                      │  │                      │  │                  │  │
│  │  FLN Program UP      │  │  Teacher Training    │  │  School Leader   │  │
│  │                      │  │  Maharashtra         │  │  Development     │  │
│  │  ████████░░ 80%      │  │  ████████████ 100%   │  │  ████░░░░░░ 40%  │  │
│  │                      │  │                      │  │                  │  │
│  │  Updated 2 hours ago │  │  Updated yesterday   │  │  Updated 3 days  │  │
│  │                      │  │                      │  │                  │  │
│  │  [Continue →]        │  │  [View] [Export]     │  │  [Continue →]    │  │
│  │                      │  │                      │  │                  │  │
│  └──────────────────────┘  └──────────────────────┘  └──────────────────┘  │
│                                                                             │
│                                                                             │
│  Quick Stats                                                                │
│  ───────────                                                                │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │              │  │              │  │              │  │              │    │
│  │     12       │  │      8       │  │     85       │  │     4.2      │    │
│  │              │  │              │  │              │  │              │    │
│  │   Total      │  │  Completed   │  │   Average    │  │   Average    │    │
│  │   Projects   │  │   LFAs       │  │   Health     │  │   Rating     │    │
│  │              │  │              │  │   Score      │  │   ★★★★☆     │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                                             │
│                                                                             │
│  Templates                                               [Browse All →]     │
│  ─────────                                                                  │
│                                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐  │
│  │  📚 FLN Program      │  │  👩‍🏫 Teacher TPD    │  │  🏫 Leadership   │  │
│  │  Grade 1-3 literacy  │  │  Pedagogy training   │  │  HM development  │  │
│  │  [Use Template]      │  │  [Use Template]      │  │  [Use Template]  │  │
│  └──────────────────────┘  └──────────────────────┘  └──────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. LFA Builder Module

### 7.1 Builder Overview - New 4-Step Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  NEW BUILDER FLOW                                                           │
│                                                                             │
│     ┌─────────┐       ┌─────────┐       ┌─────────┐       ┌─────────┐      │
│     │    1    │──────▶│    2    │──────▶│    3    │──────▶│    4    │      │
│     │ DEFINE  │       │ EXPLORE │       │  BUILD  │       │ ANALYZE │      │
│     └─────────┘       └─────────┘       └─────────┘       └─────────┘      │
│                                                                             │
│     Describe your     Answer smart      View & edit       Test, validate   │
│     program in        questions about   your generated    and export       │
│     plain language    the program       LFA document      your LFA         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Step 1: DEFINE (Program Description)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [← Back to Dashboard]                     Step 1 of 4: Define      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  PROGRESS BAR                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 25% │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  ● Define  ○ Explore  ○ Build  ○ Analyze                                   │
│                                                                             │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │                                                                     │   │
│  │       Describe Your Education Program                              │   │
│  │       ─────────────────────────────────                            │   │
│  │                                                                     │   │
│  │       Tell us about your program in your own words.                │   │
│  │       Our AI will help structure it into a framework.              │   │
│  │                                                                     │   │
│  │       ┌─────────────────────────────────────────────────────────┐  │   │
│  │       │                                                         │  │   │
│  │       │  We want to improve reading outcomes for Grade 1-3     │  │   │
│  │       │  students in rural Uttar Pradesh. Our approach is to   │  │   │
│  │       │  train teachers on activity-based pedagogy and provide │  │   │
│  │       │  them with teaching-learning materials. We will work   │  │   │
│  │       │  with CRPs to mentor teachers monthly...               │  │   │
│  │       │                                                         │  │   │
│  │       │                                                         │  │   │
│  │       │                                                         │  │   │
│  │       │                                                         │  │   │
│  │       └─────────────────────────────────────────────────────────┘  │   │
│  │                                                                     │   │
│  │       245 / 10 minimum characters                                  │   │
│  │                                                                     │   │
│  │       💡 Need inspiration? Try one of these examples:             │   │
│  │                                                                     │   │
│  │       ┌───────────────┐  ┌───────────────┐  ┌───────────────┐     │   │
│  │       │ FLN Program   │  │ Teacher TPD   │  │ Leadership    │     │   │
│  │       │ for primary   │  │ for secondary │  │ development   │     │   │
│  │       │ grades        │  │ schools       │  │ for HMs       │     │   │
│  │       └───────────────┘  └───────────────┘  └───────────────┘     │   │
│  │                                                                     │   │
│  │                                                                     │   │
│  │                        ┌──────────────────────────────┐            │   │
│  │                        │                              │            │   │
│  │                        │   Continue to Questions →    │            │   │
│  │                        │                              │            │   │
│  │                        └──────────────────────────────┘            │   │
│  │                                                                     │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Design Specifications**:
- Clean, centered layout with max-width of 720px
- Large, comfortable textarea (min-height: 200px)
- Real-time character counter
- Example chips are clickable to auto-fill
- Single prominent CTA button
- Subtle help text below textarea

### 7.3 Step 2: EXPLORE (Smart Questions)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [← Back]                                  Step 2 of 4: Explore     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  PROGRESS BAR                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 50% │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  ✓ Define  ● Explore  ○ Build  ○ Analyze                                   │
│                                                                             │
│                                                                             │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐  │
│  │                                 │  │                                 │  │
│  │  YOUR PROGRAM BRIEF             │  │  QUESTIONS                      │  │
│  │  ─────────────────              │  │  ─────────                      │  │
│  │                                 │  │                                 │  │
│  │  📝 FLN Improvement Program    │  │  6 of 12 answered               │  │
│  │                                 │  │                                 │  │
│  │  Goal: Improve reading          │  │  Progress: ██████░░░░░░        │  │
│  │  outcomes for Grade 1-3         │  │                                 │  │
│  │                                 │  │  ┌───────────────────────────┐  │  │
│  │  Target: Rural UP students      │  │  │                           │  │  │
│  │                                 │  │  │  🎯 Student Outcomes      │  │  │
│  │  Theme: FLN                     │  │  │     (REQUIRED)            │  │  │
│  │                                 │  │  │                           │  │  │
│  │  Level: School + Cluster        │  │  │  What specific reading    │  │  │
│  │                                 │  │  │  skills should students   │  │  │
│  │                                 │  │  │  demonstrate by the end   │  │  │
│  │  ─────────────────              │  │  │  of the program?          │  │  │
│  │                                 │  │  │                           │  │  │
│  │  STAKEHOLDER CONTEXT            │  │  │  ┌───────────────────┐    │  │  │
│  │                                 │  │  │  │                   │    │  │  │
│  │  ┌─────────────────────────┐   │  │  │  │  Students should  │    │  │  │
│  │  │                         │   │  │  │  │  be able to read  │    │  │  │
│  │  │  District    [DEO,DIET] │   │  │  │  │  30 words per     │    │  │  │
│  │  │      ↓                  │   │  │  │  │  minute with 80%  │    │  │  │
│  │  │  Block       [BRP,BEO]  │   │  │  │  │  comprehension... │    │  │  │
│  │  │      ↓                  │   │  │  │  │                   │    │  │  │
│  │  │  Cluster  → [CRP] ←     │   │  │  │  └───────────────────┘    │  │  │
│  │  │      ↓     highlighted  │   │  │  │                           │  │  │
│  │  │  School   [Teachers,HM] │   │  │  │  ┌─────────┐ ┌─────────┐  │  │  │
│  │  │      ↓                  │   │  │  │  │ ← Prev  │ │ Next →  │  │  │  │
│  │  │  Students               │   │  │  │  └─────────┘ └─────────┘  │  │  │
│  │  │                         │   │  │  │                           │  │  │
│  │  └─────────────────────────┘   │  │  └───────────────────────────┘  │  │
│  │                                 │  │                                 │  │
│  │                                 │  │  QUESTION NAVIGATOR             │  │
│  │                                 │  │  ┌───────────────────────────┐  │  │
│  │                                 │  │  │ ✓ ✓ ✓ ✓ ✓ ✓ ○ ○ ○ ○ ○ ○ │  │  │
│  │                                 │  │  │ 1 2 3 4 5 6 7 8 9 10 11 12│  │  │
│  │                                 │  │  └───────────────────────────┘  │  │
│  │                                 │  │                                 │  │
│  └─────────────────────────────────┘  └─────────────────────────────────┘  │
│                                                                             │
│                        ┌──────────────────────────────────────┐             │
│                        │                                      │             │
│                        │     Generate My LFA →                │             │
│                        │     (Answer at least 8 questions)    │             │
│                        │                                      │             │
│                        └──────────────────────────────────────┘             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Design Improvements**:
- Two-column layout: Context (left) + Questions (right)
- Stakeholder pyramid is always visible for context
- Category badges with consistent colors
- Clear progress tracking (X of Y answered)
- Question navigator as dot indicators
- Smart "Generate" button that enables after minimum answers

### 7.4 Step 3: BUILD (LFA Document View)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [← Back]                                  Step 3 of 4: Build       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  PROGRESS BAR                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ████████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 75% │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  ✓ Define  ✓ Explore  ● Build  ○ Analyze                                   │
│                                                                             │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  FLN Improvement Program for Rural UP                              │   │
│  │  ───────────────────────────────────────                           │   │
│  │                                                                     │   │
│  │  View:  [Logframe]  [Pyramid]  [Flow]            [✏️ Edit]         │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │  LOGFRAME MATRIX VIEW                                       │   │   │
│  │  │                                                             │   │   │
│  │  │  ┌─────────────┬───────────┬─────────────┬───────────────┐ │   │   │
│  │  │  │ Intervention│ Indicators│ Data Source │ Assumptions   │ │   │   │
│  │  │  │ Logic       │           │             │               │ │   │   │
│  │  │  ├─────────────┼───────────┼─────────────┼───────────────┤ │   │   │
│  │  │  │             │           │             │               │ │   │   │
│  │  │  │ GOAL        │ • Reading │ • ASER      │ • Schools     │ │   │   │
│  │  │  │ 80% of      │   fluency │   assessment│   accessible  │ │   │   │
│  │  │  │ Grade 1-3   │ • Compre- │ • Quarterly │ • Teachers    │ │   │   │
│  │  │  │ students    │   hension │   tests     │   attend      │ │   │   │
│  │  │  │ achieve...  │   score   │             │   training    │ │   │   │
│  │  │  │             │           │             │               │ │   │   │
│  │  │  ├─────────────┼───────────┼─────────────┼───────────────┤ │   │   │
│  │  │  │             │           │             │               │ │   │   │
│  │  │  │ OUTCOME 1   │ • % of    │ • Classroom │ • Teachers    │ │   │   │
│  │  │  │ Teachers    │   teachers│   observ.   │   willing     │ │   │   │
│  │  │  │ practice    │   using   │ • CRP visit │ • TLM         │ │   │   │
│  │  │  │ activity-   │   new     │   reports   │   available   │ │   │   │
│  │  │  │ based...    │   methods │             │               │ │   │   │
│  │  │  │             │           │             │               │ │   │   │
│  │  │  │   ├─ Output │ ...       │ ...         │               │ │   │   │
│  │  │  │   │  1.1    │           │             │               │ │   │   │
│  │  │  │   │  ├─ A1  │           │             │               │ │   │   │
│  │  │  │   │  └─ A2  │           │             │               │ │   │   │
│  │  │  │   └─ Output │           │             │               │ │   │   │
│  │  │  │      1.2    │           │             │               │ │   │   │
│  │  │  │             │           │             │               │ │   │   │
│  │  │  └─────────────┴───────────┴─────────────┴───────────────┘ │   │   │
│  │  │                                                             │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                        ┌──────────────────────────────────────┐             │
│                        │                                      │             │
│                        │   Continue to Analysis →             │             │
│                        │                                      │             │
│                        └──────────────────────────────────────┘             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.5 Step 4: ANALYZE (Analysis & Export)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [← Back]                                  Step 4 of 4: Analyze     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  PROGRESS BAR                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ████████████████████████████████████████████████████████████ 100%  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│  ✓ Define  ✓ Explore  ✓ Build  ● Analyze                                   │
│                                                                             │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  🎉 Your LFA is Ready!                                             │   │
│  │                                                                     │   │
│  │  FLN Improvement Program for Rural UP                              │   │
│  │  Health Score: ██████████░░ 82/100                                 │   │
│  │                                                                     │   │
│  │  ┌────────────────────────────────────────────────────────────┐    │   │
│  │  │  📥 Export      │  📄 Word  │  📊 CSV  │  💾 JSON  │       │    │   │
│  │  └────────────────────────────────────────────────────────────┘    │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                                                                             │
│  Analysis Tools                                                             │
│  ──────────────                                                             │
│                                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌───────────────────┐   │
│  │                     │  │                     │  │                   │   │
│  │  💬 Interview       │  │  🧠 Logic           │  │  🔮 What-If       │   │
│  │     Stakeholders    │  │     Challenger      │  │     Scenarios     │   │
│  │                     │  │                     │  │                   │   │
│  │  Get feedback from  │  │  Find gaps and      │  │  Test resilience  │   │
│  │  8 realistic        │  │  weaknesses in      │  │  against budget   │   │
│  │  stakeholder        │  │  your program       │  │  cuts, delays,    │   │
│  │  personas           │  │  logic              │  │  and more         │   │
│  │                     │  │                     │  │                   │   │
│  │  [Start Interview]  │  │  [Run Analysis]     │  │  [Explore]        │   │
│  │                     │  │                     │  │                   │   │
│  └─────────────────────┘  └─────────────────────┘  └───────────────────┘   │
│                                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐                          │
│  │                     │  │                     │                          │
│  │  📊 Health          │  │  🔄 Theory of       │                          │
│  │     Dashboard       │  │     Change          │                          │
│  │                     │  │                     │                          │
│  │  Score your LFA     │  │  Animated view of   │                          │
│  │  across 5 quality   │  │  your logic chain   │                          │
│  │  dimensions         │  │  from activities    │                          │
│  │                     │  │  to goal            │                          │
│  │                     │  │                     │                          │
│  │  [View Dashboard]   │  │  [View Animation]   │                          │
│  │                     │  │                     │                          │
│  └─────────────────────┘  └─────────────────────┘                          │
│                                                                             │
│                                                                             │
│             ┌────────────────────────────────────────────┐                  │
│             │                                            │                  │
│             │    Save & Return to Dashboard              │                  │
│             │                                            │                  │
│             └────────────────────────────────────────────┘                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Analysis Tools Design

### 8.1 Stakeholder Interview Panel (Redesigned)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  Interview Your LFA                                                         │
│  ─────────────────────                                                      │
│                                                                             │
│  Get authentic feedback from stakeholders at every level of the            │
│  education system. Click on a stakeholder to hear their perspective.       │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  DISTRICT LEVEL                                                     │   │
│  │  ┌────────────────────────────┐  ┌────────────────────────────┐    │   │
│  │  │  🏛️                        │  │  📚                        │    │   │
│  │  │  DEO                       │  │  DIET Faculty              │    │   │
│  │  │  District Education        │  │  Training Institute        │    │   │
│  │  │  Officer                   │  │  Instructor                │    │   │
│  │  │                   [▶ Talk] │  │                   [▶ Talk] │    │   │
│  │  └────────────────────────────┘  └────────────────────────────┘    │   │
│  │                                                                     │   │
│  │  BLOCK LEVEL                                                        │   │
│  │  ┌────────────────────────────┐                                    │   │
│  │  │  📍                        │                                    │   │
│  │  │  BRP                       │                                    │   │
│  │  │  Block Resource            │                                    │   │
│  │  │  Person               [✓]  │  ← Interviewed (3 issues found)   │   │
│  │  └────────────────────────────┘                                    │   │
│  │                                                                     │   │
│  │  CLUSTER LEVEL                                                      │   │
│  │  ┌────────────────────────────┐                                    │   │
│  │  │  👥                        │                                    │   │
│  │  │  CRP                       │                                    │   │
│  │  │  Cluster Resource          │                                    │   │
│  │  │  Person              [▶ Talk] │                                 │   │
│  │  └────────────────────────────┘                                    │   │
│  │                                                                     │   │
│  │  SCHOOL LEVEL                                                       │   │
│  │  ┌────────────────────────────┐  ┌────────────────────────────┐    │   │
│  │  │  👩‍🏫                        │  │  🏫                        │    │   │
│  │  │  Teacher                   │  │  Head Master               │    │   │
│  │  │  Government school         │  │  School leader             │    │   │
│  │  │  teacher                   │  │                            │    │   │
│  │  │                   [▶ Talk] │  │                   [▶ Talk] │    │   │
│  │  └────────────────────────────┘  └────────────────────────────┘    │   │
│  │                                                                     │   │
│  │  ┌────────────────────────────┐                                    │   │
│  │  │  👦                        │                                    │   │
│  │  │  Student                   │                                    │   │
│  │  │  Primary school            │                                    │   │
│  │  │  student              [▶ Talk] │                                │   │
│  │  └────────────────────────────┘                                    │   │
│  │                                                                     │   │
│  │  COMMUNITY LEVEL                                                    │   │
│  │  ┌────────────────────────────┐                                    │   │
│  │  │  🏠                        │                                    │   │
│  │  │  Parent                    │                                    │   │
│  │  │  SMC member                │                                    │   │
│  │  │                   [▶ Talk] │                                    │   │
│  │  └────────────────────────────┘                                    │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  FEEDBACK FROM: BRP (Khand Srot Vyakti)                            │   │
│  │  Sentiment: Cautious 🤔                                            │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                                                             │   │   │
│  │  │  "Namaskar! As someone coordinating across multiple        │   │   │
│  │  │   clusters, I have some practical concerns about           │   │   │
│  │  │   this program design..."                                   │   │   │
│  │  │                                                             │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  │  Issues Found:                                                      │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │  ⚠️ IMPORTANT  |  GAP                                       │   │   │
│  │  │                                                             │   │   │
│  │  │  CRP Capacity Unclear                                       │   │   │
│  │  │  How will CRPs manage 2 visits/month to each school        │   │   │
│  │  │  when they already have 15-20 schools to cover?            │   │   │
│  │  │                                                             │   │   │
│  │  │  💡 Recommendation: Specify realistic visit frequency       │   │   │
│  │  │     and consider cluster-level workshops instead.           │   │   │
│  │  │                                                             │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  │  [More feedback items...]                                           │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Logic Challenger (Redesigned)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  Logic Challenger                                                           │
│  ─────────────────                                                          │
│                                                                             │
│  Our AI acts as a "devil's advocate" to find weaknesses in your            │
│  program logic before implementation begins.                                │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │                    ┌────────────────────────┐                       │   │
│  │                    │                        │                       │   │
│  │                    │      LFA SCORE         │                       │   │
│  │                    │                        │                       │   │
│  │                    │         72             │                       │   │
│  │                    │        /100            │                       │   │
│  │                    │                        │                       │   │
│  │                    │   ████████████░░░░     │                       │   │
│  │                    │                        │                       │   │
│  │                    │   Good - Needs Work    │                       │   │
│  │                    │                        │                       │   │
│  │                    └────────────────────────┘                       │   │
│  │                                                                     │   │
│  │  Issue Summary:                                                     │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │ 🔴 0         │  │ 🟠 3         │  │ 🟡 2         │              │   │
│  │  │ Critical     │  │ Important    │  │ Minor        │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  QUICK WINS 💡                                                      │   │
│  │                                                                     │   │
│  │  These simple improvements can significantly strengthen your LFA:   │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │  → Add assessment frequency to Goal Indicator 1              │   │   │
│  │  │    Impact: Enables progress tracking                         │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │  → Specify who provides TLM materials                        │   │   │
│  │  │    Impact: Clarifies resource responsibility                 │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  DETAILED CHALLENGES                                                │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                                                             │   │   │
│  │  │  🟠 IMPORTANT  |  Indicator Weakness  |  Quick Fix          │   │   │
│  │  │                                                             │   │   │
│  │  │  Missing Measurement Timeline                               │   │   │
│  │  │  ─────────────────────────────                              │   │   │
│  │  │                                                             │   │   │
│  │  │  The goal indicator "reading fluency" doesn't specify       │   │   │
│  │  │  when or how often measurements will be taken.              │   │   │
│  │  │                                                             │   │   │
│  │  │  📍 Related Element: Goal Indicator 1                       │   │   │
│  │  │                                                             │   │   │
│  │  │  💡 Recommendation:                                         │   │   │
│  │  │  Specify "measured quarterly using ASER-style assessment"   │   │   │
│  │  │                                                             │   │   │
│  │  │                                            [▼ Show More]    │   │   │
│  │  │                                                             │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  │  [+ 4 more challenges]                                              │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Component Library

### 9.1 Buttons

```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, #4F46E5 0%, #4338CA 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px 0 rgba(79, 70, 229, 0.25);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px 0 rgba(79, 70, 229, 0.35);
}

/* Secondary Button */
.btn-secondary {
  background: white;
  color: #4F46E5;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  border: 1px solid #E2E8F0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  border-color: #4F46E5;
  background: #EEF2FF;
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: #4A5568;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background: #F4F6F8;
  color: #1A1A2E;
}
```

### 9.2 Cards

```css
/* Base Card */
.card {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
}

/* Elevated Card (on hover or for emphasis) */
.card-elevated {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07),
              0 2px 4px -1px rgba(0, 0, 0, 0.04);
}

.card-elevated:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08),
              0 4px 6px -2px rgba(0, 0, 0, 0.04);
}

/* Feature Card */
.card-feature {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 32px;
  transition: all 0.3s ease;
}

.card-feature:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.1);
  border-color: #4F46E5;
}
```

### 9.3 Form Elements

```css
/* Input Field */
.input {
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  color: #1A1A2E;
  background: #FAFBFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #4F46E5;
  background: white;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.input::placeholder {
  color: #A0AEC0;
}

/* Textarea */
.textarea {
  width: 100%;
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;
  color: #1A1A2E;
  background: #FAFBFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  resize: none;
  min-height: 160px;
  transition: all 0.2s ease;
}

.textarea:focus {
  outline: none;
  border-color: #4F46E5;
  background: white;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}
```

### 9.4 Badges

```css
/* Badge Base */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
  white-space: nowrap;
}

/* Badge Variants */
.badge-primary {
  background: #EEF2FF;
  color: #4F46E5;
}

.badge-success {
  background: #D1FAE5;
  color: #059669;
}

.badge-warning {
  background: #FEF3C7;
  color: #D97706;
}

.badge-error {
  background: #FFE4E6;
  color: #E11D48;
}

.badge-info {
  background: #E0F2FE;
  color: #0284C7;
}

/* Stakeholder Level Badges */
.badge-district { background: #EDE9FE; color: #7C3AED; }
.badge-block { background: #DBEAFE; color: #2563EB; }
.badge-cluster { background: #D1FAE5; color: #059669; }
.badge-school { background: #FFEDD5; color: #EA580C; }
.badge-community { background: #CFFAFE; color: #0891B2; }
```

### 9.5 Progress Indicators

```css
/* Progress Bar */
.progress-bar {
  width: 100%;
  height: 8px;
  background: #E2E8F0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%);
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* Step Indicator */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.step-circle.completed {
  background: #059669;
  color: white;
}

.step-circle.current {
  background: #EEF2FF;
  color: #4F46E5;
  border: 2px solid #4F46E5;
}

.step-circle.pending {
  background: #F4F6F8;
  color: #A0AEC0;
  border: 2px solid #E2E8F0;
}
```

---

## 10. Responsive Design

### 10.1 Breakpoint Strategy

```css
/* Mobile First Approach */

/* Base: Mobile (< 640px) */
/* Default styles are mobile */

/* Tablet (≥ 640px) */
@media (min-width: 640px) { ... }

/* Small Desktop (≥ 768px) */
@media (min-width: 768px) { ... }

/* Desktop (≥ 1024px) */
@media (min-width: 1024px) { ... }

/* Large Desktop (≥ 1280px) */
@media (min-width: 1280px) { ... }
```

### 10.2 Layout Adaptations

```
LANDING PAGE
─────────────
Mobile:    Single column, stacked sections
Tablet:    2-column feature grid
Desktop:   3-column feature grid, side-by-side hero

BUILDER STEP 2 (Questions)
───────────────────────────
Mobile:    Full-width questions, hidden pyramid
Tablet:    2-column (70% questions, 30% context)
Desktop:   2-column (60% questions, 40% context with pyramid)

ANALYSIS TOOLS
──────────────
Mobile:    Full-width cards, stacked
Tablet:    2-column grid
Desktop:   3-column grid

LOGFRAME MATRIX
───────────────
Mobile:    Horizontal scroll, sticky first column
Tablet:    Full table with adjusted column widths
Desktop:   Full table with optimal spacing
```

### 10.3 Touch Targets

```css
/* Minimum touch target: 44x44px */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Button padding on mobile */
@media (max-width: 640px) {
  .btn {
    padding: 14px 20px;
  }
}
```

---

## 11. Micro-interactions & Animations

### 11.1 Transitions

```css
/* Default transition */
.transition-default {
  transition: all 0.2s ease;
}

/* Smooth transitions for UI elements */
.transition-smooth {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Quick snap for buttons */
.transition-snap {
  transition: all 0.15s ease-out;
}
```

### 11.2 Loading States

```css
/* Skeleton loading */
.skeleton {
  background: linear-gradient(90deg, #F4F6F8 0%, #E2E8F0 50%, #F4F6F8 100%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Spinner */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #E2E8F0;
  border-top-color: #4F46E5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### 11.3 Feedback Animations

```css
/* Success checkmark */
@keyframes checkmark {
  0% { stroke-dashoffset: 100; }
  100% { stroke-dashoffset: 0; }
}

/* Card entrance */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-animate {
  animation: fadeInUp 0.4s ease-out;
}

/* Button click */
.btn:active {
  transform: scale(0.98);
}

/* Progress celebration */
@keyframes celebrate {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.celebrate {
  animation: celebrate 0.3s ease-out;
}
```

---

## 12. Implementation Guide

### 12.1 File Structure (Recommended)

```
frontend/
├── app/
│   ├── (public)/
│   │   ├── page.tsx              # Landing page
│   │   ├── about/page.tsx
│   │   ├── features/page.tsx
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   │
│   ├── (authenticated)/
│   │   ├── dashboard/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── builder/
│   │   │   ├── page.tsx          # Builder entry
│   │   │   ├── define/page.tsx   # Step 1
│   │   │   ├── explore/page.tsx  # Step 2
│   │   │   ├── build/page.tsx    # Step 3
│   │   │   └── analyze/page.tsx  # Step 4
│   │   └── project/[id]/page.tsx
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/                        # Base components
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Input/
│   │   ├── Badge/
│   │   ├── Progress/
│   │   ├── Modal/
│   │   └── ...
│   │
│   ├── landing/                   # Landing page components
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Testimonials.tsx
│   │   └── CTA.tsx
│   │
│   ├── builder/                   # Builder components
│   │   ├── StepProgress.tsx
│   │   ├── DefineStep.tsx
│   │   ├── ExploreStep.tsx
│   │   ├── BuildStep.tsx
│   │   ├── AnalyzeStep.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── LogframeMatrix.tsx
│   │   └── StakeholderPyramid.tsx
│   │
│   ├── analysis/                  # Analysis tool components
│   │   ├── StakeholderInterview.tsx
│   │   ├── LogicChallenger.tsx
│   │   ├── WhatIfEngine.tsx
│   │   ├── HealthDashboard.tsx
│   │   └── TheoryOfChange.tsx
│   │
│   └── layout/                    # Layout components
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       ├── Sidebar.tsx
│       └── PageHeader.tsx
│
├── lib/
│   ├── api.ts                     # API client
│   ├── utils.ts                   # Utilities
│   └── hooks/                     # Custom hooks
│       ├── useBuilder.ts
│       ├── useAnalysis.ts
│       └── useExport.ts
│
├── styles/
│   ├── globals.css
│   ├── variables.css              # CSS variables
│   └── animations.css             # Animation definitions
│
└── types/
    └── index.ts                   # TypeScript types
```

### 12.2 Key Implementation Notes

1. **Use CSS Variables**: Define all colors, spacing, and typography as CSS variables for easy theming
2. **Component-First**: Build reusable components before pages
3. **Progressive Enhancement**: Start with mobile layout, enhance for larger screens
4. **Accessibility**: Include ARIA labels, keyboard navigation, focus states
5. **Performance**: Lazy load analysis tools, optimize images, minimize bundle
6. **State Management**: Use React Query for server state, Zustand for client state

### 12.3 Animation Performance Tips

```css
/* Use transform and opacity for smooth animations */
/* GOOD */
.animated {
  transform: translateY(0);
  opacity: 1;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* AVOID - causes layout thrashing */
.bad-animated {
  margin-top: 0;
  height: 100px;
  transition: margin 0.3s ease, height 0.3s ease;
}

/* Use will-change sparingly */
.heavy-animation {
  will-change: transform;
}
```

### 12.4 Recommended Libraries

```json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "framer-motion": "^10.0.0",      // Animations
    "@tanstack/react-query": "^5.0.0", // Data fetching
    "zustand": "^4.5.0",             // State management
    "lucide-react": "^0.312.0",      // Icons
    "clsx": "^2.1.0",                // Class utilities
    "mermaid": "^10.7.0"             // Diagrams
  }
}
```

---

## Summary

This redesign transforms the LFA Builder into a modern, professional SaaS platform with:

1. **Clean White Theme**: Spacious, elegant, and accessible
2. **SaaS Landing Page**: Compelling hero, features, social proof, CTAs
3. **Streamlined 4-Step Builder**: Define → Explore → Build → Analyze
4. **Professional Component Library**: Consistent buttons, cards, badges, forms
5. **Thoughtful Animations**: Smooth transitions, loading states, celebrations
6. **Mobile-First Responsive**: Works beautifully on all devices
7. **Accessible Design**: High contrast, keyboard navigation, screen reader support

The new design positions Shikshagraha's LFA Builder as a premium tool that makes program design feel intuitive, professional, and empowering for education organizations across India.
