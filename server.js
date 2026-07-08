const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const axios = require('axios');
const FormData = require('form-data');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ============================================================
// FIREBASE ADMIN (avec gestion d'erreur si la clé est absente)
// ============================================================
let db = null;
let firebaseReady = false;

try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  db = admin.firestore();
  firebaseReady = true;
  console.log('✅ Firebase connecté');
} catch (error) {
  console.warn('⚠️ Firebase non configuré, mode dégradé (simulation)');
}

// ============================================================
// CONFIGURATION
// ============================================================
const IMG_BB_KEY = process.env.IMG_BB_KEY || '';
const YABETOO_SECRET = process.env.YABETOO_SECRET_KEY || '';
const ADMIN_PHONE = process.env.ADMIN_PHONE || '065918166';

const COMMISSION_BUYER = 0.03;
const COMMISSION_SELLER = 0.04;

const ALLOWED_CATEGORIES = [
  'vêtements', 'chaussures', 'sacs', 'bijoux', 'accessoires'
];

console.log('✅ BLK Marketplace');
console.log(`📱 Admin Phone: ${ADMIN_PHONE}`);
console.log(`🖼️  ImgBB: ${IMG_BB_KEY ? 'OK' : 'MANQUANT'}`);
console.log(`💳 Yabetoo: ${YABETOO_SECRET ? 'OK' : 'MANQUANT'}`);
console.log(`🔥 Firebase: ${firebaseReady ? 'OK' : 'DÉGRADÉ'}`);

// ============================================================
// CRON - REMBOURSEMENT AUTO (si Firebase est prêt)
// ============================================================
if (firebaseReady) {
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ Vérification des commandes expirées...');
    try {
      const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
      const snapshot = await db.collection('orders')
        .where('status', '==', 'en attente de confirmation')
        .where('createdAt', '<=', twelveHoursAgo)
        .get();

      for (const doc of snapshot.docs) {
        const order = doc.data();
        console.log(`🔄 Remboursement commande ${doc.id}`);
        await refundOrder(doc.id, order);
      }
    } catch (error) {
      console.error('❌ Cron Error:', error.message);
    }
  });
}

async function refundOrder(orderId, order) {
  if (!firebaseReady) return;
  try {
    const buyerRef = db.collection('users').doc(order.buyerId);
    const buyerDoc = await buyerRef.get();
    const buyerBalance = buyerDoc.data()?.walletBalance || 0;
    await buyerRef.update({
      walletBalance: buyerBalance + order.totalAmount
    });

    await db.collection('articles').doc(order.articleId).update({
      status: 'active'
    });

    await db.collection('orders').doc(orderId).update({
      status: 'remboursé',
      refundedAt: new Date()
    });

    console.log(`✅ Remboursement effectué pour ${orderId}`);
  } catch (error) {
    console.error(`❌ Erreur remboursement ${orderId}:`, error.message);
  }
}

// ============================================================
// ROUTES PRINCIPALES
// ============================================================
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'BLK Marketplace API',
    services: {
      firebase: firebaseReady ? '✅' : '❌',
      imgbb: IMG_BB_KEY ? '✅' : '❌',
      yabetoo: YABETOO_SECRET ? '✅' : '❌'
    }
  });
});

app.get('/ping', (req, res) => res.send('pong'));

// ============================================================
// CATÉGORIES
// ============================================================
app.get('/api/categories', (req, res) => {
  res.json({ success: true, data: ALLOWED_CATEGORIES });
});

// ============================================================
// ARTICLES
// ============================================================
app.get('/api/articles', async (req, res) => {
  if (!firebaseReady) {
    // Mode simulation
    return res.json({
      success: true,
      data: [
        { id: '1', title: 'Robe vintage', description: 'Belle robe des années 80', price: 15000, category: 'vêtements', image: '', sellerName: 'Marie K.', sellerId: 'seller1', status: 'active', createdAt: new Date() },
        { id: '2', title: 'Talons rouges', description: 'Escarpins en cuir rouge', price: 25000, category: 'chaussures', image: '', sellerName: 'Sophie L.', sellerId: 'seller2', status: 'active', createdAt: new Date() },
        { id: '3', title: 'Sac en cuir', description: 'Sac à main en cuir noir', price: 35000, category: 'sacs', image: '', sellerName: 'Jean P.', sellerId: 'seller3', status: 'active', createdAt: new Date() }
      ]
    });
  }
  try {
    const snapshot = await db.collection('articles')
      .where('status', '==', 'active')
      .orderBy('createdAt', 'desc')
      .get();
    const articles = [];
    snapshot.forEach(doc => {
      articles.push({ id: doc.id, ...doc.data() });
    });
    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/articles/seller/:sellerId', async (req, res) => {
  if (!firebaseReady) {
    return res.json({
      success: true,
      data: [
        { id: '1', title: 'Robe vintage', price: 15000, image: '', status: 'active' },
        { id: '2', title: 'Talons rouges', price: 25000, image: '', status: 'active' }
      ]
    });
  }
  try {
    const { sellerId } = req.params;
    const snapshot = await db.collection('articles')
      .where('sellerId', '==', sellerId)
      .orderBy('createdAt', 'desc')
      .get();
    const articles = [];
    snapshot.forEach(doc => {
      articles.push({ id: doc.id, ...doc.data() });
    });
    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/articles', async (req, res) => {
  if (!firebaseReady) {
    return res.json({ success: true, id: 'mock-' + Date.now() });
  }
  try {
    const { title, description, price, category, image, sellerId, sellerName, sellerPhoto } = req.body;

    if (!ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Catégorie non autorisée. Autorise: ${ALLOWED_CATEGORIES.join(', ')}`
      });
    }

    const article = {
      title,
      description,
      price: parseInt(price),
      category,
      image: image || '',
      sellerId,
      sellerName: sellerName || 'Anonyme',
      sellerPhoto: sellerPhoto || '',
      status: 'active',
      views: 0,
      createdAt: new Date()
    };

    const docRef = await db.collection('articles').add(article);
    res.json({ success: true, id: docRef.id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/articles/:id', async (req, res) => {
  if (!firebaseReady) {
    return res.json({ success: true });
  }
  try {
    const { id } = req.params;
    await db.collection('articles').doc(id).update({ status: 'inactive' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// UPLOAD IMAGE (ImgBB)
// ============================================================
app.post('/api/upload', async (req, res) => {
  try {
    const { base64 } = req.body;
    if (!base64) return res.status(400).json({ success: false, message: 'Aucune image' });
    if (!IMG_BB_KEY) return res.status(500).json({ success: false, message: 'Clé ImgBB manquante' });

    const base64Data = base64.includes('base64,') ? base64.split('base64,')[1] : base64;
    const formData = new FormData();
    formData.append('key', IMG_BB_KEY);
    formData.append('image', base64Data);

    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: formData.getHeaders()
    });

    if (response.data.success) {
      res.json({ success: true, url: response.data.data.url });
    } else {
      res.status(400).json({ success: false, message: 'Erreur ImgBB' });
    }
  } catch (error) {
    console.error('ImgBB Error:', error.message);
    res.status(500).json({ success: false, message: 'Erreur upload' });
  }
});

// ============================================================
// UTILISATEURS
// ============================================================
app.get('/api/users/:userId', async (req, res) => {
  if (!firebaseReady) {
    return res.json({
      success: true,
      data: {
        name: 'Utilisateur Test',
        photo: '',
        flames: 0,
        walletBalance: 5000,
        phone: '+242 06 123 4567',
        email: 'test@example.com'
      }
    });
  }
  try {
    const { userId } = req.params;
    const doc = await db.collection('users').doc(userId).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });

    const data = doc.data();
    res.json({
      success: true,
      data: {
        name: data.name,
        photo: data.photo || '',
        flames: data.flames || 0,
        walletBalance: data.walletBalance || 0,
        phone: data.phone || '',
        email: data.email || ''
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/users/:userId', async (req, res) => {
  if (!firebaseReady) {
    return res.json({ success: true });
  }
  try {
    const { userId } = req.params;
    const { name, email, phone, photo } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (photo) updateData.photo = photo;

    await db.collection('users').doc(userId).update(updateData);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// WALLET
// ============================================================
app.get('/api/wallet/:userId', async (req, res) => {
  if (!firebaseReady) {
    return res.json({ balance: 5000 });
  }
  try {
    const { userId } = req.params;
    const doc = await db.collection('users').doc(userId).get();
    res.json({ balance: doc.data()?.walletBalance || 0 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Pour les autres routes (dépôt, retrait, commandes, flammes, stats, etc.)
// On va les ajouter progressivement. Pour l'instant, on garde les routes simulées
// mais on les protège avec un check firebaseReady.

// ... (les autres routes restent similaires à la version simulation)

// ============================================================
// DÉMARRAGE
// ============================================================
app.listen(PORT, () => {
  console.log(`✅ BLK API running on port ${PORT}`);
  console.log(`📦 Mode: ${firebaseReady ? '100% RÉEL' : 'SIMULATION'}`);
});
