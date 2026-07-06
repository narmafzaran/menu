import React, { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, Compass, ShieldAlert } from 'lucide-react';
import { Restaurant } from '../types';

interface MapSelectorProps {
  restaurant: Restaurant;
  onLocationSelected: (address: string, coordinates: { lat: number; lng: number }, isValid: boolean) => void;
}

const TEHRAN_SPOTS = [
  { name: 'میدان ونک', x: 180, y: 190, dist: 1.5, desc: 'تهران، میدان ونک، ابتدای ملاصدرا' },
  { name: 'میدان تجریش', x: 200, y: 80, dist: 3.8, desc: 'تهران، میدان تجریش، خیابان شهرداری' },
  { name: 'سعادت‌آباد', x: 110, y: 140, dist: 2.9, desc: 'تهران، سعادت آباد، بلوار شهرداری، خیابان ۱۶' },
  { name: 'نیاوران', x: 280, y: 90, dist: 3.2, desc: 'تهران، نیاوران، میدان باهنر' },
  { name: 'بلوار کشاورز', x: 190, y: 280, dist: 4.5, desc: 'تهران، بلوار کشاورز، تقاطع کارگر شمالی' },
  { name: 'صادقیه', x: 70, y: 220, dist: 5.2, desc: 'تهران، فلکه اول صادقیه، پاساژ تهرانی' }
];

export default function MapSelector({ restaurant, onLocationSelected }: MapSelectorProps) {
  const [pin, setPin] = useState({ x: 200, y: 200 }); // center of the map
  const [distanceKm, setDistanceKm] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [addressText, setAddressText] = useState('');
  const [isInRange, setIsInRange] = useState(true);

  // Translate restaurant center
  const centerX = 200;
  const centerY = 200;

  // Convert pixels to KM (based on delivery range and mapping scaling)
  // Let 100 pixels represent the delivery range in KM
  const pixelsPerKm = 100 / (restaurant.deliveryRange || 5);

  const calculateDistance = (x: number, y: number) => {
    const dx = x - centerX;
    const dy = y - centerY;
    const pixelDistance = Math.sqrt(dx * dx + dy * dy);
    const km = pixelDistance / pixelsPerKm;
    return parseFloat(km.toFixed(1));
  };

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPin({ x, y });
    const km = calculateDistance(x, y);
    setDistanceKm(km);

    const valid = km <= restaurant.deliveryRange;
    setIsInRange(valid);

    // Generate a simulated Persian address based on coordinates
    let simulatedAddress = `تهران، محدوده ${restaurant.name}، فاز فرضی، مختصات نسبی (${x.toFixed(0)}, ${y.toFixed(0)})`;
    setAddressText(simulatedAddress);
    onLocationSelected(simulatedAddress, { lat: 35.7 + (y / 10000), lng: 51.4 + (x / 10000) }, valid);
  };

  const selectSpot = (spot: typeof TEHRAN_SPOTS[0]) => {
    setPin({ x: spot.x, y: spot.y });
    const km = calculateDistance(spot.x, spot.y);
    setDistanceKm(km);

    const valid = km <= restaurant.deliveryRange;
    setIsInRange(valid);
    setAddressText(spot.desc);
    setSearchQuery(spot.name);
    onLocationSelected(spot.desc, { lat: 35.7 + (spot.y / 10000), lng: 51.4 + (spot.x / 10000) }, valid);
  };

  useEffect(() => {
    // Reset location when restaurant changes
    setPin({ x: centerX, y: centerY });
    setDistanceKm(0);
    setIsInRange(true);
    setAddressText(`${restaurant.address} (محدوده اطراف مجموعه)`);
  }, [restaurant]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-xs" dir="rtl">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-semibold text-neutral-800 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-amber-500" />
          <span>محل تحویل سفارش روی نقشه</span>
        </label>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${isInRange ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {isInRange ? `محدوده مجاز ارسال (${restaurant.deliveryRange} کیلومتر)` : 'خارج از محدوده ارسال پیک رستوران'}
        </span>
      </div>

      {/* Search Input for preset areas */}
      <div className="relative mb-3">
        <Search className="absolute right-3 top-2.5 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="جستجوی محله‌های معروف تهران (مثال: ونک، نیاوران...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs pr-9 pl-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-amber-500 font-sans"
        />
        {searchQuery && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-100 rounded-lg shadow-lg max-h-40 overflow-y-auto">
            {TEHRAN_SPOTS.filter(s => s.name.includes(searchQuery)).map(spot => (
              <button
                key={spot.name}
                type="button"
                onClick={() => selectSpot(spot)}
                className="w-full text-right px-3 py-2 text-xs hover:bg-neutral-50 border-b border-neutral-50 last:border-0 flex items-center justify-between font-sans"
              >
                <span>{spot.name}</span>
                <span className="text-neutral-400">فاصله: ~{spot.dist} کیلومتر</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Graphic (SVG) */}
      <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 h-52 select-none">
        <svg
          className="w-full h-full cursor-crosshair"
          viewBox="0 0 400 400"
          onClick={handleMapClick}
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e5e5" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Mountains representation (Tehran North) */}
          <path d="M 0 50 Q 80 10 160 30 T 320 20 T 400 40 L 400 0 L 0 0 Z" fill="#e5e7eb" opacity="0.6" />
          <text x="350" y="25" fill="#9ca3af" fontSize="10" className="font-sans">کوه‌های شمال</text>

          {/* Major streets (lines) */}
          <line x1="200" y1="0" x2="200" y2="400" stroke="#d4d4d8" strokeWidth="4" /> {/* Valiasr street */}
          <line x1="0" y1="200" x2="400" y2="200" stroke="#d4d4d8" strokeWidth="4" /> {/* Hemmat highway */}
          <text x="210" y="380" fill="#a1a1aa" fontSize="8" transform="rotate(-90 210 380)" className="font-sans">خیابان ولیعصر</text>
          <text x="10" y="190" fill="#a1a1aa" fontSize="8" className="font-sans">بزرگراه همت</text>

          {/* Neighboring simulated zones */}
          <circle cx="110" cy="140" r="15" fill="#fbcfe8" opacity="0.4" />
          <text x="110" y="145" fill="#db2777" fontSize="8" textAnchor="middle" className="font-sans">سعادت‌آباد</text>

          <circle cx="280" cy="90" r="20" fill="#fbcfe8" opacity="0.4" />
          <text x="280" y="95" fill="#db2777" fontSize="8" textAnchor="middle" className="font-sans">نیاوران</text>

          <circle cx="180" cy="190" r="15" fill="#fbcfe8" opacity="0.4" />
          <text x="180" y="195" fill="#db2777" fontSize="8" textAnchor="middle" className="font-sans">ونک</text>

          {/* Restaurant center & radius */}
          <circle
            cx={centerX}
            cy={centerY}
            r={restaurant.deliveryRange * pixelsPerKm}
            fill="#22c55e"
            fillOpacity="0.12"
            stroke="#22c55e"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <circle cx={centerX} cy={centerY} r="8" fill={restaurant.primaryColor} className="animate-ping" style={{ animationDuration: '3s' }} />
          <circle cx={centerX} cy={centerY} r="5" fill={restaurant.primaryColor} stroke="#ffffff" strokeWidth="1.5" />
          <text x={centerX + 10} y={centerY - 10} fill={restaurant.accentColor} fontSize="10" fontWeight="bold" className="font-sans">
            مجموعه {restaurant.name}
          </text>

          {/* Custom Pin drop marker */}
          {pin.x !== centerX && (
            <g transform={`translate(${pin.x - 12}, ${pin.y - 24})`}>
              <path
                d="M12 0C5.373 0 0 5.373 0 12c0 9.333 12 24 12 24s12-14.667 12-24c0-6.627-5.373-12-12-12zm0 18c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"
                fill={isInRange ? '#22c55e' : '#dc2626'}
              />
              <circle cx="12" cy="12" r="4" fill="#ffffff" />
            </g>
          )}
        </svg>

        {/* Compass & helper overlay */}
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs px-2 py-1 rounded text-[10px] text-neutral-600 flex items-center gap-1 font-sans">
          <Compass className="w-3.5 h-3.5 text-neutral-500 animate-spin" style={{ animationDuration: '10s' }} />
          <span>جهت انتخاب، روی هر نقطه نقشه کلیک کنید</span>
        </div>
      </div>

      {/* Selected location stats */}
      <div className="mt-3 p-3 bg-neutral-50 rounded-xl flex flex-col gap-1.5 text-xs text-neutral-700">
        <div className="flex items-center justify-between">
          <span className="font-medium text-neutral-500">فاصله تا مجموعه:</span>
          <span className="font-bold text-neutral-900">{distanceKm} کیلومتر</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-neutral-500">هزینه پیک:</span>
          <span className="font-bold text-neutral-900">
            {isInRange
              ? distanceKm === 0
                ? 'رایگان'
                : `${(restaurant.deliveryFee).toLocaleString('fa-IR')} تومان`
              : 'غیرقابل ارسال (خارج از محدوده)'}
          </span>
        </div>
        <div className="mt-1 flex items-start gap-1.5 border-t border-neutral-200/60 pt-2">
          <Navigation className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-neutral-600 leading-relaxed font-sans">
            <span className="font-semibold text-neutral-800">آدرس انتخابی: </span>
            {addressText || 'روی نقشه کلیک کنید تا آدرس شما مشخص گردد'}
          </p>
        </div>

        {!isInRange && (
          <div className="mt-2 bg-red-50 text-red-800 p-2 rounded-lg flex items-center gap-2 border border-red-100 text-[10px] leading-relaxed font-sans">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
            <span>متأسفانه آدرس شما در محدوده ارسال سریع با پیک این مجموعه نیست. در صورت تمایل می‌توانید سفارش خود را به صورت «بیرون‌بر» ثبت کرده و خودتان جهت دریافت مراجعه کنید.</span>
          </div>
        )}
      </div>
    </div>
  );
}
