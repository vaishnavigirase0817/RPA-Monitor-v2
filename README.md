# 🤖 RPA Monitor

<!-- Project Banner Placeholder -->
<!-- <div align="center">
  <img src="./public/banner.png" alt="RPA Monitor Banner" width="100%" />
</div> -->

<div align="center">
  <p><strong>A high-performance enterprise dashboard designed for monitoring live robotic process automation telemetry streams in real-time.</strong></p>
  
  ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
  ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
</div>

---

## 📖 Project Overview

**RPA Monitor** is a production-ready, enterprise-grade monitoring dashboard engineered to handle high-frequency robotic process automation (RPA) telemetry. Built from the ground up without heavy external UI libraries, it features a bespoke virtualization engine capable of rendering 500+ live telemetry rows updating at 5 frames per second (200ms tick rate). 

The architecture strictly adheres to a premium warm-light design system utilizing glassmorphism, responsive CSS grid layouts, and advanced performance optimizations to ensure a zero-lag experience for enterprise operators.

---

## ✨ Key Features

- **Real-Time Telemetry Monitoring**: Custom hooks streaming 500+ data points at 5Hz.
- **Live KPI Dashboard**: Animated KPI counters dynamically calculating total revenue, bot status, and system health.
- **High-Density Virtualized Data Grid**: Bespoke virtualization utilizing `translateY` transforms to maintain 60 FPS scrolling under load.
- **Pause/Resume Telemetry Stream**: Freeze the live state globally without losing layout or data context.
- **Advanced Sorting & Filtering**: Stable multi-column sorting, single-column sorting, multi-field fuzzy search, and dropdown filters.
- **Layout Persistence**: Widgets and layout states are fully customizable and persist via `localStorage`.
- **Interactive Telemetry Inspector Panel**: A premium sliding right-drawer providing detailed financial, workflow, and AI-insight breakdowns, exclusively accessible when the stream is safely paused.
- **Activity Feed & Performance Analytics**: Live cascading logs and CSS-driven animated performance charts.
- **Responsive Enterprise Dashboard**: Built on a rigid 12-column grid and 8-point spacing system scaling flawlessly across Desktop, Tablet, and Mobile.
- **Financial Metrics Formatting**: Native `Intl.NumberFormat` handling for ROI, revenue, and budgets.
- **Visual Status Indicators**: Intelligent badges, pulsing dot arrays, and animated progress bars.
- **Accessibility Support**: Keyboard navigation (`Esc` closures, `Enter` row selection), ARIA labels, focus trapping, and semantic HTML structure.
- **Extreme Performance Optimization**: Strict implementation of React memoization (`useMemo`, `React.memo`), lazy loaded routes (`React.lazy`), and GPU-accelerated CSS animations.

---

## 🛠️ Tech Stack

- **React 19**
- **Vite**
- **Tailwind CSS**
- **JavaScript (ES6+)**
- **React Router v6**
- **CSS Animations & Variables**
- **Web Animations API** (For dynamic KPI counters and Timelines)
- **LocalStorage API**

---

## 📁 Folder Structure

```text
src/
├── components/          # Reusable UI architecture
│   ├── dashboard/       # Dashboard specific widgets (KPIGrid, ProcessTable, etc.)
│   ├── features/        # Global features (QuickActions, Settings, Notifications)
│   ├── layout/          # Structural wrappers (PageLayout, Sidebar, TopNav)
│   └── ui/              # Primitive design system components (Button, Card, Badge)
├── data/                # Mock telemetry generator (dataStream.js)
├── hooks/               # Custom logic (useLiveData, useCountUp, useKeyboardNav)
├── pages/               # Lazy-loaded route views
├── index.css            # Global CSS variables, animations, and Tailwind imports
├── main.jsx             # React DOM entry point
└── App.jsx              # Routing and Suspense configurations
```

---

## 🚀 Installation

Follow these steps to run the enterprise dashboard locally:

1. **Clone repository**
   ```bash
   git clone https://github.com/vaishnavigirase0817/RPA-Monitor.git
   cd RPA-Monitor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build production version**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

---

## 💻 Usage

- **Start the Application**: After running `npm run dev`, open your browser to the local port (usually `http://localhost:5173`).
- **View the Dashboard**: The main telemetry grid and live KPIs will immediately begin streaming updates every 200ms.
- **Pause the Telemetry Stream**: Click the prominent "Pause Stream" button in the Dashboard toolbar to freeze all live metrics globally.
- **Inspect Telemetry Records**: While the stream is *Paused*, click on any row in the Process Table to slide open the Enterprise Inspector Panel for detailed analysis.
- **Search, Sort, and Filter Data**: Utilize the multi-field search bar and dropdowns above the grid to narrow down specific bot operations. Click column headers to apply multi-column sorting.
- **Customize Dashboard Layout**: Click the "Customize Layout" dropdown to hide/show specific widgets. Refresh the page to verify that `localStorage` preserves your custom layout.
- **Navigate Between Pages**: Use the collapsible sidebar to explore Analytics, Bot Management, Activity Logs, and Settings (which dynamically load via React `Suspense`).

---

## ⚡ Performance Optimizations

To handle the strict requirement of 200ms tick updates across thousands of virtualized data points without dropping frames, the following optimizations were enforced:

| Technique | Implementation Detail |
|-----------|------------------------|
| **Component Memoization** | Aggressive use of `React.memo` on heavy components (`ProcessTable`, `InspectorPanel`, `KPICard`) prevents entire DOM tree reconciliation. |
| **Optimized Rendering** | `useMemo` strictly caches complex computations (like sorting algorithms and KPI derivations) inside the custom `useLiveData` hook. |
| **Efficient Virtualization** | Custom-built data grid calculates precise `startIndex` and `endIndex` rendering only visible rows via hardware-accelerated `translateY` tracking. |
| **Lazy Loading & Splitting** | Core routes are dynamically imported utilizing `React.lazy`, drastically reducing initial TTI (Time to Interactive). |
| **GPU Acceleration** | All UI micro-interactions, background gradients, and data-grid row transitions utilize `transform` or `opacity` modifications to avoid layout thrashing. |

---

## 🎨 UI/UX Highlights

- **Enterprise-Grade Interface**: Designed to compete with premium tools like Azure Portal, Datadog, and UiPath Orchestrator.
- **Warm Light Theme**: Escapes traditional dark modes by utilizing a highly readable, premium warm aesthetic (`#E4C4B4`, `#C8957A`, `#B47857`).
- **Animated Background**: Subtle, non-intrusive mesh gradients and floating particle systems running purely on CSS.
- **Glassmorphism**: Elegant blur effects applied to toolbars, the sliding Inspector Panel, and modal overlays.
- **Smooth Micro-Interactions**: Custom CSS Ripple effects on buttons, smooth row hover state elevations, and toast notifications.

---

## ♿ Accessibility

- **Keyboard Navigation**: Full `Tab` indexing implemented across all interactive elements.
- **Focus States**: Explicit `focus-visible:outline` applied to primary theme colors.
- **ARIA Labels**: Screen-reader friendly implementations via `aria-label`, `aria-hidden`, `aria-busy` and `role="button"` properties.
- **Semantic HTML**: Proper header hierarchies (`h1` through `h4`) and semantic structuring within `main` and `nav` regions.

---

## 📸 Screenshots

*Placeholders for final application screenshots*

<details>
<summary>Click to view screenshots</summary>

### 📈 Dashboard
<!-- ![Dashboard](./public/screenshots/dashboard.png) -->
*Live telemetry grid, KPIs, and charts.*

### 🔍 Inspector Panel
<!-- ![Inspector Panel](./public/screenshots/inspector.png) -->
*Deep-dive analytics on a paused telemetry row.*

### 📊 Analytics
<!-- ![Analytics](./public/screenshots/analytics.png) -->
*Performance overview.*

### 🤖 Bot Management
<!-- ![Bot Management](./public/screenshots/bots.png) -->
*RPA fleet management.*

### ⚙️ Settings
<!-- ![Settings](./public/screenshots/settings.png) -->
*User configuration and global notifications.*

</details>

---

## 🔮 Future Enhancements

- **WebSockets Integration**: Replace the mock `setInterval` data stream with real-time Socket.io / GraphQL subscriptions.
- **Customizable Themes**: Implement a centralized theming engine allowing enterprises to inject their branding variables.
- **Advanced Exporting**: Add CSV/PDF export support for grid data directly from the front-end.
- **Drag & Drop Layouts**: Upgrade the layout customization to allow true grid reordering.
- **Role-Based Access Control (RBAC)**: Conditionally render UI elements based on authentication levels.

---

## 👨‍💻 Author

**Vaishnavi Girase**
- GitHub: [@vaishnavigirase0817](https://github.com/vaishnavigirase0817)
- Email: [vaishnavigirase802@gmail.com]

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
