import { Restaurant, Category, MenuItem, Order, DailyStats } from '../types';

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'کافه پاییز',
    slug: 'autumn-cafe',
    logo: '☕',
    phone: '۰۲۱-۸۸۸۸۴۴۴۴',
    address: 'تهران، خیابان ولیعصر، بالاتر از میدان ونک، بن‌بست پاییز، پلاک ۱۲',
    workingHours: '۰۸:۰۰ الی ۲۳:۳۰',
    instagram: 'autumn_cafe_ir',
    telegram: 'autumn_cafe',
    primaryColor: '#d97706', // warm amber
    bgColor: '#fdfbf7', // warm cream
    accentColor: '#78350f', // deep warm brown
    deliveryRange: 4, // 4km
    deliveryFee: 25000,
    subscriptionStatus: 'active',
    tablesCount: 8
  },
  {
    id: 'rest-2',
    name: 'برگر داک',
    slug: 'burger-doc',
    logo: '🍔',
    phone: '۰۲۱-۲۲۲۲۷۷۷۷',
    address: 'تهران، نیاوران، بعد از سه راه یاسر، پلاک ۲۴۵',
    workingHours: '۱۲:۰۰ الی ۲۴:۰۰',
    instagram: 'burger_doc',
    telegram: 'burger_doc_channel',
    primaryColor: '#dc2626', // energetic red
    bgColor: '#fafafa', // clean light grey
    accentColor: '#171717', // neutral dark
    deliveryRange: 6, // 6km
    deliveryFee: 35000,
    subscriptionStatus: 'active',
    tablesCount: 12
  },
  {
    id: 'rest-3',
    name: 'پیتزا تنوری روما',
    slug: 'roma-pizza',
    logo: '🍕',
    phone: '۰۲۱-۴۴۴۴۱۱۱۱',
    address: 'تهران، سعادت آباد، بلوار پاکنژاد، پلاک ۷۸',
    workingHours: '۱۱:۳۰ الی ۲۳:۳۰',
    instagram: 'roma_pizza_tehran',
    primaryColor: '#16a34a', // green
    bgColor: '#fcfdfc',
    accentColor: '#b91c1c', // red accent
    deliveryRange: 5,
    deliveryFee: 30000,
    subscriptionStatus: 'trial',
    tablesCount: 10
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  // rest-1: کافه پاییز
  { id: 'cat-1-1', restaurantId: 'rest-1', name: 'قهوه‌های گرم', isActive: true },
  { id: 'cat-1-2', restaurantId: 'rest-1', name: 'نوشیدنی‌های سرد', isActive: true },
  { id: 'cat-1-3', restaurantId: 'rest-1', name: 'کیک و دسر', isActive: true },
  { id: 'cat-1-4', restaurantId: 'rest-1', name: 'صبحانه و میان‌وعده', isActive: true },

  // rest-2: برگر داک
  { id: 'cat-2-1', restaurantId: 'rest-2', name: 'برگرهای تخصصی', isActive: true },
  { id: 'cat-2-2', restaurantId: 'rest-2', name: 'پیش‌غذا و سوخاری', isActive: true },
  { id: 'cat-2-3', restaurantId: 'rest-2', name: 'نوشیدنی‌ها', isActive: true },

  // rest-3: پیتزا روما
  { id: 'cat-3-1', restaurantId: 'rest-3', name: 'پیتزا ایتالیایی', isActive: true },
  { id: 'cat-3-2', restaurantId: 'rest-3', name: 'پیتزا آمریکایی', isActive: true },
  { id: 'cat-3-3', restaurantId: 'rest-3', name: 'سالادها', isActive: true }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // rest-1: کافه پاییز
  {
    id: 'item-1-1',
    restaurantId: 'rest-1',
    categoryId: 'cat-1-1',
    name: 'اسپرسو دبل شات',
    price: 65000,
    description: '۱۰۰٪ عربیکا، طعم‌یاد کاکائو و کارامل، عصاره‌گیری استاندارد',
    image: 'https://images.unsplash.com/photo-1510972527409-cef1903972fa?w=400&auto=format&fit=crop&q=80',
    isActive: true
  },
  {
    id: 'item-1-2',
    restaurantId: 'rest-1',
    categoryId: 'cat-1-1',
    name: 'کافه لاته',
    price: 85000,
    description: 'اسپرسو دبل، شیر فوم‌دار داغ، طرح زیبای لاته آرت روی فوم',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?w=400&auto=format&fit=crop&q=80',
    isActive: true
  },
  {
    id: 'item-1-3',
    restaurantId: 'rest-1',
    categoryId: 'cat-1-2',
    name: 'آیس لاته کارامل',
    price: 95000,
    description: 'شیر سرد، یخ، اسپرسو تک شات، سس کارامل دست‌ساز کافه پاییز',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&auto=format&fit=crop&q=80',
    isActive: true
  },
  {
    id: 'item-1-4',
    restaurantId: 'rest-1',
    categoryId: 'cat-1-2',
    name: 'موهیتو کلاسیک',
    price: 88000,
    description: 'نعنای تازه محلی، لیموترش شیرازی، شکر قهوه‌ای، سودا و یخ خرد شده',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop&q=80',
    isActive: true
  },
  {
    id: 'item-1-5',
    restaurantId: 'rest-1',
    categoryId: 'cat-1-3',
    name: 'کیک شکلاتی بی‌بی',
    price: 90000,
    description: 'کیک مرطوب شکلاتی با خامه فشرده کاکائویی و تزیین ترافل شکلات',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop&q=80',
    isActive: true
  },
  {
    id: 'item-1-6',
    restaurantId: 'rest-1',
    categoryId: 'cat-1-3',
    name: 'کروسان ساده فرانسوی',
    price: 75000,
    description: 'کروسان کره‌ای پخت روز، با لایه‌های ترد و بافت داخلی بسیار لطیف',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop&q=80',
    isActive: true
  },
  {
    id: 'item-1-7',
    restaurantId: 'rest-1',
    categoryId: 'cat-1-4',
    name: 'صبحانه انگلیسی',
    price: 195000,
    description: 'سوسیس کراکف، دو عدد نیمرو، لوبیا گرم، قارچ گریل، ژامبون ۹۰٪، نان تست و دورچین سبزیجات',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&auto=format&fit=crop&q=80',
    isActive: true
  },

  // rest-2: برگر داک
  {
    id: 'item-2-1',
    restaurantId: 'rest-2',
    categoryId: 'cat-2-1',
    name: 'داک برگر مخصوص',
    price: 245000,
    description: '۱۸۰ گرم گوشت گوساله خالص گریل‌شده، پنیر گودا دوبل، سس دست‌ساز داک، کاهو و گوجه فرنگی تازه',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80',
    isActive: true
  },
  {
    id: 'item-2-2',
    restaurantId: 'rest-2',
    categoryId: 'cat-2-1',
    name: 'ماشروم برگر',
    price: 260000,
    description: '۱۸۰ گرم گوشت خالص، سس قارچ خامه ای غلیظ، پیاز کاراملی شیرین، پنیر موزارلا کش‌آمدنی',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&auto=format&fit=crop&q=80',
    isActive: true
  },
  {
    id: 'item-2-3',
    restaurantId: 'rest-2',
    categoryId: 'cat-2-2',
    name: 'سیب‌زمینی ویژه داک',
    price: 135000,
    description: 'خلال سیب‌زمینی سرخ‌شده ترد، پنیر چدار ذوب‌شده، ژامبون خرد شده، قارچ و سس رنچ',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&auto=format&fit=crop&q=80',
    isActive: true
  },
  {
    id: 'item-2-4',
    restaurantId: 'rest-2',
    categoryId: 'cat-2-2',
    name: 'فیله سوخاری اسپایسی (۳ تکه)',
    price: 190000,
    description: 'فیله مرغ مرینت شده تند با پولکی‌های ترد و پفکی، دورچین سالاد کلم و سس سیر',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&auto=format&fit=crop&q=80',
    isActive: true
  },
  {
    id: 'item-2-5',
    restaurantId: 'rest-2',
    categoryId: 'cat-2-3',
    name: 'میلک شیک اوریو',
    price: 110000,
    description: 'بستنی وانیلی درجه یک، کوکی اوریو خرد شده، خامه فرم گرفته و سس شکلات تلخ غلیظ',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop&q=80',
    isActive: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    restaurantId: 'rest-1',
    restaurantName: 'کافه پاییز',
    items: [
      { id: 'item-1-2', name: 'کافه لاته', price: 85000, quantity: 2, notes: 'یکی کم شکر و یکی بدون شکر لطفاً' },
      { id: 'item-1-6', name: 'کروسان ساده فرانسوی', price: 75000, quantity: 1 }
    ],
    totalPrice: 245000,
    orderType: 'dine-in',
    tableNumber: '۴',
    customerName: 'امیرحسین رضایی',
    customerPhone: '۰۹۱۲۳۴۵۶۷۸۹',
    status: 'delivered',
    createdAt: '2026-06-23T10:15:00-07:00'
  },
  {
    id: 'ord-1002',
    restaurantId: 'rest-1',
    restaurantName: 'کافه پاییز',
    items: [
      { id: 'item-1-1', name: 'اسپرسو دبل شات', price: 65000, quantity: 1 },
      { id: 'item-1-5', name: 'کیک شکلاتی بی‌بی', price: 90000, quantity: 1 }
    ],
    totalPrice: 155000,
    orderType: 'dine-in',
    tableNumber: '۲',
    customerName: 'سارا کریمی',
    customerPhone: '۰۹۱۸۷۶۵۴۳۲۱',
    status: 'preparing',
    createdAt: '2026-06-23T23:25:00-07:00'
  },
  {
    id: 'ord-1003',
    restaurantId: 'rest-2',
    restaurantName: 'برگر داک',
    items: [
      { id: 'item-2-1', name: 'داک برگر مخصوص', price: 245000, quantity: 2, notes: 'پیاز اضافه گذاشته شود' },
      { id: 'item-2-3', name: 'سیب‌زمینی ویژه داک', price: 135000, quantity: 1 }
    ],
    totalPrice: 625000,
    orderType: 'delivery',
    customerName: 'محمد احمدی',
    customerPhone: '۰۹۳۵۹۹۹۸۸۷۷',
    deliveryAddress: 'تهران، خیابان شریعتی، بن‌بست یاس، پلاک ۸، واحد ۳',
    deliveryCoordinates: { lat: 35.78, lng: 51.43 },
    status: 'pending',
    createdAt: '2026-06-23T23:30:00-07:00'
  }
];

export const INITIAL_DAILY_STATS: Record<string, DailyStats[]> = {
  'rest-1': [
    { date: 'شنبه', sales: 1250000, ordersCount: 12 },
    { date: 'یکشنبه', sales: 1420000, ordersCount: 15 },
    { date: 'دوشنبه', sales: 1100000, ordersCount: 10 },
    { date: 'سه‌شنبه', sales: 1650000, ordersCount: 18 },
    { date: 'چهارشنبه', sales: 1980000, ordersCount: 22 },
    { date: 'پنج‌شنبه', sales: 3450000, ordersCount: 38 },
    { date: 'جمعه', sales: 4200000, ordersCount: 45 }
  ],
  'rest-2': [
    { date: 'شنبه', sales: 2800000, ordersCount: 14 },
    { date: 'یکشنبه', sales: 3200000, ordersCount: 16 },
    { date: 'دوشنبه', sales: 2400000, ordersCount: 11 },
    { date: 'سه‌شنبه', sales: 3500000, ordersCount: 17 },
    { date: 'چهارشنبه', sales: 4100000, ordersCount: 21 },
    { date: 'پنج‌شنبه', sales: 6800000, ordersCount: 35 },
    { date: 'جمعه', sales: 8500000, ordersCount: 42 }
  ]
};
