import { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Store, Smartphone, Info, RotateCcw, Laptop, AlertCircle, Sparkles } from 'lucide-react';
import { Restaurant, Category, MenuItem, Order, SubscriptionType, OrderStatus } from './types';
import { SYSTEM_LOCAL_IMAGES } from './lib/localImages';
import {
  INITIAL_RESTAURANTS,
  INITIAL_CATEGORIES,
  INITIAL_MENU_ITEMS,
  INITIAL_ORDERS
} from './data/mockData';
import PlatformAdmin from './components/PlatformAdmin';
import RestaurantAdmin from './components/RestaurantAdmin';
import CustomerMenu from './components/CustomerMenu';
import LandingPage from './components/LandingPage';
import AuthPage, { AuthUser } from './components/AuthPage';
import {
  apiFetchMenu,
  apiSaveMenu,
  apiFetchOrders,
  apiSyncOrder,
  apiUpdateOrderStatus,
  apiFetchUsers,
  apiSaveUsers,
  apiFetchRestaurants,
  apiSaveRestaurants
} from './lib/api';

export default function App() {
  // Load data from LocalStorage or use default mock data
  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => {
    const saved = localStorage.getItem('menumix_restaurants');
    return saved ? JSON.parse(saved) : INITIAL_RESTAURANTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('menumix_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('menumix_menuitems');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('menumix_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Track user database
  const [users, setUsers] = useState<AuthUser[]>(() => {
    const saved = localStorage.getItem('menutak_users') || localStorage.getItem('menotak_users');
    if (saved) return JSON.parse(saved);

    const defaultUsers: AuthUser[] = [
      {
        id: 'user-admin',
        username: 'admin',
        passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // "admin"
        role: 'platform',
        name: 'مدیر پلتفرم منو تک',
        phone: '۰۹۱۲۰۰۰۰۰۰۰'
      },
      {
        id: 'user-autumn',
        username: 'autumn',
        passwordHash: '8c5c70752b75704d9c7cb3fa08f1b62310b8cf8d2e850fa986968e82ef4d5f0b', // "autumn"
        role: 'restaurant',
        restaurantId: 'rest-1',
        name: 'مدیریت کافه پاییز',
        phone: '۰۹۱۲۱۱۱۱۱۱۱'
      },
      {
        id: 'user-burger',
        username: 'burger',
        passwordHash: '12d22f6762f026c2bc4a04d3e5e413a96874eb224f1cb91b157470fcf22a61e0', // "burger"
        role: 'restaurant',
        restaurantId: 'rest-2',
        name: 'مدیریت برگر داک',
        phone: '۰۹۱۲۲۲۲۲۲۲۲'
      },
      {
        id: 'user-roma',
        username: 'roma',
        passwordHash: '1d43a6d7168db10a56e9f14371fa79326d9c666f28f090a982df4bbf797669d6', // "roma"
        role: 'restaurant',
        restaurantId: 'rest-3',
        name: 'مدیریت پیتزا روما',
        phone: '۰۹۱۲۳۳۳۳۳۳۳'
      }
    ];
    localStorage.setItem('menutak_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  });

  // Track session state
  const [loggedInUser, setLoggedInUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('menutak_logged_in_user') || localStorage.getItem('menotak_logged_in_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Track the single last placed order on this device for customer-view tracking
  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    const saved = localStorage.getItem('menumix_active_order');
    return saved ? JSON.parse(saved) : null;
  });

  // Roles inside demo simulator: landing, platform, restaurant, customer, login, register, platform-login
  const [currentRole, setCurrentRole] = useState<'landing' | 'platform' | 'restaurant' | 'customer' | 'login' | 'register' | 'platform-login'>('landing');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('rest-1');
  const activeRestaurant = restaurants.find(r => r.id === selectedRestaurantId) || restaurants[0];
  const [loadingRestaurant, setLoadingRestaurant] = useState<boolean>(false);
  const [isCloudLoaded, setIsCloudLoaded] = useState<boolean>(false);
  const lastFetchedSlugRef = useRef<string>('');

  // Load users and restaurants lists from the cloud database on startup
  useEffect(() => {
    const loadGlobalData = async () => {
      try {
        const cloudUsers = await apiFetchUsers();
        if (Array.isArray(cloudUsers) && cloudUsers.length > 0) {
          setUsers(prev => {
            // Merge: keep all cloud users, plus any local users that don't exist in cloud (by id or username)
            const merged = [...cloudUsers];
            prev.forEach(localUser => {
              if (!merged.some(u => u.id === localUser.id || u.username.toLowerCase() === localUser.username.toLowerCase())) {
                merged.push(localUser);
              }
            });
            return merged;
          });
        }
      } catch (err) {
        console.error('Error loading cloud users:', err);
      }

      try {
        const cloudRestaurants = await apiFetchRestaurants();
        if (Array.isArray(cloudRestaurants) && cloudRestaurants.length > 0) {
          setRestaurants(prev => {
            // Merge: keep all cloud restaurants, plus any local ones that don't exist in cloud (by id or slug)
            const merged = [...cloudRestaurants];
            prev.forEach(localRest => {
              if (!merged.some(r => r.id === localRest.id || r.slug.toLowerCase() === localRest.slug.toLowerCase())) {
                merged.push(localRest);
              }
            });
            return merged;
          });
        }
      } catch (err) {
        console.error('Error loading cloud restaurants:', err);
      }

      setIsCloudLoaded(true);
    };

    loadGlobalData();
  }, []);

  // Helper to save a restaurant's configuration and items to public cloud (via local API)
  const saveRestaurantToCloud = async (rest: Restaurant, cats: Category[], items: MenuItem[]) => {
    try {
      const slug = rest.slug;
      const restCats = cats.filter(c => c.restaurantId === rest.id);
      const restItems = items.filter(i => i.restaurantId === rest.id);

      await apiSaveMenu(slug, { rest, cats: restCats, items: restItems });
      console.log(`Cloud sync success for ${slug}`);
    } catch (err) {
      console.error('Cloud save failed:', err);
    }
  };

  // Helper to fetch/load a restaurant's menu from the cloud
  const fetchRestaurantFromCloud = async (slug: string, table?: string) => {
    try {
      const data = await apiFetchMenu(slug);
      const { rest, cats: cloudCats, items: cloudItems } = data;
      
      if (!rest) {
        // Fallback to local offline list
        const foundLocally = restaurants.find(r => r.slug === slug);
        if (foundLocally) {
          setSelectedRestaurantId(foundLocally.id);
          setCurrentRole('customer');
        } else {
          setCurrentRole('landing');
        }
        setLoadingRestaurant(false);
        return;
      }

      // Update local state
      setRestaurants(prev => {
        const filtered = prev.filter(r => r.slug !== slug && r.id !== rest.id);
        return [...filtered, rest];
      });

      setCategories(prev => {
        const filtered = prev.filter(c => c.restaurantId !== rest.id);
        return [...filtered, ...cloudCats];
      });

      setMenuItems(prev => {
        const filtered = prev.filter(i => i.restaurantId !== rest.id);
        return [...filtered, ...cloudItems];
      });

      setSelectedRestaurantId(rest.id);
      setCurrentRole('customer');
      if (table) {
        localStorage.setItem(`menumix_table_${rest.id}`, table);
      }
    } catch (err) {
      console.warn('Cloud sync failed, using offline cache:', err);
      const foundLocally = restaurants.find(r => r.slug === slug);
      if (foundLocally) {
        setSelectedRestaurantId(foundLocally.id);
        setCurrentRole('customer');
      } else {
        setCurrentRole('landing');
      }
    } finally {
      setLoadingRestaurant(false);
    }
  };

  // Helper to sync single placed order
  const syncOrderToCloud = async (newOrder: Order, slug: string) => {
    try {
      await apiSyncOrder(slug, newOrder);
    } catch (err) {
      console.error('Order cloud sync failed:', err);
    }
  };

  // Helper to update order status on cloud
  const updateOrderOnCloud = async (orderId: string, status: OrderStatus, slug: string) => {
    try {
      await apiUpdateOrderStatus(slug, orderId, status);
    } catch (err) {
      console.error('Order update cloud sync failed:', err);
    }
  };

  // Persistence hooks
  useEffect(() => {
    localStorage.setItem('menumix_restaurants', JSON.stringify(restaurants));
    if (isCloudLoaded) {
      apiSaveRestaurants(restaurants).catch(err => console.error('Failed to sync restaurants to cloud:', err));
    }
  }, [restaurants, isCloudLoaded]);

  useEffect(() => {
    localStorage.setItem('menumix_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('menumix_menuitems', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('menutak_users', JSON.stringify(users));
    if (isCloudLoaded) {
      apiSaveUsers(users).catch(err => console.error('Failed to sync users to cloud:', err));
    }
  }, [users, isCloudLoaded]);

  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem('menutak_logged_in_user', JSON.stringify(loggedInUser));
    } else {
      localStorage.removeItem('menutak_logged_in_user');
      localStorage.removeItem('menotak_logged_in_user');
    }
  }, [loggedInUser]);

  useEffect(() => {
    localStorage.setItem('menumix_orders', JSON.stringify(orders));
    // Keep active order updated if its status changed in the order list
    if (activeOrder) {
      const match = orders.find(o => o.id === activeOrder.id);
      if (match && match.status !== activeOrder.status) {
        setActiveOrder(match);
        localStorage.setItem('menumix_active_order', JSON.stringify(match));
      }
    }
  }, [orders, activeOrder]);

  // Load the restaurant's latest menu and orders from the cloud when the restaurant role is active
  useEffect(() => {
    if (currentRole !== 'restaurant' || !activeRestaurant) return;
    
    const loadRestaurantMenuFromCloud = async () => {
      try {
        const slug = activeRestaurant.slug;
        const data = await apiFetchMenu(slug);
        const { rest, cats: cloudCats, items: cloudItems } = data;
        if (rest) {
          setRestaurants(prev => {
            const filtered = prev.filter(r => r.slug !== slug && r.id !== rest.id);
            return [...filtered, rest];
          });

          setCategories(prev => {
            const filtered = prev.filter(c => c.restaurantId !== rest.id);
            return [...filtered, ...cloudCats];
          });

          setMenuItems(prev => {
            const filtered = prev.filter(i => i.restaurantId !== rest.id);
            return [...filtered, ...cloudItems];
          });
        }
      } catch (err) {
        console.warn('Failed to pre-load restaurant menu from cloud:', err);
      }
    };

    loadRestaurantMenuFromCloud();
  }, [currentRole, selectedRestaurantId]);

  // Synchronize restaurant configuration changes to the cloud when admin edits them
  useEffect(() => {
    if (currentRole !== 'restaurant' && currentRole !== 'platform') return;
    
    const activeRest = restaurants.find(r => r.id === selectedRestaurantId);
    if (!activeRest) return;
    
    // Simple debounce to avoid spamming the public API on rapid edits
    const timeout = setTimeout(() => {
      saveRestaurantToCloud(activeRest, categories, menuItems);
    }, 1500);
    
    return () => clearTimeout(timeout);
  }, [restaurants, categories, menuItems, selectedRestaurantId, currentRole]);

  // Poll cloud orders for admin
  useEffect(() => {
    if (currentRole !== 'restaurant' || !activeRestaurant) return;
    
    const interval = setInterval(async () => {
      try {
        const cloudOrders = await apiFetchOrders(activeRestaurant.slug);
        if (cloudOrders && Array.isArray(cloudOrders)) {
          setOrders(prev => {
            const merged = [...prev];
            cloudOrders.forEach(co => {
              const idx = merged.findIndex(o => o.id === co.id);
              if (idx > -1) {
                if (JSON.stringify(merged[idx]) !== JSON.stringify(co)) {
                  merged[idx] = co;
                }
              } else {
                merged.unshift(co);
              }
            });
            return merged;
          });
        }
      } catch (err) {
        // Silent fail
      }
    }, 7000);
    
    return () => clearInterval(interval);
  }, [currentRole, activeRestaurant]);

  // Poll active order status for customer
  useEffect(() => {
    if (currentRole !== 'customer' || !activeRestaurant || !activeOrder) return;
    
    const interval = setInterval(async () => {
      try {
        const cloudOrders = await apiFetchOrders(activeRestaurant.slug);
        if (cloudOrders && Array.isArray(cloudOrders)) {
          const match = cloudOrders.find(o => o.id === activeOrder.id);
          if (match && JSON.stringify(match) !== JSON.stringify(activeOrder)) {
            setActiveOrder(match);
            localStorage.setItem('menumix_active_order', JSON.stringify(match));
            
            setOrders(prev => prev.map(o => o.id === match.id ? match : o));
          }
        }
      } catch (err) {
        // Silent fail
      }
    }, 7000);
    
    return () => clearInterval(interval);
  }, [currentRole, activeRestaurant, activeOrder]);

  // Routing handler to parse restaurant slug, table number & specific hidden roles from hash/URL dynamically
  useEffect(() => {
    const handleRouting = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      
      let slug = '';
      let table = '';

      // Check specific URL routes first
      if (hash === '#/platform-admin') {
        if (loggedInUser && loggedInUser.role === 'platform') {
          setCurrentRole('platform');
        } else {
          setCurrentRole('platform-login');
        }
        return;
      }

      if (hash === '#/restaurant-admin') {
        if (loggedInUser && loggedInUser.role === 'restaurant') {
          setCurrentRole('restaurant');
          if (loggedInUser.restaurantId) {
            setSelectedRestaurantId(loggedInUser.restaurantId);
          }
        } else {
          setCurrentRole('login');
        }
        return;
      }

      if (hash === '#/login') {
        setCurrentRole('login');
        return;
      }

      if (hash === '#/register') {
        setCurrentRole('register');
        return;
      }

      // Check hash route first (robust for SPA static servers)
      if (hash.includes('/menu/')) {
        const parts = hash.split('/menu/');
        const restOfHash = parts[1] || '';
        slug = restOfHash.split('?')[0]?.trim();
        
        const searchPart = restOfHash.split('?')[1];
        if (searchPart) {
          const params = new URLSearchParams(searchPart);
          table = params.get('table') || '';
        }
      } 
      // Fallback to path-based route
      else if (path.includes('/menu/')) {
        const parts = path.split('/menu/');
        slug = parts[1]?.split('?')[0]?.trim();
        const params = new URLSearchParams(window.location.search);
        table = params.get('table') || '';
      }

      if (slug) {
        const found = restaurants.find(r => r.slug === slug);
        if (found) {
          setSelectedRestaurantId(found.id);
          setCurrentRole('customer');
          if (table) {
            localStorage.setItem(`menumix_table_${found.id}`, table);
          }
        } else {
          // If not found in local memory, set role to customer to show loading frame, and load it from cloud
          setCurrentRole('customer');
          setLoadingRestaurant(true);
        }

        // Only trigger cloud load if we haven't fetched this slug already in this session
        if (lastFetchedSlugRef.current !== slug) {
          lastFetchedSlugRef.current = slug;
          fetchRestaurantFromCloud(slug, table);
        }
      } else if (hash === '' || hash === '#/') {
        setCurrentRole('landing');
      }
    };

    handleRouting();
    window.addEventListener('hashchange', handleRouting);
    return () => window.removeEventListener('hashchange', handleRouting);
  }, [restaurants, loggedInUser]);

  // Reset all simulation database to default
  const resetDatabase = () => {
    if (window.confirm('آیا مایلید کل اطلاعات و تراکنش‌ها را به حالت پیش‌فرض اولیه برگردانید؟')) {
      localStorage.clear();
      setRestaurants(INITIAL_RESTAURANTS);
      setCategories(INITIAL_CATEGORIES);
      setMenuItems(INITIAL_MENU_ITEMS);
      setOrders(INITIAL_ORDERS);
      setActiveOrder(null);
      setSelectedRestaurantId('rest-1');
      setCurrentRole('platform');
    }
  };

  // Platform admin callbacks
  const handleAddRestaurant = (newRest: Omit<Restaurant, 'id'>) => {
    const id = `rest-${Date.now()}`;
    const created: Restaurant = { id, ...newRest };
    setRestaurants(prev => [...prev, created]);
  };

  const handleUpdateSubscription = (id: string, status: SubscriptionType) => {
    setRestaurants(prev => prev.map(r => r.id === id ? { ...r, subscriptionStatus: status } : r));
  };

  const handleDeleteRestaurant = (id: string) => {
    if (window.confirm('آیا از حذف کامل این کافه/رستوران اطمینان دارید؟')) {
      setRestaurants(prev => prev.filter(r => r.id !== id));
      setCategories(prev => prev.filter(c => c.restaurantId !== id));
      setMenuItems(prev => prev.filter(i => i.restaurantId !== id));
      setOrders(prev => prev.filter(o => o.restaurantId !== id));
      if (selectedRestaurantId === id) {
        setSelectedRestaurantId(restaurants[0]?.id || '');
      }
    }
  };

  // Restaurant callbacks
  const handleUpdateRestaurant = (updatedRest: Restaurant) => {
    setRestaurants(prev => prev.map(r => r.id === updatedRest.id ? updatedRest : r));
  };

  const handleAddCategory = (name: string) => {
    const id = `cat-${Date.now()}`;
    const newCat: Category = {
      id,
      restaurantId: selectedRestaurantId,
      name,
      isActive: true
    };
    setCategories(prev => [...prev, newCat]);
  };

  const handleToggleCategory = (id: string, active: boolean) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, isActive: active } : c));
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('با حذف این دسته، تمامی غذاهای متصل به آن حذف خواهند شد. ادامه می‌دهید؟')) {
      setCategories(prev => prev.filter(c => c.id !== id));
      setMenuItems(prev => prev.filter(i => i.categoryId !== id));
    }
  };

  const handleAddMenuItem = (item: Omit<MenuItem, 'id' | 'restaurantId'>) => {
    const id = `item-${Date.now()}`;
    const newItem: MenuItem = {
      id,
      restaurantId: selectedRestaurantId,
      ...item
    };
    setMenuItems(prev => [...prev, newItem]);
  };

  const handleToggleMenuItem = (id: string, active: boolean) => {
    setMenuItems(prev => prev.map(i => i.id === id ? { ...i, isActive: active } : i));
  };

  const handleDeleteMenuItem = (id: string) => {
    if (window.confirm('آیا مایلید این غذا را از کل منو حذف کنید؟')) {
      setMenuItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    
    // Cloud sync the order status update immediately
    const activeRest = restaurants.find(r => r.id === selectedRestaurantId);
    if (activeRest) {
      updateOrderOnCloud(orderId, status, activeRest.slug);
    }
  };

  // Customer menu callbacks
  const handlePlaceOrder = (orderData: Omit<Order, 'id' | 'restaurantId' | 'restaurantName' | 'status' | 'createdAt'>) => {
    const activeRest = restaurants.find(r => r.id === selectedRestaurantId);
    if (!activeRest) return;

    const id = `ord-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id,
      restaurantId: selectedRestaurantId,
      restaurantName: activeRest.name,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...orderData
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    localStorage.setItem('menumix_active_order', JSON.stringify(newOrder));

    // Cloud sync the placed order immediately
    syncOrderToCloud(newOrder, activeRest.slug);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans select-none" dir="rtl">
      {/* Active Area container */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 text-slate-800">
        {currentRole === 'landing' && (
          <LandingPage
            restaurants={restaurants}
            onEnterRole={(role) => {
              if (role === 'platform') {
                window.location.hash = '#/platform-admin';
              } else if (role === 'restaurant') {
                window.location.hash = '#/restaurant-admin';
              } else if (role === 'customer') {
                setCurrentRole('customer');
              }
            }}
            onSelectRestaurant={(id) => setSelectedRestaurantId(id)}
          />
        )}

        {(currentRole === 'login' || currentRole === 'register' || currentRole === 'platform-login') && (
          <AuthPage
            users={users}
            restaurants={restaurants}
            defaultMode={currentRole === 'register' ? 'register' : 'login'}
            isPlatformAdminOnly={currentRole === 'platform-login'}
            onLoginSuccess={(user) => {
              setLoggedInUser(user);
              if (user.role === 'platform') {
                window.location.hash = '#/platform-admin';
              } else {
                setSelectedRestaurantId(user.restaurantId || 'rest-1');
                window.location.hash = '#/restaurant-admin';
              }
            }}
            onRegisterSuccess={(newUser, newRest) => {
              // Add new restaurant to list
              setRestaurants(prev => [...prev, newRest]);
              
              // Create default categories for the new restaurant to make it look active immediately
              const catId1 = `cat-new-1-${Date.now()}`;
              const catId2 = `cat-new-2-${Date.now()}`;
              const defaultCategories: Category[] = [
                { id: catId1, restaurantId: newRest.id, name: 'قهوه و نوشیدنی‌های گرم', isActive: true },
                { id: catId2, restaurantId: newRest.id, name: 'کیک و دسر', isActive: true }
              ];
              setCategories(prev => [...prev, ...defaultCategories]);

              // Create default menu items for the new restaurant
              const defaultItems: MenuItem[] = [
                {
                  id: `item-new-1-${Date.now()}`,
                  restaurantId: newRest.id,
                  categoryId: catId1,
                  name: 'اسپرسو سینگل',
                  price: 45000,
                  description: 'تهیه شده از دانه‌های ۱۰۰٪ عربیکا با طعم‌یاد کاکائویی و غلظت عالی',
                  image: SYSTEM_LOCAL_IMAGES[0].url,
                  isActive: true
                },
                {
                  id: `item-new-2-${Date.now()}`,
                  restaurantId: newRest.id,
                  categoryId: catId1,
                  name: 'کاپوچینو',
                  price: 65000,
                  description: 'اسپرسو، شیر داغ و کف شیر مخملی غلیظ',
                  image: SYSTEM_LOCAL_IMAGES[0].url,
                  isActive: true
                },
                {
                  id: `item-new-3-${Date.now()}`,
                  restaurantId: newRest.id,
                  categoryId: catId2,
                  name: 'چیزکیک نیویورکی',
                  price: 85000,
                  description: 'چیزکیک کلاسیک پخته شده با کراست بیسکوئیتی ترد و سوس آلبالو',
                  image: SYSTEM_LOCAL_IMAGES[5].url,
                  isActive: true
                }
              ];
              setMenuItems(prev => [...prev, ...defaultItems]);

              // Add user
              setUsers(prev => [...prev, newUser]);
              
              // Log in
              setLoggedInUser(newUser);
              setSelectedRestaurantId(newRest.id);
              window.location.hash = '#/restaurant-admin';
            }}
            onBackToHome={() => {
              window.location.hash = '#/';
            }}
          />
        )}

        {currentRole === 'platform' && (
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/85">
            <PlatformAdmin
              restaurants={restaurants}
              onAddRestaurant={handleAddRestaurant}
              onUpdateSubscription={handleUpdateSubscription}
              onDeleteRestaurant={handleDeleteRestaurant}
              onSelectRestaurantForManagement={(rest) => {
                setSelectedRestaurantId(rest.id);
                window.location.hash = '#/restaurant-admin';
              }}
              onLogout={() => {
                setLoggedInUser(null);
                window.location.hash = '#/';
              }}
            />
          </div>
        )}

        {currentRole === 'restaurant' && activeRestaurant && (
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/85">
            <RestaurantAdmin
              restaurant={activeRestaurant}
              categories={categories}
              menuItems={menuItems}
              orders={orders}
              onUpdateRestaurant={handleUpdateRestaurant}
              onAddCategory={handleAddCategory}
              onToggleCategory={handleToggleCategory}
              onDeleteCategory={handleDeleteCategory}
              onAddMenuItem={handleAddMenuItem}
              onToggleMenuItem={handleToggleMenuItem}
              onDeleteMenuItem={handleDeleteMenuItem}
              onUpdateMenuItem={handleUpdateMenuItem}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onLogout={() => {
                setLoggedInUser(null);
                window.location.hash = '#/';
              }}
            />
          </div>
        )}

        {currentRole === 'customer' && (
          <div className="flex justify-center bg-slate-100 rounded-3xl border border-slate-200 py-6 overflow-hidden shadow-xs">
            {/* Standard Framed simulated mobile viewport for premium aesthetics */}
            <div className="w-full max-w-md bg-slate-50 rounded-3xl border-4 border-slate-300 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 h-4 bg-slate-300 rounded-b-xl flex justify-center items-center z-50">
                <div className="w-20 h-2.5 bg-neutral-900 rounded-full" /> {/* phone notch */}
              </div>
              <div className="pt-3">
                {loadingRestaurant || !activeRestaurant ? (
                  <div className="min-h-[600px] flex flex-col items-center justify-center p-6 bg-white animate-pulse">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-sm font-bold text-neutral-800">در حال دریافت جدیدترین منوی دیجیتال...</p>
                    <p className="text-xs text-neutral-400 mt-1">اتصال به شبکه ابری منوتک</p>
                  </div>
                ) : (
                  <CustomerMenu
                    restaurant={activeRestaurant}
                    categories={categories}
                    menuItems={menuItems}
                    onPlaceOrder={handlePlaceOrder}
                    activeOrder={activeOrder}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {restaurants.length === 0 && (
          <div className="bg-white rounded-3xl p-8 border border-neutral-200/80 text-center flex flex-col items-center justify-center max-w-md mx-auto my-12">
            <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
            <h3 className="font-extrabold text-neutral-800 text-sm">هیچ رستورانی یافت نشد!</h3>
            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
              شما تمامی کافه‌ها و رستوران‌ها را حذف کرده‌اید. برای شروع کار باید دکمه «ثبت‌نام رایگان کافه جدید» در لندینگ پیج را بزنید یا در نقش مدیر پلتفرم اقدام به ثبت رستوران جدید کنید.
            </p>
          </div>
        )}
      </main>

      {/* Footer credits */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-slate-400 text-[10px] flex items-center justify-between font-sans">
        <span>Menotak Multitenant B2B Platform - All Rights Reserved © 2026</span>
        <span className="flex items-center gap-1 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span>توسعه یافته با استانداردهای مدرن فرانت‌اند و طراحی محصول لوکس</span>
        </span>
      </footer>
    </div>
  );
}
