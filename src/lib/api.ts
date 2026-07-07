const DIRECTORY_BLOB_ID = 'addbfee';

interface RestaurantBlobMapping {
  menuBlobId: string;
  ordersBlobId: string;
}

interface Directory {
  [slug: string]: any;
}

// Check if direct jsonblob client fallback is needed
function isFallbackNeeded(response: Response): boolean {
  // 502 Bad Gateway, 404 Not Found (on static hosting), 503, 504 are indicative of server issues/lack of server
  return response.status === 404 || response.status >= 500;
}

async function getOrCreateBlobIdsDirect(slug: string): Promise<RestaurantBlobMapping> {
  let directory: Directory = {};
  try {
    const res = await fetch(`https://extendsclass.com/api/json-storage/bin/${DIRECTORY_BLOB_ID}`);
    if (res.ok) {
      directory = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch directory from extendsclass:', err);
  }

  if (directory[slug] && typeof directory[slug] === 'object' && directory[slug].menuBlobId && directory[slug].ordersBlobId) {
    return directory[slug];
  }

  // Create menu blob
  let menuBlobId = '';
  try {
    const resMenu = await fetch('https://extendsclass.com/api/json-storage/bin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rest: null, cats: [], items: [] })
    });
    if (resMenu.ok) {
      const data = await resMenu.json();
      menuBlobId = data.id || '';
    }
  } catch (err) {
    console.error('Failed to create menu blob directly:', err);
  }

  // Create orders blob
  let ordersBlobId = '';
  try {
    const resOrders = await fetch('https://extendsclass.com/api/json-storage/bin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([])
    });
    if (resOrders.ok) {
      const data = await resOrders.json();
      ordersBlobId = data.id || '';
    }
  } catch (err) {
    console.error('Failed to create orders blob directly:', err);
  }

  if (!menuBlobId || !ordersBlobId) {
    throw new Error('Failed to create JSON blobs directly');
  }

  directory[slug] = { menuBlobId, ordersBlobId };
  try {
    await fetch(`https://extendsclass.com/api/json-storage/bin/${DIRECTORY_BLOB_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(directory)
    });
  } catch (err) {
    console.error('Failed to update directory with blob IDs directly:', err);
  }

  return directory[slug];
}

async function getOrCreateUsersBlobIdDirect(directory: Directory): Promise<string> {
  if (directory._usersBlobId) {
    return directory._usersBlobId;
  }

  const defaultUsers = [
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

  let usersBlobId = '';
  try {
    const res = await fetch('https://extendsclass.com/api/json-storage/bin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(defaultUsers)
    });
    if (res.ok) {
      const data = await res.json();
      usersBlobId = data.id || '';
    }
  } catch (err) {
    console.error('Failed to create users blob directly:', err);
  }

  if (!usersBlobId) {
    throw new Error('Failed to create users blob directly');
  }

  directory._usersBlobId = usersBlobId;
  try {
    await fetch(`https://extendsclass.com/api/json-storage/bin/${DIRECTORY_BLOB_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(directory)
    });
  } catch (err) {
    console.error('Failed to update directory with usersBlobId directly:', err);
  }

  return usersBlobId;
}

async function getOrCreateRestaurantsBlobIdDirect(directory: Directory): Promise<string> {
  if (directory._restaurantsBlobId) {
    return directory._restaurantsBlobId;
  }

  const defaultRestaurants = [
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
      primaryColor: '#d97706',
      bgColor: '#fdfbf7',
      accentColor: '#78350f',
      deliveryRange: 4,
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
      primaryColor: '#dc2626',
      bgColor: '#fafafa',
      accentColor: '#171717',
      deliveryRange: 6,
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
      primaryColor: '#16a34a',
      bgColor: '#fcfdfc',
      accentColor: '#b91c1c',
      deliveryRange: 5,
      deliveryFee: 30000,
      subscriptionStatus: 'trial',
      tablesCount: 10
    }
  ];

  let restaurantsBlobId = '';
  try {
    const res = await fetch('https://extendsclass.com/api/json-storage/bin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(defaultRestaurants)
    });
    if (res.ok) {
      const data = await res.json();
      restaurantsBlobId = data.id || '';
    }
  } catch (err) {
    console.error('Failed to create restaurants blob directly:', err);
  }

  if (!restaurantsBlobId) {
    throw new Error('Failed to create restaurants blob directly');
  }

  directory._restaurantsBlobId = restaurantsBlobId;
  try {
    await fetch(`https://extendsclass.com/api/json-storage/bin/${DIRECTORY_BLOB_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(directory)
    });
  } catch (err) {
    console.error('Failed to update directory with restaurantsBlobId directly:', err);
  }

  return restaurantsBlobId;
}

// -----------------------------------------------------------------
// EXPORTED API METHODS WITH AUTO-FALLBACK
// -----------------------------------------------------------------

// 1. Fetch menu
export async function apiFetchMenu(slug: string): Promise<any> {
  try {
    const res = await fetch(`/api/menu/${slug}`);
    if (res.ok) {
      return await res.json();
    }
    if (isFallbackNeeded(res)) {
      throw new Error(`Fallback trigger: ${res.status}`);
    }
    throw new Error('Local API failed');
  } catch (err) {
    console.warn(`Local apiFetchMenu failed for ${slug}, trying direct extendsclass fallback...`, err);
    const mapping = await getOrCreateBlobIdsDirect(slug);
    const response = await fetch(`https://extendsclass.com/api/json-storage/bin/${mapping.menuBlobId}`);
    if (!response.ok) {
      throw new Error('Direct extendsclass fetch menu failed');
    }
    return await response.json();
  }
}

// 2. Save/Update menu
export async function apiSaveMenu(slug: string, body: any): Promise<any> {
  try {
    const res = await fetch(`/api/menu/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      return await res.json();
    }
    if (isFallbackNeeded(res)) {
      throw new Error(`Fallback trigger: ${res.status}`);
    }
    throw new Error('Local API failed');
  } catch (err) {
    console.warn(`Local apiSaveMenu failed for ${slug}, trying direct extendsclass fallback...`, err);
    const mapping = await getOrCreateBlobIdsDirect(slug);
    const response = await fetch(`https://extendsclass.com/api/json-storage/bin/${mapping.menuBlobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      throw new Error('Direct extendsclass update menu failed');
    }
    return { success: true };
  }
}

// 3. Fetch orders
export async function apiFetchOrders(slug: string): Promise<any[]> {
  try {
    const res = await fetch(`/api/orders/${slug}`);
    if (res.ok) {
      return await res.json();
    }
    if (isFallbackNeeded(res)) {
      throw new Error(`Fallback trigger: ${res.status}`);
    }
    throw new Error('Local API failed');
  } catch (err) {
    console.warn(`Local apiFetchOrders failed for ${slug}, trying direct extendsclass fallback...`, err);
    try {
      const mapping = await getOrCreateBlobIdsDirect(slug);
      const response = await fetch(`https://extendsclass.com/api/json-storage/bin/${mapping.ordersBlobId}`);
      if (!response.ok) {
        return [];
      }
      return await response.json();
    } catch (fallbackErr) {
      console.error('Direct extendsclass fetch orders failed:', fallbackErr);
      return [];
    }
  }
}

// 4. Create/Sync single order
export async function apiSyncOrder(slug: string, newOrder: any): Promise<any[]> {
  try {
    const res = await fetch(`/api/orders/${slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    });
    if (res.ok) {
      return await res.json();
    }
    if (isFallbackNeeded(res)) {
      throw new Error(`Fallback trigger: ${res.status}`);
    }
    throw new Error('Local API failed');
  } catch (err) {
    console.warn(`Local apiSyncOrder failed for ${slug}, trying direct extendsclass fallback...`, err);
    const mapping = await getOrCreateBlobIdsDirect(slug);
    const getRes = await fetch(`https://extendsclass.com/api/json-storage/bin/${mapping.ordersBlobId}`);
    const existingOrders = getRes.ok ? await getRes.json() : [];
    
    const filtered = Array.isArray(existingOrders) ? existingOrders.filter((o: any) => o.id !== newOrder.id) : [];
    const updatedOrders = [newOrder, ...filtered];
    
    const putRes = await fetch(`https://extendsclass.com/api/json-storage/bin/${mapping.ordersBlobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedOrders)
    });
    if (!putRes.ok) {
      throw new Error('Direct extendsclass order sync failed');
    }
    return updatedOrders;
  }
}

// 5. Update order status
export async function apiUpdateOrderStatus(slug: string, orderId: string, status: string): Promise<any[]> {
  try {
    const res = await fetch(`/api/orders/${slug}/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      return await res.json();
    }
    if (isFallbackNeeded(res)) {
      throw new Error(`Fallback trigger: ${res.status}`);
    }
    throw new Error('Local API failed');
  } catch (err) {
    console.warn(`Local apiUpdateOrderStatus failed for ${slug}, trying direct extendsclass fallback...`, err);
    const mapping = await getOrCreateBlobIdsDirect(slug);
    const getRes = await fetch(`https://extendsclass.com/api/json-storage/bin/${mapping.ordersBlobId}`);
    if (!getRes.ok) {
      throw new Error('Direct orders not found');
    }
    const existingOrders = await getRes.json();
    const updated = Array.isArray(existingOrders)
      ? existingOrders.map((o: any) => o.id === orderId ? { ...o, status } : o)
      : [];
    
    const putRes = await fetch(`https://extendsclass.com/api/json-storage/bin/${mapping.ordersBlobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    if (!putRes.ok) {
      throw new Error('Direct extendsclass status update failed');
    }
    return updated;
  }
}

// 6. Fetch users list
export async function apiFetchUsers(): Promise<any[]> {
  try {
    const res = await fetch('/api/users');
    if (res.ok) {
      return await res.json();
    }
    if (isFallbackNeeded(res)) {
      throw new Error(`Fallback trigger: ${res.status}`);
    }
    throw new Error('Local API failed');
  } catch (err) {
    console.warn('Local apiFetchUsers failed, trying direct extendsclass fallback...', err);
    let directory: Directory = {};
    const resDir = await fetch(`https://extendsclass.com/api/json-storage/bin/${DIRECTORY_BLOB_ID}`);
    if (resDir.ok) {
      directory = await resDir.json();
    }
    const blobId = await getOrCreateUsersBlobIdDirect(directory);
    const response = await fetch(`https://extendsclass.com/api/json-storage/bin/${blobId}`);
    if (!response.ok) {
      throw new Error('Direct extendsclass fetch users failed');
    }
    return await response.json();
  }
}

// 7. Save/update users list
export async function apiSaveUsers(users: any[]): Promise<any> {
  try {
    const res = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(users)
    });
    if (res.ok) {
      return await res.json();
    }
    if (isFallbackNeeded(res)) {
      throw new Error(`Fallback trigger: ${res.status}`);
    }
    throw new Error('Local API failed');
  } catch (err) {
    console.warn('Local apiSaveUsers failed, trying direct extendsclass fallback...', err);
    let directory: Directory = {};
    const resDir = await fetch(`https://extendsclass.com/api/json-storage/bin/${DIRECTORY_BLOB_ID}`);
    if (resDir.ok) {
      directory = await resDir.json();
    }
    const blobId = await getOrCreateUsersBlobIdDirect(directory);
    const response = await fetch(`https://extendsclass.com/api/json-storage/bin/${blobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(users)
    });
    if (!response.ok) {
      throw new Error('Direct extendsclass save users failed');
    }
    return { success: true };
  }
}

// 8. Fetch restaurants list
export async function apiFetchRestaurants(): Promise<any[]> {
  try {
    const res = await fetch('/api/restaurants');
    if (res.ok) {
      return await res.json();
    }
    if (isFallbackNeeded(res)) {
      throw new Error(`Fallback trigger: ${res.status}`);
    }
    throw new Error('Local API failed');
  } catch (err) {
    console.warn('Local apiFetchRestaurants failed, trying direct extendsclass fallback...', err);
    let directory: Directory = {};
    const resDir = await fetch(`https://extendsclass.com/api/json-storage/bin/${DIRECTORY_BLOB_ID}`);
    if (resDir.ok) {
      directory = await resDir.json();
    }
    const blobId = await getOrCreateRestaurantsBlobIdDirect(directory);
    const response = await fetch(`https://extendsclass.com/api/json-storage/bin/${blobId}`);
    if (!response.ok) {
      throw new Error('Direct extendsclass fetch restaurants failed');
    }
    return await response.json();
  }
}

// 9. Save/update restaurants list
export async function apiSaveRestaurants(restaurants: any[]): Promise<any> {
  try {
    const res = await fetch('/api/restaurants', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(restaurants)
    });
    if (res.ok) {
      return await res.json();
    }
    if (isFallbackNeeded(res)) {
      throw new Error(`Fallback trigger: ${res.status}`);
    }
    throw new Error('Local API failed');
  } catch (err) {
    console.warn('Local apiSaveRestaurants failed, trying direct extendsclass fallback...', err);
    let directory: Directory = {};
    const resDir = await fetch(`https://extendsclass.com/api/json-storage/bin/${DIRECTORY_BLOB_ID}`);
    if (resDir.ok) {
      directory = await resDir.json();
    }
    const blobId = await getOrCreateRestaurantsBlobIdDirect(directory);
    const response = await fetch(`https://extendsclass.com/api/json-storage/bin/${blobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(restaurants)
    });
    if (!response.ok) {
      throw new Error('Direct extendsclass save restaurants failed');
    }
    return { success: true };
  }
}
