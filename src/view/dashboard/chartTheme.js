/* =============================================================================
 * DigiMal – Shared chart theme (extends the platform's consolidated tokens)
 * -----------------------------------------------------------------------------
 * Single source of truth for chart colours + interaction "feel" shared by the
 * Highcharts and ApexCharts dashboards so the whole platform stays uniform.
 *
 * These tokens EXTEND the design tokens already used across the DigiMal
 * platform modules (budget / household / net-distribution / admin) — no new
 * palette is invented here:
 *
 *   Core   #1c7a48 primary · #2f6746 brand deep · #20c997 success
 *          #fa8c16 warning (canonical, normalized from #fa8b0c)
 *          #ff4d4f danger · #5f63f2 in-progress (indigo) · #2f54eb info
 *          #1f2437 text · #5b6072 body · #8a90a6 muted · #9299b8 gray
 *          #eef1f5 / #e6f2eb borders · #ffffff surfaces
 *   Budget #15693c value · #4d8a63 label · #d9f0e2 border · #f3fcf6…
 *          gradient bg — RESERVED for financial/budget panels only
 * ========================================================================== */

// ── Consolidated platform tokens (extended, not invented) ─────────────────────
export const Palette = {
  // Core
  primary: "#1c7a48", // links, active states, primary actions, categorical #1
  primaryDeep: "#2f6746", // panel titles, categorical #2
  success: "#20c997", // success / healthy, categorical #3
  warning: "#fa8c16", // canonical warning (normalized from #fa8b0c), categorical #4
  danger: "#ff4d4f", // critical, categorical #5
  indigo: "#5f63f2", // in-progress / processing state, categorical #6
  info: "#2f54eb", // informational / calculation accent (blue callouts)

  // Text
  textHeading: "#1f2437", // headings & KPI values
  textBody: "#5b6072", // body copy
  textMuted: "#8a90a6", // muted / axis labels / legends / footnotes, categorical #7
  textGray: "#9299b8",

  // Surfaces
  white: "#ffffff",
  border: "#eef1f5", // card / chart gridline default
  borderGreenSoft: "#e6f2eb", // softer green-tinted border variant

  // Semantic state surfaces (12px-radius pill / chip tokens)
  warningBg: "#fffaf0",
  dangerBg: "#fff1f0",
  dangerBgAlt: "#fff5f5",
  dangerBorder: "#ffccc7",
  infoBg: "#f4f8ff",
  infoBorder: "#d6e4ff",
  indigoBg: "#ebebff",
  successChipBg: "#f6ffed",
  successChipBorder: "#b7eb8f",

  // Budget / financial deep green — reserved for finance-flavored panels only
  budgetValue: "#15693c",
  budgetLabel: "#4d8a63",
  budgetBorder: "#d9f0e2",
  budgetGradA: "#f3fcf6",
  budgetGradB: "#f9fffb",
  budgetGradC: "#f4fcf6",

  // 8th categorical series (only when >7 series are needed)
  tealSoft: "#4a90a2",

  // Panel / card treatment
  cardShadow: "0 3px 10px rgba(28, 122, 72, 0.05)",
};

// Categorical series order — the SAME order every time, so a given
// metric/category always renders in the same colour across every chart.
export const ChartColors = [
  Palette.primary, // #1c7a48
  Palette.primaryDeep, // #2f6746
  Palette.success, // #20c997
  Palette.warning, // #fa8c16
  Palette.danger, // #ff4d4f
  Palette.indigo, // #5f63f2  (in-progress series)
  Palette.textMuted, // #8a90a6
  Palette.tealSoft, // #4a90a2  (8th, only if needed)
];

const FONT = "'Inter', sans-serif";
let themeApplied = false;

/**
 * Applies the DigiMal chart theme as Highcharts GLOBAL defaults:
 *  - categorical palette above (charts that read getOptions().colors or leave
 *    the default palette untouched now render with the platform order)
 *  - credits hidden (replaces the old "Powered by HealthIT KE" watermarks)
 *  - gridlines/axes: light neutral #eef1f5; axis labels & legends muted
 *    #8a90a6 @ 11–12px
 *  - tooltips: white bg, #eef1f5 border, 12px radius, soft shadow,
 *    value text #1f2437 — same treatment as cards
 *  - subtle, standard entrance / refresh animation
 * Idempotent – safe to call once per page or several times.
 */
export const applyChartTheme = (Highcharts) => {
  if (!Highcharts || themeApplied) return;
  themeApplied = true;

  Highcharts.setOptions({
    colors: ChartColors,
    credits: { enabled: false, text: "", href: "" },
    chart: {
      animation: { duration: 900, easing: "easeOutCubic" },
      style: { fontFamily: FONT },
    },
    title: {
      style: { color: Palette.textHeading, fontFamily: FONT, fontSize: "14px" },
    },
    subtitle: {
      style: { color: Palette.textMuted, fontFamily: FONT, fontSize: "12px" },
    },
    legend: {
      itemStyle: { color: Palette.textMuted, fontFamily: FONT, fontSize: "12px" },
      itemHoverStyle: { color: Palette.textHeading },
    },
    tooltip: {
      backgroundColor: Palette.white,
      borderColor: Palette.border,
      borderWidth: 1,
      borderRadius: 12,
      shadow: true,
      padding: 8,
      style: { color: Palette.textHeading, fontFamily: FONT, fontSize: "12px" },
    },
    xAxis: {
      lineColor: Palette.border,
      tickColor: Palette.border,
      gridLineColor: Palette.border,
      labels: { style: { color: Palette.textMuted, fontSize: "11px" } },
    },
    yAxis: {
      gridLineColor: Palette.border,
      lineColor: Palette.border,
      labels: { style: { color: Palette.textMuted, fontSize: "11px" } },
    },
    plotOptions: {
      pie: {
        borderColor: Palette.white,
        dataLabels: { style: { fontFamily: FONT, fontSize: "12px" } },
      },
    },
  });
};

/**
 * Small ApexCharts sparkline used on the KPI cards – animated, subtle,
 * and rendered with the same brand colours as the Highcharts charts.
 */
export const apexSparkOptions = (lineColor) => ({
  chart: {
    type: "area",
    sparkline: { enabled: true },
    background: "transparent",
    animations: { enabled: true, easing: "easeinout", speed: 750 },
  },
  colors: [lineColor],
  stroke: { curve: "smooth", width: 2 },
  fill: {
    type: "gradient",
    gradient: {
      shade: "light",
      type: "horizontal",
      shadeIntensity: 0.55,
      opacityFrom: 0.5,
      opacityTo: 0.05,
      stops: [0, 60, 100],
    },
  },
  markers: { size: 0 },
  dataLabels: { enabled: false },
  legend: { show: false },
  tooltip: { enabled: false },
  grid: { show: false },
  yaxis: { show: false, labels: { show: false } },
  xaxis: {
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
});

/**
 * Compact number formatter used on KPI chips / chart headers:
 * 1234567 -> "1.2M", 45678 -> "45.7k".
 */
export const fmtCompact = (n, dp = 1) => {
  try {
    const v = Number(n);
    if (Number.isNaN(v) || v === 0) return "0";
    if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(dp)}M`;
    if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(dp)}k`;
    return `${Math.round(v)}`;
  } catch {
    return Number(n).toString();
  }
};

/**
 * ApexCharts radial gauge for "% of target / % delivered" KPI rings —
 * subtle animated ring, brand colour, no legend, no clutter.
 */
export const apexRadialOptions = (color = Palette.primary) => ({
  chart: {
    type: "radialBar",
    height: 96,
    animations: { enabled: true, easing: "easeinout", speed: 900 },
  },
  colors: [color],
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      track: { background: "#eef1f5", strokeWidth: "92%" },
      hollow: { size: "58%" },
      dataLabels: {
        name: { show: false },
        value: {
          fontSize: "17px",
          color: "#1f2437",
          fontWeight: 700,
          formatter: (v) => `${Math.round(Number(v))}%`,
        },
      },
    },
  },
  stroke: { lineCap: "round" },
  legend: { show: false },
  tooltip: { enabled: false },
});