import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Phone, ArrowLeft, ArrowRight, Sparkles, 
  Building2, Store, ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Restaurant } from '../types';

export interface AuthUser {
  id: string;
  username: string;
  passwordHash: string;
  role: 'platform' | 'restaurant';
  restaurantId?: string;
  name: string;
  phone: string;
}

interface AuthPageProps {
  users: AuthUser[];
  restaurants: Restaurant[];
  defaultMode?: 'login' | 'register';
  isPlatformAdminOnly?: boolean; // If accessing via /platform-admin
  onLoginSuccess: (user: AuthUser) => void;
  onRegisterSuccess: (newUser: AuthUser, newRest: Restaurant) => void;
  onBackToHome: () => void;
}

// Browser-native SHA-256 hashing
export async function hashPassword(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function AuthPage({
  users,
  restaurants,
  defaultMode = 'login',
  isPlatformAdminOnly = false,
  onLoginSuccess,
  onRegisterSuccess,
  onBackToHome
}: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantSlug, setRestaurantSlug] = useState('');

  // Auto-generate slug from restaurant name
  useEffect(() => {
    if (mode === 'register' && restaurantName) {
      const generated = restaurantName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\u0600-\u06FF-]/g, ''); // Allow letters, numbers, hyphens and Persian chars
      setRestaurantSlug(generated);
    }
  }, [restaurantName, mode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!username || !password) {
      setError('لطفاً نام کاربری و رمز عبور را وارد کنید.');
      return;
    }

    setLoading(true);
    try {
      const hashedPassword = await hashPassword(password);
      
      // Find matching user
      const foundUser = users.find(
        u => u.username.toLowerCase() === username.trim().toLowerCase() && u.passwordHash === hashedPassword
      );

      if (!foundUser) {
        setError('نام کاربری یا رمز عبور اشتباه است.');
        setLoading(false);
        return;
      }

      if (isPlatformAdminOnly && foundUser.role !== 'platform') {
        setError('شما دسترسی ورود به پنل مدیریت کل را ندارید.');
        setLoading(false);
        return;
      }

      setSuccess('ورود با موفقیت انجام شد. در حال انتقال...');
      setTimeout(() => {
        onLoginSuccess(foundUser);
        setLoading(false);
      }, 800);

    } catch (err) {
      setError('خطایی در فرآیند ورود رخ داد. لطفا دوباره تلاش کنید.');
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName || !username || !phone || !password || !restaurantName || !restaurantSlug) {
      setError('لطفاً تمامی فیلدهای الزامی را پر کنید.');
      return;
    }

    if (password.length < 4) {
      setError('رمز عبور باید حداقل ۴ کاراکتر باشد.');
      return;
    }

    setLoading(true);
    try {
      // Check if username already exists
      const usernameExists = users.some(u => u.username.toLowerCase() === username.trim().toLowerCase());
      if (usernameExists) {
        setError('این نام کاربری قبلاً ثبت شده است.');
        setLoading(false);
        return;
      }

      // Check if restaurant slug already exists
      const slugExists = restaurants.some(r => r.slug.toLowerCase() === restaurantSlug.trim().toLowerCase());
      if (slugExists) {
        setError('این شناسه اینترنتی (slug) برای کافه دیگری رزرو شده است. لطفاً آن را تغییر دهید.');
        setLoading(false);
        return;
      }

      const hashedPassword = await hashPassword(password);
      const restaurantId = `rest-${Date.now()}`;
      const userId = `user-${Date.now()}`;

      // Create restaurant object
      const newRestaurant: Restaurant = {
        id: restaurantId,
        name: restaurantName,
        slug: restaurantSlug.trim().toLowerCase(),
        logo: '☕',
        phone: phone,
        address: 'ثبت نشده - لطفا از پنل مدیریت آدرس دقیق را وارد کنید.',
        workingHours: '۰۹:۰۰ الی ۲۳:۰۰',
        primaryColor: '#6366f1', // elegant indigo
        bgColor: '#fdfbf7', // warm cream
        accentColor: '#312e81', // deep indigo
        deliveryRange: 5,
        deliveryFee: 30000,
        subscriptionStatus: 'trial', // free trial initially
        tablesCount: 6
      };

      // Create user object
      const newUser: AuthUser = {
        id: userId,
        username: username.trim().toLowerCase(),
        passwordHash: hashedPassword,
        role: 'restaurant',
        restaurantId: restaurantId,
        name: fullName,
        phone: phone
      };

      setSuccess('حساب کاربری و کافه شما با موفقیت ثبت شد! در حال انتقال به پنل...');
      setTimeout(() => {
        onRegisterSuccess(newUser, newRestaurant);
        setLoading(false);
      }, 1000);

    } catch (err) {
      setError('خطایی در فرآیند ثبت‌نام رخ داد. لطفا دوباره تلاش کنید.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 font-sans" dir="rtl">
      <div className="absolute inset-0 bg-linear-to-b from-indigo-50/40 via-white to-slate-50/50 -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl shadow-xl p-8 relative overflow-hidden"
      >
        {/* Background glow decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10" />

        {/* Back Button */}
        <button 
          onClick={onBackToHome}
          className="absolute left-6 top-6 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-xl transition-all flex items-center gap-1 text-[11px] font-bold"
        >
          <span>بازگشت به خانه</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>

        {/* Header Logo & Title */}
        <div className="text-center mb-8 mt-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-2xl text-white mb-3 shadow-md shadow-indigo-600/20">
            {isPlatformAdminOnly ? <ShieldCheck className="w-6 h-6" /> : <Store className="w-6 h-6" />}
          </div>
          <h2 className="text-lg font-black text-slate-800">
            {isPlatformAdminOnly 
              ? 'ورود به پنل مدیریت کل منو تک' 
              : mode === 'login' ? 'ورود به پنل مدیریت کافه' : 'راه‌اندازی و عضویت در منو تک'}
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">
            {isPlatformAdminOnly 
              ? 'بخش اختصاصی مدیر پلتفرم چندمستاجره SaaS' 
              : mode === 'login' ? 'اطلاعات کاربری خود را برای ورود وارد کنید' : 'در کمتر از یک دقیقه منوی دیجیتال کافه خود را بسازید'}
          </p>
        </div>

        {/* Notification Toasts */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-start gap-2.5 text-xs font-bold leading-relaxed"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-start gap-2.5 text-xs font-bold leading-relaxed"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
            <span>{success}</span>
          </motion.div>
        )}

        {/* Forms */}
        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-black text-slate-500 mb-1.5 mr-1">نام کاربری</label>
              <div className="relative">
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <User className="w-4.5 h-4.5" />
                </span>
                <input
                  type="text"
                  placeholder="مثال: admin یا autumn"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-4 pr-10.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs outline-hidden font-sans font-medium transition-all"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-500 mb-1.5 mr-1">رمز عبور</label>
              <div className="relative">
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-4.5 h-4.5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs outline-hidden font-sans font-medium transition-all"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-black text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-6"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>ورود به حساب کاربری</span>
                  <ArrowRight className="w-4 h-4 text-white transform rotate-180" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[11px] font-black text-slate-500 mb-1.5 mr-1">نام و نام خانوادگی مدیر</label>
                <input
                  type="text"
                  placeholder="مثال: رضا محمدی"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs outline-hidden font-sans font-medium transition-all"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-500 mb-1.5 mr-1">نام کاربری اختصاصی (جهت ورود بعدی)</label>
                <div className="relative">
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="مثال: rezamohammadi"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-4 pr-10.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs outline-hidden font-sans font-medium transition-all"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-500 mb-1.5 mr-1">شماره تماس مدیر</label>
                <div className="relative">
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Phone className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="tel"
                    placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-4 pr-10.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs outline-hidden font-sans font-medium transition-all"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-500 mb-1.5 mr-1">نام کافه یا رستوران شما</label>
                <div className="relative">
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Building2 className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="مثال: کافه لوتوس"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    className="w-full pl-4 pr-10.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs outline-hidden font-sans font-medium transition-all"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-black text-slate-500 mr-1">شناسه اینترنتی منو (Slug انگلیسی/فارسی)</label>
                </div>
                <div className="relative" dir="ltr">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-semibold">
                    menutak.ir/menu/
                  </span>
                  <input
                    type="text"
                    placeholder="lotus-cafe"
                    value={restaurantSlug}
                    onChange={(e) => setRestaurantSlug(e.target.value)}
                    className="w-full pl-[100px] pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs outline-hidden font-mono font-medium transition-all text-left"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-500 mb-1.5 mr-1">رمز عبور ایمن</label>
                <div className="relative">
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="حداقل ۴ کاراکتر"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs outline-hidden font-sans font-medium transition-all"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white font-black text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-6"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>ایجاد کافه و دریافت منوی دیجیتال</span>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Toggle Footer */}
        {!isPlatformAdminOnly && (
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-slate-500 font-medium">
                هنوز عضو منو تک نشده‌اید؟{' '}
                <button
                  type="button"
                  onClick={() => { setError(''); setMode('register'); }}
                  className="text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  ثبت‌نام رایگان کافه جدید
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500 font-medium">
                قبلاً ثبت‌نام کرده‌اید؟{' '}
                <button
                  type="button"
                  onClick={() => { setError(''); setMode('login'); }}
                  className="text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  وارد پنل مدیریت شوید
                </button>
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
