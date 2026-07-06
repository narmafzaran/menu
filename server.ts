import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DIRECTORY_BLOB_ID = '019f324a-4f9c-7073-b200-0f566a40ab91';

app.use(express.json());

interface RestaurantBlobMapping {
  menuBlobId: string;
  ordersBlobId: string;
}

interface Directory {
  [slug: string]: any;
}

// Helper to get or create users blob ID
async function getOrCreateUsersBlobId(directory: Directory): Promise<string> {
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
    const res = await fetch('https://jsonblob.com/api/jsonBlob', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(defaultUsers)
    });
    usersBlobId = res.headers.get('x-jsonblob-id') || '';
  } catch (err) {
    console.error('Failed to create users blob:', err);
  }

  if (!usersBlobId) {
    throw new Error('Failed to create users blob in cloud');
  }

  directory._usersBlobId = usersBlobId;
  try {
    await fetch(`https://jsonblob.com/api/jsonBlob/${DIRECTORY_BLOB_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(directory)
    });
  } catch (err) {
    console.error('Failed to update directory with usersBlobId:', err);
  }

  return usersBlobId;
}

// Helper to get or create restaurants blob ID
async function getOrCreateRestaurantsBlobId(directory: Directory): Promise<string> {
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
    const res = await fetch('https://jsonblob.com/api/jsonBlob', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(defaultRestaurants)
    });
    restaurantsBlobId = res.headers.get('x-jsonblob-id') || '';
  } catch (err) {
    console.error('Failed to create restaurants blob:', err);
  }

  if (!restaurantsBlobId) {
    throw new Error('Failed to create restaurants blob in cloud');
  }

  directory._restaurantsBlobId = restaurantsBlobId;
  try {
    await fetch(`https://jsonblob.com/api/jsonBlob/${DIRECTORY_BLOB_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(directory)
    });
  } catch (err) {
    console.error('Failed to update directory with restaurantsBlobId:', err);
  }

  return restaurantsBlobId;
}

// Helper to get or create blob IDs for a given slug from the jsonblob directory
async function getOrCreateBlobIds(slug: string): Promise<RestaurantBlobMapping> {
  // 1. Fetch directory
  let directory: Directory = {};
  try {
    const res = await fetch(`https://jsonblob.com/api/jsonBlob/${DIRECTORY_BLOB_ID}`);
    if (res.ok) {
      directory = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch directory from jsonblob:', err);
  }

  // 2. If slug already mapped and valid, return it
  if (directory[slug] && typeof directory[slug] === 'object' && directory[slug].menuBlobId && directory[slug].ordersBlobId) {
    return directory[slug];
  }

  // 3. Create menu blob
  let menuBlobId = '';
  try {
    const resMenu = await fetch('https://jsonblob.com/api/jsonBlob', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rest: null, cats: [], items: [] })
    });
    menuBlobId = resMenu.headers.get('x-jsonblob-id') || '';
  } catch (err) {
    console.error('Failed to create menu blob:', err);
  }

  // 4. Create orders blob
  let ordersBlobId = '';
  try {
    const resOrders = await fetch('https://jsonblob.com/api/jsonBlob', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([])
    });
    ordersBlobId = resOrders.headers.get('x-jsonblob-id') || '';
  } catch (err) {
    console.error('Failed to create orders blob:', err);
  }

  if (!menuBlobId || !ordersBlobId) {
    throw new Error('Failed to provision cloud storage for restaurant');
  }

  // 5. Update directory
  directory[slug] = { menuBlobId, ordersBlobId };
  try {
    await fetch(`https://jsonblob.com/api/jsonBlob/${DIRECTORY_BLOB_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(directory)
    });
  } catch (err) {
    console.error('Failed to save directory update:', err);
  }

  return directory[slug];
}

// API Routes

// 1. Fetch restaurant menu
app.get("/api/menu/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const mapping = await getOrCreateBlobIds(slug);
    const response = await fetch(`https://jsonblob.com/api/jsonBlob/${mapping.menuBlobId}`);
    if (!response.ok) {
      return res.status(404).json({ error: "Menu not found" });
    }
    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    console.error(`Error fetching menu for ${req.params.slug}:`, err);
    return res.status(500).json({ error: err.message });
  }
});

// 2. Save/update restaurant menu
app.put("/api/menu/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const { rest, cats, items } = req.body;
    const mapping = await getOrCreateBlobIds(slug);
    const response = await fetch(`https://jsonblob.com/api/jsonBlob/${mapping.menuBlobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rest, cats, items })
    });
    if (!response.ok) {
      return res.status(500).json({ error: "Failed to update menu in jsonblob" });
    }
    return res.json({ success: true });
  } catch (err: any) {
    console.error(`Error saving menu for ${req.params.slug}:`, err);
    return res.status(500).json({ error: err.message });
  }
});

// 3. Fetch restaurant orders
app.get("/api/orders/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const mapping = await getOrCreateBlobIds(slug);
    const response = await fetch(`https://jsonblob.com/api/jsonBlob/${mapping.ordersBlobId}`);
    if (!response.ok) {
      return res.json([]);
    }
    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    console.error(`Error fetching orders for ${req.params.slug}:`, err);
    return res.status(500).json({ error: err.message });
  }
});

// 4. Create/sync a single order
app.post("/api/orders/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const newOrder = req.body;
    const mapping = await getOrCreateBlobIds(slug);
    const getRes = await fetch(`https://jsonblob.com/api/jsonBlob/${mapping.ordersBlobId}`);
    const existingOrders = getRes.ok ? await getRes.json() : [];
    
    // De-duplicate & merge
    const filtered = Array.isArray(existingOrders) ? existingOrders.filter((o: any) => o.id !== newOrder.id) : [];
    const updatedOrders = [newOrder, ...filtered];
    
    const putRes = await fetch(`https://jsonblob.com/api/jsonBlob/${mapping.ordersBlobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedOrders)
    });
    if (!putRes.ok) {
      return res.status(500).json({ error: "Failed to sync order to jsonblob" });
    }
    return res.json(updatedOrders);
  } catch (err: any) {
    console.error(`Error syncing order for ${req.params.slug}:`, err);
    return res.status(500).json({ error: err.message });
  }
});

// 5. Update an order's status
app.patch("/api/orders/:slug/:orderId", async (req, res) => {
  try {
    const { slug, orderId } = req.params;
    const { status } = req.body;
    const mapping = await getOrCreateBlobIds(slug);
    const getRes = await fetch(`https://jsonblob.com/api/jsonBlob/${mapping.ordersBlobId}`);
    if (!getRes.ok) {
      return res.status(404).json({ error: "Orders list not found" });
    }
    const existingOrders = await getRes.json();
    const updated = Array.isArray(existingOrders) 
      ? existingOrders.map((o: any) => o.id === orderId ? { ...o, status } : o)
      : [];
    
    const putRes = await fetch(`https://jsonblob.com/api/jsonBlob/${mapping.ordersBlobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    if (!putRes.ok) {
      return res.status(500).json({ error: "Failed to update order status in jsonblob" });
    }
    return res.json(updated);
  } catch (err: any) {
    console.error(`Error updating order status for ${req.params.slug}:`, err);
    return res.status(500).json({ error: err.message });
  }
});

// 6. Fetch users list
app.get("/api/users", async (req, res) => {
  try {
    let directory: Directory = {};
    const resDir = await fetch(`https://jsonblob.com/api/jsonBlob/${DIRECTORY_BLOB_ID}`);
    if (resDir.ok) {
      directory = await resDir.json();
    }
    const blobId = await getOrCreateUsersBlobId(directory);
    const response = await fetch(`https://jsonblob.com/api/jsonBlob/${blobId}`);
    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ error: err.message });
  }
});

// 7. Save/update users list
app.put("/api/users", async (req, res) => {
  try {
    let directory: Directory = {};
    const resDir = await fetch(`https://jsonblob.com/api/jsonBlob/${DIRECTORY_BLOB_ID}`);
    if (resDir.ok) {
      directory = await resDir.json();
    }
    const blobId = await getOrCreateUsersBlobId(directory);
    const response = await fetch(`https://jsonblob.com/api/jsonBlob/${blobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    if (!response.ok) {
      return res.status(500).json({ error: "Failed to update users in cloud" });
    }
    return res.json({ success: true });
  } catch (err: any) {
    console.error("Error saving users:", err);
    return res.status(500).json({ error: err.message });
  }
});

// 8. Fetch restaurants list
app.get("/api/restaurants", async (req, res) => {
  try {
    let directory: Directory = {};
    const resDir = await fetch(`https://jsonblob.com/api/jsonBlob/${DIRECTORY_BLOB_ID}`);
    if (resDir.ok) {
      directory = await resDir.json();
    }
    const blobId = await getOrCreateRestaurantsBlobId(directory);
    const response = await fetch(`https://jsonblob.com/api/jsonBlob/${blobId}`);
    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    console.error("Error fetching restaurants:", err);
    return res.status(500).json({ error: err.message });
  }
});

// 9. Save/update restaurants list
app.put("/api/restaurants", async (req, res) => {
  try {
    let directory: Directory = {};
    const resDir = await fetch(`https://jsonblob.com/api/jsonBlob/${DIRECTORY_BLOB_ID}`);
    if (resDir.ok) {
      directory = await resDir.json();
    }
    const blobId = await getOrCreateRestaurantsBlobId(directory);
    const response = await fetch(`https://jsonblob.com/api/jsonBlob/${blobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    if (!response.ok) {
      return res.status(500).json({ error: "Failed to update restaurants in cloud" });
    }
    return res.json({ success: true });
  } catch (err: any) {
    console.error("Error saving restaurants:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Serve frontend assets using Vite dev middleware or standard static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
