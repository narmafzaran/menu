import React, { useState, useEffect } from 'react';
import {
  QrCode, Settings, ShoppingBag, Plus, FolderPlus, ToggleLeft, ToggleRight, Trash2,
  DollarSign, TrendingUp, CheckCircle2, ShoppingCart, User, MapPin, Clock, Edit3,
  Instagram, Send, Sparkles, Filter, ChevronRight, Activity, Percent, LogOut,
  Cloud, Check, AlertCircle
} from 'lucide-react';
import { Restaurant, Category, MenuItem, Order, SubscriptionType, OrderStatus } from '../types';
import QRCodeModal from './QRCodeModal';
import { motion, AnimatePresence } from 'motion/react';
import { apiSaveMenu } from '../lib/api';

interface RestaurantAdminProps {
  restaurant: Restaurant;
  categories: Category[];
  menuItems: MenuItem[];
  orders: Order[];
  onUpdateRestaurant: (updatedRest: Restaurant) => void;
  onAddCategory: (name: string) => void;
  onToggleCategory: (id: string, active: boolean) => void;
  onDeleteCategory: (id: string) => void;
  onAddMenuItem: (item: Omit<MenuItem, 'id' | 'restaurantId'>) => void;
  onToggleMenuItem: (id: string, active: boolean) => void;
  onDeleteMenuItem: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onLogout?: () => void;
}

export default function RestaurantAdmin({
  restaurant,
  categories,
  menuItems,
  orders,
  onUpdateRestaurant,
  onAddCategory,
  onToggleCategory,
  onDeleteCategory,
  onAddMenuItem,
  onToggleMenuItem,
  onDeleteMenuItem,
  onUpdateOrderStatus,
  onLogout
}: RestaurantAdminProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'branding'>('overview');
  const [showQRModal, setShowQRModal] = useState(false);

  // States for Cloud publishing
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<boolean | null>(null);

  const handlePublishMenu = async () => {
    setPublishing(true);
    setPublishSuccess(null);
    try {
      const slug = restaurant.slug;
      const restCats = categories.filter(c => c.restaurantId === restaurant.id);
      const restItems = menuItems.filter(i => i.restaurantId === restaurant.id);

      await apiSaveMenu(slug, { rest: restaurant, cats: restCats, items: restItems });
      setPublishSuccess(true);
    } catch (err) {
      console.error('Error publishing to cloud:', err);
      setPublishSuccess(false);
    } finally {
      setPublishing(false);
      setTimeout(() => setPublishSuccess(null), 4000);
    }
  };

  // Automatically publish/sync to cloud on mount to ensure mobile/other browsers have latest data
  useEffect(() => {
    handlePublishMenu();
  }, []);

  // Filter categories and menu items for this restaurant
  const restaurantCategories = categories.filter(c => c.restaurantId === restaurant.id);
  const restaurantMenuItems = menuItems.filter(i => i.restaurantId === restaurant.id);
  const restaurantOrders = orders.filter(o => o.restaurantId === restaurant.id);

  // States for Category addition
  const [newCatName, setNewCatName] = useState('');

  // States for Item addition
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemCatId, setNewItemCatId] = useState(restaurantCategories[0]?.id || '');
  const [newItemImg, setNewItemImg] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80');

  // Stats Calculations
  const completedOrders = restaurantOrders.filter(o => o.status === 'delivered');
  const totalSales = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalOrdersCount = restaurantOrders.length;
  const averageOrderValue = completedOrders.length > 0 ? Math.round(totalSales / completedOrders.length) : 0;
  const activeItemsCount = restaurantMenuItems.filter(i => i.isActive).length;

  // Active orders filter
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'preparing' | 'delivered' | 'cancelled'>('all');
  const filteredOrders = restaurantOrders.filter(o => orderFilter === 'all' || o.status === orderFilter);

  // Custom branding edit state
  const [editName, setEditName] = useState(restaurant.name);
  const [editPhone, setEditPhone] = useState(restaurant.phone);
  const [editAddress, setEditAddress] = useState(restaurant.address);
  const [editWorkingHours, setEditWorkingHours] = useState(restaurant.workingHours);
  const [editInsta, setEditInsta] = useState(restaurant.instagram || '');
  const [editTelegram, setEditTelegram] = useState(restaurant.telegram || '');
  const [editPrimary, setEditPrimary] = useState(restaurant.primaryColor);
  const [editBg, setEditBg] = useState(restaurant.bgColor);
  const [editAccent, setEditAccent] = useState(restaurant.accentColor);
  const [editDeliveryRange, setEditDeliveryRange] = useState(restaurant.deliveryRange);
  const [editDeliveryFee, setEditDeliveryFee] = useState(restaurant.deliveryFee);

  const handleBrandingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRestaurant({
      ...restaurant,
      name: editName,
      phone: editPhone,
      address: editAddress,
      workingHours: editWorkingHours,
      instagram: editInsta,
      telegram: editTelegram,
      primaryColor: editPrimary,
      bgColor: editBg,
      accentColor: editAccent,
      deliveryRange: Number(editDeliveryRange),
      deliveryFee: Number(editDeliveryFee)
    });
  };

  const handleAddCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onAddCategory(newCatName);
    setNewCatName('');
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice || !newItemCatId) return;
    onAddMenuItem({
      name: newItemName,
      price: Number(newItemPrice),
      description: newItemDesc,
      categoryId: newItemCatId,
      image: newItemImg,
      isActive: true
    });
    setNewItemName('');
    setNewItemPrice('');
    setNewItemDesc('');
  };

  // Mock prefilled high quality foods for faster selection when adding a new item
  const MOCK_FOOD_PRESETS = [
    { name: 'قهوه فرانسه', img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80' },
    { name: 'پیتزا پپرونی', img: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&auto=format&fit=crop&q=80' },
    { name: 'سالاد سزار', img: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&auto=format&fit=crop&q=80' },
    { name: 'کیک هویج', img: 'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?w=400&auto=format&fit=crop&q=80' },
    { name: 'سیب‌زمینی ساده', img: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&auto=format&fit=crop&q=80' }
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Restaurant Header */}
      <div className="bg-white rounded-3xl border border-neutral-100 p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-3 bg-neutral-50 rounded-2xl border border-neutral-100">{restaurant.logo}</span>
          <div>
            <h1 className="text-xl font-black text-neutral-900 flex items-center gap-1.5">
              <span>مدیریت منوی دیجیتال {restaurant.name}</span>
              <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">فعال</span>
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
              <span>آدرس منو مشتری:</span>
              <a href={`#/menu/${restaurant.slug}`} target="_blank" rel="noreferrer" className="text-indigo-600 font-mono font-semibold hover:underline">
                menutak.ir/menu/{restaurant.slug}
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePublishMenu}
            disabled={publishing}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer ${
              publishing
                ? 'bg-indigo-50 text-indigo-400 border border-indigo-100 cursor-not-allowed'
                : publishSuccess === true
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : publishSuccess === false
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {publishing ? (
              <span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            ) : publishSuccess === true ? (
              <Check className="w-4 h-4" />
            ) : publishSuccess === false ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <Cloud className="w-4 h-4" />
            )}
            <span>
              {publishing
                ? 'در حال انتشار...'
                : publishSuccess === true
                ? 'منو منتشر شد!'
                : publishSuccess === false
                ? 'خطا در انتشار'
                : 'انتشار منوی دیجیتال'}
            </span>
          </button>

          <button
            onClick={() => setShowQRModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>ایجاد بارکد QR میزها</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-extrabold rounded-xl border border-rose-100 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج از پنل</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-neutral-200 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 text-xs font-extrabold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${activeTab === 'overview' ? 'border-amber-500 text-amber-600' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}
        >
          <Activity className="w-4 h-4" />
          <span>میز کار و آمار کل</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 text-xs font-extrabold transition-all border-b-2 flex items-center gap-1.5 shrink-0 relative ${activeTab === 'orders' ? 'border-amber-500 text-amber-600' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>سفارش‌های دریافتی</span>
          {restaurantOrders.filter(o => o.status === 'pending').length > 0 && (
            <span className="absolute -top-1 left-0 bg-red-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold animate-pulse">
              {restaurantOrders.filter(o => o.status === 'pending').length}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('menu');
            // Auto select category if none set
            if (!newItemCatId && restaurantCategories.length > 0) {
              setNewItemCatId(restaurantCategories[0].id);
            }
          }}
          className={`pb-3 px-4 text-xs font-extrabold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${activeTab === 'menu' ? 'border-amber-500 text-amber-600' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}
        >
          <Sparkles className="w-4 h-4" />
          <span>مدیریت دسته‌بندی و آیتم‌ها</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`pb-3 px-4 text-xs font-extrabold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${activeTab === 'branding' ? 'border-amber-500 text-amber-600' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}
        >
          <Settings className="w-4 h-4" />
          <span>برندینگ و اطلاعات مجموعه</span>
        </button>
      </div>

      {/* Tabs Content */}
      <div>
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Core KPI widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-neutral-100 p-4 rounded-2xl shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-400">کل فروش تایید شده</span>
                  <span className="text-xl font-black text-neutral-800 mt-1 block">{(totalSales).toLocaleString('fa-IR')} <span className="text-xs">تومان</span></span>
                </div>
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white border border-neutral-100 p-4 rounded-2xl shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-400">تعداد کل فاکتورها</span>
                  <span className="text-xl font-black text-neutral-800 mt-1 block">{(totalOrdersCount).toLocaleString('fa-IR')} سفارش</span>
                </div>
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white border border-neutral-100 p-4 rounded-2xl shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-400">میانگین مبلغ هر سفارش</span>
                  <span className="text-xl font-black text-neutral-800 mt-1 block">{(averageOrderValue).toLocaleString('fa-IR')} <span className="text-xs">تومان</span></span>
                </div>
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white border border-neutral-100 p-4 rounded-2xl shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-400">آیتم‌های فعال در منو</span>
                  <span className="text-xl font-black text-neutral-800 mt-1 block">{(activeItemsCount).toLocaleString('fa-IR')} محصول</span>
                </div>
                <div className="w-10 h-10 bg-neutral-50 text-neutral-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Simulated Sales Chart & Top Selling Items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Custom SVG Line Chart */}
              <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-xs lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-extrabold text-neutral-800 text-sm">نمودار روند فروش هفتگی</h3>
                    <p className="text-[10px] text-neutral-400">میزان فروش ناخالص در روزهای اخیر</p>
                  </div>
                  <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>روند صعودی</span>
                  </span>
                </div>

                {/* Vector Custom line chart */}
                <div className="h-44 relative mt-4">
                  <svg className="w-full h-full" viewBox="0 0 500 150">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d97706" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#d97706" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Chart helper lines */}
                    <line x1="0" y1="30" x2="500" y2="30" stroke="#f4f4f5" strokeWidth="1" />
                    <line x1="0" y1="75" x2="500" y2="75" stroke="#f4f4f5" strokeWidth="1" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="#f4f4f5" strokeWidth="1" />

                    {/* Area under line */}
                    <path
                      d="M 10 130 Q 80 110 150 125 T 290 85 T 400 50 T 490 35 L 490 135 L 10 135 Z"
                      fill="url(#chartGrad)"
                    />

                    {/* Sales trend line */}
                    <path
                      d="M 10 130 Q 80 110 150 125 T 290 85 T 400 50 T 490 35"
                      fill="none"
                      stroke={restaurant.primaryColor}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Nodes on points */}
                    <circle cx="10" cy="130" r="4.5" fill="#ffffff" stroke={restaurant.primaryColor} strokeWidth="2.5" />
                    <circle cx="150" cy="125" r="4.5" fill="#ffffff" stroke={restaurant.primaryColor} strokeWidth="2.5" />
                    <circle cx="290" cy="85" r="4.5" fill="#ffffff" stroke={restaurant.primaryColor} strokeWidth="2.5" />
                    <circle cx="400" cy="50" r="4.5" fill="#ffffff" stroke={restaurant.primaryColor} strokeWidth="2.5" />
                    <circle cx="490" cy="35" r="4.5" fill="#ffffff" stroke={restaurant.primaryColor} strokeWidth="2.5" />

                    {/* Labels under graph */}
                    <text x="10" y="148" fill="#a1a1aa" fontSize="9" textAnchor="middle" className="font-sans">شنبه</text>
                    <text x="110" y="148" fill="#a1a1aa" fontSize="9" textAnchor="middle" className="font-sans">دوشنبه</text>
                    <text x="210" y="148" fill="#a1a1aa" fontSize="9" textAnchor="middle" className="font-sans">چهارشنبه</text>
                    <text x="310" y="148" fill="#a1a1aa" fontSize="9" textAnchor="middle" className="font-sans">پنجشنبه</text>
                    <text x="410" y="148" fill="#a1a1aa" fontSize="9" textAnchor="middle" className="font-sans">امروز</text>
                  </svg>
                </div>
              </div>

              {/* Popular categories / Items stats list */}
              <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-xs">
                <h3 className="font-extrabold text-neutral-800 text-sm mb-4">آیتم‌های محبوب منوی شما</h3>
                <div className="space-y-3.5">
                  {restaurantMenuItems.slice(0, 3).map((item, idx) => (
                    <div key={item.id} className="flex items-center justify-between border-b border-neutral-50 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-amber-600 bg-amber-50 w-6 h-6 rounded-lg flex items-center justify-center">{(idx + 1).toLocaleString('fa-IR')}</span>
                        <div>
                          <span className="font-bold text-neutral-800 text-xs block">{item.name}</span>
                          <span className="text-[9px] text-neutral-400">قیمت: {(item.price).toLocaleString('fa-IR')} تومان</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2.5 py-0.5 rounded-full">پر تقاضا</span>
                    </div>
                  ))}
                  {restaurantMenuItems.length === 0 && (
                    <p className="text-xs text-neutral-400 text-center py-6">آیتمی در منو تعریف نشده است.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS MANAGEMENT TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-neutral-50 p-1.5 rounded-xl border border-neutral-100">
              <span className="text-[10px] font-black text-neutral-400 px-2 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                <span>فیلتر سفارشات:</span>
              </span>
              {(['all', 'pending', 'preparing', 'delivered', 'cancelled'] as const).map((filter) => {
                const faLabels: Record<string, string> = {
                  all: 'همه',
                  pending: 'جدید (در انتظار تایید)',
                  preparing: 'در حال آماده‌سازی',
                  delivered: 'تحویل داده شده',
                  cancelled: 'لغو شده'
                };
                return (
                  <button
                    key={filter}
                    onClick={() => setOrderFilter(filter)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${orderFilter === filter ? 'bg-amber-500 text-white shadow-xs' : 'bg-transparent text-neutral-500 hover:text-neutral-700'}`}
                  >
                    {faLabels[filter]}
                  </button>
                );
              })}
            </div>

            {/* Interactive Orders list */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`border rounded-2xl p-4 bg-white transition-all ${
                    order.status === 'pending'
                      ? 'border-red-200 shadow-red-50/50 shadow-md ring-2 ring-red-500/20'
                      : order.status === 'preparing'
                      ? 'border-blue-200'
                      : 'border-neutral-150'
                  }`}
                >
                  {/* Order header */}
                  <div className="flex items-center justify-between border-b border-neutral-50 pb-3 mb-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-neutral-900 text-sm">سفارش {order.id}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                          order.status === 'pending' ? 'bg-red-50 text-red-700' :
                          order.status === 'preparing' ? 'bg-blue-50 text-blue-700' :
                          order.status === 'delivered' ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-500'
                        }`}>
                          {order.status === 'pending' ? 'جدید' :
                           order.status === 'preparing' ? 'در حال پخت' :
                           order.status === 'delivered' ? 'تحویل شد' : 'لغو شده'}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 mt-0.5 block">{new Date(order.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div className="text-left">
                      <span className="text-[10px] text-neutral-400 block">نحوه سفارش:</span>
                      <span className="text-xs font-black text-neutral-700">
                        {order.orderType === 'dine-in' ? `حضوری - میز ${order.tableNumber}` :
                         order.orderType === 'takeaway' ? 'بیرون‌بر (حمل توسط مشتری)' : 'دلیوری (ارسال با پیک)'}
                      </span>
                    </div>
                  </div>

                  {/* Customer info */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600 bg-neutral-50/80 p-2.5 rounded-xl mb-3">
                    <div className="flex items-center gap-1 font-sans">
                      <User className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="font-bold text-neutral-800">{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-1 font-sans">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{order.customerPhone}</span>
                    </div>
                    {order.deliveryAddress && (
                      <div className="col-span-2 flex items-start gap-1 mt-1 font-sans border-t border-neutral-200/50 pt-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed truncate" title={order.deliveryAddress}>{order.deliveryAddress}</span>
                      </div>
                    )}
                  </div>

                  {/* Order items */}
                  <div className="space-y-2 mb-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-start justify-between text-xs border-b border-dashed border-neutral-100 pb-2 last:border-0 last:pb-0">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-neutral-800">{item.name}</span>
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 rounded">{(item.quantity).toLocaleString('fa-IR')}x</span>
                          </div>
                          {item.notes && <p className="text-[10px] text-red-500 mt-1 font-sans">یادداشت: {item.notes}</p>}
                        </div>
                        <span className="font-bold text-neutral-600">{(item.price * item.quantity).toLocaleString('fa-IR')} تومان</span>
                      </div>
                    ))}
                  </div>

                  {/* Total price & Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-150 pt-3">
                    <div className="self-start">
                      <span className="text-[10px] text-neutral-400 block">جمع کل فاکتور:</span>
                      <span className="font-black text-sm text-neutral-900">{(order.totalPrice).toLocaleString('fa-IR')} تومان</span>
                    </div>

                    <div className="flex gap-1.5 w-full sm:w-auto justify-end">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                            className="flex-1 sm:flex-initial py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold transition-colors"
                          >
                            تایید و شروع آماده‌سازی
                          </button>
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'cancelled')}
                            className="py-1.5 px-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-[10px] font-bold transition-colors"
                          >
                            لغو سفارش
                          </button>
                        </>
                      )}

                      {order.status === 'preparing' && (
                        <>
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                            className="flex-1 sm:flex-initial py-1.5 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-bold transition-colors"
                          >
                            تحویل به مشتری / پیک
                          </button>
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'cancelled')}
                            className="py-1.5 px-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-[10px] font-bold transition-colors"
                          >
                            لغو
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredOrders.length === 0 && (
                <div className="col-span-2 text-center py-12 bg-white rounded-3xl border border-neutral-100 text-neutral-400 text-xs">
                  سفارشی در این دسته موجود نیست. به زودی از سمت مشتریان سفارش ثبت خواهد شد!
                </div>
              )}
            </div>
          </div>
        )}

        {/* MENU MANAGER TAB */}
        {activeTab === 'menu' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            {/* Left/Right layouts */}
            {/* Category column */}
            <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-xs h-fit space-y-4">
              <div className="border-b border-neutral-100 pb-3">
                <h3 className="font-extrabold text-neutral-800 text-sm">دسته‌بندی‌های منو</h3>
                <p className="text-[10px] text-neutral-400 mt-0.5">مدیریت هدرهای منوی دیجیتال مشتریان</p>
              </div>

              {/* Add category form */}
              <form onSubmit={handleAddCat} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="عنوان دسته جدید... (مثال: برگر)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-amber-500 font-sans"
                />
                <button
                  type="submit"
                  className="px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              {/* Categories item lists */}
              <div className="space-y-2">
                {restaurantCategories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-xl hover:bg-neutral-100/50 transition-colors">
                    <div>
                      <span className="font-bold text-neutral-800 text-xs block">{cat.name}</span>
                      <span className="text-[9px] text-neutral-400 font-sans">
                        {restaurantMenuItems.filter(i => i.categoryId === cat.id).length} آیتم فعال
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onToggleCategory(cat.id, !cat.isActive)}
                        className="text-neutral-400 hover:text-amber-600 transition-colors"
                        title={cat.isActive ? 'غیرفعال کردن دسته' : 'فعال کردن دسته'}
                      >
                        {cat.isActive ? <ToggleRight className="w-6 h-6 text-amber-500" /> : <ToggleLeft className="w-6 h-6" />}
                      </button>

                      <button
                        onClick={() => onDeleteCategory(cat.id)}
                        className="p-1 text-neutral-300 hover:text-red-500 transition-colors"
                        title="حذف دسته‌بندی"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {restaurantCategories.length === 0 && (
                  <p className="text-center py-6 text-neutral-400 text-xs">هیچ دسته‌ای تعریف نشده است.</p>
                )}
              </div>
            </div>

            {/* Items creation & list column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Add item box */}
              <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-xs">
                <div className="border-b border-neutral-100 pb-3 mb-4">
                  <h3 className="font-extrabold text-neutral-800 text-sm">افزودن آیتم جدید به منو</h3>
                  <p className="text-[10px] text-neutral-400 mt-0.5">افزودن غذا، نوشیدنی یا دسر جدید با قیمت و تصویر دلخواه</p>
                </div>

                <form onSubmit={handleAddItem} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-500 block mb-1">نام محصول / غذا:</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: آیس کافی فندقی"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-amber-500 font-sans"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-500 block mb-1">قیمت فروش (تومان):</label>
                      <input
                        type="number"
                        required
                        placeholder="مثال: ۸۵۰۰۰"
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-amber-500 font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-500 block mb-1">انتخاب دسته‌بندی مربوطه:</label>
                      <select
                        value={newItemCatId}
                        onChange={(e) => setNewItemCatId(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-amber-500 font-sans"
                      >
                        {restaurantCategories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-500 block mb-1">آدرس تصویر (یا انتخاب از پالت زیر):</label>
                      <input
                        type="text"
                        value={newItemImg}
                        onChange={(e) => setNewItemImg(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-amber-500 font-sans font-mono"
                      />
                    </div>
                  </div>

                  {/* Preset quick image select */}
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 block mb-1.5">انتخاب سریع تصاویر پیش‌فرض غذا:</span>
                    <div className="flex flex-wrap gap-2">
                      {MOCK_FOOD_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setNewItemName(preset.name);
                            setNewItemImg(preset.img);
                          }}
                          className="flex items-center gap-1.5 bg-neutral-100 hover:bg-amber-100/40 text-neutral-700 text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all border border-neutral-200/50"
                        >
                          <img src={preset.img} alt={preset.name} className="w-4 h-4 rounded-full object-cover" />
                          <span>{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-500 block mb-1">توضیحات و ترکیبات آیتم:</label>
                    <textarea
                      rows={2}
                      placeholder="مثال: تهیه شده از مرغوب‌ترین دانه‌های ۱۰۰٪ عربیکا به همراه سس کارامل محلی..."
                      value={newItemDesc}
                      onChange={(e) => setNewItemDesc(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-amber-500 font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>افزودن آیتم جدید به منوی رستوران</span>
                  </button>
                </form>
              </div>

              {/* Items list */}
              <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-xs space-y-4">
                <h3 className="font-extrabold text-neutral-800 text-sm border-b border-neutral-50 pb-3">آیتم‌های موجود در منوی مشتریان</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {restaurantMenuItems.map((item) => {
                    const itemCat = restaurantCategories.find(c => c.id === item.categoryId)?.name || 'دسته نامشخص';
                    return (
                      <div key={item.id} className="border border-neutral-100 rounded-2xl p-3 flex gap-3 hover:shadow-xs transition-shadow bg-neutral-50/50">
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between">
                              <span className="font-extrabold text-neutral-800 text-xs block">{item.name}</span>
                              <span className="text-[8px] bg-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded-sm font-sans">{itemCat}</span>
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-1 line-clamp-1 leading-relaxed">{item.description || 'بدون توضیحات'}</p>
                          </div>

                          <div className="flex items-center justify-between border-t border-neutral-100 pt-2 mt-2">
                            <span className="font-bold text-neutral-700 text-[11px]">{(item.price).toLocaleString('fa-IR')} تومان</span>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => onToggleMenuItem(item.id, !item.isActive)}
                                className="text-neutral-400 hover:text-amber-600 transition-colors"
                                title={item.isActive ? 'ناموجود کردن فوری' : 'موجود کردن فوری'}
                              >
                                {item.isActive ? <ToggleRight className="w-5.5 h-5.5 text-amber-500" /> : <ToggleLeft className="w-5.5 h-5.5" />}
                              </button>
                              <button
                                onClick={() => onDeleteMenuItem(item.id)}
                                className="p-1 text-neutral-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {restaurantMenuItems.length === 0 && (
                    <p className="col-span-2 text-center py-8 text-neutral-400 text-xs">هیچ محصولی هنوز ثبت نشده است.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS AND BRANDING TAB */}
        {activeTab === 'branding' && (
          <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-xs animate-fadeIn max-w-3xl">
            <div className="border-b border-neutral-100 pb-3 mb-5">
              <h3 className="font-extrabold text-neutral-800 text-sm">شخصی‌سازی رنگ‌بندی و اطلاعات پایه مجموعه</h3>
              <p className="text-[10px] text-neutral-400 mt-0.5">شخصی‌سازی کامل هویت بصری منوی دیجیتال مشتریان به صورت لحظه‌ای</p>
            </div>

            <form onSubmit={handleBrandingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-neutral-500 block mb-1">نام نمایشی کافه/رستوران:</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden font-sans"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-500 block mb-1">شماره تماس ثابت/پشتیبانی:</label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-neutral-500 block mb-1">ساعات کاری مجموعه:</label>
                  <input
                    type="text"
                    required
                    value={editWorkingHours}
                    onChange={(e) => setEditWorkingHours(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-500 block mb-1">شعاع پیک (KM):</label>
                    <input
                      type="number"
                      required
                      value={editDeliveryRange}
                      onChange={(e) => setEditDeliveryRange(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-neutral-500 block mb-1">هزینه پیک (تومان):</label>
                    <input
                      type="number"
                      required
                      value={editDeliveryFee}
                      onChange={(e) => setEditDeliveryFee(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Branding colors picker */}
              <div className="bg-amber-50/20 border border-amber-100 p-4 rounded-2xl">
                <span className="text-xs font-bold text-amber-800 block mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>طراحی اختصاصی رنگ‌بندی منوی دیجیتال مشتریان</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 block mb-1">رنگ تم اصلی (دکمه‌ها و نشانگرها):</label>
                    <div className="flex gap-1.5">
                      <input
                        type="color"
                        value={editPrimary}
                        onChange={(e) => setEditPrimary(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-neutral-300"
                      />
                      <input
                        type="text"
                        value={editPrimary}
                        onChange={(e) => setEditPrimary(e.target.value)}
                        className="w-full text-xs px-2 py-1 border border-neutral-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 block mb-1">رنگ پس‌زمینه منو مشتری:</label>
                    <div className="flex gap-1.5">
                      <input
                        type="color"
                        value={editBg}
                        onChange={(e) => setEditBg(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-neutral-300"
                      />
                      <input
                        type="text"
                        value={editBg}
                        onChange={(e) => setEditBg(e.target.value)}
                        className="w-full text-xs px-2 py-1 border border-neutral-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-500 block mb-1">رنگ متن و نوشته‌های اصلی:</label>
                    <div className="flex gap-1.5">
                      <input
                        type="color"
                        value={editAccent}
                        onChange={(e) => setEditAccent(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-neutral-300"
                      />
                      <input
                        type="text"
                        value={editAccent}
                        onChange={(e) => setEditAccent(e.target.value)}
                        className="w-full text-xs px-2 py-1 border border-neutral-200 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-neutral-500 block mb-1">شناسه اینستاگرام (Instagram Username):</label>
                  <div className="relative">
                    <Instagram className="absolute right-3 top-2.5 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="example_username"
                      value={editInsta}
                      onChange={(e) => setEditInsta(e.target.value)}
                      className="w-full text-xs pr-9 pl-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden font-sans font-mono text-left"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-500 block mb-1">آی‌دی تلگرام (Telegram ID):</label>
                  <div className="relative">
                    <Send className="absolute right-3 top-2.5 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="example_channel"
                      value={editTelegram}
                      onChange={(e) => setEditTelegram(e.target.value)}
                      className="w-full text-xs pr-9 pl-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden font-sans font-mono text-left"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-500 block mb-1">آدرس فیزیکی مجموعه:</label>
                <textarea
                  rows={2}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Settings className="w-4 h-4" />
                <span>ذخیره نهایی و اعمال برندینگ در منو مشتریان</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* QR Code Modal rendering */}
      <QRCodeModal
        restaurant={restaurant}
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />
    </div>
  );
}
