// Helper to safely convert SVG string to a local base64 data URL
function createSvgDataUrl(svgString: string): string {
  const base64 = btoa(unescape(encodeURIComponent(svgString)));
  return `data:image/svg+xml;base64,${base64}`;
}

export interface LocalPresetImage {
  id: string;
  name: string;
  category: string;
  url: string;
}

const COFFEE_SVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-coffee" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#78350F" />
      <stop offset="100%" stop-color="#451A03" />
    </linearGradient>
    <linearGradient id="grad-bg-coffee" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF3C7" />
      <stop offset="100%" stop-color="#FDE68A" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="40" fill="url(#grad-bg-coffee)"/>
  <g transform="translate(45, 55)">
    <path d="M35,-15 Q40,-25 35,-35 Q30,-45 35,-55" fill="none" stroke="#78350F" stroke-width="4" stroke-linecap="round" opacity="0.5" />
    <path d="M55,-10 Q60,-20 55,-30 Q50,-40 55,-50" fill="none" stroke="#78350F" stroke-width="4" stroke-linecap="round" opacity="0.3" />
    <path d="M75,-15 Q80,-25 75,-35 Q70,-45 75,-55" fill="none" stroke="#78350F" stroke-width="4" stroke-linecap="round" opacity="0.4" />
    <path d="M20,0 L90,0 C90,45 20,45 20,0 Z" fill="url(#grad-coffee)"/>
    <path d="M90,10 C105,10 105,30 90,30" fill="none" stroke="#78350F" stroke-width="8" stroke-linecap="round"/>
    <path d="M5,50 L105,50" fill="none" stroke="#78350F" stroke-width="8" stroke-linecap="round"/>
  </g>
  <text x="100" y="170" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="#78350F" text-anchor="middle">قهوه گرم</text>
</svg>`;

const PIZZA_SVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-pizza-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB" />
      <stop offset="100%" stop-color="#FEF3C7" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="40" fill="url(#grad-pizza-bg)"/>
  <g transform="translate(10, 10)">
    <circle cx="90" cy="90" r="70" fill="#D97706" />
    <circle cx="90" cy="90" r="62" fill="#F59E0B" />
    <circle cx="90" cy="90" r="58" fill="#EF4444" />
    <circle cx="90" cy="90" r="54" fill="#FBBF24" />
    <line x1="90" y1="36" x2="90" y2="144" stroke="#D97706" stroke-width="2" stroke-dasharray="2,2" />
    <line x1="36" y1="90" x2="144" y2="90" stroke="#D97706" stroke-width="2" stroke-dasharray="2,2" />
    <circle cx="65" cy="65" r="10" fill="#DC2626" />
    <circle cx="65" cy="65" r="8" fill="#B91C1C" />
    <circle cx="115" cy="65" r="10" fill="#DC2626" />
    <circle cx="115" cy="65" r="8" fill="#B91C1C" />
    <circle cx="65" cy="115" r="10" fill="#DC2626" />
    <circle cx="65" cy="115" r="8" fill="#B91C1C" />
    <circle cx="115" cy="115" r="10" fill="#DC2626" />
    <circle cx="115" cy="115" r="8" fill="#B91C1C" />
    <circle cx="90" cy="55" r="4" fill="#1F2937" />
    <circle cx="90" cy="125" r="4" fill="#1F2937" />
    <circle cx="55" cy="90" r="4" fill="#1F2937" />
    <circle cx="125" cy="90" r="4" fill="#1F2937" />
  </g>
  <text x="100" y="170" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="#9A3412" text-anchor="middle">پیتزا تنوری</text>
</svg>`;

const BURGER_SVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-burger-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF1F2" />
      <stop offset="100%" stop-color="#FFE4E6" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="40" fill="url(#grad-burger-bg)"/>
  <g transform="translate(40, 45)">
    <path d="M10,40 Q60,10 110,40 Z" fill="#D97706" />
    <ellipse cx="40" cy="28" rx="2" ry="1" fill="#FFFFFF" transform="rotate(-15 40 28)" />
    <ellipse cx="60" cy="24" rx="2" ry="1" fill="#FFFFFF" transform="rotate(10 60 24)" />
    <ellipse cx="80" cy="28" rx="2" ry="1" fill="#FFFFFF" transform="rotate(-5 80 28)" />
    <path d="M5,42 Q15,48 25,42 Q35,48 45,42 Q55,48 65,42 Q75,48 85,42 Q95,48 105,42 Q115,48 115,42" fill="none" stroke="#16A34A" stroke-width="6" stroke-linecap="round" />
    <rect x="12" y="46" width="96" height="6" rx="3" fill="#EF4444" />
    <path d="M10,54 L110,54 L100,62 L80,54 L20,54" fill="#FBBF24" />
    <rect x="15" y="58" width="90" height="14" rx="7" fill="#451A03" />
    <rect x="10" y="74" width="100" height="12" rx="6" fill="#D97706" />
  </g>
  <text x="100" y="170" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="#9F1239" text-anchor="middle">همبرگر مخصوص</text>
</svg>`;

const SALAD_SVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-salad-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F0FDF4" />
      <stop offset="100%" stop-color="#DCFCE7" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="40" fill="url(#grad-salad-bg)"/>
  <g transform="translate(40, 50)">
    <path d="M10,40 C10,85 110,85 110,40 Z" fill="#94A3B8" />
    <path d="M5,38 L115,38" fill="none" stroke="#64748B" stroke-width="6" stroke-linecap="round" />
    <circle cx="35" cy="30" r="18" fill="#22C55E" opacity="0.9" />
    <circle cx="60" cy="25" r="20" fill="#16A34A" opacity="0.9" />
    <circle cx="85" cy="32" r="16" fill="#15803D" opacity="0.9" />
    <circle cx="45" cy="28" r="8" fill="#EF4444" />
    <circle cx="45" cy="28" r="5" fill="#FCA5A5" />
    <circle cx="75" cy="30" r="8" fill="#EF4444" />
    <circle cx="75" cy="30" r="5" fill="#FCA5A5" />
    <circle cx="60" cy="38" r="6" fill="#86EFAC" />
    <circle cx="60" cy="38" r="4" fill="#22C55E" />
  </g>
  <text x="100" y="170" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="#166534" text-anchor="middle">سالاد رژیمی</text>
</svg>`;

const FRIES_SVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-fries-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB" />
      <stop offset="100%" stop-color="#FEF3C7" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="40" fill="url(#grad-fries-bg)"/>
  <g transform="translate(50, 45)">
    <rect x="15" y="5" width="10" height="60" rx="2" fill="#FBBF24" transform="rotate(-10 15 5)" />
    <rect x="30" y="2" width="10" height="65" rx="2" fill="#FBBF24" transform="rotate(5 30 2)" />
    <rect x="45" y="0" width="10" height="60" rx="2" fill="#FBBF24" transform="rotate(-5 45 0)" />
    <rect x="60" y="5" width="10" height="62" rx="2" fill="#FBBF24" transform="rotate(12 60 5)" />
    <rect x="75" y="10" width="10" height="55" rx="2" fill="#FBBF24" transform="rotate(-8 75 10)" />
    <path d="M10,40 L90,40 L80,90 L20,90 Z" fill="#EF4444" />
    <ellipse cx="50" cy="40" rx="40" ry="10" fill="#DC2626" />
    <circle cx="50" cy="65" r="14" fill="#FBBF24" />
    <path d="M44,65 L56,65 M50,59 L50,71" fill="none" stroke="#EF4444" stroke-width="4" stroke-linecap="round" />
  </g>
  <text x="100" y="170" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="#991B1B" text-anchor="middle">سیب زمینی سرخ شده</text>
</svg>`;

const CAKE_SVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-cake-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAF5FF" />
      <stop offset="100%" stop-color="#F3E8FF" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="40" fill="url(#grad-cake-bg)"/>
  <g transform="translate(45, 50)">
    <path d="M10,65 L100,35 L100,75 L10,75 Z" fill="#78350F" />
    <path d="M10,50 L100,20 L100,35 L10,65 Z" fill="#FBCFE8" />
    <path d="M10,35 L100,5 L100,20 L10,50 Z" fill="#EC4899" />
    <path d="M100,5 L100,75 L110,75 L110,5 Z" fill="#FDF2F8" />
    <circle cx="55" cy="15" r="10" fill="#DC2626" />
    <path d="M55,5 Q65,0 70,-10" fill="none" stroke="#047857" stroke-width="2" stroke-linecap="round" />
  </g>
  <text x="100" y="170" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="#86198F" text-anchor="middle">کیک و شیرینی</text>
</svg>`;

const SODA_SVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-soda-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ECFEFF" />
      <stop offset="100%" stop-color="#CFFAFE" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="40" fill="url(#grad-soda-bg)"/>
  <g transform="translate(50, 40)">
    <path d="M65,0 L80,-15 L95,-15" fill="none" stroke="#EF4444" stroke-width="6" stroke-linecap="round" />
    <path d="M65,0 L50,30" fill="none" stroke="#E2E8F0" stroke-width="6" />
    <path d="M20,30 L80,30 L70,100 L30,100 Z" fill="#06B6D4" />
    <path d="M15,25 L85,25" fill="none" stroke="#22D3EE" stroke-width="8" stroke-linecap="round" />
    <path d="M20,25 A 15 15 0 0 1 20 55 Z" fill="#F97316" />
    <rect x="35" y="45" width="14" height="14" rx="3" fill="#FFFFFF" opacity="0.6" transform="rotate(15 35 45)" />
    <rect x="52" y="60" width="14" height="14" rx="3" fill="#FFFFFF" opacity="0.6" transform="rotate(-10 52 60)" />
  </g>
  <text x="100" y="170" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="#0891B2" text-anchor="middle">نوشیدنی سرد</text>
</svg>`;

const PASTA_SVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-pasta-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB" />
      <stop offset="100%" stop-color="#FEF3C7" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="40" fill="url(#grad-pasta-bg)"/>
  <g transform="translate(40, 50)">
    <ellipse cx="60" cy="50" rx="55" ry="25" fill="#E2E8F0" />
    <ellipse cx="60" cy="48" rx="45" ry="18" fill="#F1F5F9" />
    <path d="M30,40 Q60,20 90,40" fill="none" stroke="#FBBF24" stroke-width="5" stroke-linecap="round" />
    <path d="M25,45 Q60,25 95,45" fill="none" stroke="#FBBF24" stroke-width="5" stroke-linecap="round" />
    <path d="M35,35 Q60,15 85,35" fill="none" stroke="#FBBF24" stroke-width="5" stroke-linecap="round" />
    <path d="M40,48 Q60,30 80,48" fill="none" stroke="#FBBF24" stroke-width="5" stroke-linecap="round" />
    <circle cx="60" cy="30" r="14" fill="#EF4444" />
    <path d="M52,22 C48,15 58,12 60,20 Z" fill="#22C55E" />
  </g>
  <text x="100" y="170" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="#C2410C" text-anchor="middle">پاستا و غذا</text>
</svg>`;

const SANDWICH_SVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-sandwich-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC" />
      <stop offset="100%" stop-color="#F1F5F9" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="40" fill="url(#grad-sandwich-bg)"/>
  <g transform="translate(45, 50)">
    <path d="M10,60 L90,10 L90,60 Z" fill="#D97706" />
    <path d="M15,55 L85,15 L85,55 Z" fill="#FDE68A" />
    <path d="M20,53 L80,23" fill="none" stroke="#22C55E" stroke-width="4" stroke-linecap="round" />
    <path d="M30,48 L70,33" fill="none" stroke="#EF4444" stroke-width="4" stroke-linecap="round" />
    <path d="M40,43 L60,35" fill="none" stroke="#FBBF24" stroke-width="4" stroke-linecap="round" />
  </g>
  <text x="100" y="170" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="#0369A1" text-anchor="middle">ساندویچ و اسنک</text>
</svg>`;

const KEBAB_SVG = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-kebab-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF2F2" />
      <stop offset="100%" stop-color="#FEE2E2" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="40" fill="url(#grad-kebab-bg)"/>
  <g transform="translate(45, 45)">
    <line x1="10" y1="90" x2="100" y2="0" stroke="#94A3B8" stroke-width="4" stroke-linecap="round" />
    <rect x="20" y="65" width="22" height="22" rx="4" fill="#451A03" transform="rotate(45 31 76)" />
    <circle cx="48" cy="48" r="12" fill="#EF4444" />
    <rect x="52" y="32" width="22" height="22" rx="4" fill="#451A03" transform="rotate(45 63 43)" />
    <rect x="73" y="15" width="16" height="16" rx="2" fill="#15803D" transform="rotate(25 81 23)" />
  </g>
  <text x="100" y="170" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="#991B1B" text-anchor="middle">کباب و جوجه</text>
</svg>`;

export const SYSTEM_LOCAL_IMAGES: LocalPresetImage[] = [
  { id: 'pres-coffee', name: 'قهوه گرم', category: 'کافه', url: createSvgDataUrl(COFFEE_SVG) },
  { id: 'pres-pizza', name: 'پیتزا تنوری', category: 'فست‌فود', url: createSvgDataUrl(PIZZA_SVG) },
  { id: 'pres-burger', name: 'همبرگر مخصوص', category: 'فست‌فود', url: createSvgDataUrl(BURGER_SVG) },
  { id: 'pres-salad', name: 'سالاد رژیمی', category: 'پیش‌غذا', url: createSvgDataUrl(SALAD_SVG) },
  { id: 'pres-fries', name: 'سیب‌زمینی', category: 'پیش‌غذا', url: createSvgDataUrl(FRIES_SVG) },
  { id: 'pres-cake', name: 'کیک و شیرینی', category: 'کافه', url: createSvgDataUrl(CAKE_SVG) },
  { id: 'pres-soda', name: 'نوشیدنی سرد', category: 'نوشیدنی', url: createSvgDataUrl(SODA_SVG) },
  { id: 'pres-pasta', name: 'پاستا و غذا', category: 'ایرانی/فرنگی', url: createSvgDataUrl(PASTA_SVG) },
  { id: 'pres-sandwich', name: 'ساندویچ و اسنک', category: 'فست‌فود', url: createSvgDataUrl(SANDWICH_SVG) },
  { id: 'pres-kebab', name: 'کباب و جوجه', category: 'ایرانی/فرنگی', url: createSvgDataUrl(KEBAB_SVG) },
];
