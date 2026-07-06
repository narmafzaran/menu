import React, { useState } from 'react';
import {
  ShoppingCart, Search, MapPin, Phone, User, Clock, Check, ChevronLeft,
  ArrowRight, Heart, Minus, Plus, MessageSquare, Compass, CheckCircle2, Info, Instagram, Send
} from 'lucide-react';
import { Restaurant, Category, MenuItem, Order, OrderItem, OrderType } from '../types';
import MapSelector from './MapSelector';
import { motion, AnimatePresence } from 'motion/react';

interface CustomerMenuProps {
  restaurant: Restaurant;
  categories: Category[];
  menuItems: MenuItem[];
  onPlaceOrder: (order: Omit<Order, 'id' | 'restaurantId' | 'restaurantName' | 'status' | 'createdAt'>) => void;
  activeOrder: Order | null;
}

export default function CustomerMenu({ restaurant, categories, menuItems, onPlaceOrder, activeOrder }: CustomerMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Checkout states
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [tableNumber, setTableNumber] = useState(() => {
    return localStorage.getItem(`menumix_table_${restaurant.id}`) || '';
  });
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCoords, setDeliveryCoords] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [isDeliveryValid, setIsDeliveryValid] = useState(true);
  const [orderNotes, setOrderNotes] = useState('');

  // Item custom notes in cart
  const [editingNotesIndex, setEditingNotesIndex] = useState<number | null>(null);
  const [tempNotesText, setTempNotesText] = useState('');

  // Filter categories and items for this restaurant
  const restaurantCategories = categories.filter(c => c.restaurantId === restaurant.id && c.isActive);
  const restaurantMenuItems = menuItems.filter(i => i.restaurantId === restaurant.id && i.isActive);

  // Filter items by category and search
  const filteredItems = restaurantMenuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
    const matchesSearch = item.name.includes(searchQuery) || item.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  // Cart operations
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, amount: number) => {
    setCart(prev => {
      return prev.map(i => {
        if (i.id === id) {
          const newQty = i.quantity + amount;
          return newQty > 0 ? { ...i, quantity: newQty } : null;
        }
        return i;
      }).filter(Boolean) as OrderItem[];
    });
  };

  const saveItemNotes = (index: number) => {
    setCart(prev => prev.map((item, idx) => idx === index ? { ...item, notes: tempNotesText } : item));
    setEditingNotesIndex(null);
    setTempNotesText('');
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCost = orderType === 'delivery' ? restaurant.deliveryFee : 0;
  const finalTotal = cartTotal + deliveryCost;

  const handleLocationChange = (address: string, coords: { lat: number; lng: number }, isValid: boolean) => {
    setDeliveryAddress(address);
    setDeliveryCoords(coords);
    setIsDeliveryValid(true); // Always true to avoid blocking checkout
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (orderType === 'dine-in' && !tableNumber) return;
    if (orderType === 'delivery' && !deliveryAddress) return;

    onPlaceOrder({
      items: cart,
      totalPrice: finalTotal,
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
      customerName,
      customerPhone,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
      deliveryCoordinates: orderType === 'delivery' ? deliveryCoords : undefined,
      notes: orderNotes
    });

    // Clear cart and close screens
    setCart([]);
    setShowCart(false);
    setShowCheckout(false);
  };

  // Get status text for active tracking
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'در انتظار تایید رستوران';
      case 'preparing': return 'درحال آماده‌سازی در آشپزخانه';
      case 'delivered': return 'تحویل داده شد نوش جان!';
      case 'cancelled': return 'سفارش متاسفانه لغو گردید';
      default: return 'ناشناس';
    }
  };

  const getStatusStepIndex = (status: string) => {
    switch (status) {
      case 'pending': return 1;
      case 'preparing': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen pb-24 font-sans antialiased selection:bg-amber-100" style={{ backgroundColor: restaurant.bgColor, color: restaurant.accentColor }} dir="rtl">
      {/* Maximum compact layout wrap simulating high-fidelity smartphone display */}
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative flex flex-col border-x border-neutral-100 pb-16">
        
        {/* Dynamic Tracking Floating Bar if there is an active order */}
        {activeOrder && (
          <div className="bg-amber-500 text-white p-3.5 flex items-center justify-between sticky top-0 z-40 shadow-md">
            <div className="flex items-center gap-2">
              <span className="animate-ping rounded-full h-2 w-2 bg-white" />
              <div>
                <span className="text-xs font-bold block">سفارش فعال شماره {activeOrder.id}</span>
                <span className="text-[10px] font-medium opacity-90">{getStatusLabel(activeOrder.status)}</span>
              </div>
            </div>
            <div className="text-left">
              <span className="text-[10px] block opacity-80">نحوه سفارش:</span>
              <span className="text-xs font-bold">
                {activeOrder.orderType === 'dine-in' ? `میز ${activeOrder.tableNumber}` : activeOrder.orderType === 'takeaway' ? 'بیرون‌بر' : 'پیک ارسالی'}
              </span>
            </div>
          </div>
        )}

        {/* Brand Banner */}
        <div className="relative h-44 overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-neutral-900/40 z-10" />
          <img
            src="https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&auto=format&fit=crop&q=80"
            alt="cafe brand"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute bottom-4 right-4 left-4 z-20 flex items-end gap-3 text-white">
            <span className="text-4xl p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">{restaurant.logo}</span>
            <div className="mb-1">
              <h1 className="text-xl font-black tracking-tight">{restaurant.name}</h1>
              <p className="text-[10px] opacity-90 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                <span>ساعات کاری: {restaurant.workingHours}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Search & info quick tabs */}
        <div className="p-4 bg-white border-b border-neutral-100">
          <div className="relative mb-3.5">
            <Search className="absolute right-3.5 top-2.5 w-4.5 h-4.5 text-neutral-400" />
            <input
              type="text"
              placeholder="جستجو در بین آیتم‌های خوشمزه منو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pr-10 pl-3 py-2.5 bg-neutral-50 border border-neutral-200/80 rounded-xl focus:outline-hidden focus:border-amber-500 font-sans"
            />
          </div>

          {/* Socials & Info */}
          <div className="flex items-center justify-between text-neutral-500 text-[10px] pt-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span>{restaurant.phone}</span>
              </span>
              <span className="flex items-center gap-1 truncate max-w-[180px]" title={restaurant.address}>
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>{restaurant.address}</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {restaurant.instagram && (
                <a href={`https://instagram.com/${restaurant.instagram}`} target="_blank" rel="noreferrer" className="p-1 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-amber-600 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {restaurant.telegram && (
                <a href={`https://t.me/${restaurant.telegram}`} target="_blank" rel="noreferrer" className="p-1 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-amber-600 transition-colors">
                  <Send className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Categories Scroller (Sticky-ish) */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 p-3 border-b border-neutral-100 overflow-x-auto flex gap-1.5 scrollbar-none shrink-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${selectedCategory === 'all' ? 'bg-amber-500 text-white shadow-xs' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
          >
            همه موارد
          </button>
          {restaurantCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${selectedCategory === cat.id ? 'bg-amber-500 text-white shadow-xs' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Active Order Tracker display if placed */}
        {activeOrder && (
          <div className="m-4 p-4 bg-green-50/50 border border-green-150 rounded-2xl text-xs space-y-3 font-sans">
            <h4 className="font-extrabold text-green-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>فاکتور شما ثبت شد و در حال پیگیری است</span>
            </h4>

            {/* Tracking Progress Bar */}
            <div className="relative pt-2 pb-1">
              <div className="flex mb-2 items-center justify-between">
                <span className="text-[10px] font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-100">
                  مرحله {getStatusStepIndex(activeOrder.status)} از ۳
                </span>
                <span className="text-[10px] font-bold text-green-700">
                  {getStatusLabel(activeOrder.status)}
                </span>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-100">
                <div
                  style={{ width: `${(getStatusStepIndex(activeOrder.status) / 3) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
                />
              </div>
            </div>

            {/* Receipt Summary */}
            <div className="border-t border-dashed border-green-200/80 pt-2 text-[11px] text-neutral-600 space-y-1">
              <div className="flex justify-between">
                <span>تعداد آیتم‌ها:</span>
                <span className="font-bold text-neutral-800">{activeOrder.items.reduce((s, i) => s + i.quantity, 0)} عدد</span>
              </div>
              <div className="flex justify-between">
                <span>مبلغ پرداختی:</span>
                <span className="font-bold text-neutral-800">{(activeOrder.totalPrice).toLocaleString('fa-IR')} تومان</span>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items Grid */}
        <div className="p-4 space-y-4 flex-1">
          {filteredItems.map((item) => {
            const cartQty = cart.find(c => c.id === item.id)?.quantity || 0;
            return (
              <motion.div
                key={item.id}
                layout
                className="bg-white border border-neutral-100 rounded-2xl p-3 flex gap-3 shadow-xs hover:shadow-xs transition-shadow relative"
              >
                {/* Image */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-neutral-50 border border-neutral-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  {/* Heart badge */}
                  <button className="absolute top-1 right-1 p-1 bg-white/70 backdrop-blur-md rounded-full text-neutral-400 hover:text-red-500 transition-colors">
                    <Heart className="w-3 h-3" />
                  </button>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-neutral-800 text-sm">{item.name}</h3>
                    <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed line-clamp-2">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-50">
                    <span className="font-black text-xs text-neutral-700">{(item.price).toLocaleString('fa-IR')} <span className="text-[10px] font-normal">تومان</span></span>

                    {/* Cart actions */}
                    {cartQty > 0 ? (
                      <div className="flex items-center gap-2.5 bg-amber-500 text-white rounded-lg px-2 py-1 font-sans font-bold text-xs shadow-xs">
                        <button onClick={() => updateQuantity(item.id, -1)} className="hover:scale-110 active:scale-95 transition-transform"><Minus className="w-3.5 h-3.5" /></button>
                        <span>{(cartQty).toLocaleString('fa-IR')}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="hover:scale-110 active:scale-95 transition-transform"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="p-1.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filteredItems.length === 0 && (
            <p className="text-center text-neutral-400 py-12 text-xs">هیچ محصولی در این دسته‌بندی یافت نشد.</p>
          )}
        </div>

        {/* View Cart Sticky Button at footer if items exist */}
        {cart.length > 0 && (
          <div className="absolute bottom-0 right-0 left-0 p-4 bg-white border-t border-neutral-100 z-40 shrink-0">
            <button
              onClick={() => setShowCart(true)}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-2xl text-xs flex items-center justify-between shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="bg-white/20 px-2 py-0.5 rounded-md text-[10px]">{(cart.length).toLocaleString('fa-IR')} آیتم</span>
                <span>مشاهده سبد سفارش شما</span>
              </div>
              <span className="font-black">{(cartTotal).toLocaleString('fa-IR')} تومان</span>
            </button>
          </div>
        )}

        {/* CART DRAWER MODAL */}
        <AnimatePresence>
          {showCart && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center font-sans" dir="rtl">
              {/* Back close overlay */}
              <div className="absolute inset-0" onClick={() => setShowCart(false)} />

              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="bg-white rounded-t-3xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border-t border-neutral-100 z-10 relative"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-neutral-100 bg-neutral-50/50">
                  <div>
                    <h3 className="font-bold text-neutral-950 text-sm">سبد سفارش کافه {restaurant.name}</h3>
                    <p className="text-[10px] text-neutral-400 mt-0.5">بررسی مجدد و ثبت نهایی سفارش</p>
                  </div>
                  <button onClick={() => setShowCart(false)} className="text-xs text-neutral-400 hover:text-neutral-600 font-bold">بستن</button>
                </div>

                {/* Cart list items */}
                <div className="p-4 overflow-y-auto flex-1 space-y-3">
                  {cart.map((item, index) => (
                    <div key={item.id} className="border-b border-neutral-50 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between text-xs">
                        <div>
                          <span className="font-extrabold text-neutral-800 block text-xs">{item.name}</span>
                          <span className="text-[10px] text-neutral-400">قیمت واحد: {(item.price).toLocaleString('fa-IR')} تومان</span>

                          {/* Editable notes badge */}
                          {item.notes ? (
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md w-fit">
                              <MessageSquare className="w-3 h-3" />
                              <span>یادداشت: {item.notes}</span>
                              <button
                                onClick={() => {
                                  setEditingNotesIndex(index);
                                  setTempNotesText(item.notes || '');
                                }}
                                className="text-[9px] text-neutral-400 hover:text-amber-700 underline mr-1"
                              >
                                ویرایش
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingNotesIndex(index);
                                setTempNotesText('');
                              }}
                              className="mt-1.5 flex items-center gap-1 text-[9px] text-neutral-400 hover:text-neutral-600 font-semibold border border-neutral-200 px-2 py-0.5 rounded-md"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>افزودن یادداشت سفارش (شکر کم، داغ...)</span>
                            </button>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-1.5">
                          <span className="font-bold text-neutral-700">{(item.price * item.quantity).toLocaleString('fa-IR')} تومان</span>
                          {/* Cart actions */}
                          <div className="flex items-center gap-2.5 bg-neutral-100 text-neutral-800 rounded-lg px-2 py-0.5 font-sans font-bold text-xs">
                            <button onClick={() => updateQuantity(item.id, -1)} className="hover:scale-110"><Minus className="w-3 h-3" /></button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="hover:scale-110"><Plus className="w-3 h-3" /></button>
                          </div>
                        </div>
                      </div>

                      {/* Custom note edit overlay drawer in card */}
                      {editingNotesIndex === index && (
                        <div className="mt-2.5 p-2 bg-neutral-50 rounded-xl border border-neutral-200">
                          <label className="text-[9px] text-neutral-500 font-bold block mb-1">یادداشت برای این آیتم:</label>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              placeholder="مثال: بدون قند، اسپایسی‌تر، سرد..."
                              value={tempNotesText}
                              onChange={(e) => setTempNotesText(e.target.value)}
                              className="w-full text-[10px] px-2 py-1 bg-white border border-neutral-300 rounded-md focus:outline-hidden focus:border-amber-500"
                            />
                            <button
                              onClick={() => saveItemNotes(index)}
                              className="px-2.5 py-1 bg-amber-500 text-white rounded-md text-[10px] font-bold"
                            >
                              ثبت
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Checkout Bottom and total */}
                <div className="p-4 bg-neutral-50 border-t border-neutral-100">
                  <div className="flex justify-between mb-4 text-xs">
                    <span className="font-semibold text-neutral-500">مجموع سبد خرید:</span>
                    <span className="font-black text-neutral-900">{(cartTotal).toLocaleString('fa-IR')} تومان</span>
                  </div>

                  <button
                    onClick={() => {
                      setShowCart(false);
                      setShowCheckout(true);
                    }}
                    className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 shadow-md"
                  >
                    <span>تایید سبد خرید و انتخاب شیوه سفارش</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* CHECKOUT SCREEN DRAWER */}
        <AnimatePresence>
          {showCheckout && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center font-sans" dir="rtl">
              {/* Back close overlay */}
              <div className="absolute inset-0" onClick={() => setShowCheckout(false)} />

              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-t border-neutral-100 z-10 relative"
              >
                {/* Header */}
                <div className="flex items-center gap-2 p-4 border-b border-neutral-100 bg-neutral-50/50">
                  <button onClick={() => {
                    setShowCheckout(false);
                    setShowCart(true);
                  }} className="p-1 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-600">
                    <ArrowRight className="w-4.5 h-4.5" />
                  </button>
                  <div>
                    <h3 className="font-bold text-neutral-950 text-sm">تکمیل و ثبت اطلاعات سفارش</h3>
                    <p className="text-[10px] text-neutral-400 mt-0.5">انتخاب شیوه تحویل و وارد کردن آدرس</p>
                  </div>
                </div>

                {/* Scrollable Form */}
                <form onSubmit={handleCheckoutSubmit} className="p-4 overflow-y-auto flex-1 space-y-4">
                  {/* Customer basic info */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-neutral-400 block mb-1">اطلاعات خریدار:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-neutral-500 block mb-1">نام و نام خانوادگی:</label>
                        <input
                          type="text"
                          required
                          placeholder="مثال: رضا کریمی"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-amber-500 font-sans"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-500 block mb-1">شماره تماس جهت پیگیری:</label>
                        <input
                          type="tel"
                          required
                          placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-amber-500 font-sans font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Order delivery modes */}
                  <div>
                    <span className="text-[10px] font-black text-neutral-400 block mb-2">شیوه تحویل سفارش:</span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setOrderType('dine-in')}
                        className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1 ${orderType === 'dine-in' ? 'bg-amber-500 border-amber-500 text-white shadow-xs' : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'}`}
                      >
                        <span>🍽️</span>
                        <span>میل در سالن</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOrderType('takeaway')}
                        className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1 ${orderType === 'takeaway' ? 'bg-amber-500 border-amber-500 text-white shadow-xs' : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'}`}
                      >
                        <span>🛍️</span>
                        <span>بیرون‌بر</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOrderType('delivery')}
                        className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-1 ${orderType === 'delivery' ? 'bg-amber-500 border-amber-500 text-white shadow-xs' : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'}`}
                      >
                        <span>🛵</span>
                        <span>ارسال با پیک</span>
                      </button>
                    </div>
                  </div>

                  {/* Mode-specific forms */}
                  {orderType === 'dine-in' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3.5 bg-amber-50/30 border border-amber-100 rounded-2xl">
                      <label className="text-xs font-bold text-amber-800 block mb-1.5">شماره میز شما چنده؟</label>
                      <input
                        type="text"
                        required
                        placeholder="شماره حک شده روی بارکد میز را بنویسید"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-amber-200 rounded-lg focus:outline-hidden focus:border-amber-500"
                      />
                    </motion.div>
                  )}

                  {orderType === 'delivery' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3.5">
                      {/* Manual Address Input */}
                      <div className="p-3.5 bg-neutral-50 border border-neutral-150 rounded-2xl space-y-2">
                        <label className="text-xs font-extrabold text-neutral-800 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-amber-500 shrink-0 animate-bounce" />
                          <span>آدرس دقیق محل تحویل (دستی):</span>
                        </label>
                        <textarea
                          required
                          rows={2}
                          placeholder="آدرس دقیق خود را برای پیک بنویسید (مثال: تهران، خیابان ونک، کوچه دوم، پلاک ۴، واحد ۱)"
                          value={deliveryAddress}
                          onChange={(e) => {
                            setDeliveryAddress(e.target.value);
                            setIsDeliveryValid(true);
                          }}
                          className="w-full text-xs px-3 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-hidden focus:border-amber-500 font-sans leading-relaxed"
                        />
                        <p className="text-[10px] text-neutral-400 font-medium">نوشتن آدرس تحویل به صورت دستی الزامی است.</p>
                      </div>

                      {/* Map Selector */}
                      <div className="border border-neutral-150 rounded-2xl overflow-hidden">
                        <div className="p-2.5 bg-neutral-50 border-b border-neutral-150 flex justify-between items-center text-[10px] font-black text-neutral-500">
                          <span>مکان‌یابی فرضی روی نقشه (اختیاری)</span>
                          <span className="text-amber-500 font-bold">نمایش محدوده ارسال کافه</span>
                        </div>
                        <MapSelector
                          restaurant={restaurant}
                          onLocationSelected={handleLocationChange}
                        />
                      </div>
                    </motion.div>
                  )}

                  {orderType === 'takeaway' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3.5 bg-neutral-50 border border-neutral-150 rounded-2xl flex items-start gap-2 text-[11px] text-neutral-600 leading-relaxed font-sans">
                      <Info className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                      <span>سفارش شما پس از پخت، آماده تحویل حضوری می‌گردد. شما باید خودتان به آدرس {restaurant.address} جهت دریافت مراجعه نمایید.</span>
                    </motion.div>
                  )}

                  {/* Extra order-wide notes */}
                  <div>
                    <label className="text-[10px] font-black text-neutral-400 block mb-1">توضیحات و یادداشت کلی سفارش (اختیاری):</label>
                    <textarea
                      rows={1.5}
                      placeholder="اگر در مورد کلیت سفارش یا پیک نیاز به یادداشتی است، اینجا بنویسید..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-amber-500 font-sans"
                    />
                  </div>

                  {/* Final invoice table */}
                  <div className="p-3 bg-neutral-50 rounded-xl text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">جمع فاکتور خرید:</span>
                      <span className="font-bold text-neutral-800">{(cartTotal).toLocaleString('fa-IR')} تومان</span>
                    </div>
                    {orderType === 'delivery' && (
                      <div className="flex justify-between">
                        <span className="text-neutral-500">هزینه پیک موتوری:</span>
                        <span className="font-bold text-neutral-800">
                          {isDeliveryValid ? `${(restaurant.deliveryFee).toLocaleString('fa-IR')} تومان` : 'غیرقابل ارسال'}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-neutral-200/80 pt-2 font-black text-sm">
                      <span className="text-neutral-900">جمع کل پرداختی:</span>
                      <span className="text-amber-600">{(finalTotal).toLocaleString('fa-IR')} تومان</span>
                    </div>
                  </div>

                   {/* Submit checkout */}
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 rounded-xl font-black text-xs text-white shadow-md transition-all"
                  >
                    ثبت سفارش و ارسال فاکتور
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
