const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ============================================================
// FIREBASE ADMIN
// ============================================================
let db = null;
let firebaseReady = false;

try {
  let serviceAccount = null;
  const secretPath = '/etc/secrets/firebase-key.json';
  if (fs.existsSync(secretPath)) {
    console.log('📁 Lecture Firebase depuis Secret File...');
    serviceAccount = JSON.parse(fs.readFileSync(secretPath, 'utf8'));
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.log('📁 Lecture Firebase depuis variable d\'environnement...');
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }

  if (serviceAccount) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    db = admin.firestore();
    firebaseReady = true;
    console.log('✅ Firebase connecté avec succès !');
  } else {
    console.warn('⚠️ Aucune clé Firebase trouvée. Mode SIMULATION.');
  }
} catch (error) {
  console.error('❌ Erreur Firebase:', error.message);
  console.warn('⚠️ Mode SIMULATION activé.');
}

// ============================================================
// CONFIGURATION
// ============================================================
// ⚠️ Supprimez la clé codée en dur, utilisez uniquement les variables d'environnement
const IMG_BB_KEY = process.env.IMG_BB_KEY || '';
const YABETOO_SECRET = process.env.YABETOO_SECRET_KEY || '';
const YABETOO_WEBHOOK_SECRET = process.env.YABETOO_WEBHOOK_SECRET || 'change-me';
const ADMIN_PHONE = process.env.ADMIN_PHONE || '065918166';
const YABETOO_API_BASE = 'https://pay.api.yabetoopay.com/v1';

const COMMISSION_BUYER = 0.03;
const COMMISSION_SELLER = 0.04;
const ORDER_DELAY_MS = 6 * 60 * 60 * 1000; // 6h pour confirmer la réception

const ALLOWED_CATEGORIES = ['vêtements', 'chaussures', 'sacs', 'bijoux', 'accessoires'];

console.log(`📱 Admin Phone: ${ADMIN_PHONE}`);
console.log(`🖼️  ImgBB: ${IMG_BB_KEY ? 'OK' : 'MANQUANT'}`);
console.log(`💳 Yabetoo Secret: ${YABETOO_SECRET ? 'OK' : 'MANQUANT'}`);
console.log(`🔒 Webhook Secret: ${YABETOO_WEBHOOK_SECRET !== 'change-me' ? 'OK' : 'DEFAUT (changez-moi !)'}`);
console.log(`🔥 Firebase: ${firebaseReady ? 'OK' : 'DÉGRADÉ (SIMULATION)'}`);
console.log(`🌐 Yabetoo API Base: ${YABETOO_API_BASE}`);

function formatPhoneForYabetoo(phone) {
  let formatted = String(phone).trim().replace(/\s/g, '').replace(/\+/g, '');
  if (formatted.startsWith('0')) formatted = formatted.substring(1);
  if (!formatted.startsWith('242')) formatted = '242' + formatted;
  return '+' + formatted;
}

// ============================================================
// MIDDLEWARE AUTHENTIFICATION (à activer pour la production)
// ============================================================
// Pour l'instant, on peut se contenter de vérifier que le userId existe
// mais pour une vraie sécurité, il faudra Firebase Auth.
// Exemple d'utilisation : app.use('/api/orders', verifyAuth);
async function verifyAuth(req, res, next) {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) return res.status(401).json({ success: false, message: 'Non autorisé' });
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.userId = decodedToken.uid;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalide' });
  }
}

// ============================================================
// ROUTES PRINCIPALES
// ============================================================
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'BLK Marketplace API',
    mode: firebaseReady ? '100% RÉEL' : 'SIMULATION',
    services: {
      firebase: firebaseReady ? '✅' : '❌',
      imgbb: IMG_BB_KEY ? '✅' : '❌',
      yabetoo: YABETOO_SECRET ? '✅' : '❌'
    }
  });
});

app.get('/ping', (req, res) => res.send('pong'));

app.get('/api/debug/env', (req, res) => {
  res.json({
    YABETOO_SECRET_KEY_present: !!process.env.YABETOO_SECRET_KEY,
    YABETOO_SECRET_KEY_length: (process.env.YABETOO_SECRET_KEY || '').length,
    firebaseReady,
    YABETOO_API_BASE
  });
});

app.get('/api/debug/yabetoo-ping', async (req, res) => {
  try {
    const response = await axios.post(
      `${YABETOO_API_BASE}/payment-intents`,
      { amount: 100, currency: 'xaf', description: 'Test ping BLK' },
      { headers: { 'Authorization': `Bearer ${YABETOO_SECRET}`, 'Content-Type': 'application/json' }, timeout: 10000 }
    );
    res.json({ success: true, status: response.status, data: response.data });
  } catch (error) {
    res.status(200).json({
      success: false,
      http_status: error.response?.status || null,
      yabetoo_error: error.response?.data || null,
      message: error.message
    });
  }
});

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
  if (!firebaseReady) return res.json({ success: true, data: [] });
  try {
    const snapshot = await db.collection('products').where('status', '==', 'active').get();
    const articles = [];
    snapshot.forEach(doc => articles.push({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/articles/seller/:sellerId', async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, data: [] });
  try {
    const { sellerId } = req.params;
    const snapshot = await db.collection('products').where('sellerId', '==', sellerId).get();
    const articles = [];
    snapshot.forEach(doc => articles.push({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/articles', async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, id: 'mock-' + Date.now() });
  try {
    const { title, description, price, category, image, images, sellerId, sellerName, sellerPhoto } = req.body;
    if (!ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({ success: false, message: `Catégorie non autorisée. Autorise: ${ALLOWED_CATEGORIES.join(', ')}` });
    }
    var imageList = Array.isArray(images) ? images.filter(Boolean).slice(0, 10) : [];
    if (imageList.length === 0 && image) imageList = [image];
    const article = {
      title, description, price: parseInt(price), category,
      image: imageList[0] || '', images: imageList,
      sellerId, sellerName: sellerName || 'Anonyme', sellerPhoto: sellerPhoto || '',
      status: 'active', views: 0, createdAt: new Date()
    };
    const docRef = await db.collection('products').add(article);
    res.json({ success: true, id: docRef.id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/articles/:id', async (req, res) => {
  if (!firebaseReady) return res.json({ success: true });
  try {
    const { id } = req.params;
    await db.collection('products').doc(id).update({ status: 'inactive' });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/articles/view/:id', async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, views: 1 });
  try {
    const { id } = req.params;
    const doc = await db.collection('products').doc(id).get();
    const views = (doc.data()?.views || 0) + 1;
    await db.collection('products').doc(id).update({ views });
    res.json({ success: true, views });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// UPLOAD IMAGE
// ============================================================
app.post('/api/upload', async (req, res) => {
  try {
    const { base64 } = req.body;
    if (!base64) return res.status(400).json({ success: false, message: 'Aucune image fournie' });
    if (!IMG_BB_KEY) return res.status(500).json({ success: false, message: 'Clé ImgBB non configurée' });

    let cleanBase64 = base64;
    if (cleanBase64.includes('base64,')) cleanBase64 = cleanBase64.split('base64,')[1];
    cleanBase64 = cleanBase64.replace(/\s/g, '');
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(cleanBase64)) {
      return res.status(400).json({ success: false, message: 'Format d\'image invalide' });
    }
    const imageSize = Buffer.from(cleanBase64, 'base64').length;
    if (imageSize > 1.5 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: 'Image trop volumineuse (max 1.5 Mo)' });
    }

    const formData = new FormData();
    formData.append('key', IMG_BB_KEY);
    formData.append('image', cleanBase64);
    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: formData.getHeaders(), timeout: 15000
    });

    if (response.data.success) {
      res.json({ success: true, url: response.data.data.url });
    } else {
      res.status(400).json({ success: false, message: 'Erreur ImgBB: ' + (response.data.error?.message || 'inconnue') });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur: ' + error.message });
  }
});

// ============================================================
// UTILISATEURS
// ============================================================
app.post('/api/users/register', async (req, res) => {
  if (!firebaseReady) {
    return res.json({ success: true, data: { walletBalance: 5000, flames: 0 } });
  }
  try {
    const { userId, name, email, phone } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'userId requis' });
    const userRef = db.collection('users').doc(userId);
    const existing = await userRef.get();
    if (!existing.exists) {
      await userRef.set({
        name: name || 'Utilisateur', email: email || '', phone: phone || '',
        photo: '', flames: 0, walletBalance: 0, isSeller: false, blockedUsers: [],
        online: true, createdAt: new Date()
      });
    } else {
      const updateData = { online: true };
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (phone) updateData.phone = phone;
      await userRef.update(updateData);
    }
    const fresh = await userRef.get();
    res.json({ success: true, data: fresh.data() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/users/:userId', async (req, res) => {
  if (!firebaseReady) {
    return res.json({
      success: true,
      data: { name: 'Utilisateur Test', photo: '', flames: 0, walletBalance: 5000, phone: '+242 06 123 4567', email: 'test@example.com', isSeller: false, blockedUsers: [], online: false, articlesCount: 0 }
    });
  }
  try {
    const { userId } = req.params;
    const doc = await db.collection('users').doc(userId).get();
    const data = doc.exists ? doc.data() : {};
    const articlesSnapshot = await db.collection('products').where('sellerId', '==', userId).where('status', '==', 'active').get();
    res.json({
      success: true,
      data: {
        name: data.name || 'Utilisateur', photo: data.photo || '', flames: data.flames || 0,
        walletBalance: data.walletBalance || 0, phone: data.phone || '', email: data.email || '',
        isSeller: data.isSeller || false, blockedUsers: data.blockedUsers || [], online: data.online || false,
        articlesCount: articlesSnapshot.size,
        followersCount: data.followersCount || 0, followingCount: data.followingCount || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/users/online', async (req, res) => {
  if (!firebaseReady) return res.json({ success: true });
  try {
    const { userId, online } = req.body;
    await db.collection('users').doc(userId).update({ online: online || false });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/users/:userId', async (req, res) => {
  if (!firebaseReady) return res.json({ success: true });
  try {
    const { userId } = req.params;
    const { name, email, phone, photo, isSeller } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (photo) updateData.photo = photo;
    if (isSeller !== undefined) updateData.isSeller = isSeller;
    await db.collection('users').doc(userId).update(updateData);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/users/block', async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, message: 'Simulation' });
  try {
    const { blockerId, blockedId } = req.body;
    if (!blockerId || !blockedId) return res.status(400).json({ success: false, message: 'IDs requis' });
    const blockerRef = db.collection('users').doc(blockerId);
    const blockerDoc = await blockerRef.get();
    const blocked = blockerDoc.data()?.blockedUsers || [];
    if (blocked.includes(blockedId)) {
      await blockerRef.update({ blockedUsers: blocked.filter(id => id !== blockedId) });
      return res.json({ success: true, message: 'Débloqué', blocked: false });
    } else {
      await blockerRef.update({ blockedUsers: [...blocked, blockedId] });
      return res.json({ success: true, message: 'Bloqué', blocked: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// WALLET
// ============================================================
app.get('/api/wallet/:userId', async (req, res) => {
  if (!firebaseReady) return res.json({ balance: 5000 });
  try {
    const { userId } = req.params;
    const doc = await db.collection('users').doc(userId).get();
    res.json({ balance: doc.data()?.walletBalance || 0 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/payment/initiate', async (req, res) => {
  try {
    const { userId, amount, phone, operator } = req.body;
    if (!userId || !amount || !phone) return res.status(400).json({ success: false, message: 'userId, amount et phone requis' });
    if (!firebaseReady) return res.status(500).json({ success: false, message: 'Firebase non disponible' });

    const userRef = db.collection('users').doc(userId);
    let userDoc = await userRef.get();
    if (!userDoc.exists) {
      // Créer l'utilisateur s'il n'existe pas
      await userRef.set({
        name: 'Utilisateur', email: '', phone: phone || '', photo: '',
        walletBalance: 0, flames: 0, blockedUsers: [], online: true, createdAt: new Date()
      });
      userDoc = await userRef.get();
    }

    const formattedPhone = formatPhoneForYabetoo(phone);
    const operatorName = (operator || 'mtn').toLowerCase();

    // 1. Créer l'intention de paiement
    const createResponse = await axios.post(
      `${YABETOO_API_BASE}/payment-intents`,
      { amount: parseInt(amount), currency: 'xaf', description: `Dépôt BLK - ${userId}` },
      { headers: { 'Authorization': `Bearer ${YABETOO_SECRET}`, 'Content-Type': 'application/json' } }
    );
    const intent = createResponse.data;
    const clientSecret = intent.client_secret || intent.clientSecret || intent.data?.client_secret || intent.data?.clientSecret || intent.intent?.client_secret || intent.intent?.clientSecret;
    if (!clientSecret) {
      return res.status(502).json({ success: false, message: "La création de l'intention Yabetoo n'a pas renvoyé de client_secret exploitable.", yabetoo_create_response: intent });
    }

    // 2. Confirmer l'intention avec Mobile Money
    const confirmPayload = {
      client_secret: clientSecret, amount: parseInt(amount), currency: 'xaf',
      first_name: 'Client', last_name: 'BLK', receipt_email: userDoc.data()?.email || 'client@blk.com',
      payment_method_data: { type: 'momo', momo: { country: 'cg', msisdn: formattedPhone, operator_name: operatorName } }
    };
    const confirmResponse = await axios.post(
      `${YABETOO_API_BASE}/payment-intents/${intent.id}/confirm`,
      confirmPayload,
      { headers: { 'Authorization': `Bearer ${YABETOO_SECRET}`, 'Content-Type': 'application/json' } }
    );
    const confirmData = confirmResponse.data;

    // 3. Enregistrer la transaction
    const transactionRef = await db.collection('transactions').add({
      userId, amount: parseInt(amount), phone: formattedPhone, operator: operatorName,
      yabetooId: intent.id, status: 'pending', type: 'deposit', createdAt: new Date()
    });
    await transactionRef.update({ transactionId: confirmData.transactionId || confirmData.intentId || intent.id, status: confirmData.status || 'pending' });

    // 4. Si le paiement est déjà réussi, créditer immédiatement
    if (confirmData.status === 'succeeded' && confirmData.captured) {
      const currentBalance = userDoc.data()?.walletBalance || 0;
      await userRef.update({ walletBalance: currentBalance + parseInt(amount) });
      await transactionRef.update({ status: 'completed', completedAt: new Date() });
      return res.json({ success: true, message: '✅ Dépôt confirmé et wallet crédité !', status: 'succeeded' });
    }

    res.json({ success: true, message: 'Demande envoyée à Yabetoo. En attente de ta confirmation par SMS/USSD, puis du webhook.', status: confirmData.status || 'pending' });
  } catch (error) {
    return res.status(502).json({
      success: false, message: 'Le paiement Yabetoo a échoué (aucun crédit fictif appliqué).',
      yabetoo_http_status: error.response?.status || null, yabetoo_error: error.response?.data || null, raw_message: error.message
    });
  }
});

// Webhook sécurisé
app.post('/api/payment/callback', async (req, res) => {
  const signature = req.headers['x-yabetoo-signature'];
  // Vérification de signature (à adapter selon la doc Yabetoo)
  if (signature) {
    const expected = crypto.createHmac('sha256', YABETOO_WEBHOOK_SECRET).update(JSON.stringify(req.body)).digest('hex');
    if (signature !== expected) {
      return res.status(401).json({ success: false, message: 'Signature invalide' });
    }
  }
  // Répondre immédiatement
  res.status(200).json({ success: true });

  setImmediate(async () => {
    try {
      if (!firebaseReady) return;
      const eventType = req.body.type || '';
      const payload = req.body.data || req.body;

      if (eventType.startsWith('disbursement')) {
        const disb = payload.disbursement || payload;
        const disbId = disb.id;
        const disbStatus = disb.status;
        const snapshot = await db.collection('transactions').where('yabetooDisbursementId', '==', disbId).get();
        if (snapshot.empty) return;
        const transactionDoc = snapshot.docs[0];
        const transactionData = transactionDoc.data();
        if (transactionData.status !== 'pending') return;
        if (disbStatus === 'success' || disbStatus === 'completed' || disbStatus === 'succeeded') {
          await transactionDoc.ref.update({ status: 'completed', completedAt: new Date() });
        } else {
          const userRef = db.collection('users').doc(transactionData.userId);
          const userDoc = await userRef.get();
          const currentBalance = userDoc.data()?.walletBalance || 0;
          await userRef.update({ walletBalance: currentBalance + transactionData.amount });
          await transactionDoc.ref.update({ status: 'failed', failedAt: new Date() });
        }
        return;
      }

      const { id, status, amount, reference } = payload;
      let snapshot = await db.collection('transactions').where('yabetooId', '==', id).get();
      if (snapshot.empty && reference) snapshot = await db.collection('transactions').where('reference', '==', reference).get();
      if (snapshot.empty) return;
      const transactionDoc = snapshot.docs[0];
      const transactionData = transactionDoc.data();
      if (transactionData.status === 'completed') return;

      if (status === 'success' || status === 'completed' || status === 'succeeded') {
        const userRef = db.collection('users').doc(transactionData.userId);
        const userDoc = await userRef.get();
        const currentBalance = userDoc.data()?.walletBalance || 0;
        const creditAmount = parseInt(amount || transactionData.amount);
        await userRef.update({ walletBalance: currentBalance + creditAmount });
        await transactionDoc.ref.update({ status: 'completed', completedAt: new Date() });
      } else {
        await transactionDoc.ref.update({ status: 'failed', failedAt: new Date() });
      }
    } catch (error) {
      console.error('❌ Erreur traitement webhook:', error);
    }
  });
});

app.post('/api/wallet/transfer', async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, message: 'Transfert simulé avec succès !' });
  try {
    const { fromUserId, toPhone, amount } = req.body;
    if (!fromUserId || !toPhone || !amount || parseInt(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'fromUserId, toPhone et amount requis' });
    }
    const recipientSnapshot = await db.collection('users').where('phone', '==', toPhone).limit(1).get();
    if (recipientSnapshot.empty) return res.status(404).json({ success: false, message: 'Aucun utilisateur BLK trouvé avec ce numéro' });
    const recipientDoc = recipientSnapshot.docs[0];
    if (recipientDoc.id === fromUserId) return res.status(400).json({ success: false, message: 'Tu ne peux pas te transférer de l\'argent à toi-même' });

    const senderRef = db.collection('users').doc(fromUserId);
    const result = await db.runTransaction(async (t) => {
      const senderDoc = await t.get(senderRef);
      const recipientRef = recipientDoc.ref;
      const recipientFreshDoc = await t.get(recipientRef);
      const senderBalance = senderDoc.data()?.walletBalance || 0;
      const transferAmount = parseInt(amount);
      if (senderBalance < transferAmount) throw new Error('INSUFFICIENT_BALANCE');
      const recipientBalance = recipientFreshDoc.data()?.walletBalance || 0;
      t.update(senderRef, { walletBalance: senderBalance - transferAmount });
      t.update(recipientRef, { walletBalance: recipientBalance + transferAmount });
      return { newSenderBalance: senderBalance - transferAmount, recipientName: recipientFreshDoc.data()?.name || 'Utilisateur' };
    });

    const transferAmount = parseInt(amount);
    await db.collection('transactions').add({ userId: fromUserId, amount: transferAmount, type: 'transfer_sent', toUserId: recipientDoc.id, status: 'completed', description: `Transfert envoyé à ${result.recipientName}`, createdAt: new Date() });
    await db.collection('transactions').add({ userId: recipientDoc.id, amount: transferAmount, type: 'transfer_received', fromUserId, status: 'completed', description: 'Transfert reçu', createdAt: new Date() });
    await db.collection('notifications').add({ userId: recipientDoc.id, message: `Tu as reçu ${transferAmount} FCFA par transfert.`, type: 'transfer_received', read: false, createdAt: new Date() });

    res.json({ success: true, message: `${transferAmount} FCFA envoyés à ${result.recipientName}`, newBalance: result.newSenderBalance });
  } catch (error) {
    if (error.message === 'INSUFFICIENT_BALANCE') return res.status(400).json({ success: false, message: 'Solde insuffisant' });
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/wallet/withdraw', async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, message: 'Retrait simulé avec succès !', newBalance: 5000 });
  try {
    const { userId, amount, phone, operator } = req.body;
    if (!userId || !amount || !phone) return res.status(400).json({ success: false, message: 'userId, amount et phone requis' });

    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();
    const currentBalance = doc.data()?.walletBalance || 0;
    if (currentBalance < amount) return res.status(400).json({ success: false, message: 'Solde insuffisant' });

    const formattedPhone = formatPhoneForYabetoo(phone).replace('+', '');
    const operatorName = (operator || 'mtn').toLowerCase();

    let disbursement;
    try {
      const disbursementResponse = await axios.post(
        `${YABETOO_API_BASE}/disbursement`,
        {
          amount: parseInt(amount), currency: 'XAF',
          first_name: doc.data()?.name?.split(' ')[0] || 'Client',
          last_name: doc.data()?.name?.split(' ').slice(1).join(' ') || 'BLK',
          payment_method_data: { type: 'momo', momo: { msisdn: formattedPhone, country: 'CG', operator_name: operatorName } }
        },
        { headers: { 'Authorization': `Bearer ${YABETOO_SECRET}`, 'Content-Type': 'application/json' } }
      );
      disbursement = disbursementResponse.data;
    } catch (yabetooError) {
      return res.status(502).json({
        success: false,
        message: "Le retrait Yabetoo a échoué (aucun montant débité). Si l'erreur mentionne un accès partenaire manquant, il faut en faire la demande à Yabetoo.",
        yabetoo_error: yabetooError.response?.data || null
      });
    }

    const newBalance = currentBalance - parseInt(amount);
    await userRef.update({ walletBalance: newBalance });
    await db.collection('transactions').add({
      userId, amount: parseInt(amount), phone: formattedPhone, operator: operatorName,
      yabetooDisbursementId: disbursement.id || null, type: 'withdraw', status: 'pending',
      description: 'Retrait Yabetoo (exécution J+1)', createdAt: new Date()
    });

    res.json({ success: true, message: "Retrait initié. Yabetoo l'exécutera automatiquement sous 24h vers ton Mobile Money.", newBalance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/wallet/admin-credit', async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, message: 'Crédit simulé' });
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount) return res.status(400).json({ success: false, message: 'userId et amount requis' });
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const currentBalance = userDoc.data()?.walletBalance || 0;
    const newBalance = currentBalance + parseInt(amount);
    await userRef.update({ walletBalance: newBalance });
    await db.collection('transactions').add({ userId, amount: parseInt(amount), type: 'deposit', status: 'completed', description: 'Crédit manuel admin', createdAt: new Date() });
    res.json({ success: true, newBalance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// ORDRES
// ============================================================
app.post('/api/orders/create', async (req, res) => {
  if (!firebaseReady) {
    return res.json({
      success: true, orderId: 'mock-' + Date.now(), message: 'Commande créée (simulée)',
      totalAmount: 15450, buyerCommission: 450, sellerCommission: 600,
      expiresAt: new Date(Date.now() + ORDER_DELAY_MS)
    });
  }
  try {
    const { articleId, buyerId, sellerId, amount, buyerPhone } = req.body;
    if (!articleId || !buyerId || !sellerId || !amount) {
      return res.status(400).json({ success: false, message: 'Champs requis manquants' });
    }

    const articleRef = db.collection('products').doc(articleId);
    const buyerRef = db.collection('users').doc(buyerId);

    const orderId = await db.runTransaction(async (t) => {
      const articleSnap = await t.get(articleRef);
      if (!articleSnap.exists) throw new Error('ARTICLE_NOT_FOUND');
      const article = articleSnap.data();
      if (article.status !== 'active') throw new Error('ARTICLE_NOT_ACTIVE');

      const buyerSnap = await t.get(buyerRef);
      const buyerData = buyerSnap.data();
      const blockedUsers = buyerData?.blockedUsers || [];
      if (blockedUsers.includes(sellerId)) throw new Error('SELLER_BLOCKED');

      const buyerBalance = buyerData?.walletBalance || 0;
      const buyerCommission = Math.round(amount * COMMISSION_BUYER);
      const totalAmount = amount + buyerCommission;
      if (buyerBalance < totalAmount) {
        throw new Error(`INSUFFICIENT_BALANCE|${buyerBalance}|${totalAmount}|${totalAmount - buyerBalance}`);
      }

      // Réserver l'article
      t.update(articleRef, { status: 'reserved', reservedAt: new Date(), reservedBy: buyerId });
      // Débiter l'acheteur
      t.update(buyerRef, { walletBalance: buyerBalance - totalAmount });

      const orderData = {
        articleId, buyerId, sellerId,
        buyerPhone: buyerPhone || buyerData?.phone || '',
        amount: parseInt(amount), buyerCommission, totalAmount,
        sellerCommission: Math.round(amount * COMMISSION_SELLER),
        status: 'en attente de confirmation', buyerConfirmed: false, buyerConfirmedAt: null,
        flamesGiven: false, expiresAt: new Date(Date.now() + ORDER_DELAY_MS), createdAt: new Date()
      };
      const orderRef = db.collection('orders').doc();
      t.set(orderRef, orderData);
      return orderRef.id;
    });

    // Notifier le vendeur
    await db.collection('notifications').add({
      userId: sellerId,
      message: `🛒 Nouvelle commande #${orderId.slice(0,8)} - ${amount} FCFA`,
      type: 'new_order', read: false, orderId, createdAt: new Date()
    });

    res.json({
      success: true, orderId, message: '✅ Commande créée avec succès ! Livraison sous 6h.',
      totalAmount: Math.round(amount * (1 + COMMISSION_BUYER)),
      buyerCommission: Math.round(amount * COMMISSION_BUYER),
      sellerCommission: Math.round(amount * COMMISSION_SELLER),
      expiresAt: new Date(Date.now() + ORDER_DELAY_MS)
    });
  } catch (error) {
    console.error('Order Error:', error.message);
    if (error.message === 'ARTICLE_NOT_FOUND') return res.status(404).json({ success: false, message: 'Article introuvable' });
    if (error.message === 'ARTICLE_NOT_ACTIVE') return res.status(409).json({ success: false, message: "Cet article vient d'être réservé par un autre acheteur." });
    if (error.message === 'SELLER_BLOCKED') return res.status(403).json({ success: false, message: 'Vous avez bloqué ce vendeur' });
    if (error.message.startsWith('INSUFFICIENT_BALANCE')) {
      const [, balance, required, difference] = error.message.split('|');
      return res.status(400).json({ success: false, message: '❌ Solde insuffisant', balance: Number(balance), required: Number(required), difference: Number(difference) });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/orders/confirm', async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, message: 'Commande confirmée (simulée)' });
  try {
    const { orderId, buyerId, confirmations } = req.body;
    if (!orderId || !buyerId || !confirmations) return res.status(400).json({ success: false, message: 'Champs requis' });

    const required = ['recu', 'bon_etat', 'confirme'];
    for (const key of required) {
      if (!confirmations[key]) return res.status(400).json({ success: false, message: '❌ Tu dois cocher les 3 cases pour confirmer' });
    }

    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    if (!orderDoc.exists) return res.status(404).json({ success: false, message: 'Commande non trouvée' });

    const order = orderDoc.data();
    if (order.buyerId !== buyerId) return res.status(403).json({ success: false, message: 'Non autorisé' });
    if (order.status !== 'en attente de confirmation') return res.status(400).json({ success: false, message: 'Commande déjà traitée' });

    const now = new Date();
    const expiresAt = order.expiresAt.toDate ? order.expiresAt.toDate() : new Date(order.expiresAt);
    if (now > expiresAt) return res.status(400).json({ success: false, message: '⏰ Délai expiré, remboursement automatique' });

    const sellerCommission = order.sellerCommission || Math.round(order.amount * COMMISSION_SELLER);
    const buyerCommission = order.buyerCommission || Math.round(order.amount * COMMISSION_BUYER);
    const amountToSeller = order.amount - sellerCommission;
    const adminTotal = buyerCommission + sellerCommission;

    const sellerRef = db.collection('users').doc(order.sellerId);
    const sellerDoc = await sellerRef.get();
    const sellerBalance = sellerDoc.data()?.walletBalance || 0;
    await sellerRef.update({ walletBalance: sellerBalance + amountToSeller });

    // ✅ L'article est définitivement vendu
    const articleRef = db.collection('products').doc(order.articleId);
    await articleRef.update({ status: 'sold', soldAt: new Date(), soldTo: buyerId, orderId });

    await orderRef.update({
      status: 'livré', buyerConfirmed: true, buyerConfirmedAt: new Date(), confirmations,
      sellerReceived: amountToSeller, adminCommission: adminTotal
    });

    await db.collection('notifications').add({
      userId: order.sellerId, message: `💰 Vente confirmée ! ${amountToSeller} FCFA crédités sur ton wallet.`,
      type: 'sale_confirmed', read: false, orderId, createdAt: new Date()
    });
    await db.collection('notifications').add({
      userId: order.buyerId, message: `✅ Commande #${orderId.slice(0,8)} confirmée avec succès.`,
      type: 'order_confirmed', read: false, orderId, createdAt: new Date()
    });

    res.json({ success: true, message: '✅ Commande confirmée !', sellerReceived: amountToSeller, adminCommission: adminTotal, sellerBalance: sellerBalance + amountToSeller });
  } catch (error) {
    console.error('Confirm Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/orders/:userId', async (req, res) => {
  if (!firebaseReady) return res.json([]);
  try {
    const { userId } = req.params;
    const orders = [];
    const buyerSnapshot = await db.collection('orders').where('buyerId', '==', userId).get();
    for (const doc of buyerSnapshot.docs) {
      const order = doc.data();
      const articleDoc = await db.collection('products').doc(order.articleId).get();
      const article = articleDoc.data();
      const sellerDoc = await db.collection('users').doc(order.sellerId).get();
      const seller = sellerDoc.data();
      orders.push({ id: doc.id, ...order,
        article: article ? { title: article.title, image: article.image, price: article.price } : null,
        seller: seller ? { name: seller.name, photo: seller.photo || '' } : null });
    }
    const sellerSnapshot = await db.collection('orders').where('sellerId', '==', userId).get();
    for (const doc of sellerSnapshot.docs) {
      const order = doc.data();
      if (!orders.find(o => o.id === doc.id)) {
        const articleDoc = await db.collection('products').doc(order.articleId).get();
        const article = articleDoc.data();
        const buyerDoc = await db.collection('users').doc(order.buyerId).get();
        const buyer = buyerDoc.data();
        orders.push({ id: doc.id, ...order,
          article: article ? { title: article.title, image: article.image, price: article.price } : null,
          buyer: buyer ? { name: buyer.name, photo: buyer.photo || '' } : null });
      }
    }
    orders.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return dateB - dateA;
    });
    res.json(orders);
  } catch (error) {
    console.error('Orders Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/orders/cancel/:orderId', async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, message: 'Commande annulée (simulée)' });
  try {
    const { orderId } = req.params;
    const { userId } = req.body;
    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    if (!orderDoc.exists) return res.status(404).json({ success: false, message: 'Commande non trouvée' });
    const order = orderDoc.data();
    if (order.buyerId !== userId && order.sellerId !== userId) return res.status(403).json({ success: false, message: 'Non autorisé' });
    const now = new Date();
    const createdAt = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
    const hoursSinceCreation = (now - createdAt) / (1000 * 60 * 60);
    if (hoursSinceCreation > 2) return res.status(400).json({ success: false, message: '⏰ Délai de 2h dépassé. Annulation impossible.' });

    const buyerRef = db.collection('users').doc(order.buyerId);
    const buyerDoc = await buyerRef.get();
    const buyerBalance = buyerDoc.data()?.walletBalance || 0;
    await buyerRef.update({ walletBalance: buyerBalance + order.totalAmount });

    // ✅ L'article redevient disponible
    const articleRef = db.collection('products').doc(order.articleId);
    await articleRef.update({ status: 'active', reservedAt: null, reservedBy: null });

    await orderRef.update({ status: 'annulé', cancelledAt: new Date(), cancelledBy: userId });
    res.json({ success: true, message: '✅ Commande annulée et remboursée', refunded: order.totalAmount });
  } catch (error) {
    console.error('Cancel Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// EXPIRATION AUTOMATIQUE DES COMMANDES NON CONFIRMÉES
// ============================================================
async function autoExpireOrders() {
  if (!firebaseReady) return;
  try {
    const now = new Date();
    const snapshot = await db.collection('orders').where('status', '==', 'en attente de confirmation').get();
    for (const doc of snapshot.docs) {
      const order = doc.data();
      const expiresAt = order.expiresAt?.toDate ? order.expiresAt.toDate() : new Date(order.expiresAt);
      if (now > expiresAt) {
        const buyerRef = db.collection('users').doc(order.buyerId);
        const buyerDoc = await buyerRef.get();
        const buyerBalance = buyerDoc.data()?.walletBalance || 0;
        await buyerRef.update({ walletBalance: buyerBalance + order.totalAmount });
        await db.collection('products').doc(order.articleId).update({ status: 'active', reservedAt: null, reservedBy: null });
        await doc.ref.update({ status: 'expiré', expiredAt: new Date() });
        await db.collection('notifications').add({
          userId: order.buyerId, message: `⏰ Ta commande a expiré, tu as été remboursé.`,
          type: 'order_expired', read: false, orderId: doc.id, createdAt: new Date()
        });
        console.log('⏰ Commande expirée et remboursée:', doc.id);
      }
    }
  } catch (error) {
    console.error('❌ Erreur autoExpireOrders:', error.message);
  }
}
setInterval(autoExpireOrders, 5 * 60 * 1000); // toutes les 5 minutes

// ============================================================
// FLAMMES
// ============================================================
app.post('/api/flames', async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, flames: 5 });
  try {
    const { sellerId, buyerId } = req.body;
    if (!sellerId || !buyerId) return res.status(400).json({ success: false, message: 'sellerId et buyerId requis' });
    const existing = await db.collection('flames').where('sellerId', '==', sellerId).where('buyerId', '==', buyerId).get();
    if (!existing.empty) return res.status(400).json({ success: false, message: 'Flamme déjà donnée' });
    await db.collection('flames').add({ sellerId, buyerId, createdAt: new Date() });
    const userRef = db.collection('users').doc(sellerId);
    const userDoc = await userRef.get();
    const currentFlames = userDoc.data()?.flames || 0;
    await userRef.update({ flames: currentFlames + 1 });
    res.json({ success: true, flames: currentFlames + 1 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/flames/:userId', async (req, res) => {
  if (!firebaseReady) return res.json({ flames: 3 });
  try {
    const { userId } = req.params;
    const doc = await db.collection('users').doc(userId).get();
    res.json({ flames: doc.data()?.flames || 0 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// STATISTIQUES
// ============================================================
app.get('/api/stats/:userId', async (req, res) => {
  if (!firebaseReady) {
    return res.json({ success: true, data: { totalArticles: 0, totalSales: 0, totalRevenue: 0, totalPurchases: 0, totalSpent: 0, history: [] } });
  }
  try {
    const { userId } = req.params;
    const articlesSnapshot = await db.collection('products').where('sellerId', '==', userId).where('status', '==', 'active').get();
    const ordersSnapshot = await db.collection('orders').where('sellerId', '==', userId).where('status', '==', 'livré').get();
    let totalSales = 0, totalRevenue = 0;
    ordersSnapshot.forEach(doc => {
      const order = doc.data();
      totalSales++;
      totalRevenue += order.sellerReceived || (order.amount - (order.amount * COMMISSION_SELLER));
    });
    const purchasesSnapshot = await db.collection('orders').where('buyerId', '==', userId).where('status', '==', 'livré').get();
    let totalPurchases = 0, totalSpent = 0;
    purchasesSnapshot.forEach(doc => {
      const order = doc.data();
      totalPurchases++;
      totalSpent += order.totalAmount || order.amount;
    });
    const history = {};
    ordersSnapshot.forEach(doc => {
      const order = doc.data();
      const date = order.createdAt?.toDate?.() || new Date(order.createdAt);
      const month = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
      if (!history[month]) history[month] = { ventes: 0, revenu: 0 };
      history[month].ventes++;
      history[month].revenu += order.sellerReceived || (order.amount - (order.amount * COMMISSION_SELLER));
    });
    const historyArray = Object.keys(history).sort().map(month => ({ month, ventes: history[month].ventes, revenu: Math.round(history[month].revenu) }));
    res.json({ success: true, data: { totalArticles: articlesSnapshot.size, totalSales, totalRevenue: Math.round(totalRevenue), totalPurchases, totalSpent, history: historyArray } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// MESSAGES
// ============================================================
app.get('/api/messages/:userId', async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, data: [] });
  try {
    const { userId } = req.params;
    const snapshot = await db.collection('messages').where('participants', 'array-contains', userId).limit(200).get();
    const messages = [];
    snapshot.forEach(doc => messages.push({ id: doc.id, ...doc.data() }));
    messages.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return dateB - dateA;
    });
    for (const msg of messages) {
      if (msg.receiverId === userId && !msg.read) await db.collection('messages').doc(msg.id).update({ read: true });
    }
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/messages', async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, id: 'mock-' + Date.now() });
  try {
    const { senderId, receiverId, text, senderName, senderPhoto, audioUrl, audioDuration } = req.body;
    if (!senderId || !receiverId || (!text && !audioUrl)) return res.status(400).json({ success: false, message: 'Message ou audio requis' });

    const receiverDoc = await db.collection('users').doc(receiverId).get();
    const blockedUsers = receiverDoc.data()?.blockedUsers || [];
    if (blockedUsers.includes(senderId)) return res.status(403).json({ success: false, message: 'Vous êtes bloqué par ce destinataire' });

    const message = {
      senderId, receiverId, text: text || '', audioUrl: audioUrl || '', audioDuration: audioDuration || 0,
      senderName: senderName || 'Anonyme', senderPhoto: senderPhoto || '',
      receiverName: receiverDoc.exists ? (receiverDoc.data().name || 'Utilisateur') : 'Utilisateur',
      receiverPhoto: receiverDoc.exists ? (receiverDoc.data().photo || '') : '',
      participants: [senderId, receiverId], read: false, createdAt: new Date()
    };
    const docRef = await db.collection('messages').add(message);
    await db.collection('notifications').add({ userId: receiverId, message: `💬 Nouveau message de ${senderName || 'Anonyme'}`, type: 'new_message', read: false, messageId: docRef.id, createdAt: new Date() });
    res.json({ success: true, id: docRef.id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// NOTIFICATIONS
// ============================================================
app.get('/api/notifications/:userId', async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, data: [] });
  try {
    const { userId } = req.params;
    const snapshot = await db.collection('notifications').where('userId', '==', userId).limit(50).get();
    const notifications = [];
    snapshot.forEach(doc => notifications.push({ id: doc.id, ...doc.data() }));
    notifications.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return dateB - dateA;
    });
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/notifications/read/:id', async (req, res) => {
  if (!firebaseReady) return res.json({ success: true });
  try {
    const { id } = req.params;
    await db.collection('notifications').doc(id).update({ read: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================================
// DÉMARRAGE
// ============================================================
app.listen(PORT, () => {
  console.log(`✅ BLK API running on port ${PORT}`);
  console.log(`📦 Mode: ${firebaseReady ? '100% RÉEL' : 'SIMULATION'}`);
  console.log(`💳 Paiement: ${YABETOO_SECRET ? 'Yabetoo' : 'Simulé'}`);
  console.log(`📱 Admin: ${ADMIN_PHONE}`);
  console.log(`💰 Commissions: ${COMMISSION_BUYER*100}% (buyer) + ${COMMISSION_SELLER*100}% (seller)`);
});
