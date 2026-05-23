/**
 * shared-nav.js
 * Injects the global header (nav bar), mobile menu, music sidebar,
 * floating "Study Beats" button, page overlay, and all associated
 * CSS + JS logic into every sub-page.
 *
 * Usage: add  <script src="../shared-nav.js"></script>  before </body>
 *        (adjust path for deeper directories)
 */
(function () {
  'use strict';

  // ── Detect base path (how many folders deep we are from root) ──
  const depth = (function () {
    const scripts = document.querySelectorAll('script[src*="shared-nav"]');
    for (const s of scripts) {
      const src = s.getAttribute('src') || '';
      const ups = (src.match(/\.\.\//g) || []).length;
      if (ups > 0) return '../'.repeat(ups);
    }
    // fallback: try to guess from location
    const pathParts = location.pathname.replace(/\/[^/]*\.html$/i, '').split('/').filter(Boolean);
    // root pages won't use this script normally; assume 1 level deep
    return '../';
  })();

  // ── Inject Google Fonts needed by the nav (if not already loaded) ──
  if (!document.querySelector('link[href*="Playfair+Display"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }
  // also preconnect
  ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'].forEach(origin => {
    if (!document.querySelector(`link[href="${origin}"]`)) {
      const l = document.createElement('link');
      l.rel = 'preconnect';
      l.href = origin;
      if (origin.includes('gstatic')) l.crossOrigin = '';
      document.head.appendChild(l);
    }
  });

  // ── CSS ──────────────────────────────────────────────────────────
  const css = `
/* ══════════════════════════════════════════
   SHARED NAV — INJECTED STYLES
══════════════════════════════════════════ */
:root {
  --snav-bg:          #F7F6F2;
  --snav-bg2:         #EDEAE3;
  --snav-surface:     #FFFFFF;
  --snav-surface2:    #F0EDE8;
  --snav-fg:          #1A1927;
  --snav-fg-muted:    #6B7280;
  --snav-accent:      #4F46E5;
  --snav-accent2:     #7C3AED;
  --snav-border:      rgba(0,0,0,0.09);
  --snav-shadow:      0 4px 24px rgba(0,0,0,0.07);
  --snav-shadow-lg:   0 20px 60px rgba(0,0,0,0.13);
  --snav-radius:      16px;
  --snav-nav-h:       68px;
  --snav-sidebar-w:   320px;
  --snav-t:           0.32s cubic-bezier(0.4,0,0.2,1);
}
[data-theme="dark"] {
  --snav-bg:          #09090F;
  --snav-bg2:         #111118;
  --snav-surface:     #141420;
  --snav-surface2:    #1C1C2A;
  --snav-fg:          #EEEEF5;
  --snav-fg-muted:    #9CA3AF;
  --snav-accent:      #818CF8;
  --snav-accent2:     #A78BFA;
  --snav-border:      rgba(255,255,255,0.07);
  --snav-shadow:      0 4px 24px rgba(0,0,0,0.45);
  --snav-shadow-lg:   0 20px 60px rgba(0,0,0,0.65);
}

/* Icon helpers */
.sn-icon { display: inline-block; vertical-align: middle; flex-shrink: 0; }
.sn-icon-sm { width: 16px; height: 16px; }
.sn-icon-md { width: 20px; height: 20px; }
.sn-icon-lg { width: 24px; height: 24px; }

/* ── NAV BAR ── */
nav#sn-main-nav {
  position: fixed; top: 0; left: 0; right: 0;
  height: var(--snav-nav-h);
  z-index: 9000;
  display: flex; align-items: center;
  padding: 0 28px;
  background: rgba(247,246,242,0.88);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border-bottom: 1px solid var(--snav-border);
  transition: background var(--snav-t), box-shadow var(--snav-t);
  font-family: 'Sora', sans-serif;
}
[data-theme="dark"] nav#sn-main-nav { background: rgba(9,9,15,0.88); }
nav#sn-main-nav.scrolled { box-shadow: 0 2px 24px rgba(0,0,0,0.09); }

.sn-nav-brand {
  font-family: 'Playfair Display', serif;
  font-weight: 900; font-size: 1.15rem;
  color: var(--snav-fg);
  white-space: nowrap; margin-right: 28px;
  display: flex; align-items: center; gap: 10px;
  flex-shrink: 0; text-decoration: none;
}
.sn-nav-brand .sn-brand-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--snav-accent);
  animation: sn-pulse-dot 2s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes sn-pulse-dot {
  0%,100% { transform: scale(1); opacity:1; }
  50%     { transform: scale(1.55); opacity:0.6; }
}

.sn-nav-links {
  display: flex; align-items: center; gap: 2px;
  flex: 1;
}
.sn-nav-item { position: relative; }
.sn-nav-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 12px; border-radius: 10px;
  font-family: 'Sora', sans-serif; font-size: 0.8rem; font-weight: 500;
  color: var(--snav-fg-muted); background: transparent;
  border: none; cursor: pointer;
  transition: all 0.18s ease; white-space: nowrap;
}
.sn-nav-btn:hover { color: var(--snav-fg); background: var(--snav-surface2); }
.sn-nav-btn.active { color: var(--snav-accent); background: rgba(79,70,229,0.08); }
.sn-nav-btn .sn-chev { transition: transform 0.2s ease; }
.sn-nav-item:hover .sn-chev,
.sn-nav-item.open .sn-chev { transform: rotate(180deg); }

/* MEGA MENU */
.sn-mega-menu {
  position: absolute; top: calc(100% + 10px); left: 50%;
  transform: translateX(-50%) translateY(-6px);
  min-width: 230px;
  background: var(--snav-surface);
  border: 1px solid var(--snav-border);
  border-radius: var(--snav-radius);
  box-shadow: var(--snav-shadow-lg);
  padding: 6px;
  opacity: 0; pointer-events: none;
  transition: all 0.2s ease;
  z-index: 9001;
}
.sn-nav-item:hover .sn-mega-menu,
.sn-nav-item.open .sn-mega-menu {
  opacity: 1; pointer-events: all;
  transform: translateX(-50%) translateY(0);
}
.sn-mega-menu-header {
  padding: 8px 10px 6px;
  font-size: 0.68rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--snav-fg-muted);
  border-bottom: 1px solid var(--snav-border);
  margin-bottom: 4px;
}
.sn-mega-menu a {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 10px; border-radius: 10px;
  font-size: 0.82rem; font-weight: 400;
  color: var(--snav-fg-muted);
  transition: all 0.14s ease;
  text-decoration: none;
}
.sn-mega-menu a:hover { color: var(--snav-fg); background: var(--snav-surface2); }
.sn-page-icon {
  width: 28px; height: 28px; border-radius: 8px;
  background: var(--snav-surface2); display: flex;
  align-items: center; justify-content: center;
  flex-shrink: 0; transition: transform 0.18s;
}
.sn-mega-menu a:hover .sn-page-icon { transform: scale(1.1); }

/* NAV RIGHT */
.sn-nav-right {
  display: flex; align-items: center; gap: 8px;
  margin-left: auto; flex-shrink: 0;
}
.sn-icon-btn {
  width: 40px; height: 40px; border-radius: 10px;
  background: var(--snav-surface2); border: 1px solid var(--snav-border);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: var(--snav-fg); transition: all 0.18s ease;
  flex-shrink: 0;
}
.sn-icon-btn:hover { transform: scale(1.06); background: var(--snav-surface); }
.sn-hamburger-btn { display: none; }

/* ── MOBILE MENU ── */
#sn-mobile-menu {
  position: fixed; top: 0; left: 0;
  width: min(300px, 85vw); height: 100dvh;
  background: var(--snav-surface);
  border-right: 1px solid var(--snav-border);
  box-shadow: var(--snav-shadow-lg);
  z-index: 9101;
  display: flex; flex-direction: column;
  transform: translateX(-100%);
  transition: transform 0.36s cubic-bezier(0.4,0,0.2,1);
  overflow-y: auto; overflow-x: hidden;
  font-family: 'Sora', sans-serif;
}
#sn-mobile-menu.open { transform: translateX(0); }
.sn-mob-menu-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 18px 16px;
  border-bottom: 1px solid var(--snav-border);
  flex-shrink: 0;
}
.sn-mob-menu-brand {
  font-family: 'Playfair Display', serif;
  font-weight: 900; font-size: 1rem;
  display: flex; align-items: center; gap: 8px;
}
.sn-mob-close {
  width: 34px; height: 34px; border-radius: 8px;
  background: var(--snav-surface2); border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--snav-fg-muted); transition: all 0.18s;
}
.sn-mob-close:hover { color: var(--snav-fg); background: var(--snav-bg2); }
.sn-mob-nav {
  flex: 1; padding: 8px 8px;
}
.sn-mob-home-link {
  display: flex; align-items: center; gap: 10px;
  padding: 11px 12px; border-radius: 10px;
  font-size: 0.85rem; font-weight: 600; color: var(--snav-accent);
  background: rgba(79,70,229,0.08); margin-bottom: 4px;
  cursor: pointer; border: none; width: 100%;
  font-family: 'Sora', sans-serif;
  text-align: left; text-decoration: none;
}
.sn-mob-subject { margin-bottom: 2px; }
.sn-mob-subject-btn {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; padding: 10px 12px; border-radius: 10px;
  font-size: 0.82rem; font-weight: 600; color: var(--snav-fg-muted);
  background: transparent; border: none; cursor: pointer;
  font-family: 'Sora', sans-serif; transition: all 0.15s;
}
.sn-mob-subject-btn:hover { color: var(--snav-fg); background: var(--snav-surface2); }
.sn-mob-subject-btn .sn-left { display: flex; align-items: center; gap: 8px; }
.sn-mob-subject-btn .sn-mob-chev { transition: transform 0.2s ease; }
.sn-mob-subject.open .sn-mob-chev { transform: rotate(180deg); }
.sn-mob-sub-links {
  display: none; padding: 2px 0 2px 12px;
}
.sn-mob-subject.open .sn-mob-sub-links { display: block; }
.sn-mob-sub-links a {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 10px; border-radius: 8px;
  font-size: 0.78rem; font-weight: 400; color: var(--snav-fg-muted);
  transition: all 0.14s ease; text-decoration: none;
}
.sn-mob-sub-links a:hover { color: var(--snav-fg); background: var(--snav-surface2); }
.sn-mob-footer-actions {
  padding: 14px; border-top: 1px solid var(--snav-border);
  display: flex; gap: 8px; flex-shrink: 0;
}
.sn-mob-footer-actions .sn-icon-btn { flex: 1; border-radius: 10px; height: 42px; }

/* PAGE OVERLAY */
#sn-page-overlay {
  position: fixed; inset: 0;
  z-index: 9099;
  background: rgba(0,0,0,0.38);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  opacity: 0; pointer-events: none;
  transition: opacity 0.3s ease;
}
#sn-page-overlay.open { opacity: 1; pointer-events: all; }

/* ── MUSIC SIDEBAR ── */
#sn-music-sidebar {
  position: fixed; top: 0; right: 0;
  width: var(--snav-sidebar-w); height: 100dvh;
  z-index: 9102;
  transform: translateX(100%);
  transition: transform 0.38s cubic-bezier(0.4,0,0.2,1);
  display: flex; flex-direction: column;
  background: var(--snav-surface);
  border-left: 1px solid var(--snav-border);
  box-shadow: -8px 0 40px rgba(0,0,0,0.12);
  font-family: 'Sora', sans-serif;
}
#sn-music-sidebar.open { transform: translateX(0); }

.sn-sidebar-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 18px 14px;
  border-bottom: 1px solid var(--snav-border); flex-shrink: 0;
}
.sn-sidebar-title {
  font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 700;
  display: flex; align-items: center; gap: 10px;
}
.sn-sidebar-close {
  width: 32px; height: 32px; border-radius: 8px;
  background: var(--snav-surface2); border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--snav-fg-muted); transition: all 0.18s;
}
.sn-sidebar-close:hover { color: var(--snav-fg); background: var(--snav-bg2); }

.sn-player-section {
  padding: 16px 16px 14px;
  border-bottom: 1px solid var(--snav-border); flex-shrink: 0;
}
.sn-now-playing-label {
  font-size: 0.67rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--snav-accent); margin-bottom: 7px;
  display: flex; align-items: center; gap: 6px;
}
.sn-track-display {
  font-size: 0.82rem; font-weight: 600; color: var(--snav-fg);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  margin-bottom: 12px;
}
.sn-progress-wrap {
  width: 100%; height: 4px; background: var(--snav-surface2);
  border-radius: 2px; cursor: pointer; margin-bottom: 5px;
}
.sn-progress-bar {
  height: 100%; border-radius: 2px;
  background: linear-gradient(90deg, var(--snav-accent), var(--snav-accent2));
  width: 0%; transition: width 0.2s linear;
}
.sn-time-display {
  display: flex; justify-content: space-between;
  font-size: 0.67rem; color: var(--snav-fg-muted);
  font-family: 'JetBrains Mono', monospace; margin-bottom: 12px;
}
.sn-player-controls {
  display: flex; align-items: center; justify-content: center; gap: 10px;
}
.sn-ctrl-btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--snav-surface2); border: 1px solid var(--snav-border);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: var(--snav-fg-muted); transition: all 0.18s ease;
}
.sn-ctrl-btn:hover { color: var(--snav-fg); background: var(--snav-bg2); transform: scale(1.06); }
.sn-ctrl-btn.sn-play-btn {
  width: 48px; height: 48px;
  background: var(--snav-accent); color: white; border-color: var(--snav-accent);
}
.sn-ctrl-btn.sn-play-btn:hover { transform: scale(1.09); box-shadow: 0 4px 18px rgba(79,70,229,0.42); }
.sn-ctrl-btn.sn-active-ctrl { color: var(--snav-accent); }
.sn-volume-row {
  display: flex; align-items: center; gap: 8px; margin-top: 10px;
}
.sn-vol-icon { color: var(--snav-fg-muted); display: flex; align-items: center; }
.sn-vol-slider {
  flex: 1; height: 3px; -webkit-appearance: none;
  background: var(--snav-surface2); border-radius: 2px; outline: none; cursor: pointer;
}
.sn-vol-slider::-webkit-slider-thumb {
  -webkit-appearance: none; width: 12px; height: 12px;
  border-radius: 50%; background: var(--snav-accent); cursor: pointer;
}
.sn-track-list { flex: 1; overflow-y: auto; padding: 8px; }
.sn-track-list::-webkit-scrollbar { width: 3px; }
.sn-track-list::-webkit-scrollbar-thumb { background: var(--snav-border); }
.sn-track-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: 10px; cursor: pointer;
  transition: all 0.14s ease; margin-bottom: 2px;
}
.sn-track-item:hover { background: var(--snav-surface2); }
.sn-track-item.sn-playing {
  background: rgba(79,70,229,0.09); border: 1px solid rgba(79,70,229,0.18);
}
.sn-track-num {
  width: 22px; text-align: center;
  font-size: 0.68rem; color: var(--snav-fg-muted);
  font-family: 'JetBrains Mono', monospace; flex-shrink: 0;
}
.sn-track-item.sn-playing .sn-track-num { color: var(--snav-accent); }
.sn-track-name {
  flex: 1; font-size: 0.78rem; font-weight: 500; color: var(--snav-fg-muted);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.sn-track-item.sn-playing .sn-track-name { color: var(--snav-accent); font-weight: 600; }
.sn-playing-bars { display: flex; gap: 2px; align-items: flex-end; height: 14px; flex-shrink: 0; }
.sn-playing-bars span {
  width: 3px; background: var(--snav-accent); border-radius: 1px;
  animation: sn-equalizer 0.7s ease-in-out infinite alternate;
}
.sn-playing-bars span:nth-child(1) { height: 6px; animation-delay: 0s; }
.sn-playing-bars span:nth-child(2) { height: 12px; animation-delay: 0.2s; }
.sn-playing-bars span:nth-child(3) { height: 8px; animation-delay: 0.4s; }
@keyframes sn-equalizer { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }

/* ── FLOATING MUSIC BUTTON ── */
#sn-music-fab {
  position: fixed; bottom: 28px; right: 24px;
  z-index: 9050;
  display: flex; align-items: center; gap: 9px;
  padding: 0 18px 0 14px;
  height: 48px; border-radius: 999px;
  background: var(--snav-accent); color: white;
  border: none; cursor: pointer;
  font-family: 'Sora', sans-serif; font-size: 0.8rem; font-weight: 700;
  box-shadow: 0 8px 28px rgba(79,70,229,0.42);
  transition: all 0.22s ease;
  white-space: nowrap;
}
#sn-music-fab:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 12px 36px rgba(79,70,229,0.52); }
#sn-music-fab .sn-fab-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: rgba(255,255,255,0.7);
  animation: sn-pulse-dot 1.4s ease-in-out infinite;
}

/* ── BODY PADDING TO COMPENSATE FOR FIXED NAV ── */
body.sn-has-nav { padding-top: var(--snav-nav-h); }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  :root { --snav-nav-h: 60px; --snav-sidebar-w: min(300px, 90vw); }
  nav#sn-main-nav { padding: 0 16px; }
  .sn-nav-links { display: none; }
  .sn-hamburger-btn { display: flex !important; }
}
@media (max-width: 600px) {
  #sn-music-fab { width: 48px; height: 48px; padding: 0; border-radius: 50%; }
  #sn-music-fab .sn-fab-text { display: none; }
}
@media (max-width: 480px) {
  #sn-music-fab { bottom: 20px; right: 16px; }
}
`;

  // Inject CSS
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── SVG Icons (inline sprite) ──
  const svgSprite = `
<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
  <symbol id="sn-ic-home" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </symbol>
  <symbol id="sn-ic-atom" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <circle cx="12" cy="12" r="2.2"/>
    <ellipse cx="12" cy="12" rx="10" ry="4.2"/>
    <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)"/>
    <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)"/>
  </symbol>
  <symbol id="sn-ic-flask" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 3h6"/><path d="M9 3v6.5L5.5 16a3 3 0 0 0 2.5 4.5h8A3 3 0 0 0 18.5 16L15 9.5V3"/>
    <path d="M7.5 14.5h9"/>
  </symbol>
  <symbol id="sn-ic-sigma" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="5 6 5 3 19 3 12 12 19 21 5 21 5 18"/>
  </symbol>
  <symbol id="sn-ic-book-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </symbol>
  <symbol id="sn-ic-run" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="13" cy="4" r="2"/><path d="M7 22l3-7 3 3 3-5 2 4"/><path d="M5 12l4-3 4 2 3-2 3 1"/>
  </symbol>
  <symbol id="sn-ic-music" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
  </symbol>
  <symbol id="sn-ic-headphones" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
    <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
  </symbol>
  <symbol id="sn-ic-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </symbol>
  <symbol id="sn-ic-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </symbol>
  <symbol id="sn-ic-play" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></symbol>
  <symbol id="sn-ic-pause" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
  </symbol>
  <symbol id="sn-ic-prev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <polygon points="19 20 9 12 19 4 19 20" fill="currentColor" stroke="none"/><line x1="5" y1="19" x2="5" y2="5"/>
  </symbol>
  <symbol id="sn-ic-next" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <polygon points="5 4 15 12 5 20 5 4" fill="currentColor" stroke="none"/><line x1="19" y1="5" x2="19" y2="19"/>
  </symbol>
  <symbol id="sn-ic-shuffle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/>
    <polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/>
  </symbol>
  <symbol id="sn-ic-repeat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
    <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </symbol>
  <symbol id="sn-ic-vol-low" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
  </symbol>
  <symbol id="sn-ic-vol-high" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
  </symbol>
  <symbol id="sn-ic-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </symbol>
  <symbol id="sn-ic-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </symbol>
  <symbol id="sn-ic-chevron-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </symbol>
  <symbol id="sn-ic-file" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
    <polyline points="13 2 13 9 20 9"/>
  </symbol>
  <symbol id="sn-ic-lightning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </symbol>
  <symbol id="sn-ic-sparkle" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l1.6 7.4 7.4 1.6-7.4 1.6L12 20l-1.6-7.4L3 11l7.4-1.6z"/>
  </symbol>
</svg>`;

  // ── Build icon helper ──
  function ic(name, cls) {
    cls = cls || 'sn-icon-sm';
    return `<svg class="sn-icon ${cls}"><use href="#sn-ic-${name}"/></svg>`;
  }

  // ── Build nav links data (with adjusted hrefs) ──
  const B = depth; // base path prefix

  // ── HTML: page overlay ──
  const overlayHTML = `<div id="sn-page-overlay"></div>`;

  // ── HTML: music sidebar ──
  const sidebarHTML = `
<aside id="sn-music-sidebar" role="complementary" aria-label="Music Player">
  <div class="sn-sidebar-header">
    <div class="sn-sidebar-title">
      ${ic('headphones','sn-icon-md')} Study Beats
    </div>
    <button class="sn-sidebar-close" id="sn-sidebar-close" aria-label="Close music player">
      ${ic('close','sn-icon-md')}
    </button>
  </div>
  <div class="sn-player-section">
    <div class="sn-now-playing-label">
      ${ic('music','sn-icon-sm')} Now Playing
    </div>
    <div class="sn-track-display" id="sn-track-display">Select a track to play</div>
    <div class="sn-progress-wrap" id="sn-progress-wrap">
      <div class="sn-progress-bar" id="sn-progress-bar"></div>
    </div>
    <div class="sn-time-display">
      <span id="sn-time-current">0:00</span>
      <span id="sn-time-total">0:00</span>
    </div>
    <div class="sn-player-controls">
      <button class="sn-ctrl-btn" id="sn-btn-prev" title="Previous">${ic('prev','sn-icon-sm')}</button>
      <button class="sn-ctrl-btn" id="sn-btn-shuffle" title="Shuffle">${ic('shuffle','sn-icon-sm')}</button>
      <button class="sn-ctrl-btn sn-play-btn" id="sn-btn-play" title="Play/Pause">
        <svg class="sn-icon" style="width:20px;height:20px" id="sn-play-icon"><use href="#sn-ic-play"/></svg>
      </button>
      <button class="sn-ctrl-btn" id="sn-btn-repeat" title="Repeat">${ic('repeat','sn-icon-sm')}</button>
      <button class="sn-ctrl-btn" id="sn-btn-next" title="Next">${ic('next','sn-icon-sm')}</button>
    </div>
    <div class="sn-volume-row">
      <span class="sn-vol-icon">${ic('vol-low','sn-icon-sm')}</span>
      <input type="range" class="sn-vol-slider" id="sn-vol-slider" min="0" max="100" value="80">
      <span class="sn-vol-icon">${ic('vol-high','sn-icon-sm')}</span>
    </div>
  </div>
  <div class="sn-track-list" id="sn-track-list"></div>
</aside>
<audio id="sn-main-audio" preload="none"></audio>`;

  // ── HTML: floating button ──
  const fabHTML = `
<button id="sn-music-fab" aria-label="Open music player">
  <svg class="sn-icon" style="width:20px;height:20px"><use href="#sn-ic-music"/></svg>
  <span class="sn-fab-text">Study Beats</span>
  <span class="sn-fab-dot"></span>
</button>`;

  // ── HTML: navigation ──
  const navHTML = `
<nav id="sn-main-nav" role="navigation" aria-label="Main navigation">
  <a class="sn-nav-brand" href="${B}index.html">
    <span class="sn-brand-dot"></span>
    Class XII HW
  </a>
  <div class="sn-nav-links">
    <div class="sn-nav-item">
      <a class="sn-nav-btn" href="${B}index.html">
        ${ic('home','sn-icon-sm')} Home
      </a>
    </div>
    <div class="sn-nav-item" tabindex="0">
      <button class="sn-nav-btn">
        ${ic('atom','sn-icon-sm')} Physics
        <svg class="sn-icon sn-icon-sm sn-chev"><use href="#sn-ic-chevron-down"/></svg>
      </button>
      <div class="sn-mega-menu">
        <div class="sn-mega-menu-header">Physics</div>
        <a href="${B}Physics/Chapter_1_exercise_solution.html"><span class="sn-page-icon">${ic('file','sn-icon-sm')}</span>Ch. 1 Exercise Solution</a>
        <a href="${B}Physics/Chapter_2_%26_3_exercise_solution.html"><span class="sn-page-icon">${ic('file','sn-icon-sm')}</span>Ch. 2 &amp; 3 Exercises</a>
        <a href="${B}Physics/Derivations_Chapter_1.html"><span class="sn-page-icon">${ic('lightning','sn-icon-sm')}</span>Derivations Ch. 1</a>
        <a href="${B}Physics/Derivations_Chapter_2.html"><span class="sn-page-icon">${ic('lightning','sn-icon-sm')}</span>Derivations Ch. 2</a>
        <a href="${B}Physics/Derivations_Chapter_3.html"><span class="sn-page-icon">${ic('lightning','sn-icon-sm')}</span>Derivations Ch. 3</a>
        <a href="${B}Physics/Derivations_Chapter_4.html"><span class="sn-page-icon">${ic('lightning','sn-icon-sm')}</span>Derivations Ch. 4</a>
        <a href="${B}Physics/APJ_Abdul_Kalam_Story.html"><span class="sn-page-icon">${ic('book-open','sn-icon-sm')}</span>APJ Abdul Kalam Story</a>
      </div>
    </div>
    <div class="sn-nav-item" tabindex="0">
      <button class="sn-nav-btn">
        ${ic('flask','sn-icon-sm')} Chemistry
        <svg class="sn-icon sn-icon-sm sn-chev"><use href="#sn-ic-chevron-down"/></svg>
      </button>
      <div class="sn-mega-menu">
        <div class="sn-mega-menu-header">Chemistry</div>
        <a href="${B}Chemistry/chemistry_formulas.html"><span class="sn-page-icon"><svg class="sn-icon sn-icon-sm" style="color:#10B981"><use href="#sn-ic-file"/></svg></span>Chemistry Formulas</a>
        <a href="${B}Chemistry/chemistry_pyq.html"><span class="sn-page-icon"><svg class="sn-icon sn-icon-sm" style="color:#10B981"><use href="#sn-ic-book-open"/></svg></span>Previous Year Questions</a>
      </div>
    </div>
    <div class="sn-nav-item" tabindex="0">
      <button class="sn-nav-btn">
        ${ic('sigma','sn-icon-sm')} Maths
        <svg class="sn-icon sn-icon-sm sn-chev"><use href="#sn-ic-chevron-down"/></svg>
      </button>
      <div class="sn-mega-menu">
        <div class="sn-mega-menu-header">Mathematics</div>
        <a href="${B}Maths/Formulas.html"><span class="sn-page-icon"><svg class="sn-icon sn-icon-sm" style="color:#F59E0B"><use href="#sn-ic-file"/></svg></span>Maths Formulas</a>
        <a href="${B}Maths/RS%20Aggarwal%20Solved%20Examples.html"><span class="sn-page-icon"><svg class="sn-icon sn-icon-sm" style="color:#F59E0B"><use href="#sn-ic-book-open"/></svg></span>RS Aggarwal Solved</a>
        <a href="${B}Maths/art_integration.html"><span class="sn-page-icon"><svg class="sn-icon sn-icon-sm" style="color:#F59E0B"><use href="#sn-ic-sparkle"/></svg></span>Art Integration</a>
      </div>
    </div>
    <div class="sn-nav-item" tabindex="0">
      <button class="sn-nav-btn">
        ${ic('book-open','sn-icon-sm')} English
        <svg class="sn-icon sn-icon-sm sn-chev"><use href="#sn-ic-chevron-down"/></svg>
      </button>
      <div class="sn-mega-menu">
        <div class="sn-mega-menu-header">English</div>
        <a href="${B}English/english.html"><span class="sn-page-icon"><svg class="sn-icon sn-icon-sm" style="color:#8B5CF6"><use href="#sn-ic-book-open"/></svg></span>English Homework</a>
      </div>
    </div>
    <div class="sn-nav-item" tabindex="0">
      <button class="sn-nav-btn">
        ${ic('run','sn-icon-sm')} Phy. Ed.
        <svg class="sn-icon sn-icon-sm sn-chev"><use href="#sn-ic-chevron-down"/></svg>
      </button>
      <div class="sn-mega-menu">
        <div class="sn-mega-menu-header">Physical Education</div>
        <a href="${B}Physical%20Education/Yoga_File_AND%20Chart.html"><span class="sn-page-icon"><svg class="sn-icon sn-icon-sm" style="color:#F97316"><use href="#sn-ic-file"/></svg></span>Yoga File &amp; Chart</a>
      </div>
    </div>
  </div>

  <div class="sn-nav-right">
    <button class="sn-icon-btn" id="sn-theme-btn" title="Toggle theme" aria-label="Toggle colour theme">
      <svg class="sn-icon sn-icon-md" id="sn-theme-icon"><use href="#sn-ic-moon"/></svg>
    </button>
    <button class="sn-icon-btn" id="sn-music-open-btn-nav" title="Open Music Player" aria-label="Open music player">
      ${ic('music','sn-icon-md')}
    </button>
    <button class="sn-icon-btn sn-hamburger-btn" id="sn-hamburger-btn" aria-label="Open menu" aria-expanded="false">
      ${ic('menu','sn-icon-md')}
    </button>
  </div>
</nav>`;

  // ── HTML: mobile menu ──
  const mobileHTML = `
<div id="sn-mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu">
  <div class="sn-mob-menu-head">
    <div class="sn-mob-menu-brand">
      <span class="sn-brand-dot" style="width:8px;height:8px;border-radius:50%;background:var(--snav-accent);display:inline-block;animation:sn-pulse-dot 2s ease-in-out infinite;"></span>
      Class XII HW
    </div>
    <button class="sn-mob-close" id="sn-mob-close-btn" aria-label="Close menu">
      ${ic('close','sn-icon-md')}
    </button>
  </div>
  <nav class="sn-mob-nav">
    <a class="sn-mob-home-link" href="${B}index.html">
      ${ic('home','sn-icon-md')} Home
    </a>
    <!-- Physics -->
    <div class="sn-mob-subject">
      <button class="sn-mob-subject-btn" onclick="snToggleMobAccordion(this)">
        <span class="sn-left"><svg class="sn-icon sn-icon-md" style="color:#3B82F6"><use href="#sn-ic-atom"/></svg> Physics</span>
        <svg class="sn-icon sn-icon-sm sn-mob-chev"><use href="#sn-ic-chevron-down"/></svg>
      </button>
      <div class="sn-mob-sub-links">
        <a href="${B}Physics/Chapter_1_exercise_solution.html"><span class="sn-page-icon">${ic('file','sn-icon-sm')}</span>Ch. 1 Exercise Solution</a>
        <a href="${B}Physics/Chapter_2_%26_3_exercise_solution.html"><span class="sn-page-icon">${ic('file','sn-icon-sm')}</span>Ch. 2 &amp; 3 Exercises</a>
        <a href="${B}Physics/Derivations_Chapter_1.html"><span class="sn-page-icon">${ic('lightning','sn-icon-sm')}</span>Derivations Ch. 1</a>
        <a href="${B}Physics/Derivations_Chapter_2.html"><span class="sn-page-icon">${ic('lightning','sn-icon-sm')}</span>Derivations Ch. 2</a>
        <a href="${B}Physics/Derivations_Chapter_3.html"><span class="sn-page-icon">${ic('lightning','sn-icon-sm')}</span>Derivations Ch. 3</a>
        <a href="${B}Physics/Derivations_Chapter_4.html"><span class="sn-page-icon">${ic('lightning','sn-icon-sm')}</span>Derivations Ch. 4</a>
        <a href="${B}Physics/APJ_Abdul_Kalam_Story.html"><span class="sn-page-icon">${ic('book-open','sn-icon-sm')}</span>APJ Abdul Kalam Story</a>
      </div>
    </div>
    <!-- Chemistry -->
    <div class="sn-mob-subject">
      <button class="sn-mob-subject-btn" onclick="snToggleMobAccordion(this)">
        <span class="sn-left"><svg class="sn-icon sn-icon-md" style="color:#10B981"><use href="#sn-ic-flask"/></svg> Chemistry</span>
        <svg class="sn-icon sn-icon-sm sn-mob-chev"><use href="#sn-ic-chevron-down"/></svg>
      </button>
      <div class="sn-mob-sub-links">
        <a href="${B}Chemistry/chemistry_formulas.html"><span class="sn-page-icon"><svg class="sn-icon sn-icon-sm" style="color:#10B981"><use href="#sn-ic-file"/></svg></span>Chemistry Formulas</a>
        <a href="${B}Chemistry/chemistry_pyq.html"><span class="sn-page-icon"><svg class="sn-icon sn-icon-sm" style="color:#10B981"><use href="#sn-ic-book-open"/></svg></span>Previous Year Questions</a>
      </div>
    </div>
    <!-- Maths -->
    <div class="sn-mob-subject">
      <button class="sn-mob-subject-btn" onclick="snToggleMobAccordion(this)">
        <span class="sn-left"><svg class="sn-icon sn-icon-md" style="color:#F59E0B"><use href="#sn-ic-sigma"/></svg> Mathematics</span>
        <svg class="sn-icon sn-icon-sm sn-mob-chev"><use href="#sn-ic-chevron-down"/></svg>
      </button>
      <div class="sn-mob-sub-links">
        <a href="${B}Maths/Formulas.html"><span class="sn-page-icon"><svg class="sn-icon sn-icon-sm" style="color:#F59E0B"><use href="#sn-ic-file"/></svg></span>Maths Formulas</a>
        <a href="${B}Maths/RS%20Aggarwal%20Solved%20Examples.html"><span class="sn-page-icon"><svg class="sn-icon sn-icon-sm" style="color:#F59E0B"><use href="#sn-ic-book-open"/></svg></span>RS Aggarwal Solved</a>
        <a href="${B}Maths/art_integration.html"><span class="sn-page-icon"><svg class="sn-icon sn-icon-sm" style="color:#F59E0B"><use href="#sn-ic-sparkle"/></svg></span>Art Integration</a>
      </div>
    </div>
    <!-- English -->
    <div class="sn-mob-subject">
      <button class="sn-mob-subject-btn" onclick="snToggleMobAccordion(this)">
        <span class="sn-left"><svg class="sn-icon sn-icon-md" style="color:#8B5CF6"><use href="#sn-ic-book-open"/></svg> English</span>
        <svg class="sn-icon sn-icon-sm sn-mob-chev"><use href="#sn-ic-chevron-down"/></svg>
      </button>
      <div class="sn-mob-sub-links">
        <a href="${B}English/english.html"><span class="sn-page-icon"><svg class="sn-icon sn-icon-sm" style="color:#8B5CF6"><use href="#sn-ic-book-open"/></svg></span>English Homework</a>
      </div>
    </div>
    <!-- PE -->
    <div class="sn-mob-subject">
      <button class="sn-mob-subject-btn" onclick="snToggleMobAccordion(this)">
        <span class="sn-left"><svg class="sn-icon sn-icon-md" style="color:#F97316"><use href="#sn-ic-run"/></svg> Physical Education</span>
        <svg class="sn-icon sn-icon-sm sn-mob-chev"><use href="#sn-ic-chevron-down"/></svg>
      </button>
      <div class="sn-mob-sub-links">
        <a href="${B}Physical%20Education/Yoga_File_AND%20Chart.html"><span class="sn-page-icon"><svg class="sn-icon sn-icon-sm" style="color:#F97316"><use href="#sn-ic-file"/></svg></span>Yoga File &amp; Chart</a>
      </div>
    </div>
  </nav>
  <div class="sn-mob-footer-actions">
    <button class="sn-icon-btn" id="sn-mob-theme-btn" title="Toggle theme" style="gap:8px;font-size:0.78rem;font-family:'Sora',sans-serif;font-weight:600;color:var(--snav-fg-muted);flex:none;width:auto;padding:0 14px">
      <svg class="sn-icon sn-icon-md" id="sn-mob-theme-icon"><use href="#sn-ic-moon"/></svg>
    </button>
    <button class="sn-icon-btn" id="sn-mob-music-btn" style="flex:1;gap:8px;font-family:'Sora',sans-serif;font-size:0.8rem;font-weight:600;color:white;background:var(--snav-accent);border-color:var(--snav-accent)">
      ${ic('music','sn-icon-md')} Study Beats
    </button>
  </div>
</div>`;

  // ── Inject all HTML ──
  const wrapper = document.createElement('div');
  wrapper.id = 'sn-shared-wrapper';
  wrapper.innerHTML = svgSprite + overlayHTML + sidebarHTML + fabHTML + navHTML + mobileHTML;
  document.body.insertBefore(wrapper, document.body.firstChild);

  // Add body class for nav padding
  document.body.classList.add('sn-has-nav');

  // ── Set data-theme on html if not present ──
  const htmlEl = document.documentElement;
  if (!htmlEl.getAttribute('data-theme')) {
    htmlEl.setAttribute('data-theme', 'light');
  }

  // ── THEME TOGGLE ──
  function snSetTheme(t) {
    htmlEl.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    const isDark = t === 'dark';
    const themeIcon = document.getElementById('sn-theme-icon');
    if (themeIcon) themeIcon.querySelector('use').setAttribute('href', isDark ? '#sn-ic-sun' : '#sn-ic-moon');
    const mobTI = document.getElementById('sn-mob-theme-icon');
    if (mobTI) mobTI.querySelector('use').setAttribute('href', isDark ? '#sn-ic-sun' : '#sn-ic-moon');
  }
  const saved = localStorage.getItem('theme') || 'light';
  snSetTheme(saved);

  document.getElementById('sn-theme-btn').addEventListener('click', () => {
    snSetTheme(htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
  document.getElementById('sn-mob-theme-btn').addEventListener('click', () => {
    snSetTheme(htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  // ── MEGA MENU (desktop) ──
  document.querySelectorAll('.sn-nav-item[tabindex="0"]').forEach(item => {
    item.addEventListener('mouseenter', () => item.classList.add('open'));
    item.addEventListener('mouseleave', () => item.classList.remove('open'));
    item.addEventListener('click', e => {
      if (e.target.closest('.sn-mega-menu')) return;
      item.classList.toggle('open');
    });
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.sn-nav-item'))
      document.querySelectorAll('.sn-nav-item.open').forEach(i => i.classList.remove('open'));
  });

  // ── OVERLAY ──
  const snOverlay = document.getElementById('sn-page-overlay');
  snOverlay.addEventListener('click', () => { snCloseSidebar(); snCloseMobileMenu(); });

  // ── MOBILE MENU ──
  const snMobileMenu = document.getElementById('sn-mobile-menu');
  const snHamburger = document.getElementById('sn-hamburger-btn');

  function snOpenMobileMenu() {
    snMobileMenu.classList.add('open');
    snOverlay.classList.add('open');
    snHamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function snCloseMobileMenu() {
    snMobileMenu.classList.remove('open');
    if (!document.getElementById('sn-music-sidebar').classList.contains('open'))
      snOverlay.classList.remove('open');
    snHamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  snHamburger.addEventListener('click', snOpenMobileMenu);
  document.getElementById('sn-mob-close-btn').addEventListener('click', snCloseMobileMenu);

  // global for onclick handlers
  window.snToggleMobAccordion = function(btn) {
    const subject = btn.closest('.sn-mob-subject');
    const isOpen = subject.classList.contains('open');
    document.querySelectorAll('.sn-mob-subject.open').forEach(s => s.classList.remove('open'));
    if (!isOpen) subject.classList.add('open');
  };

  // ── MUSIC SIDEBAR ──
  const snSidebar = document.getElementById('sn-music-sidebar');
  function snOpenSidebar() {
    snSidebar.classList.add('open');
    snOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function snCloseSidebar() {
    snSidebar.classList.remove('open');
    if (!snMobileMenu.classList.contains('open'))
      snOverlay.classList.remove('open');
    if (!snMobileMenu.classList.contains('open'))
      document.body.style.overflow = '';
  }
  document.getElementById('sn-music-open-btn-nav').addEventListener('click', snOpenSidebar);
  document.getElementById('sn-sidebar-close').addEventListener('click', snCloseSidebar);
  document.getElementById('sn-music-fab').addEventListener('click', snOpenSidebar);
  document.getElementById('sn-mob-music-btn').addEventListener('click', () => {
    snCloseMobileMenu();
    snOpenSidebar();
  });

  // ── MUSIC PLAYER ──
  const MUSIC_BASE = 'https://raw.githubusercontent.com/tyagiakshit536-dotcom/Class-Music/9d918dcccdba4d340a40c2a503ca3ff737abd545/Music/';
  const tracks = [
    { file:'ACIDO_III__Super_Slowed_(128k).m4a',                                            name:'ACIDO III — Super Slowed' },
    { file:'Ariis_-_dan%C3%A7a_zip_%5BBrazilian_Phonk%5D(128k).m4a',                       name:'Ariis — Dança Zip (Brazilian Phonk)' },
    { file:'Ariis_-__GOZALO(128k).m4a',                                                    name:'Ariis — GOZALO' },
    { file:'CONFESS_YOUR_LOVE_FUNK__Lyrics_Video_(128k).m4a',                              name:'Confess Your Love Funk' },
    { file:'FUNK_CRIMINAL__SUPER_SLOWED_(128k).m4a',                                       name:'FUNK CRIMINAL — Super Slowed' },
    { file:'FUNK_INFERNAL(128k).m4a',                                                      name:'FUNK INFERNAL' },
    { file:'FUNK_SIGILO(128k).m4a',                                                        name:'FUNK SIGILO' },
    { file:'FUNK_UNIVERSO__Slowed_(128k).m4a',                                             name:'FUNK UNIVERSO — Slowed' },
    { file:'MONTAGEM_ALQUIMIA__SLOWED__-_h6itam%2C_n7san7os___Mc_Menor_Do_Alvorada(128k).m4a', name:'Montagem Alquimia — Slowed' },
    { file:'NADA_NADA_-_JMILTON_x_KAISER%2C_SAE%2C_LORENZO_%5BBrazilian_Funk%5D(128k).m4a',  name:'Nada Nada — Brazilian Funk' },
    { file:'NOCHE_ETERNA__ULTRA_SLOWED__(128k).m4a',                                        name:'Noche Eterna — Ultra Slowed' },
    { file:'Ogryzek_-_AURA_Slowed__Official_Visualiser_(128k).m4a',                         name:'Ogryzek — AURA Slowed' },
    { file:'Ogryzek_-_EMPIRE_Slowed__Official_Visualiser_(128k).m4a',                       name:'Ogryzek — EMPIRE Slowed' },
    { file:'Ogryzek_-_GLORY_Slowed__Official_Visualiser_(128k).m4a',                        name:'Ogryzek — GLORY Slowed' },
    { file:'Ogryzek_-_GLORY__PHONK_(128k).m4a',                                             name:'Ogryzek — GLORY PHONK' },
    { file:'REVENGE__Super_Slowed__-_1HXSX%2C_Wnorg17_(128k).m4a',                          name:'Revenge — Super Slowed' },
    { file:'Slowed____HR_-_EEYUH!__Irokz_Remix_(128k).m4a',                                 name:'HR — EEYUH! (Irokz Remix)' },
    { file:'LUZ_ROJA__Mega_Slowed_(128k).m4a',                                              name:'LUZ ROJA — Mega Slowed' }
  ];

  const snTrackListEl = document.getElementById('sn-track-list');
  tracks.forEach((t, i) => {
    const div = document.createElement('div');
    div.className = 'sn-track-item';
    div.dataset.index = i;
    div.innerHTML = `
      <span class="sn-track-num">${i + 1}</span>
      <span class="sn-track-name">${t.name}</span>
      <div class="sn-playing-bars" style="display:none"><span></span><span></span><span></span></div>`;
    div.addEventListener('click', () => snPlayTrack(i));
    snTrackListEl.appendChild(div);
  });

  const snAudio = document.getElementById('sn-main-audio');
  let snCurrentTrack = -1, snIsPlaying = false, snShuffle = false, snRepeat = false;

  /* ─── MUSIC STATE PERSISTENCE (cross-page) ─── */
  function snSaveMusicState() {
    if (snCurrentTrack < 0) return;
    const state = {
      trackIndex: snCurrentTrack,
      currentTime: snAudio.currentTime || 0,
      isPlaying: snIsPlaying,
      volume: parseInt(document.getElementById('sn-vol-slider').value, 10),
      shuffle: snShuffle,
      repeat: snRepeat,
      timestamp: Date.now()
    };
    sessionStorage.setItem('musicState', JSON.stringify(state));
  }
  function snRestoreMusicState() {
    const raw = sessionStorage.getItem('musicState');
    if (!raw) return;
    try {
      const state = JSON.parse(raw);
      // Only restore if saved within last 5 seconds (recent navigation)
      if (Date.now() - state.timestamp > 5000) { sessionStorage.removeItem('musicState'); return; }
      if (state.trackIndex < 0 || state.trackIndex >= tracks.length) return;
      // Restore shuffle/repeat
      if (state.shuffle) { snShuffle = true; document.getElementById('sn-btn-shuffle').style.color = 'var(--snav-accent)'; document.getElementById('sn-btn-shuffle').classList.add('sn-active-ctrl'); }
      if (state.repeat)  { snRepeat = true; snAudio.loop = true; document.getElementById('sn-btn-repeat').style.color = 'var(--snav-accent)'; document.getElementById('sn-btn-repeat').classList.add('sn-active-ctrl'); }
      // Restore volume
      document.getElementById('sn-vol-slider').value = state.volume;
      snAudio.volume = state.volume / 100;
      // Play track
      snCurrentTrack = state.trackIndex;
      document.querySelectorAll('.sn-track-item').forEach((el, i) => {
        el.classList.toggle('sn-playing', i === state.trackIndex);
        el.querySelector('.sn-playing-bars').style.display = i === state.trackIndex ? 'flex' : 'none';
      });
      document.getElementById('sn-track-display').textContent = tracks[state.trackIndex].name;
      snAudio.src = MUSIC_BASE + tracks[state.trackIndex].file;
      const savedTime = state.currentTime;
      const shouldPlay = state.isPlaying;
      snAudio.addEventListener('loadedmetadata', function onMeta() {
        snAudio.removeEventListener('loadedmetadata', onMeta);
        if (savedTime > 0 && savedTime < snAudio.duration) snAudio.currentTime = savedTime;
        if (shouldPlay) {
          snAudio.play().then(() => { snIsPlaying = true; snSetPlayIcon(true); }).catch(e => console.warn('Auto-resume blocked:', e));
        }
      });
      sessionStorage.removeItem('musicState');
    } catch(e) { console.warn('Music state restore error:', e); }
  }
  // Save state before page unload
  window.addEventListener('beforeunload', snSaveMusicState);
  // Intercept all link clicks to save state before navigation
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href]');
    if (link && !link.href.startsWith('javascript:') && !link.href.startsWith('#') && link.target !== '_blank') {
      snSaveMusicState();
    }
  });

  function snSetPlayIcon(playing) {
    document.getElementById('sn-play-icon').querySelector('use').setAttribute('href', playing ? '#sn-ic-pause' : '#sn-ic-play');
  }
  function snPlayTrack(index) {
    if (index < 0 || index >= tracks.length) return;
    document.querySelectorAll('.sn-track-item').forEach((el, i) => {
      el.classList.toggle('sn-playing', i === index);
      el.querySelector('.sn-playing-bars').style.display = i === index ? 'flex' : 'none';
    });
    snCurrentTrack = index;
    snAudio.src = MUSIC_BASE + tracks[index].file;
    snAudio.volume = parseInt(document.getElementById('sn-vol-slider').value, 10) / 100;
    snAudio.play().catch(e => console.warn('Audio error:', e));
    snIsPlaying = true;
    snSetPlayIcon(true);
    document.getElementById('sn-track-display').textContent = tracks[index].name;
    const activeItem = document.querySelector(`.sn-track-item[data-index="${index}"]`);
    if (activeItem) activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  function snTogglePlay() {
    if (snCurrentTrack === -1) { snPlayTrack(0); return; }
    if (snAudio.paused) { snAudio.play(); snIsPlaying = true;  snSetPlayIcon(true);  }
    else                { snAudio.pause(); snIsPlaying = false; snSetPlayIcon(false); }
  }
  function snPlayNext() {
    snPlayTrack(snShuffle ? Math.floor(Math.random() * tracks.length) : (snCurrentTrack + 1) % tracks.length);
  }
  function snPlayPrev() {
    if (snAudio.currentTime > 3) { snAudio.currentTime = 0; return; }
    snPlayTrack((snCurrentTrack - 1 + tracks.length) % tracks.length);
  }
  document.getElementById('sn-btn-play').addEventListener('click', snTogglePlay);
  document.getElementById('sn-btn-next').addEventListener('click', snPlayNext);
  document.getElementById('sn-btn-prev').addEventListener('click', snPlayPrev);
  document.getElementById('sn-btn-shuffle').addEventListener('click', function() {
    snShuffle = !snShuffle;
    this.style.color = snShuffle ? 'var(--snav-accent)' : '';
    this.classList.toggle('sn-active-ctrl', snShuffle);
  });
  document.getElementById('sn-btn-repeat').addEventListener('click', function() {
    snRepeat = !snRepeat;
    snAudio.loop = snRepeat;
    this.style.color = snRepeat ? 'var(--snav-accent)' : '';
    this.classList.toggle('sn-active-ctrl', snRepeat);
  });
  snAudio.addEventListener('ended', () => { if (!snRepeat) snPlayNext(); });
  snAudio.addEventListener('timeupdate', () => {
    if (!snAudio.duration) return;
    const pct = (snAudio.currentTime / snAudio.duration) * 100;
    document.getElementById('sn-progress-bar').style.width = pct + '%';
    document.getElementById('sn-time-current').textContent = snFmt(snAudio.currentTime);
    document.getElementById('sn-time-total').textContent   = snFmt(snAudio.duration);
  });
  document.getElementById('sn-progress-wrap').addEventListener('click', e => {
    const r = e.currentTarget.getBoundingClientRect();
    if (snAudio.duration) snAudio.currentTime = ((e.clientX - r.left) / r.width) * snAudio.duration;
  });
  document.getElementById('sn-vol-slider').addEventListener('input', e => {
    snAudio.volume = e.target.value / 100;
  });
  function snFmt(s) {
    if (!s || isNaN(s)) return '0:00';
    return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  }
  // Restore music state after player is fully initialized
  snRestoreMusicState();

  // ── NAV SCROLL ──
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('sn-main-nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

})();
