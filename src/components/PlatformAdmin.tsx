import React, { useState } from 'react';
import { Plus, Search, Building2, Phone, Calendar, ArrowUpRight, BarChart3, Users, DollarSign, Store, Edit2, Trash2, CheckCircle2, AlertTriangle, ShieldCheck, LogOut } from 'lucide-react';
import { Restaurant, SubscriptionType } from '../types';
import { motion } from 'motion/react';

interface PlatformAdminProps {
  restaurants: Restaurant[];
  onAddRestaurant: (newRest: Omit<Restaurant, 'id'>) => void;
  onUpdateSubscription: (id: string, status: SubscriptionType) => void;
  onDeleteRestaurant: (id: string) => void;
  onSelectRestaurantForManagement: (restaurant: Restaurant) => void;
  onLogout?: () => void;
}

export default function PlatformAdmin({
  restaurants,
  onAddRestaurant,
  onUpdateSubscription,
  onDeleteRestaurant,
  onSelectRestaurantForManagement,
  onLogout
}: PlatformAdminProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [logo, setLogo] = useState('☕');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [workingHours, setWorkingHours] = useState('۰۹:۰۰ الی ۲۳:۰۰');
  const [tablesCount, setTablesCount] = useState(10);
  const [deliveryRange, setDeliveryRange] = useState(5);
  const [deliveryFee, setDeliveryFee] = useState(30000);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionType>('trial');
  const [primaryColor, setPrimaryColor] = useState('#d97706');
  const [bgColor, setBgColor] = useState('#fdfbf7');
  const [accentColor, setAccentColor] = useState('#78350f');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    onAddRestaurant({
      name,
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      logo,
      phone,
      address,
      workingHours,
      tablesCount: Number(tablesCount),
      deliveryRange: Number(deliveryRange),
      deliveryFee: Number(deliveryFee),
      subscriptionStatus,
      primaryColor,
      bgColor,
      accentColor
    });

    // Reset Form
    setName('');
    setSlug('');
    setLogo('☕');
    setPhone('');
    setAddress('');
    setWorkingHours('۰۹:۰۰ الی ۲۳:۰۰');
    setTablesCount(10);
    setDeliveryRange(5);
    setDeliveryFee(30000);
    setSubscriptionStatus('trial');
    setShowAddForm(false);
  };

  // Filter restaurants
  const filteredRestaurants = restaurants.filter(
    r => r.name.includes(searchQuery) || r.slug.includes(searchQuery) || r.address.includes(searchQuery)
  );

  // SaaS statistics
  const totalRests = restaurants.length;
  const activeSubs = restaurants.filter(r => r.subscriptionStatus === 'active').length;
  const trialSubs = restaurants.filter(r => r.subscriptionStatus === 'trial').length;
  const totalTablesSimulated = restaurants.reduce((acc, r) => acc + r.tablesCount, 0);
  const simulatedMonthlySaaSIncome = (activeSubs * 450000) + (trialSubs * 0); // 450,000 Tomans per active SaaS restaurant subscription

  return (
    <div className="space-y-6" dir="rtl">
      {/* SaaS Admin Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-indigo-600" />
            <span>پنل مدیریت کل پلتفرم منو تک (SaaS Owners)</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            داشبورد اختصاصی مدیر پلتفرم جهت ثبت و مدیریت رستوران‌ها، بررسی وضعیت اشتراک‌ها و پایش درآمدهای کل
          </p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>ثبت کافه یا رستوران جدید</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs px-4 py-2.5 rounded-xl border border-rose-100 transition-all cursor-pointer"
            >
              <LogOut className="w-4.5 h-4.5" />
              <span>خروج از پنل</span>
            </button>
          )}
        </div>
      </div>

      {/* SaaS Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-150/80 p-4 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-neutral-400 block">کل مجموعه‌های ثبت شده</span>
            <span className="text-2xl font-black text-neutral-800 mt-1 block">{(totalRests).toLocaleString('fa-IR')} مجموعه</span>
          </div>
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-neutral-150/80 p-4 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-neutral-400 block">اشتراک‌های فعال و تجاری</span>
            <span className="text-2xl font-black text-green-600 mt-1 block">{(activeSubs).toLocaleString('fa-IR')} اشتراک</span>
          </div>
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-neutral-150/80 p-4 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-neutral-400 block">درآمد ماهیانه پلتفرم (SaaS)</span>
            <span className="text-2xl font-black text-indigo-600 mt-1 block">{(simulatedMonthlySaaSIncome).toLocaleString('fa-IR')} <span className="text-xs">تومان</span></span>
          </div>
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-neutral-150/80 p-4 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-neutral-400 block">کل میزهای فعال (بارکد خورده)</span>
            <span className="text-2xl font-black text-neutral-800 mt-1 block">{(totalTablesSimulated).toLocaleString('fa-IR')} میز فعال</span>
          </div>
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Add Restaurant Form Modal/Expand */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-50 rounded-2xl border-2 border-dashed border-indigo-200 p-5 shadow-xs"
        >
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-indigo-100">
            <h3 className="font-extrabold text-neutral-900 text-sm">فرم ثبت کافه یا رستوران جدید در بستر منو تک</h3>
            <button onClick={() => setShowAddForm(false)} className="text-xs text-neutral-400 hover:text-neutral-600">انصراف</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">نام مجموعه (کافه/رستوران):</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: کافه پلاس"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">اسلاگ یکتا (Slug انگلیسی جهت آدرس منو):</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: plus-cafe"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-sans font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">آیکون لوگو (ایموجی یا کاراکتر):</label>
                <select
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-sans"
                >
                  <option value="☕">☕ کافه / قهوه</option>
                  <option value="🍔">🍔 برگر / فست‌فود</option>
                  <option value="🍕">🍕 پیتزا / فست‌فود</option>
                  <option value="🍰">🍰 شیرینی‌فروشی / بستنی</option>
                  <option value="🍱">🍱 رستوران سنتی</option>
                  <option value="🥗">🥗 رژیمی و گیاهی</option>
                  <option value="🍹">🍹 بار آبمیوه و اسموتی</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">شماره تماس مجموعه:</label>
                <input
                  type="text"
                  placeholder="مثال: ۰۲۱۸۸۸۸۴۴۴۴"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">ساعات کاری مجموعه:</label>
                <input
                  type="text"
                  placeholder="مثال: ۰۸:۰۰ الی ۲۳:۳۰"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">تعداد کل میزها:</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={tablesCount}
                  onChange={(e) => setTablesCount(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">شعاع پوشش‌دهی پیک (کیلومتر):</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={deliveryRange}
                  onChange={(e) => setDeliveryRange(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">هزینه پایه پیک (تومان):</label>
                <input
                  type="number"
                  step="5000"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">وضعیت اشتراک پلتفرم:</label>
                <select
                  value={subscriptionStatus}
                  onChange={(e) => setSubscriptionStatus(e.target.value as SubscriptionType)}
                  className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-sans"
                >
                  <option value="trial">آزمایشی رایگان (Trial)</option>
                  <option value="active">فعال و تجاری (Active)</option>
                  <option value="inactive">غیرفعال (Inactive)</option>
                </select>
              </div>
            </div>

            {/* Custom Theme Color Previews */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">رنگ تم اصلی (کدهای دکمه و هدر):</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-neutral-300 shrink-0"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 border border-neutral-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">رنگ پس‌زمینه منو مشتری:</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-neutral-300 shrink-0"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 border border-neutral-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">رنگ نوشته‌ها و عناصر فرعی:</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-neutral-300 shrink-0"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 border border-neutral-200 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-600 block mb-1">آدرس کامل مجموعه:</label>
              <textarea
                rows={2}
                required
                placeholder="آدرس دقیق شعبه کافه/رستوران جهت ارجاع مشتریان..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Building2 className="w-4 h-4" />
              <span>ایجاد و پیکربندی خودکار زیردامنه مجموعه</span>
            </button>
          </form>
        </motion.div>
      )}

      {/* Search and List */}
      <div className="bg-white rounded-3xl border border-neutral-100 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <h2 className="text-base font-extrabold text-neutral-900">لیست رستوران‌ها و کافه‌های تحت پوشش پلتفرم</h2>
          <div className="relative max-w-xs w-full">
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="جستجو بر اساس نام، آدرس یا دامنه..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pr-9 pl-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-sans"
            />
          </div>
        </div>

        {/* Restaurants Table/Card layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50 text-neutral-500 border-b border-neutral-100 font-bold">
                <th className="p-3">مجموعه / نام رستوران</th>
                <th className="p-3">اطلاعات تماس و آدرس</th>
                <th className="p-3 text-center">تعداد میز</th>
                <th className="p-3 text-center">محدوده ارسال</th>
                <th className="p-3">وضعیت اشتراک پلتفرم</th>
                <th className="p-3 text-center">عملیات مدیریت</th>
              </tr>
            </thead>
            <tbody>
              {filteredRestaurants.map((rest) => (
                <tr key={rest.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center">{rest.logo}</span>
                      <div>
                        <span className="font-extrabold text-neutral-800 text-sm block">{rest.name}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">menutak.ir/menu/{rest.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 max-w-[240px]">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-neutral-700 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-neutral-400" />
                        {rest.phone}
                      </span>
                      <span className="text-neutral-400 text-[10px] truncate block" title={rest.address}>{rest.address}</span>
                    </div>
                  </td>
                  <td className="p-3 text-center font-bold text-neutral-800">{rest.tablesCount} میز</td>
                  <td className="p-3 text-center text-neutral-600 font-medium">{rest.deliveryRange} کیلومتر</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <select
                        value={rest.subscriptionStatus}
                        onChange={(e) => onUpdateSubscription(rest.id, e.target.value as SubscriptionType)}
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold border-0 cursor-pointer focus:outline-hidden ${
                          rest.subscriptionStatus === 'active'
                            ? 'bg-green-50 text-green-700'
                            : rest.subscriptionStatus === 'trial'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        <option value="trial">آزمایشی (Trial)</option>
                        <option value="active">اشتراک فعال (Active)</option>
                        <option value="inactive">غیرفعال (Inactive)</option>
                      </select>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onSelectRestaurantForManagement(rest)}
                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>ورود به پنل مجموعه</span>
                      </button>

                      <button
                        onClick={() => onDeleteRestaurant(rest.id)}
                        className="p-1.5 hover:bg-red-50 text-neutral-400 hover:text-red-600 rounded-lg transition-colors"
                        title="حذف کامل مجموعه"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRestaurants.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-neutral-400 text-xs">
                    هیچ موردی یافت نشد. می‌توانید با کلیک بر روی دکمه بالای صفحه یک مجموعه جدید اضافه کنید.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
