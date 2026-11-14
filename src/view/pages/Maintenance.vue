<template>
  <div class="maintenance-screen">
    <!-- Decorative background layers (never interactive) -->
    <div class="aurora aurora--one" aria-hidden="true"></div>
    <div class="aurora aurora--two" aria-hidden="true"></div>
    <div class="net-mesh" aria-hidden="true"></div>
    <div class="particles" aria-hidden="true">
      <span
        v-for="(particle, index) in particles"
        :key="index"
        class="particle"
        :style="{
          left: particle.left,
          top: particle.top,
          width: particle.size + 'px',
          height: particle.size + 'px',
          animationDelay: particle.delay,
          animationDuration: particle.duration,
        }"
      ></span>
    </div>

    <main class="maintenance-card">
      <div class="brand">
        <span class="brand__mark" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="26" height="26">
            <path
              d="M16 2.5 27 7v9.3c0 6.5-4.6 10.9-11 13.2C9.6 27.2 5 22.8 5 16.3V7L16 2.5Z"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="m10.8 15.6 3.4 3.4 7-7.4"
              fill="none"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span class="brand__name">DigiMal<span>-KE</span></span>
        <span class="brand__rule" aria-hidden="true"></span>
        <span class="brand__tagline">National Mass Net Distribution</span>
      </div>

      <div class="emblem" aria-hidden="true">
        <svg class="emblem__svg" viewBox="0 0 320 320">
          <defs>
            <radialGradient id="dm-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#20c997" stop-opacity="0.18" />
              <stop offset="60%" stop-color="#20c997" stop-opacity="0.05" />
              <stop offset="100%" stop-color="#20c997" stop-opacity="0" />
            </radialGradient>
            <radialGradient id="dm-ground" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#20c997" stop-opacity="0.16" />
              <stop offset="100%" stop-color="#20c997" stop-opacity="0" />
            </radialGradient>
            <linearGradient id="dm-net-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#20c997" stop-opacity="0.1" />
              <stop offset="100%" stop-color="#20c997" stop-opacity="0.03" />
            </linearGradient>
            <linearGradient id="dm-net-line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#20c997" />
              <stop offset="100%" stop-color="#0cab7c" />
            </linearGradient>
            <linearGradient id="dm-blanket" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#a7f3d0" />
              <stop offset="100%" stop-color="#20c997" />
            </linearGradient>
            <linearGradient id="dm-frame" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#adb4d2" />
              <stop offset="50%" stop-color="#c6d0dc" />
              <stop offset="100%" stop-color="#adb4d2" />
            </linearGradient>
            <linearGradient id="dm-shimmer" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
              <stop offset="50%" stop-color="#20c997" stop-opacity="0.28" />
              <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
            </linearGradient>
            <pattern
              id="dm-net-mesh"
              width="11"
              height="11"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <path
                d="M0 0H11M0 0V11"
                fill="none"
                stroke="rgba(12, 171, 124, 0.3)"
                stroke-width="0.7"
              />
            </pattern>
            <clipPath id="dm-net-clip">
              <path
                d="M70 238 V150 C70 132 82 120 102 114 L160 100 L218 114 C238 120 250 132 250 150 V238 Z"
              />
            </clipPath>
          </defs>

          <circle
            class="emblem__halo"
            cx="160"
            cy="155"
            r="150"
            fill="url(#dm-halo)"
          />
          <circle class="orbit orbit--outer" cx="160" cy="155" r="142" />
          <circle class="orbit orbit--inner" cx="160" cy="155" r="118" />
          <g class="orbit__sparks">
            <circle cx="160" cy="13" r="4" />
            <circle cx="284" cy="196" r="3" />
            <circle cx="40" cy="205" r="2.6" />
          </g>

          <ellipse
            class="scene__ground"
            cx="160"
            cy="266"
            rx="104"
            ry="12"
            fill="url(#dm-ground)"
          />

          <!-- Net hanging cord -->
          <path class="net__cord" d="M160 76 V100" />
          <circle class="net__ring" cx="160" cy="76" r="4" />

          <!-- Bed and sleeper, seen through the net -->
          <g class="bed">
            <rect x="94" y="243" width="8" height="21" rx="4" fill="#adb4d2" />
            <rect x="222" y="243" width="8" height="21" rx="4" fill="#adb4d2" />
            <rect
              x="86"
              y="233"
              width="148"
              height="10"
              rx="5"
              fill="url(#dm-frame)"
            />
            <rect
              x="80"
              y="170"
              width="12"
              height="66"
              rx="6"
              fill="url(#dm-frame)"
            />
            <rect x="90" y="212" width="146" height="23" rx="10" fill="#eff0f3" />
            <rect
              x="100"
              y="199"
              width="41"
              height="14"
              rx="7"
              fill="#ffffff"
              stroke="#e3e6ef"
              transform="rotate(-4 120 206)"
            />
            <circle cx="122" cy="194" r="9" fill="#f2c9a0" />
            <path
              d="M113 191 C115 183 126 182 130 189"
              fill="none"
              stroke="#5b3a24"
              stroke-width="3"
              stroke-linecap="round"
            />
            <path
              d="M131 213 C143 196 158 190 177 194 C200 199 219 206 233 213 L233 228 L131 228 Z"
              fill="url(#dm-blanket)"
            />
            <path
              d="M133 215 C153 206 211 206 232 216"
              fill="none"
              stroke="rgba(255, 255, 255, 0.5)"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <g class="zzz" fill="#9299b8">
              <text x="132" y="187" font-size="7">z</text>
              <text x="141" y="178" font-size="9">z</text>
              <text x="151" y="168" font-size="12">z</text>
            </g>
          </g>
          <!-- The protective net -->
          <g class="net">
            <path
              class="net__fill"
              d="M70 238 V150 C70 132 82 120 102 114 L160 100 L218 114 C238 120 250 132 250 150 V238 Z"
              fill="url(#dm-net-fill)"
            />
            <path
              class="net__mesh"
              d="M70 238 V150 C70 132 82 120 102 114 L160 100 L218 114 C238 120 250 132 250 150 V238 Z"
              fill="url(#dm-net-mesh)"
            />
            <g clip-path="url(#dm-net-clip)">
              <rect
                class="net__shimmer"
                x="-80"
                y="90"
                width="58"
                height="160"
                fill="url(#dm-shimmer)"
                transform="skewX(-12)"
              />
            </g>
            <path
              class="net__seam"
              d="M110 112.5 V238 M160 100 V238 M210 112.5 V238"
            />
            <path class="net__seam net__seam--soft" d="M70 166 H250 M70 214 H250" />
            <path class="net__zip" d="M160 104 V232" />
            <circle class="net__zip-pull" cx="160" cy="229" r="3.4" />
            <path
              class="net__outline"
              d="M70 238 V150 C70 132 82 120 102 114 L160 100 L218 114 C238 120 250 132 250 150 V238 Z"
              fill="none"
              stroke="url(#dm-net-line)"
              stroke-width="2.4"
              stroke-linejoin="round"
            />
          </g>

          <!-- Mosquitoes bounce off the mesh, never getting in -->
          <g class="mosquito mosquito--left" transform="translate(22 190)">
            <g class="mosquito__flight">
              <g class="mosquito__figure">
                <g class="mosquito__wings">
                  <ellipse
                    cx="-1"
                    cy="-6"
                    rx="9"
                    ry="3.4"
                    fill="rgba(32, 201, 151, 0.3)"
                    stroke="rgba(12, 171, 124, 0.25)"
                    stroke-width="0.6"
                    transform="rotate(-24 -1 -6)"
                  />
                  <ellipse
                    cx="5"
                    cy="-5"
                    rx="7.5"
                    ry="3"
                    fill="rgba(146, 153, 184, 0.28)"
                    stroke="rgba(12, 171, 124, 0.25)"
                    stroke-width="0.6"
                    transform="rotate(22 5 -5)"
                  />
                </g>
                <ellipse cx="0" cy="0" rx="7" ry="3" fill="#0cab7c" />
                <circle cx="7" cy="0" r="2" fill="#087f5b" />
                <path
                  d="M9 0.6 L15 1.4"
                  stroke="#0cab7c"
                  stroke-width="1.2"
                  stroke-linecap="round"
                />
                <path
                  d="M-4 1.6 L-9 7 M-2 2.4 L-4 9 M1 2.4 L3 9 M4 1.6 L10 6"
                  fill="none"
                  stroke="#0cab7c"
                  stroke-width="1"
                  stroke-linecap="round"
                />
              </g>
            </g>
          </g>

          <g class="mosquito mosquito--right" transform="translate(298 150)">
            <g class="mosquito__flight">
              <g class="mosquito__flip" transform="scale(-1 1)">
                <g class="mosquito__figure">
                  <g class="mosquito__wings">
                    <ellipse
                      cx="-1"
                      cy="-6"
                      rx="9"
                      ry="3.4"
                      fill="rgba(32, 201, 151, 0.3)"
                      stroke="rgba(12, 171, 124, 0.25)"
                      stroke-width="0.6"
                      transform="rotate(-24 -1 -6)"
                    />
                    <ellipse
                      cx="5"
                      cy="-5"
                      rx="7.5"
                      ry="3"
                      fill="rgba(146, 153, 184, 0.28)"
                      stroke="rgba(12, 171, 124, 0.25)"
                      stroke-width="0.6"
                      transform="rotate(22 5 -5)"
                    />
                  </g>
                  <ellipse cx="0" cy="0" rx="7" ry="3" fill="#0cab7c" />
                  <circle cx="7" cy="0" r="2" fill="#087f5b" />
                  <path
                    d="M9 0.6 L15 1.4"
                    stroke="#0cab7c"
                    stroke-width="1.2"
                    stroke-linecap="round"
                  />
                  <path
                    d="M-4 1.6 L-9 7 M-2 2.4 L-4 9 M1 2.4 L3 9 M4 1.6 L10 6"
                    fill="none"
                    stroke="#0cab7c"
                    stroke-width="1"
                    stroke-linecap="round"
                  />
                </g>
              </g>
            </g>
          </g>

          <!-- Impact ripples where the mosquitoes hit the net -->
          <g transform="translate(70 190)">
            <g class="net-impact net-impact--left">
              <circle r="4" />
              <circle class="net-impact__outer" r="8" />
            </g>
          </g>
          <g transform="translate(250 150)">
            <g class="net-impact net-impact--right">
              <circle r="4" />
              <circle class="net-impact__outer" r="8" />
            </g>
          </g>

        </svg>
      </div>

      <p class="eyebrow">
        <span class="eyebrow__dot" aria-hidden="true"></span>
        Malaria Free Kenya
      </p>

      <h1 class="headline">
        <span class="headline__accent">Scheduled Maintenance</span>
      </h1>

      <!-- <ul class="promises" aria-label="What we are protecting">
        <li>
          <strong>18</strong>
          <span>counties connected</span>
        </li>
        <li>
          <strong>100%</strong>
          <span>data kept safe</span>
        </li>
        <li>
          <strong>0</strong>
          <span>action needed</span>
        </li>
      </ul> -->

      <div class="status">
        <div class="status__line" role="status">
          <span
            class="status__pulse"
            :class="{ 'status__pulse--checking': checking }"
            aria-hidden="true"
          ></span>
          <span>Platform upgrade in progress</span>
        </div>
        <div class="status__bar" aria-hidden="true"><span></span></div>
        <p class="status__hint">
          {{
            checking
              ? "Checking platform status…"
              : `This screen re-checks automatically every ${pollSeconds} seconds. For your security, cached session data is cleared, you'll sign in again when we're back.`
          }}
        </p>
      </div>
    </main>

    <footer class="screen-footer">
      <span class="screen-footer__brand">DigiMal-KE</span>
      <span class="screen-footer__dot" aria-hidden="true"></span>
      <span>Towards a malaria-free Kenya</span>
    </footer>
  </div>
</template>

<script>
/**
 * Standalone maintenance takeover rendered by App.vue whenever APP_STATE
 * resolves to `maintenance`. Deliberately contains NO buttons, links, forms or
 * other interactive elements: while maintenance is active there is no action a
 * user can take, including logging in.
 *
 * `checking`     – true while App.vue is re-probing APP_STATE
 * `pollSeconds`  – cadence of those automatic re-probes (display only)
 */
const particles = [
  { left: "8%", top: "18%", size: 4, delay: "0s", duration: "12s" },
  { left: "16%", top: "68%", size: 3, delay: "-4s", duration: "14s" },
  { left: "24%", top: "38%", size: 5, delay: "-8s", duration: "16s" },
  { left: "33%", top: "82%", size: 3, delay: "-2s", duration: "11s" },
  { left: "41%", top: "12%", size: 4, delay: "-6s", duration: "15s" },
  { left: "52%", top: "72%", size: 3, delay: "-10s", duration: "13s" },
  { left: "61%", top: "28%", size: 5, delay: "-3s", duration: "17s" },
  { left: "69%", top: "84%", size: 4, delay: "-7s", duration: "12s" },
  { left: "76%", top: "46%", size: 3, delay: "-11s", duration: "15s" },
  { left: "84%", top: "20%", size: 4, delay: "-5s", duration: "14s" },
  { left: "91%", top: "62%", size: 3, delay: "-9s", duration: "16s" },
  { left: "12%", top: "90%", size: 2.5, delay: "-12s", duration: "13s" },
  { left: "47%", top: "48%", size: 2.5, delay: "-1s", duration: "18s" },
  { left: "58%", top: "6%", size: 3, delay: "-13s", duration: "14s" },
  { left: "88%", top: "88%", size: 4, delay: "-4.5s", duration: "12.5s" },
  { left: "3%", top: "52%", size: 3, delay: "-8.5s", duration: "15.5s" },
];

export default {
  name: "Maintenance",
  props: {
    // True while App.vue re-probes APP_STATE in the background.
    checking: {
      type: Boolean,
      default: false,
    },
    // Displayed to explain the automatic recovery check.
    pollSeconds: {
      type: Number,
      default: 30,
    },
  },
  setup() {
    return { particles };
  },
};
</script>


<style scoped>
/* ─────────────────────────────────────────────────────────────────────────
   Towards a Malaria-free Kenya — maintenance takeover
   A self-contained screen (no Ant Design theme, no layout) so it renders
   identically whether App.vue gates the router or /maintenance is visited
   directly.
   ───────────────────────────────────────────────────────────────────────── */
.maintenance-screen {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 48px 24px;
  overflow-x: hidden;
  overflow-y: auto;
  text-align: center;
  color: #272b41;
  background:
    radial-gradient(circle at 12% 18%, rgba(32, 201, 151, 0.13), transparent 46%),
    radial-gradient(circle at 88% 12%, rgba(32, 201, 151, 0.1), transparent 42%),
    radial-gradient(circle at 50% 112%, rgba(32, 201, 151, 0.15), transparent 58%),
    linear-gradient(180deg, #eef2f1 0%, #e8ecf0 100%);
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

/* Soft moving light pools behind the card. */
.aurora {
  position: fixed;
  z-index: -2;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.55;
  pointer-events: none;
  animation: dm-drift 18s ease-in-out infinite alternate;
}
.aurora--one {
  top: -190px;
  left: -150px;
  width: 540px;
  height: 540px;
  background: rgba(32, 201, 151, 0.22);
}
.aurora--two {
  right: -190px;
  bottom: -270px;
  width: 640px;
  height: 640px;
  background: rgba(32, 201, 151, 0.16);
  animation-delay: -7s;
}

/* Mosquito-net mesh drifting across the background. */
.net-mesh {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image:
    repeating-linear-gradient(
      45deg,
      rgba(32, 201, 151, 0.08) 0 1px,
      transparent 1px 26px
    ),
    repeating-linear-gradient(
      -45deg,
      rgba(32, 201, 151, 0.08) 0 1px,
      transparent 1px 26px
    );
  -webkit-mask-image: radial-gradient(
    circle at 50% 42%,
    #000 0%,
    transparent 74%
  );
  mask-image: radial-gradient(circle at 50% 42%, #000 0%, transparent 74%);
  animation: dm-mesh-drift 32s linear infinite;
}

.particles {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}
.particle {
  position: absolute;
  border-radius: 50%;
  opacity: 0;
  background: rgba(32, 201, 151, 0.55);
  box-shadow: 0 0 12px rgba(32, 201, 151, 0.35);
  animation-name: dm-float;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

/* ── Card ─────────────────────────────────────────────────────────────── */
.maintenance-card {
  position: relative;
  width: min(780px, 100%);
  padding: clamp(28px, 5vw, 56px) clamp(22px, 5vw, 64px);
  border: 1px solid #e3e6ef;
  border-radius: 16px;
  background: #ffffff;
  box-shadow:
    0 5px 20px rgba(146, 153, 184, 0.12),
    0 18px 50px rgba(146, 153, 184, 0.08);
  animation: dm-card-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.maintenance-card::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 4px;
  border-radius: inherit;
  background: linear-gradient(90deg, #20c997 0%, #17a589 100%);
}

/* ── Brand row ────────────────────────────────────────────────────────── */
.brand {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: center;
  margin-bottom: clamp(16px, 3vw, 26px);
  color: #272b41;
}
.brand__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  color: #20c997;
  border: 1px solid #b7ebd5;
  border-radius: 12px;
  background: #f0fdf9;
  box-shadow: 0 2px 6px rgba(32, 201, 151, 0.08);
}
.brand__name {
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: #272b41;
}
.brand__name span {
  color: #20c997;
}
.brand__rule {
  width: 1px;
  height: 20px;
  background: #e3e6ef;
}
.brand__tagline {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #9299b8;
}

/* ── Animated emblem ──────────────────────────────────────────────────── */
.emblem {
  position: relative;
  width: clamp(210px, 30vw, 270px);
  margin: 4px auto 8px;
  animation: dm-emblem-in 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
}
.emblem__svg {
  display: block;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 10px 24px rgba(32, 201, 151, 0.12));
}
.emblem__halo {
  transform-box: fill-box;
  transform-origin: center;
  animation: dm-breathe 4.6s ease-in-out infinite;
}
.orbit {
  fill: none;
  stroke: rgba(32, 201, 151, 0.28);
  stroke-width: 1.2;
  stroke-dasharray: 2 10;
  transform-box: view-box;
  transform-origin: 160px 155px;
}
.orbit--outer {
  animation: dm-spin 34s linear infinite;
}
.orbit--inner {
  opacity: 0.55;
  stroke-dasharray: 1 14;
  animation: dm-spin 24s linear infinite reverse;
}
.orbit__sparks {
  fill: #20c997;
  filter: drop-shadow(0 0 6px rgba(32, 201, 151, 0.4));
  transform-box: view-box;
  transform-origin: 160px 155px;
  animation: dm-spin 34s linear infinite;
}
/* ── Bed + protective net scene ───────────────────────────────────────── */
.scene__ground {
  transform-box: fill-box;
  transform-origin: center;
  animation: dm-breathe 5.4s ease-in-out infinite;
}
.net__cord {
  fill: none;
  stroke: rgba(12, 171, 124, 0.45);
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-dasharray: 3 4;
}
.net__ring {
  fill: none;
  stroke: #20c997;
  stroke-width: 1.6;
}
.net__fill {
  animation: dm-net-glow 4.6s ease-in-out infinite;
}
.net__mesh {
  opacity: 0.8;
}
.net__outline {
  filter: drop-shadow(0 0 8px rgba(32, 201, 151, 0.35));
}
.net__seam {
  fill: none;
  stroke: rgba(12, 171, 124, 0.3);
  stroke-width: 1;
  stroke-linecap: round;
}
.net__seam--soft {
  stroke: rgba(12, 171, 124, 0.12);
}
.net__zip {
  fill: none;
  stroke: rgba(12, 171, 124, 0.45);
  stroke-width: 1.2;
  stroke-dasharray: 2 3;
}
.net__zip-pull {
  fill: #20c997;
}
.net__shimmer {
  animation: dm-shimmer 7s ease-in-out infinite;
}
.zzz {
  font-family: "Inter", sans-serif;
  font-weight: 700;
  animation: dm-zzz 3.4s ease-in-out infinite;
}

/* ── Mosquitoes: fly in, bounce off, never get through ────────────────── */
.mosquito--left .mosquito__flight {
  animation: dm-mosquito-left 4.8s ease-in-out infinite;
  animation-delay: -1.2s;
}
.mosquito--right .mosquito__flight {
  animation: dm-mosquito-right 5.6s ease-in-out infinite;
  animation-delay: -2.4s;
}
.mosquito__figure {
  transform-box: fill-box;
  transform-origin: center;
  animation: dm-mosquito-bob 1.1s ease-in-out infinite;
}
.mosquito--right .mosquito__figure {
  animation-delay: -0.4s;
}
.mosquito__wings {
  transform-box: fill-box;
  transform-origin: center;
  animation: dm-wing-flap 0.14s linear infinite;
}
.mosquito--right .mosquito__wings {
  animation-delay: -0.07s;
}
.net-impact {
  fill: none;
  stroke: #fa8b0c;
  stroke-width: 1.6;
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
}
.net-impact__outer {
  stroke: rgba(250, 139, 12, 0.45);
  stroke-width: 1;
}
.net-impact--left {
  animation: dm-net-hit 4.8s ease-out infinite;
  animation-delay: -1.2s;
}
.net-impact--right {
  animation: dm-net-hit 5.6s ease-out infinite;
  animation-delay: -2.4s;
}
.emblem__caption {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  white-space: nowrap;
  color: #0cab7c;
}



/* ── Copy ─────────────────────────────────────────────────────────────── */
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin: 0 0 16px;
  padding: 9px 20px;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #0cab7c;
  border: 1px solid rgba(32, 201, 151, 0.35);
  border-radius: 999px;
  background: linear-gradient(
    100deg,
    rgba(32, 201, 151, 0.12) 0%,
    rgba(32, 201, 151, 0.05) 100%
  );
  box-shadow: 0 4px 12px rgba(32, 201, 151, 0.1);
  animation:
    dm-rise 0.7s ease-out 0.2s both,
    dm-badge-glow 3.2s ease-in-out 1s infinite;
}
.eyebrow__dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #20c997;
  animation: dm-status-pulse 2s ease-out infinite;
}
.headline {
  margin: 0;
  font-size: clamp(2.15rem, 5.4vw, 3.6rem);
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.035em;
  color: #272b41;
  text-wrap: balance;
  animation: dm-rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
}
.headline__accent {
  display: block;
  padding-bottom: 0.08em;
  margin-top: 0.08em;
  background: linear-gradient(
    100deg,
    #a85a00 0%,
    #b45309 25%,
    #d47407 55%,
    #b45309 80%,
    #a85a00 100%
  );
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 8px 24px rgba(32, 201, 151, 0.22));
  animation: dm-shine 9s linear infinite;
}
.lede {
  max-width: 560px;
  margin: clamp(16px, 3vw, 24px) auto 0;
  font-size: clamp(0.95rem, 1.6vw, 1.06rem);
  line-height: 1.75;
  color: #5a5f7d;
  text-wrap: pretty;
  animation: dm-rise 0.8s ease-out 0.45s both;
}
.lede strong {
  font-weight: 600;
  color: #0cab7c;
}

/* ── Three promises ───────────────────────────────────────────────────── */
.promises {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding: 0;
  margin: clamp(22px, 4vw, 32px) 0 0;
  list-style: none;
  animation: dm-rise 0.8s ease-out 0.55s both;
}
.promises li {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 14px 10px;
  border: 1px solid #e3e6ef;
  border-radius: 10px;
  background: #f8f9fb;
}
.promises strong {
  font-size: clamp(1.1rem, 2.4vw, 1.35rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #0cab7c;
}
.promises span {
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #9299b8;
}

/* ── Auto-recovery status ─────────────────────────────────────────────── */
.status {
  margin-top: clamp(22px, 4vw, 30px);
  animation: dm-rise 0.8s ease-out 0.65s both;
}
.status__line {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5a5f7d;
}
.status__pulse {
  position: relative;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #20c997;
  transition: background-color 0.3s ease;
}
.status__pulse--checking {
  background: #fa8b0c;
}
.status__pulse::after {
  content: "";
  position: absolute;
  inset: -5px;
  border: 1px solid rgba(32, 201, 151, 0.5);
  border-radius: 50%;
  animation: dm-halo-pulse 1.8s ease-out infinite;
}
.status__pulse--checking::after {
  border-color: rgba(250, 139, 12, 0.5);
}
.status__bar {
  position: relative;
  max-width: 340px;
  height: 6px;
  margin: 16px auto 12px;
  overflow: hidden;
  border-radius: 999px;
  background: #eff0f3;
}
.status__bar span {
  position: absolute;
  inset-block: 0;
  width: 42%;
  border-radius: inherit;
  background: linear-gradient(90deg, #20c997, #fa8b0c);
  box-shadow: 0 0 12px rgba(32, 201, 151, 0.35);
  animation: dm-progress 2.4s ease-in-out infinite;
}
.status__hint {
  margin: 0;
  font-size: 0.76rem;
  color: #9299b8;
}

/* ── Footer ───────────────────────────────────────────────────────────── */
.screen-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: center;
  margin-top: clamp(24px, 4vw, 36px);
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #9299b8;
  animation: dm-rise 0.8s ease-out 0.8s both;
}
.screen-footer__brand {
  font-weight: 800;
  letter-spacing: 0.16em;
  color: #5a5f7d;
}
.screen-footer__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #20c997;
}

/* ── Small screens ────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .maintenance-screen {
    padding: 28px 16px;
  }
  .maintenance-card {
    border-radius: 14px;
  }
  .brand__rule,
  .brand__tagline {
    display: none;
  }
  .emblem {
    width: 200px;
  }
  .promises {
    grid-template-columns: 1fr;
  }
  .promises li {
    flex-direction: row;
    gap: 8px;
    align-items: baseline;
    justify-content: center;
    padding: 10px;
  }
  .promises span {
    font-size: 0.62rem;
  }
}


/* ── Motion ───────────────────────────────────────────────────────────── */
@keyframes dm-card-in {
  from {
    opacity: 0;
    transform: translateY(28px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes dm-rise {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes dm-emblem-in {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.86);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes dm-drift {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(40px, -30px, 0) scale(1.12);
  }
}

@keyframes dm-mesh-drift {
  to {
    background-position: 52px 52px, -52px 52px;
  }
}

@keyframes dm-float {
  0% {
    opacity: 0;
    transform: translate3d(0, 20px, 0) scale(0.6);
  }
  15% {
    opacity: 0.8;
  }
  85% {
    opacity: 0.35;
  }
  100% {
    opacity: 0;
    transform: translate3d(18px, -70px, 0) scale(1);
  }
}

@keyframes dm-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes dm-breathe {
  0%,
  100% {
    opacity: 0.75;
    transform: scale(0.97);
  }
  50% {
    opacity: 1;
    transform: scale(1.03);
  }
}

@keyframes dm-net-glow {
  0%,
  100% {
    opacity: 0.72;
  }
  50% {
    opacity: 1;
  }
}

@keyframes dm-shimmer {
  0% {
    transform: translateX(0);
  }
  55%,
  100% {
    transform: translateX(420px);
  }
}

@keyframes dm-zzz {
  0%,
  100% {
    opacity: 0.35;
    transform: translateY(2px);
  }
  50% {
    opacity: 0.95;
    transform: translateY(-3px);
  }
}

@keyframes dm-mosquito-left {
  0% {
    opacity: 0;
    transform: translate(-20px, 12px) rotate(7deg);
  }
  10% {
    opacity: 1;
  }
  36% {
    opacity: 1;
    transform: translate(30px, 0) rotate(2deg);
  }
  42% {
    transform: translate(34px, -2px) rotate(-9deg);
  }
  50% {
    transform: translate(18px, -14px) rotate(-17deg);
  }
  68% {
    opacity: 1;
    transform: translate(-8px, -22px) rotate(-6deg);
  }
  100% {
    opacity: 0;
    transform: translate(-20px, 12px) rotate(7deg);
  }
}

@keyframes dm-mosquito-right {
  0% {
    opacity: 0;
    transform: translate(12px, 10px) rotate(-5deg);
  }
  10% {
    opacity: 1;
  }
  36% {
    opacity: 1;
    transform: translate(-30px, 2px) rotate(2deg);
  }
  42% {
    transform: translate(-34px, 0) rotate(9deg);
  }
  50% {
    transform: translate(-18px, -12px) rotate(17deg);
  }
  68% {
    opacity: 1;
    transform: translate(4px, -20px) rotate(6deg);
  }
  100% {
    opacity: 0;
    transform: translate(12px, 10px) rotate(-5deg);
  }
}

@keyframes dm-mosquito-bob {
  0%,
  100% {
    transform: translateY(-1px) rotate(-2deg);
  }
  50% {
    transform: translateY(1px) rotate(2deg);
  }
}

@keyframes dm-wing-flap {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.3);
  }
}

@keyframes dm-net-hit {
  0%,
  32% {
    opacity: 0;
    transform: scale(0.4);
  }
  40% {
    opacity: 0.9;
    transform: scale(0.85);
  }
  52% {
    opacity: 0;
    transform: scale(1.6);
  }
  100% {
    opacity: 0;
    transform: scale(0.4);
  }
}

@keyframes dm-shine {
  to {
    background-position: 220% center;
  }
}

@keyframes dm-progress {
  0% {
    transform: translateX(-115%);
  }
  100% {
    transform: translateX(255%);
  }
}

@keyframes dm-halo-pulse {
  0% {
    opacity: 1;
    transform: scale(0.6);
  }
  100% {
    opacity: 0;
    transform: scale(1.25);
  }
}

@keyframes dm-badge-glow {
  0%,
  100% {
    box-shadow: 0 4px 12px rgba(32, 201, 151, 0.1);
  }
  50% {
    box-shadow:
      0 4px 18px rgba(32, 201, 151, 0.2),
      0 0 0 1px rgba(250, 139, 12, 0.05);
  }
}

@keyframes dm-status-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(32, 201, 151, 0.55);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(32, 201, 151, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(32, 201, 151, 0);
  }
}

/* Respect users who prefer a still page. */
@media (prefers-reduced-motion: reduce) {
  .maintenance-screen *,
  .maintenance-screen *::before,
  .maintenance-screen *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
</style>

