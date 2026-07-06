import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  QrCode, 
  Smartphone, 
  BarChart3, 
  MapPin, 
  Palette, 
  Settings, 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck, 
  Store, 
  Sparkles, 
  Flame, 
  UtensilsCrossed, 
  Coffee, 
  Users, 
  Zap, 
  ChevronRight,
  ShoppingBag,
  BellRing,
  Star,
  HelpCircle,
  Heart,
  TrendingUp,
  DollarSign,
  Layers,
  Send,
  Share2
} from 'lucide-react';
import { Restaurant } from '../types';

interface LandingPageProps {
  restaurants: Restaurant[];
  onEnterRole: (role: 'platform' | 'restaurant' | 'customer') => void;
  onSelectRestaurant: (id: string) => void;
}

export default function LandingPage({ restaurants, onEnterRole, onSelectRestaurant }: LandingPageProps) {
  // Brand Customizer state for Phone Mockup
  const [activeBrandColor, setActiveBrandColor] = useState({
    name: 'زعفرانی لوکس',
    primary: '#f59e0b', // amber-500
    bg: '#fffbeb', // amber-50
    text: 'text-amber-600',
    btnBg: 'bg-amber-500 hover:bg-amber-600'
  });

  const brandColors = [
    {
      name: 'زعفرانی لوکس',
      primary: '#f59e0b',
      bg: '#fffbeb',
      text: 'text-amber-600',
      btnBg: 'bg-amber-500 hover:bg-amber-600'
    },
    {
      name: 'زمردی سلامت',
      primary: '#10b981',
      bg: '#ecfdf5',
      text: 'text-emerald-600',
      btnBg: 'bg-emerald-500 hover:bg-emerald-600'
    },
    {
      name: 'زرشکی سنتی',
      primary: '#be123c',
      bg: '#fff1f2',
      text: 'text-rose-600',
      btnBg: 'bg-rose-600 hover:bg-rose-700'
    },
    {
      name: 'شاه‌بلوطی کلاسیک',
      primary: '#b45309',
      bg: '#fdf6e2',
      text: 'text-amber-800',
      btnBg: 'bg-amber-700 hover:bg-amber-800'
    },
    {
      name: 'نیلی مدرن',
      primary: '#6366f1',
      bg: '#e0e7ff',
      text: 'text-indigo-600',
      btnBg: 'bg-indigo-600 hover:bg-indigo-700'
    }
  ];

  // Interactive phone menu state
  const [phoneCartCount, setPhoneCartCount] = useState(0);
  const [lastAddedItem, setLastAddedItem] = useState<string | null>(null);
  const [phoneActiveCategory, setPhoneActiveCategory] = useState('hot');

  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Pricing Interval (Monthly / Yearly)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const demoItems = [
    { id: '1', name: 'اسپرسو دبل آرت', price: '۵۹,۰۰۰', desc: '۱۰۰٪ عربیکا کلمبیا، بادی سنگین و غلیظ', category: 'hot', icon: '☕' },
    { id: '2', name: 'وافل نوتلا پلاس', price: '۱۲۵,۰۰۰', desc: 'همراه با موز، توت فرنگی و بستنی وانیل', category: 'dessert', icon: '🧇' },
    { id: '3', name: 'کیک هویج و گردو', price: '۸۵,۰۰۰', desc: 'بافت لطیف خانگی با کرم پنیر خوش‌طعم', category: 'dessert', icon: '🍰' },
    { id: '4', name: 'آیس لاته کارامل', price: '۹۵,۰۰۰', desc: 'قهوه اسپرسو سرد شده با سیروپ کارامل دست‌ساز', category: 'cold', icon: '🥤' }
  ];

  const handlePhoneAddToCart = (itemName: string) => {
    setPhoneCartCount(prev => prev + 1);
    setLastAddedItem(itemName);
    setTimeout(() => {
      setLastAddedItem(null);
    }, 2500);
  };

  const handleScrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-20 py-4 font-sans text-slate-800 bg-linear-to-b from-slate-50 via-white to-slate-50 rounded-3xl" dir="rtl">
      
      {/* ================= HEADER MENU (NAVIGATION BAR) ================= */}
      <header className="sticky top-4 z-50 mx-4 md:mx-8 bg-white/80 backdrop-blur-md border border-slate-150/80 rounded-2xl p-4 shadow-xs flex items-center justify-between transition-all">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-tr from-indigo-600 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <UtensilsCrossed className="w-5.5 h-5.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-slate-900 tracking-tight">منو تک</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-md font-bold">SaaS</span>
            </div>
            <span className="text-[10px] text-slate-400 block font-bold mt-0.5">منوساز هوشمند رستوران و کافه</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-black text-slate-600">
          <button onClick={() => handleScrollToId('features')} className="hover:text-indigo-600 transition-colors cursor-pointer">ویژگی‌ها</button>
          <button onClick={() => handleScrollToId('simulator')} className="hover:text-indigo-600 transition-colors cursor-pointer">پیش‌نمایش گوشی</button>
          <button onClick={() => handleScrollToId('steps')} className="hover:text-indigo-600 transition-colors cursor-pointer">راهنمای راه‌اندازی</button>
          <button onClick={() => handleScrollToId('pricing')} className="hover:text-indigo-600 transition-colors cursor-pointer">پلن‌های قیمت‌گذاری</button>
          <button onClick={() => handleScrollToId('testimonials')} className="hover:text-indigo-600 transition-colors cursor-pointer">نظرات مشتریان</button>
          <button onClick={() => handleScrollToId('faq')} className="hover:text-indigo-600 transition-colors cursor-pointer">پرسش‌های متداول</button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { window.location.hash = '#/login'; }}
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-all rounded-xl cursor-pointer"
          >
            <span>ورود مدیران</span>
          </button>
          <button
            onClick={() => { window.location.hash = '#/register'; }}
            className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-xs shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            راه‌اندازی رایگان کافه
          </button>
        </div>
      </header>

      {/* ================= 1. HERO SECTION WITH BACKGROUND GRADIENTS ================= */}
      <section className="relative mx-4 md:mx-8 bg-slate-950 rounded-[3rem] p-8 md:p-16 overflow-hidden shadow-2xl border border-slate-900">
        {/* Futuristic glowing elements */}
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none -mr-40 -mt-40 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -ml-40 -mb-40" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left/Content Column */}
          <div className="lg:col-span-7 space-y-8 text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 rounded-full text-[10px] md:text-xs font-black tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>پلتفرم مدرن منو تک (نسخه جدید ۲۰۲۶)</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight font-sans tracking-tight">
              فروش کافه خود را با<br/>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-orange-400 to-indigo-400">
                منوی دیجیتال تعاملی
              </span> چند برابر کنید!
            </h1>
            
            <p className="text-slate-300 text-xs md:text-sm lg:text-base leading-relaxed max-w-xl font-medium">
              با منو تک، مشتریان شما با اسکن ساده <span className="text-amber-400 font-extrabold">QR Code اختصاصی روی میز</span>، علاوه بر مشاهده منوی اختصاصی با تصاویر لوکس، سفارش خود را بدون اتلاف وقت ثبت می‌کنند. سفارش مستقیماً به پنل آشپزخانه رستوران فرستاده شده و ثانیه به ثانیه ردیابی می‌شود.
            </p>

            {/* Quick platform stats */}
            <div className="grid grid-cols-3 gap-6 border-y border-slate-900 py-6 max-w-xl">
              <div className="text-right">
                <span className="block text-2xl md:text-3xl font-black text-amber-400 font-sans tracking-wider">٪۱۰۰</span>
                <span className="block text-[10px] md:text-xs text-slate-400 mt-1 font-bold">طراحی مدرن موبایل (SPA)</span>
              </div>
              <div className="text-right border-x border-slate-900 px-4">
                <span className="block text-2xl md:text-3xl font-black text-indigo-400 font-sans tracking-wider">۳ گام</span>
                <span className="block text-[10px] md:text-xs text-slate-400 mt-1 font-bold">راه‌اندازی بدون نیاز به تخصص</span>
              </div>
              <div className="text-right">
                <span className="block text-2xl md:text-3xl font-black text-emerald-400 font-sans tracking-wider">زنده</span>
                <span className="block text-[10px] md:text-xs text-slate-400 mt-1 font-bold">نوتیفیکیشن پخت آشپزخانه</span>
              </div>
            </div>

            {/* Quick Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => { window.location.hash = '#/platform-admin'; }}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs md:text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/45 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>ورود به پنل مدیریت کل (SaaS)</span>
                <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={() => {
                  onSelectRestaurant('rest-1');
                  onEnterRole('customer');
                }}
                className="px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 rounded-2xl font-black text-xs md:text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>مشاهده دمو روی گوشی مجازی</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-4 text-slate-500 text-[10px] font-bold">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> بدون نیاز به نصب برنامه</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> بدون کارمزد تراکنش‌ها</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> پشتیبانی ۲۴ ساعته</span>
            </div>
          </div>
          
          {/* Right/Interactive Mockup Column */}
          <div id="simulator" className="lg:col-span-5 flex flex-col items-center justify-center relative pt-6 lg:pt-0">
            {/* Ambient glows behind device */}
            <div className="absolute w-80 h-80 bg-indigo-500/10 rounded-full blur-[70px] -z-10" />
            
            {/* 3D SmartPhone Frame with buttons */}
            <div className="relative w-[300px] h-[610px]">
              {/* Physical side buttons */}
              {/* Action Button - left */}
              <div className="absolute -left-1 top-20 w-[4px] h-6 bg-slate-800 rounded-l-md border-y border-slate-700 shadow-xs" />
              {/* Volume Up - left */}
              <div className="absolute -left-1 top-32 w-[4px] h-12 bg-slate-800 rounded-l-md border-y border-slate-700 shadow-xs" />
              {/* Volume Down - left */}
              <div className="absolute -left-1 top-[190px] w-[4px] h-12 bg-slate-800 rounded-l-md border-y border-slate-700 shadow-xs" />
              {/* Power Button - right */}
              <div className="absolute -right-1 top-36 w-[4px] h-16 bg-slate-800 rounded-r-md border-y border-slate-700 shadow-xs" />

              {/* Main phone body */}
              <div className="w-full h-full bg-slate-950 rounded-[3rem] p-3 border-[6px] border-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10 relative flex flex-col overflow-hidden">
                
                {/* Dynamic Island Capsule */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6.5 bg-black rounded-full z-50 flex items-center justify-between px-3 shadow-inner">
                  {/* Left lens */}
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900/90 border border-slate-950 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-indigo-950/70" />
                  </div>
                  {/* Right green indicator */}
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse opacity-80" />
                </div>

                {/* Phone screen inside */}
                <div className="flex-1 bg-slate-50 rounded-[2.4rem] overflow-hidden flex flex-col relative text-slate-800 font-sans text-right select-none pt-9 pb-2 border border-slate-950/25">
                  
                  {/* Simulated iOS Top Status Bar */}
                  <div className="absolute top-2 inset-x-5 h-6 flex justify-between items-center text-[10px] font-extrabold text-neutral-800 z-40 select-none" dir="ltr">
                    {/* Time */}
                    <span className="font-sans leading-none tracking-tight">09:41</span>
                    
                    {/* Status Icons */}
                    <div className="flex items-center gap-1">
                      {/* Signal */}
                      <div className="flex items-end gap-[1.5px] h-2">
                        <div className="w-[2px] h-1 bg-neutral-800 rounded-[0.5px]" />
                        <div className="w-[2px] h-1.5 bg-neutral-800 rounded-[0.5px]" />
                        <div className="w-[2px] h-2 bg-neutral-800 rounded-[0.5px]" />
                        <div className="w-[2px] h-2.5 bg-neutral-800 rounded-[0.5px]" />
                      </div>
                      
                      {/* 5G / Wifi indicator */}
                      <span className="text-[7.5px] tracking-tighter leading-none text-neutral-500 font-bold">5G</span>
                      
                      {/* Battery */}
                      <div className="w-5.5 h-2.5 border border-neutral-800 rounded-[3.5px] p-[1.5px] flex items-center">
                        <div className="h-full w-[85%] bg-neutral-800 rounded-[1.5px]" />
                        <div className="w-0.5 h-1 bg-neutral-800 rounded-r-[0.5px] -mr-[0.5px]" />
                      </div>
                    </div>
                  </div>

                  {/* Simulated App Header */}
                  <div className="px-4 pt-4 pb-3 border-b border-neutral-100 flex justify-between items-center bg-white/95 backdrop-blur-md sticky top-0 z-20 shadow-3xs">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-sm" style={{ color: activeBrandColor.primary, backgroundColor: activeBrandColor.bg }}>
                        ☕
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-neutral-800 block">کافه امبر لوکس</span>
                        <span className="text-[7px] text-neutral-400 block font-bold">منوی دیجیتال رومیزی</span>
                      </div>
                    </div>
                    
                    {/* Cart icon with real indicator */}
                    <div className="relative">
                      <div className="w-8 h-8 rounded-xl border border-neutral-100 flex items-center justify-center text-neutral-600 transition-transform active:scale-90 shadow-3xs hover:bg-neutral-50 bg-white">
                        <ShoppingBag className="w-4 h-4" style={{ color: activeBrandColor.primary }} />
                      </div>
                      {phoneCartCount > 0 && (
                        <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center px-1 border border-white">
                          {phoneCartCount}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Simulated Categories tab */}
                  <div className="px-3.5 py-2.5 bg-neutral-50/50 border-b border-neutral-100 flex gap-2 overflow-x-auto scrollbar-none">
                    {[
                      { id: 'hot', label: 'گرم ☕' },
                      { id: 'cold', label: 'سرد 🥤' },
                      { id: 'dessert', label: 'دسر 🧇' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setPhoneActiveCategory(cat.id)}
                        className="px-3.5 py-1.5 rounded-full text-[9px] font-black whitespace-nowrap transition-all duration-300 transform active:scale-95 cursor-pointer shadow-3xs"
                        style={{
                          backgroundColor: phoneActiveCategory === cat.id ? activeBrandColor.primary : '#ffffff',
                          color: phoneActiveCategory === cat.id ? '#ffffff' : '#525252',
                          border: phoneActiveCategory === cat.id ? `1px solid ${activeBrandColor.primary}` : '1px solid #e5e5e5'
                        }}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Live Food Items list */}
                  <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-neutral-50/40 scrollbar-none">
                    {demoItems
                      .filter(item => item.category === phoneActiveCategory)
                      .map((item) => (
                        <div key={item.id} className="p-2.5 bg-white border border-neutral-150 rounded-2xl hover:border-neutral-250 transition-all flex items-center gap-3 shadow-3xs relative overflow-hidden group">
                          {/* Inner ambient glow on hover */}
                          <div className="absolute inset-0 bg-neutral-50/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                          
                          <div className="w-12 h-12 bg-neutral-50 border border-neutral-100 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-3xs group-hover:scale-105 transition-transform duration-300">
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0 pr-0.5">
                            <h4 className="font-extrabold text-[10px] text-neutral-800 truncate">{item.name}</h4>
                            <p className="text-[7.5px] text-neutral-400 truncate mt-0.5 leading-relaxed">{item.desc}</p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-[9.5px] font-black" style={{ color: activeBrandColor.primary }}>
                                {item.price} تومان
                              </span>
                              
                              <button
                                onClick={() => handlePhoneAddToCart(item.name)}
                                className="px-2.5 py-1 text-[8px] text-white font-black rounded-lg transition-transform active:scale-95 shrink-0 shadow-3xs cursor-pointer"
                                style={{ backgroundColor: activeBrandColor.primary }}
                              >
                                + افزودن
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Sticky simulated bottom bar */}
                  <div className="p-3 bg-white border-t border-neutral-100 text-center text-[8.5px] text-neutral-400 font-extrabold flex items-center justify-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>منو تک • سفارش روی میز شماره ۴</span>
                  </div>

                  {/* Simulated Notification Toast inside Phone */}
                  <AnimatePresence>
                    {lastAddedItem && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-12 left-3 right-3 p-2.5 bg-slate-900/95 backdrop-blur-sm text-white rounded-xl text-[9px] font-black flex items-center justify-between shadow-lg z-30 border border-white/5"
                      >
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>به سبد خرید اضافه شد</span>
                        </span>
                        <span className="text-slate-300 truncate max-w-[90px] font-extrabold">{lastAddedItem}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Home Indicator */}
                <div className="w-24 h-1 bg-slate-800 mx-auto rounded-full mt-2" />
              </div>
            </div>

            {/* Live Interactive theme badge for the user */}
            <div className="mt-6 bg-slate-900/90 border border-slate-800/80 px-4.5 py-3 rounded-2xl max-w-xs text-center space-y-2.5 shadow-lg">
              <span className="text-[10px] text-slate-400 font-extrabold block">
                تغییر زنده رنگ برند در گوشی فرضی:
              </span>
              <div className="flex gap-2.5 justify-center">
                {brandColors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveBrandColor(color)}
                    className={`w-5.5 h-5.5 rounded-full border transition-all ${activeBrandColor.primary === color.primary ? 'scale-125 border-white ring-2 ring-indigo-500/50' : 'border-transparent hover:scale-110'}`}
                    style={{ backgroundColor: color.primary }}
                    title={color.name}
                  />
                ))}
              </div>
              <span className="text-[9px] text-amber-400 font-black block">
                رنگ فعال: {activeBrandColor.name}
              </span>
            </div>

          </div>
          
        </div>
      </section>

      {/* ================= BRAND CAROUSEL (MOCK CLIENT LOGOS) ================= */}
      <section className="px-6 md:px-12 text-center space-y-4">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">کافه‌ها و رستوران‌های برتر همکار ما</span>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-60">
          <div className="flex items-center gap-2 font-black text-slate-400 text-sm md:text-base"><Coffee className="w-5 h-5 text-indigo-500" /> کافه ملورین</div>
          <div className="flex items-center gap-2 font-black text-slate-400 text-sm md:text-base"><Store className="w-5 h-5 text-amber-500" /> رستوران ملل شاندیز</div>
          <div className="flex items-center gap-2 font-black text-slate-400 text-sm md:text-base"><Flame className="w-5 h-5 text-rose-500" /> پیتزا ناپولی</div>
          <div className="flex items-center gap-2 font-black text-slate-400 text-sm md:text-base"><Coffee className="w-5 h-5 text-emerald-500" /> گرین لانژ</div>
          <div className="flex items-center gap-2 font-black text-slate-400 text-sm md:text-base"><UtensilsCrossed className="w-5 h-5 text-sky-500" /> همبرگر ذغالی جک</div>
        </div>
      </section>

      {/* ================= 2. CORE FEATURES BENTO GRID SECTION ================= */}
      <section id="features" className="px-6 md:px-12 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-100 text-amber-600 rounded-full text-[10px] font-black">
            <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>امکانات بی رقیب</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
            تمام ابزارهای موردنیاز شما در یک پلتفرم جامع
          </h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            ما همه‌چیز را برای دیجیتال کردن کامل کافه و رستوران شما، از مدیریت سفارش‌ها تا نقشه‌های پیشرفته ارسال، فراهم کرده‌ایم.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-6.5 border border-slate-150 hover:border-indigo-500 hover:shadow-lg transition-all duration-300 group space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">سفارش‌گیری هوشمند مبتنی بر میز</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-2">
                هر میز دارای یک QR Code اختصاصی است. مشتریان بدون معطل شدن برای گارسون، منو را بررسی کرده و سفارش خود را با شماره میز ثبت می‌کنند.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-6.5 border border-slate-150 hover:border-amber-500 hover:shadow-lg transition-all duration-300 group space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <BellRing className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">ردیابی زنده وضعیت غذا</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-2">
                مشتری پس از ثبت سفارش، صفحه فاکتور زنده‌ای دریافت می‌کند که وضعیت پخت و آماده‌سازی غذاها را ثانیه به ثانیه مستقیماً در مرورگر نشان می‌دهد.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-6.5 border border-slate-150 hover:border-emerald-500 hover:shadow-lg transition-all duration-300 group space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">آدرس‌دهی دستی و نقشه برای ارسال</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-2">
                برای سفارشات بیرون‌بر یا پیک، مشتری می‌تواند به راحتی لوکیشن خود را روی نقشه مشخص کرده و همزمان آدرس متنی دقیق را به صورت دستی تایپ کند.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-3xl p-6.5 border border-slate-150 hover:border-rose-500 hover:shadow-lg transition-all duration-300 group space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">پنل پخت اختصاصی آشپزخانه</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-2">
                مدیریت و صاحبان رستوران پنل کاربری جذابی دارند تا تمام سفارشات ورودی را تایید کنند، در حال پخت بگذارند، یا به پیک موتور تحویل دهند.
              </p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-3xl p-6.5 border border-slate-150 hover:border-purple-500 hover:shadow-lg transition-all duration-300 group space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">شخصی‌سازی بی حد و مرز قالب</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-2">
                تغییر بی‌درنگ رنگ اصلی، تصاویر پس‌زمینه، اطلاعات لوگو، نام دسته‌بندی‌ها و قیمت غذاها از داخل پنل مدیریت بدون داشتن تخصص فنی.
              </p>
            </div>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-3xl p-6.5 border border-slate-150 hover:border-sky-500 hover:shadow-lg transition-all duration-300 group space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">نمودارها و گزارشات مالی پیشرفته</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-2">
                محاسبه اتوماتیک فروش روزانه، تعداد تراکنش‌ها و نمودار پیشرفت درآمد ماهانه برای ردیابی عملکرد تجاری کافه و ارتقای بازاریابی.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ================= 3. INTERACTIVE SIMULATED ADMIN DASHBOARD SHOWCASE ================= */}
      <section className="mx-4 md:mx-8 bg-slate-50 rounded-[2.5rem] p-6 md:p-12 border border-slate-200/80 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 text-right">
            <h3 className="text-xl md:text-3xl font-black text-slate-800 leading-tight">شبیه‌ساز زنده پنل مدیریت رستوران</h3>
            <p className="text-xs md:text-sm text-slate-500 max-w-xl leading-relaxed">
              پنل مدیریت تعاملی صاحبان رستوران با قابلیت مشاهده زنده سفارشات، نمودار درآمد روزانه، مدیریت دسته‌ها و چاپ سریع کدهای QR برای میزها.
            </p>
          </div>
          <button 
            onClick={() => { window.location.hash = '#/restaurant-admin'; }} 
            className="self-start md:self-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl flex items-center gap-2 shadow-xs shrink-0 transition-all cursor-pointer"
          >
            <span>ورود مستقیم به پنل مدیریت رستوران</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Dashboard Mockup Component */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Top header bar */}
          <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-rose-400 rounded-full" />
              <span className="w-3 h-3 bg-amber-400 rounded-full" />
              <span className="w-3 h-3 bg-emerald-400 rounded-full" />
              <span className="text-[10px] text-slate-400 font-extrabold mr-2">پنل مدیریت منو تک</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-600 font-extrabold bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-[10px]">
              <Store className="w-4 h-4" />
              <span>کافه امیران (اشتراک فعال)</span>
            </div>
          </div>

          {/* Simulated stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 md:p-6 bg-slate-50/50 border-b border-slate-150">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-extrabold block">مجموع فروش امروز</span>
              <span className="text-sm md:text-base font-black text-slate-850 block mt-1">۱,۸۵۰,۰۰۰ تومان</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-extrabold block">سفارشات تحویل شده</span>
              <span className="text-sm md:text-base font-black text-emerald-600 block mt-1">۱۸ سفارش</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-extrabold block">در انتظار تایید</span>
              <span className="text-sm md:text-base font-black text-amber-500 block mt-1 animate-pulse">۳ سفارش نو</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-extrabold block">تعداد کل میزها</span>
              <span className="text-sm md:text-base font-black text-indigo-600 block mt-1">۱۲ میز فعال</span>
            </div>
          </div>

          {/* Main content split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6">
            
            {/* Table/List of pending orders */}
            <div className="lg:col-span-7 space-y-3">
              <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5 mb-2">
                <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>سفارش‌های در جریان (زنده):</span>
              </h4>

              {/* Order item row 1 */}
              <div className="p-3 bg-amber-50/40 border border-amber-200/60 rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 bg-amber-500 text-white rounded-md text-[9px] font-black">در انتظار تایید</span>
                  <div className="text-xs font-black text-slate-800 mt-1">سفارش شماره #۴۹۸۲ • <span className="text-amber-600">میز ۴</span></div>
                  <div className="text-[10px] text-slate-500">۲ عدد پیتزا پپرونی، ۱ عدد نوشابه لیمویی</div>
                </div>
                <div className="text-left">
                  <span className="text-xs font-black text-slate-850 block">۲۹۵,۰۰۰ تومان</span>
                  <span className="text-[8px] text-slate-400 block mt-1 font-bold">۲ دقیقه پیش</span>
                </div>
              </div>

              {/* Order item row 2 */}
              <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 bg-indigo-600 text-white rounded-md text-[9px] font-black">در حال پخت</span>
                  <div className="text-xs font-black text-slate-800 mt-1">سفارش شماره #۴۹۸۱ • <span className="text-indigo-600">میز ۱۲</span></div>
                  <div className="text-[10px] text-slate-500">۱ عدد پاستا آلفردو، ۲ عدد موهیتو طبیعی</div>
                </div>
                <div className="text-left">
                  <span className="text-xs font-black text-slate-850 block">۳۸۰,۰۰۰ تومان</span>
                  <span className="text-[8px] text-slate-400 block mt-1 font-bold">۱۰ دقیقه پیش</span>
                </div>
              </div>

              {/* Order item row 3 */}
              <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-md text-[9px] font-black">تحویل داده شده</span>
                  <div className="text-xs font-black text-slate-800 mt-1">سفارش شماره #۴۹۸۰ • <span className="text-emerald-600">پیک بیرون‌بر</span></div>
                  <div className="text-[10px] text-slate-500">۱ عدد همبرگر ذغالی با پنیر، ۱ عدد سیب زمینی سرخ شده</div>
                </div>
                <div className="text-left">
                  <span className="text-xs font-black text-slate-850 block">۲۲۰,۰۰۰ تومان</span>
                  <span className="text-[8px] text-slate-400 block mt-1 font-bold">۲۵ دقیقه پیش</span>
                </div>
              </div>
            </div>

            {/* Simulated interactive QR preview */}
            <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center space-y-4">
              <QrCode className="w-12 h-12 text-indigo-600 shrink-0" />
              <div className="space-y-1">
                <h5 className="text-xs font-black text-slate-800">کدهای QR اختصاصی میزها را دریافت کنید</h5>
                <p className="text-[10px] text-slate-500 leading-relaxed max-w-xs">
                  تنها با وارد کردن شماره میزها، پلتفرم برای هر کدام کیوآرکد منحصربه‌فرد با آدرس اختصاصی همان میز تولید می‌کند تا فاکتورها دقیق ثبت شوند.
                </p>
              </div>
              <button 
                onClick={() => onEnterRole('restaurant')}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-extrabold text-[10px] rounded-xl border border-indigo-200 transition-all cursor-pointer"
              >
                برو به مدیریت میزها و چاپ QR
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 4. THREE EASY STEPS SECTION ================= */}
      <section id="steps" className="px-6 md:px-12 space-y-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full text-[10px] font-black">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>راه‌اندازی آسان</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">کافه خود را تنها در ۳ مرحله متحول کنید</h3>
          <p className="text-xs text-slate-500">چگونه منو تک به راحتی کیفیت سفارش‌گیری رستوران شما را ارتقا می‌دهد؟</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <div className="bg-white p-6.5 rounded-3xl border border-slate-150 text-center relative space-y-4 shadow-2xs hover:shadow-xs transition-all">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-sm shadow-md">
              ۱
            </div>
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mt-2">
              <Store className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-800 text-sm">ثبت نام و اطلاعات کافه</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              مشخصات، لوگو، شماره تماس، آدرس و رنگ اختصاصی برند کافه یا رستوران خود را در پنل ثبت کنید.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6.5 rounded-3xl border border-slate-150 text-center relative space-y-4 shadow-2xs hover:shadow-xs transition-all">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-sm shadow-md">
              ۲
            </div>
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mt-2">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-800 text-sm">تعریف منو و دسته‌ها</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              دسته‌بندی‌های دلخواه را بسازید و نام، قیمت، جزییات و تصویر غذاها و نوشیدنی‌ها را قرار دهید.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6.5 rounded-3xl border border-slate-150 text-center relative space-y-4 shadow-2xs hover:shadow-xs transition-all">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-sm shadow-md">
              ۳
            </div>
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mt-2">
              <QrCode className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-slate-800 text-sm">پرینت QR و شروع سفارش‌گیری</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              کدهای کیوآر اختصاصی هر میز را دانلود و چاپ کنید. حالا مشتری اسکن می‌کند و لذت می‌برد!
            </p>
          </div>

        </div>
      </section>

      {/* ================= PRICING & SUBSCRIPTION PLANS SECTION ================= */}
      <section id="pricing" className="px-6 md:px-12 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full text-[10px] font-black">
            <DollarSign className="w-3.5 h-3.5" />
            <span>پلن‌های اشتراکی مقرون‌به‌صرفه</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">هزینه کمتر، کارایی بسیار بالاتر</h3>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">یک پلن متناسب با اندازه کسب‌وکار خود انتخاب کنید و از امکانات فوق‌العاده منو تک بهره‌مند شوید.</p>
          
          {/* Monthly / Yearly Toggle */}
          <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 mt-2">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${billingCycle === 'monthly' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              ماهانه
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <span>سالانه</span>
              <span className="text-[9px] px-1 bg-amber-400 text-slate-950 rounded-sm font-black animate-pulse">۲۰٪ تخفیف</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6.5 max-w-5xl mx-auto">
          
          {/* Plan 1 */}
          <div className="bg-white rounded-3xl p-6.5 border border-slate-150 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[9px] font-black px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">پایه / تست مستقل</span>
              <h4 className="text-base font-black text-slate-800">برنز آزمایشی</h4>
              <p className="text-xs text-slate-400">مناسب کافه‌های نوپا و تست سیستم سفارش‌گیری دیجیتال.</p>
              
              <div className="pt-2">
                <span className="text-2xl font-black text-slate-800 font-sans tracking-wide">رایگان</span>
                <span className="text-xs text-slate-400 font-medium"> / بدون محدودیت زمانی</span>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-3.5 text-xs text-slate-600">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> منوی دیجیتال تا ۳۰ قلم غذا</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> سقف ۵ میز اختصاصی</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> مدیریت سفارشات پایه</div>
                <div className="text-slate-300 line-through flex items-center gap-2"><span>نقشه و محدوده ارسال بیرون‌بر</span></div>
                <div className="text-slate-300 line-through flex items-center gap-2"><span>نمودارهای پیشرفته درآمد مالی</span></div>
              </div>
            </div>
            
            <button onClick={() => onEnterRole('platform')} className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-black text-xs border border-slate-200 transition-colors cursor-pointer">
              شروع رایگان
            </button>
          </div>

          {/* Plan 2 */}
          <div className="bg-white rounded-3xl p-6.5 border-2 border-indigo-600 flex flex-col justify-between space-y-6 relative shadow-lg">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white rounded-full text-[9px] font-black tracking-wider shadow-sm flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>پیشنهاد ویژه کافه‌داران</span>
            </div>

            <div className="space-y-4">
              <span className="text-[9px] font-black px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md">کامل‌ترین پنل</span>
              <h4 className="text-base font-black text-slate-800">نقره‌ای حرفه‌ای</h4>
              <p className="text-xs text-slate-400">برای کافه‌ها و رستوران‌های پرمشتری که به دنبال ارتقای سرعت پخت هستند.</p>
              
              <div className="pt-2">
                <span className="text-2xl font-black text-indigo-600 font-sans tracking-wide">
                  {billingCycle === 'monthly' ? '۲۹۰,۰۰۰' : '۲۳۰,۰۰۰'}
                </span>
                <span className="text-xs text-slate-400 font-medium"> تومان / ماه</span>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-3.5 text-xs text-slate-600">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" /> منوی دیجیتال نامحدود غذا و دسر</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" /> کدهای QR نامحدود برای تمامی میزها</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" /> پنل مدیریت زنده آشپزخانه و پخت</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" /> نقشه ارسال پیک بیرون‌بر و آدرس دستی</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" /> شخصی‌سازی کامل قالب و تم برندینگ</div>
              </div>
            </div>
            
            <button onClick={() => onEnterRole('platform')} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer">
              انتخاب پلن حرفه‌ای
            </button>
          </div>

          {/* Plan 3 */}
          <div className="bg-white rounded-3xl p-6.5 border border-slate-150 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[9px] font-black px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md">رستوران‌های زنجیره‌ای</span>
              <h4 className="text-base font-black text-slate-800">طلایی VIP</h4>
              <p className="text-xs text-slate-400">مناسب هلدینگ‌ها و مجموعه‌های دارای شعبات متعدد و سیستم متمرکز.</p>
              
              <div className="pt-2">
                <span className="text-2xl font-black text-slate-800 font-sans tracking-wide">
                  {billingCycle === 'monthly' ? '۵۹۰,۰۰۰' : '۴۷۰,۰۰۰'}
                </span>
                <span className="text-xs text-slate-400 font-medium"> تومان / ماه</span>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-3.5 text-xs text-slate-600">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> تمامی قابلیت‌های پلن نقره‌ای</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> اتصال به چندین پنل اختصاصی شعب</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> بهینه‌سازی بارگذاری سریع منو</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> گزارشات فایل اکسل و خروجی فاکتورها</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> پشتیبانی تلفنی اختصاصی VIP</div>
              </div>
            </div>
            
            <button onClick={() => onEnterRole('platform')} className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-black text-xs border border-slate-200 transition-colors cursor-pointer">
              تماس با بخش فروش
            </button>
          </div>

        </div>
      </section>

      {/* ================= TESTIMONIALS SECTION ================= */}
      <section id="testimonials" className="px-6 md:px-12 space-y-8 bg-slate-50 py-12 rounded-[2.5rem]">
        <div className="text-center space-y-2">
          <span className="text-[10px] text-indigo-600 font-extrabold block">نظر صاحبان موفق کافه‌ها</span>
          <h3 className="text-2xl font-black text-slate-900">مشتریان ما چه می‌گویند؟</h3>
          <p className="text-xs text-slate-500">رضایت همکاران ما، انگیزه توسعه مداوم منو تک است.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          {/* Testimonial 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-150 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              «سرعت ثبت سفارش و ردیابی وضعیت غذا بی‌نظیر است. مشتریان از اینکه نیازی به معطل شدن برای گارسون ندارند، بسیار خوشحالند.»
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-black">ع</div>
              <div>
                <span className="block text-xs font-black text-slate-800">جناب علی مرادی</span>
                <span className="block text-[10px] text-slate-400">مدیر داخلی کافه ملورین</span>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-150 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              «قابلیت نوشتن آدرس دستی در کنار نقشه‌ی فرضی، دغدغه سفارشات پیک بیرون‌بر ما را حل کرد. مشتری آدرس را تایپ می‌کند و پیک ما دقیقاً تحویل می‌دهد.»
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-xs font-black">س</div>
              <div>
                <span className="block text-xs font-black text-slate-800">سرکار خانم سارا امیری</span>
                <span className="block text-[10px] text-slate-400">صاحب مطبخ بزرگ امیران</span>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-150 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              «نمودارهای درآمد و پنل آشپزخانه واقعاً زیبا طراحی شده‌اند. به راحتی متوجه می‌شویم چه غذاهایی در روز محبوب‌تر بوده‌اند تا تدارک لازم را ببینیم.»
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-black">ر</div>
              <div>
                <span className="block text-xs font-black text-slate-800">جناب رضا شهام</span>
                <span className="block text-[10px] text-slate-400">موسس زنجیره‌ای کافه لانژ</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section id="faq" className="px-6 md:px-12 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-widest block">راهنمای شفاف</span>
          <h3 className="text-2xl font-black text-slate-900">پاسخ به سوالات متداول شما</h3>
          <p className="text-xs text-slate-500">پاسخ به برخی سوالات پر تکرار کافه‌داران محترم در مورد منو تک.</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3.5">
          {[
            {
              q: 'چگونه مشتریان از منوی دیجیتال استفاده می‌کنند؟ آیا نیاز به نصب برنامه است؟',
              a: 'خیر، مشتریان به هیچ‌وجه نیاز به نصب هیچ‌گونه اپلیکیشنی ندارند. آن‌ها به سادگی با دوربین گوشی خود، کد QR نصب شده روی میز کافه شما را اسکن می‌کنند و منوی ریسپانسیو و تعاملی کافه شما تحت وب باز می‌شود.'
            },
            {
              q: 'تغییر دادن قیمت غذاها یا تصاویر آن‌ها در منو چگونه انجام می‌شود؟',
              a: 'شما به عنوان صاحب کافه، دسترسی کامل به پنل مدیریت کافه اختصاصی خود دارید. در هر ساعت از شبانه‌روز می‌توانید قیمت‌ها را تغییر دهید، آیتم جدید اضافه کنید یا غذای ناموجود را با یک کلیک غیرفعال کنید. تغییرات در کسری از ثانیه در موبایل مشتریان اعمال خواهد شد.'
            },
            {
              q: 'سیستم ثبت آدرس برای تحویل با پیک چگونه عمل می‌کند؟',
              a: 'مشتریان در کنار قابلیت فرضی لوکیشن نقشه، به راحتی می‌توانند آدرس متنی دقیق خود را به صورت دستی یادداشت کنند. سیستم منو تک آدرس دستی را اولویت فاکتور پیک قرار می‌دهد تا ارسال بدون خطا انجام شود.'
            },
            {
              q: 'آیا سفارشاتی که توسط مشتریان ثبت می‌شوند به پنل آشپزخانه متصل هستند؟',
              a: 'بله کاملاً! تمامی سفارشات به صورت زنده بدون نیاز به لود مجدد صفحه در پنل مدیریت صاحب رستوران نشان داده می‌شوند. شما می‌توانید با زدن دکمه تایید، سفارش را وارد مرحله پخت کنید تا بلافاصله مشتری در صفحه فاکتور خود وضعیت تغییر یافته را ردیابی کند.'
            },
            {
              q: 'چگونه کدهای QR اختصاصی برای میزهای کافه بسازیم؟',
              a: 'تنها کافی است در پنل مدیریت رستوران بخش مربوط به میزها، شماره میزها را بنویسید. سیستم به طور خودکار کدهای کیوآر اختصاصی هر میز را به صورت عکس با کیفیت تولید می‌کند تا بتوانید آن‌ها را به راحتی دانلود و پرینت بگیرید.'
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-150 rounded-2xl overflow-hidden transition-all duration-300">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full px-5 py-4 flex justify-between items-center text-right font-extrabold text-xs md:text-sm text-slate-800 hover:bg-slate-50/50 cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className={`text-indigo-600 transition-transform duration-250 ${openFaqIndex === idx ? 'rotate-180' : ''}`}>
                  <HelpCircle className="w-5 h-5 shrink-0" />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openFaqIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-slate-100"
                  >
                    <div className="px-5 py-4 text-xs text-slate-500 leading-relaxed font-medium bg-slate-50/30">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 5. PREMIUM CALL TO ACTION SECTION ================= */}
      <section className="mx-4 md:mx-8 bg-indigo-600 text-white rounded-[2.5rem] p-8 md:p-14 text-center space-y-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none -ml-20 -mt-20" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/15 rounded-full blur-3xl pointer-events-none -mr-20 -mb-20" />
        
        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          <h3 className="text-xl md:text-3.5xl font-black">همین حالا کافه خود را دیجیتالی کنید</h3>
          <p className="text-xs md:text-sm text-indigo-100 leading-relaxed font-medium">
            بدون پرداخت هزینه‌های گران‌قیمت توسعه اپلیکیشن و سرور، با منو تک صاحب پیشرفته‌ترین سیستم منوی دیجیتال کشور شوید. به راحتی میان تب‌های بالا سوییچ کنید تا دمو را تست کنید.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center relative z-10 pt-2">
          <button
            onClick={() => onEnterRole('platform')}
            className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-700 font-black text-xs md:text-sm rounded-2xl hover:bg-slate-50 transition-all duration-200 shadow-md cursor-pointer"
          >
            شروع کنید (ثبت رایگان کافه)
          </button>
          
          <button
            onClick={() => {
              onSelectRestaurant('rest-1');
              onEnterRole('customer');
            }}
            className="w-full sm:w-auto px-6 py-4 bg-indigo-700 text-white border border-indigo-500 font-extrabold text-xs md:text-sm rounded-2xl hover:bg-indigo-800 transition-all duration-200 cursor-pointer"
          >
            تست منوی مشتری روی موبایل
          </button>
        </div>
      </section>

      {/* ================= COMPREHENSIVE LANDING FOOTER ================= */}
      <footer className="mx-4 md:mx-8 bg-slate-900 text-slate-400 rounded-t-[2.5rem] p-8 md:p-14 space-y-12">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4 text-right">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black shadow-md">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-sm font-black text-white tracking-tight">پلتفرم منو تک</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              سامانه نرم‌افزاری ابری چندمستاجره (SaaS) جهت یکپارچه‌سازی و نوسازی خدمات منوی دیجیتال، ردیابی سفارش و تحویل با نقشه در سرتاسر کافه‌های کشور.
            </p>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold pt-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
              <span>ساخته شده با عشق برای صنف رستوران‌داران</span>
            </div>
          </div>

          {/* Column 2: Products */}
          <div className="space-y-4 text-right">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">بخش‌های مختلف پلتفرم</h4>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => onEnterRole('customer')} className="hover:text-white transition-colors cursor-pointer text-right w-full">منوی تعاملی مشتریان کافه</button></li>
              <li><button onClick={() => onEnterRole('restaurant')} className="hover:text-white transition-colors cursor-pointer text-right w-full">پنل مدیریت صاحبان رستوران</button></li>
              <li><button onClick={() => onEnterRole('platform')} className="hover:text-white transition-colors cursor-pointer text-right w-full">پنل ناظر و مدیر کل SaaS</button></li>
              <li><a href="#simulator" className="hover:text-white transition-colors">پیش‌نمایش در گوشی شبیه‌سازی شده</a></li>
            </ul>
          </div>

          {/* Column 3: Features */}
          <div className="space-y-4 text-right">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">برخی قابلیت‌ها</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-1.5 justify-start"><span>• آدرس‌دهی دستی و لوکیشن نقشه</span></li>
              <li className="flex items-center gap-1.5 justify-start"><span>• پنل زنده پخت و آشپزخانه</span></li>
              <li className="flex items-center gap-1.5 justify-start"><span>• چاپ اتوماتیک کیوآرکدهای میز</span></li>
              <li className="flex items-center gap-1.5 justify-start"><span>• شخصی‌سازی آسان رنگ و تصاویر</span></li>
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div className="space-y-4 text-right">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">عضویت در خبرنامه منو تک</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              از آخرین مقالات ما در مورد دیجیتالی کردن کافه‌ها و افزایش رضایت مشتریان مطلع شوید.
            </p>
            
            {/* Mock input newsletter */}
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="ایمیل شما..."
                className="flex-1 text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl focus:outline-hidden focus:border-indigo-500 font-sans text-white text-right"
              />
              <button className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-colors cursor-pointer">
                عضویت
              </button>
            </div>
          </div>

        </div>

        {/* Divider line */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold">
          
          {/* Copyright text */}
          <div className="text-slate-500 text-center md:text-right">
            © ۱۴۰۵ منو تک (MenuTek). تمامی حقوق برای شبیه‌ساز SaaS کافه‌داری محفوظ است.
          </div>

          {/* Bottom links */}
          <div className="flex items-center gap-6 text-slate-500">
            <a href="#faq" className="hover:text-slate-300 transition-colors">سوالات متداول</a>
            <span>•</span>
            <a href="#pricing" className="hover:text-slate-300 transition-colors">شرایط اشتراک</a>
            <span>•</span>
            <a href="#features" className="hover:text-slate-300 transition-colors">راهنمای پلتفرم</a>
          </div>

        </div>

      </footer>

    </div>
  );
}
