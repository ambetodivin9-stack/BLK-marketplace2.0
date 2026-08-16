const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

let db = null;
let firebaseReady = false;

try {
  let serviceAccount = null;
  const secretPath = '/etc/secrets/firebase-key.json';
  if (fs.existsSync(secretPath)) {
    serviceAccount = JSON.parse(fs.readFileSync(secretPath, 'utf8'));
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }
  if (serviceAccount) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    db = admin.firestore();
    firebaseReady = true;
    console.log('Firebase connecte avec succes !');
  } else {
    console.warn('Aucune cle Firebase trouvee. Mode SIMULATION.');
  }
} catch (error) {
  console.error('Erreur Firebase:', error.message);
}

const IMG_BB_KEY = process.env.IMG_BB_KEY;
const YABETOO_SECRET = process.env.YABETOO_SECRET_KEY || '';
const YABETOO_API_BASE = 'https://pay.api.yabetoopay.com/v1';
const JWT_SECRET = process.env.JWT_SECRET || 'chaine-secrete-tres-longue-a-changer-en-production';

const COMMISSION_BUYER = 0.03;
const COMMISSION_SELLER = 0.04;
const ORDER_DELAY_MS = 6 * 60 * 60 * 1000;
const ALLOWED_CATEGORIES = ['vêtements', 'chaussures', 'sacs', 'bijoux', 'accessoires'];

function parseAmount(value) {
  const amount = Number(value);
  if (!Number.isInteger(amount) || amount <= 0) throw new Error('AMOUNT_INVALID');
  return amount;
}

function formatPhoneForYabetoo(phone) {
  let digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('242')) digits = digits.substring(3);
  if (digits.startsWith('0')) digits = digits.substring(1);
  return '242' + digits;
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Non authentifié' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalide ou expiré' });
  }
}

app.get('/', (req, res) => {
  res.json({
    status: 'OK', message: 'BLK Marketplace API', mode: firebaseReady ? '100% REEL' : 'SIMULATION',
    services: { firebase: firebaseReady, imgbb: !!IMG_BB_KEY, yabetoo: !!YABETOO_SECRET }
  });
});
app.get('/ping', (req, res) => res.send('pong'));
app.get('/api/categories', (req, res) => res.json({ success: true, data: ALLOWED_CATEGORIES }));

app.post('/api/auth/register', async (req, res) => {
  if (!firebaseReady) return res.status(500).json({ success: false, message: 'Firebase non disponible' });
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ success: false, message: 'Champs requis' });

    const usersRef = db.collection('users');
    const existing = await usersRef.where('email', '==', email).get();
    if (!existing.empty) return res.status(409).json({ success: false, message: 'Email déjà utilisé' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRef = usersRef.doc();
    await userRef.set({
      name, email, password: hashedPassword,
      phone: '', photo: '', walletBalance: 0, flames: 0,
      blockedUsers: [], online: true, createdAt: new Date()
    });

    const token = jwt.sign({ userId: userRef.id, email }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, token, userId: userRef.id, user: { id: userRef.id, name, email } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  if (!firebaseReady) return res.status(500).json({ success: false, message: 'Firebase non disponible' });
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });

    const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();
    if (snapshot.empty) return res.status(401).json({ success: false, message: 'Identifiants invalides' });

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    const valid = await bcrypt.compare(password, userData.password);
    if (!valid) return res.status(401).json({ success: false, message: 'Identifiants invalides' });

    const token = jwt.sign({ userId: userDoc.id, email }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, token, userId: userDoc.id, user: { id: userDoc.id, name: userData.name, email: userData.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/articles', async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, data: [] });
  try {
    const snapshot = await db.collection('products').where('status', '==', 'active').get();
    let articles = [];
    snapshot.forEach(doc => articles.push({ id: doc.id, ...doc.data() }));
    articles.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return dateB - dateA;
    });
    articles = articles.slice(0, 200);
    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/articles/seller/:sellerId', async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, data: [] });
  try {
    const { sellerId } = req.params;
    const snapshot = await db.collection('products').where('sellerId', '==', sellerId).where('status', '==', 'active').get();
    let articles = [];
    snapshot.forEach(doc => articles.push({ id: doc.id, ...doc.data() }));
    articles.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return dateB - dateA;
    });
    articles = articles.slice(0, 100);
    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/articles', authenticate, async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, id: 'mock-' + Date.now() });
  try {
    const { title, description, price, category, image, images, sellerName, sellerPhoto } = req.body;
    const sellerId = req.userId;
    if (!title || !description || !price || !category) {
      return res.status(400).json({ success: false, message: 'Champs requis manquants' });
    }
    if (!ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({ success: false, message: `Categorie non autorisee. Autorise: ${ALLOWED_CATEGORIES.join(', ')}` });
    }
    const articlePrice = parseAmount(price);
    let imageList = Array.isArray(images) ? images.filter(Boolean).slice(0, 10) : [];
    if (imageList.length === 0 && image) imageList = [image];
    if (imageList.length === 0) return res.status(400).json({ success: false, message: 'Au moins une image est requise' });

    const article = {
      title, description, price: articlePrice, category,
      image: imageList[0], images: imageList,
      sellerId, sellerName: sellerName || 'Anonyme', sellerPhoto: sellerPhoto || '',
      status: 'active', views: 0, createdAt: new Date()
    };
    const docRef = await db.collection('products').add(article);
    res.json({ success: true, id: docRef.id });
  } catch (error) {
    if (error.message === 'AMOUNT_INVALID') return res.status(400).json({ success: false, message: 'Prix invalide' });
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/articles/:id', authenticate, async (req, res) => {
  if (!firebaseReady) return res.json({ success: true });
  try {
    const { id } = req.params;
    const articleRef = db.collection('products').doc(id);
    const articleDoc = await articleRef.get();
    if (!articleDoc.exists) return res.status(404).json({ success: false, message: 'Article introuvable' });
    if (articleDoc.data().sellerId !== req.userId) {
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    }
    await articleRef.update({ status: 'inactive' });
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
    await doc.ref.update({ views });
    res.json({ success: true, views });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/upload', authenticate, async (req, res) => {
  try {
    const { base64 } = req.body;
    if (!base64) return res.status(400).json({ success: false, message: 'Aucune image fournie' });
    if (!IMG_BB_KEY) return res.status(500).json({ success: false, message: 'Cle ImgBB non configuree' });
    let cleanBase64 = base64;
    if (cleanBase64.includes('base64,')) cleanBase64 = cleanBase64.split('base64,')[1];
    cleanBase64 = cleanBase64.replace(/\s/g, '');
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(cleanBase64)) {
      return res.status(400).json({ success: false, message: "Format d'image invalide" });
    }
    const imageSize = Buffer.from(cleanBase64, 'base64').length;
    if (imageSize > 1.5 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: 'Image trop volumineuse (max 1.5 Mo)' });
    }
    const formData = new FormData();
    formData.append('key', IMG_BB_KEY);
    formData.append('image', cleanBase64);
    const response = await axios.post('https://api.imgbb.com/1/upload', formData, { headers: formData.getHeaders(), timeout: 15000 });
    if (response.data.success) res.json({ success: true, url: response.data.data.url });
    else res.status(400).json({ success: false, message: 'Erreur ImgBB: ' + (response.data.error?.message || 'inconnue') });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur: ' + error.message });
  }
});

app.get('/api/users/:userId', async (req, res) => {
  if (!firebaseReady) {
    return res.json({ success: true, data: { name: 'Utilisateur Test', photo: '', flames: 0, walletBalance: 5000, phone: '+242 06 123 4567', email: 'test@example.com', isSeller: false, blockedUsers: [], online: false, articlesCount: 0, followersCount: 0, followingCount: 0 } });
  }
  try {
    const { userId } = req.params;
    const doc = await db.collection('users').doc(userId).get();
    if (!doc.exists) return res.status(404).json({ success: false, message: 'Utilisateur non trouve' });
    const data = doc.data();
    const articlesSnapshot = await db.collection('products').where('sellerId', '==', userId).where('status', '==', 'active').get();
    const followersSnapshot = await db.collection('follows').where('followingId', '==', userId).get();
    const followingSnapshot = await db.collection('follows').where('followerId', '==', userId).get();
    res.json({
      success: true,
      data: {
        name: data.name, photo: data.photo || '', flames: data.flames || 0,
        walletBalance: data.walletBalance || 0, phone: data.phone || '', email: data.email || '',
        isSeller: data.isSeller || false, blockedUsers: data.blockedUsers || [], online: data.online || false,
        articlesCount: articlesSnapshot.size, followersCount: followersSnapshot.size, followingCount: followingSnapshot.size
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/users/:userId', authenticate, async (req, res) => {
  if (!firebaseReady) return res.json({ success: true });
  try {
    const { userId } = req.params;
    if (userId !== req.userId) return res.status(403).json({ success: false, message: 'Non autorisé' });
    const { name, email, phone, photo, isSeller } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (photo) updateData.photo = photo;
    if (isSeller !== undefined) updateData.isSeller = isSeller;
    await db.collection('users').doc(userId).set(updateData, { merge: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/users/online', authenticate, async (req, res) => {
  if (!firebaseReady) return res.json({ success: true });
  try {
    const { online } = req.body;
    await db.collection('users').doc(req.userId).set({ online: online || false }, { merge: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/users/block', authenticate, async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, message: 'Simulation' });
  try {
    const { blockedId } = req.body;
    const blockerId = req.userId;
    if (!blockedId) return res.status(400).json({ success: false, message: 'ID bloqué requis' });
    const blockerRef = db.collection('users').doc(blockerId);
    const blockerDoc = await blockerRef.get();
    const blocked = blockerDoc.data()?.blockedUsers || [];
    if (blocked.includes(blockedId)) {
      await blockerRef.update({ blockedUsers: blocked.filter(id => id !== blockedId) });
      return res.json({ success: true, message: 'Debloque', blocked: false });
    } else {
      await blockerRef.update({ blockedUsers: [...blocked, blockedId] });
      return res.json({ success: true, message: 'Bloque', blocked: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/users/follow', authenticate, async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, message: 'Simulation' });
  try {
    const { followingId } = req.body;
    const followerId = req.userId;
    if (!followingId || followingId === followerId) return res.status(400).json({ success: false, message: 'ID invalide' });
    const followRef = db.collection('follows').where('followerId', '==', followerId).where('followingId', '==', followingId).limit(1);
    const snapshot = await followRef.get();
    if (!snapshot.empty) {
      await snapshot.docs[0].ref.delete();
      return res.json({ success: true, following: false });
    } else {
      await db.collection('follows').add({ followerId, followingId, createdAt: new Date() });
      return res.json({ success: true, following: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/wallet/:userId', authenticate, async (req, res) => {
  if (!firebaseReady) return res.json({ balance: 5000 });
  try {
    const { userId } = req.params;
    if (userId !== req.userId) return res.status(403).json({ success: false, message: 'Non autorisé' });
    const doc = await db.collection('users').doc(userId).get();
    res.json({ balance: doc.data()?.walletBalance || 0 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/payment/initiate', authenticate, async (req, res) => {
  try {
    const { amount, phone, operator } = req.body;
    const userId = req.userId;
    if (!amount || !phone) return res.status(400).json({ success: false, message: 'amount et phone requis' });
    if (!firebaseReady) return res.status(500).json({ success: false, message: 'Firebase non disponible' });

    const depositAmount = parseAmount(amount);
    const formattedPhone = formatPhoneForYabetoo(phone);
    const operatorName = (operator || 'mtn').toLowerCase();

    const userRef = db.collection('users').doc(userId);
    let userDoc = await userRef.get();
    if (!userDoc.exists) {
      await userRef.set({ name: 'Utilisateur', email: req.userEmail, phone: phone, photo: '', walletBalance: 0, flames: 0, blockedUsers: [], online: true, createdAt: new Date() });
      userDoc = await userRef.get();
    }

    const createResponse = await axios.post(
      `${YABETOO_API_BASE}/payment-intents`,
      { amount: depositAmount, currency: 'xaf', description: `Depot BLK - ${userId}` },
      { headers: { 'Authorization': `Bearer ${YABETOO_SECRET}`, 'Content-Type': 'application/json' } }
    );
    const intent = createResponse.data;
    const clientSecret = intent.client_secret || intent.clientSecret || intent.data?.client_secret || intent.data?.clientSecret || intent.intent?.client_secret || intent.intent?.clientSecret;
    if (!clientSecret) {
      return res.status(502).json({ success: false, message: "La creation de l'intention Yabetoo n'a pas renvoye de client_secret exploitable.", yabetoo_create_response: intent });
    }

    const confirmPayload = {
      client_secret: clientSecret, amount: depositAmount, currency: 'xaf',
      first_name: 'Client', last_name: 'BLK', receipt_email: userDoc.data()?.email || 'client@blk.com',
      payment_method_data: { type: 'momo', momo: { country: 'cg', msisdn: formattedPhone, operator_name: operatorName } }
    };
    const confirmResponse = await axios.post(
      `${YABETOO_API_BASE}/payment-intents/${intent.id}/confirm`,
      confirmPayload,
      { headers: { 'Authorization': `Bearer ${YABETOO_SECRET}`, 'Content-Type': 'application/json' } }
    );
    const confirmData = confirmResponse.data;

    const transactionRef = await db.collection('transactions').add({
      userId, amount: depositAmount, phone: formattedPhone, operator: operatorName,
      yabetooId: intent.id, status: 'pending', type: 'deposit', createdAt: new Date()
    });
    await transactionRef.update({ transactionId: confirmData.transactionId || confirmData.intentId || intent.id, status: confirmData.status || 'pending' });

    if (confirmData.status === 'succeeded' && confirmData.captured) {
      const currentBalance = userDoc.data()?.walletBalance || 0;
      await userRef.update({ walletBalance: currentBalance + depositAmount });
      await transactionRef.update({ status: 'completed', completedAt: new Date() });
      return res.json({ success: true, message: 'Depot confirme et wallet credite !', status: 'succeeded' });
    }

    res.json({ success: true, message: 'Demande envoyee a Yabetoo. En attente de ta confirmation par SMS/USSD, puis du webhook.', status: confirmData.status || 'pending' });
  } catch (error) {
    if (error.message === 'AMOUNT_INVALID') return res.status(400).json({ success: false, message: 'Montant invalide' });
    return res.status(502).json({
      success: false, message: 'Le paiement Yabetoo a echoue (aucun credit fictif applique).',
      yabetoo_http_status: error.response?.status || null, yabetoo_error: error.response?.data || null, raw_message: error.message
    });
  }
});

app.post('/api/payment/callback', async (req, res) => {
  try {
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
      } catch (error) { console.error('Erreur traitement webhook:', error); }
    });
  } catch (error) { res.status(500).json({ success: false }); }
});

app.post('/api/wallet/transfer', authenticate, async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, message: 'Transfert simule avec succes !' });
  try {
    const { toPhone, amount } = req.body;
    const fromUserId = req.userId;
    if (!toPhone || !amount) return res.status(400).json({ success: false, message: 'toPhone et amount requis' });
    const transferAmount = parseAmount(amount);
    const recipientSnapshot = await db.collection('users').where('phone', '==', toPhone).limit(1).get();
    if (recipientSnapshot.empty) return res.status(404).json({ success: false, message: 'Aucun utilisateur BLK trouve avec ce numero' });
    const recipientDoc = recipientSnapshot.docs[0];
    if (recipientDoc.id === fromUserId) return res.status(400).json({ success: false, message: 'Tu ne peux pas te transferer de l\'argent a toi-meme' });

    const senderRef = db.collection('users').doc(fromUserId);
    const result = await db.runTransaction(async (t) => {
      const senderDoc = await t.get(senderRef);
      const recipientRef = recipientDoc.ref;
      const recipientFreshDoc = await t.get(recipientRef);
      const senderBalance = senderDoc.data()?.walletBalance || 0;
      if (senderBalance < transferAmount) throw new Error('INSUFFICIENT_BALANCE');
      const recipientBalance = recipientFreshDoc.data()?.walletBalance || 0;
      t.update(senderRef, { walletBalance: senderBalance - transferAmount });
      t.update(recipientRef, { walletBalance: recipientBalance + transferAmount });
      return { newSenderBalance: senderBalance - transferAmount, recipientName: recipientFreshDoc.data()?.name || 'Utilisateur' };
    });

    await db.collection('transactions').add({ userId: fromUserId, amount: transferAmount, type: 'transfer_sent', toUserId: recipientDoc.id, status: 'completed', description: `Transfert envoye a ${result.recipientName}`, createdAt: new Date() });
    await db.collection('transactions').add({ userId: recipientDoc.id, amount: transferAmount, type: 'transfer_received', fromUserId, status: 'completed', description: 'Transfert recu', createdAt: new Date() });
    await db.collection('notifications').add({ userId: recipientDoc.id, message: `Tu as recu ${transferAmount} FCFA par transfert.`, type: 'transfer_received', read: false, createdAt: new Date() });

    res.json({ success: true, message: `${transferAmount} FCFA envoyes a ${result.recipientName}`, newBalance: result.newSenderBalance });
  } catch (error) {
    if (error.message === 'INSUFFICIENT_BALANCE') return res.status(400).json({ success: false, message: 'Solde insuffisant' });
    if (error.message === 'AMOUNT_INVALID') return res.status(400).json({ success: false, message: 'Montant invalide' });
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/wallet/withdraw', authenticate, async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, message: 'Retrait simule avec succes !', newBalance: 5000 });
  try {
    const { amount, phone, operator } = req.body;
    const userId = req.userId;
    if (!amount || !phone) return res.status(400).json({ success: false, message: 'amount et phone requis' });
    const withdrawAmount = parseAmount(amount);
    const formattedPhone = formatPhoneForYabetoo(phone);
    const operatorName = (operator || 'mtn').toLowerCase();

    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();
    const currentBalance = doc.data()?.walletBalance || 0;
    if (currentBalance < withdrawAmount) return res.status(400).json({ success: false, message: 'Solde insuffisant' });

    let disbursement;
    try {
      const disbursementResponse = await axios.post(
        `${YABETOO_API_BASE}/disbursement`,
        {
          amount: withdrawAmount, currency: 'XAF',
          first_name: doc.data()?.name?.split(' ')[0] || 'Client',
          last_name: doc.data()?.name?.split(' ').slice(1).join(' ') || 'BLK',
          payment_method_data: { type: 'momo', momo: { msisdn: formattedPhone, country: 'cg', operator_name: operatorName } }
        },
        { headers: { 'Authorization': `Bearer ${YABETOO_SECRET}`, 'Content-Type': 'application/json' } }
      );
      disbursement = disbursementResponse.data;
    } catch (yabetooError) {
      console.error('Erreur Yabetoo disbursement:', JSON.stringify(yabetooError.response?.data || yabetooError.message));
      return res.status(502).json({
        success: false,
        message: "Le retrait Yabetoo a echoue (aucun montant debite). Si l'erreur mentionne un acces partenaire manquant, il faut en faire la demande a Yabetoo.",
        yabetoo_error: yabetooError.response?.data || null
      });
    }

    const newBalance = currentBalance - withdrawAmount;
    await userRef.update({ walletBalance: newBalance });
    await db.collection('transactions').add({
      userId, amount: withdrawAmount, phone: formattedPhone, operator: operatorName,
      yabetooDisbursementId: disbursement.id || null, type: 'withdraw', status: 'pending',
      description: 'Retrait Yabetoo (execution J+1)', createdAt: new Date()
    });

    res.json({ success: true, message: "Retrait initie. Yabetoo l'executera automatiquement sous 24h vers ton Mobile Money.", newBalance });
  } catch (error) {
    if (error.message === 'AMOUNT_INVALID') return res.status(400).json({ success: false, message: 'Montant invalide' });
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/orders/create', authenticate, async (req, res) => {
  if (!firebaseReady) {
    return res.json({ success: true, orderId: 'mock-' + Date.now(), message: 'Commande creee (simulee)', totalAmount: 15450, buyerCommission: 450, sellerCommission: 600, expiresAt: new Date(Date.now() + ORDER_DELAY_MS) });
  }
  try {
    const { articleId, sellerId, amount, buyerPhone } = req.body;
    const buyerId = req.userId;
    if (!articleId || !sellerId || !amount) return res.status(400).json({ success: false, message: 'Champs requis manquants' });
    if (buyerId === sellerId) return res.status(400).json({ success: false, message: 'Vous ne pouvez pas acheter votre propre article' });

    const orderAmount = parseAmount(amount);
    const articleRef = db.collection('products').doc(articleId);
    const articleSnap = await articleRef.get();
    if (!articleSnap.exists) return res.status(404).json({ success: false, message: 'Article introuvable' });
    if (articleSnap.data().status !== 'active') return res.status(409).json({ success: false, message: "Cet article vient d'etre reserve par un autre acheteur." });

    const buyerDoc = await db.collection('users').doc(buyerId).get();
    const blockedUsers = buyerDoc.data()?.blockedUsers || [];
    if (blockedUsers.includes(sellerId)) return res.status(403).json({ success: false, message: 'Vous avez bloque ce vendeur' });

    const buyerBalance = buyerDoc.data()?.walletBalance || 0;
    const buyerCommission = Math.round(orderAmount * COMMISSION_BUYER);
    const totalAmount = orderAmount + buyerCommission;
    if (buyerBalance < totalAmount) {
      return res.status(400).json({ success: false, message: 'Solde insuffisant', balance: buyerBalance, required: totalAmount, difference: totalAmount - buyerBalance });
    }

    await db.runTransaction(async (t) => {
      const freshBuyerDoc = await t.get(db.collection('users').doc(buyerId));
      const freshArticleDoc = await t.get(articleRef);
      if (freshArticleDoc.data().status !== 'active') throw new Error('ARTICLE_RESERVED');
      const freshBalance = freshBuyerDoc.data().walletBalance || 0;
      if (freshBalance < totalAmount) throw new Error('INSUFFICIENT_BALANCE');
      t.update(db.collection('users').doc(buyerId), { walletBalance: freshBalance - totalAmount });
      t.update(articleRef, { status: 'reserved', reservedAt: new Date(), reservedBy: buyerId });
    });

    const order = {
      articleId, buyerId, sellerId,
      buyerPhone: buyerPhone || buyerDoc.data()?.phone || '',
      amount: orderAmount, buyerCommission, totalAmount,
      sellerCommission: Math.round(orderAmount * COMMISSION_SELLER),
      status: 'en attente de confirmation',
      buyerConfirmed: false, buyerConfirmedAt: null,
      flamesGiven: false,
      expiresAt: new Date(Date.now() + ORDER_DELAY_MS),
      createdAt: new Date()
    };
    const orderRef = await db.collection('orders').add(order);
    const orderId = orderRef.id;

    await db.collection('notifications').add({ userId: sellerId, message: `Nouvelle commande #${orderId.slice(0,8)} - ${orderAmount} FCFA`, type: 'new_order', read: false, orderId, createdAt: new Date() });

    res.json({ success: true, orderId, message: 'Commande creee avec succes ! Livraison sous 6h.', totalAmount, buyerCommission, sellerCommission: Math.round(orderAmount * COMMISSION_SELLER), expiresAt: order.expiresAt });
  } catch (error) {
    if (error.message === 'ARTICLE_RESERVED') return res.status(409).json({ success: false, message: 'Article déjà réservé' });
    if (error.message === 'INSUFFICIENT_BALANCE') return res.status(400).json({ success: false, message: 'Solde insuffisant' });
    if (error.message === 'AMOUNT_INVALID') return res.status(400).json({ success: false, message: 'Montant invalide' });
    console.error('Order Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/orders/confirm', authenticate, async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, message: 'Commande confirmee (simulee)' });
  try {
    const { orderId, confirmations } = req.body;
    const buyerId = req.userId;
    if (!orderId || !confirmations) return res.status(400).json({ success: false, message: 'Champs requis' });

    const required = ['recu', 'bon_etat', 'confirme'];
    for (const key of required) {
      if (!confirmations[key]) return res.status(400).json({ success: false, message: 'Tu dois cocher les 3 cases pour confirmer' });
    }

    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    if (!orderDoc.exists) return res.status(404).json({ success: false, message: 'Commande non trouvee' });
    const order = orderDoc.data();
    if (order.buyerId !== buyerId) return res.status(403).json({ success: false, message: 'Non autorise' });
    if (order.status !== 'en attente de confirmation') return res.status(400).json({ success: false, message: 'Commande deja traitee' });

    const now = new Date();
    const expiresAt = order.expiresAt.toDate ? order.expiresAt.toDate() : new Date(order.expiresAt);
    if (now > expiresAt) return res.status(400).json({ success: false, message: 'Delai expire, remboursement automatique' });

    const sellerCommission = order.sellerCommission || Math.round(order.amount * COMMISSION_SELLER);
    const buyerCommission = order.buyerCommission || Math.round(order.amount * COMMISSION_BUYER);
    const amountToSeller = order.amount - sellerCommission;
    const adminTotal = buyerCommission + sellerCommission;

    await db.runTransaction(async (t) => {
      const freshOrderDoc = await t.get(orderRef);
      if (freshOrderDoc.data().status !== 'en attente de confirmation') throw new Error('ORDER_ALREADY_PROCESSED');
      const sellerRef = db.collection('users').doc(order.sellerId);
      const sellerDoc = await t.get(sellerRef);
      const sellerBalance = sellerDoc.data()?.walletBalance || 0;
      t.update(sellerRef, { walletBalance: sellerBalance + amountToSeller });
      t.update(db.collection('products').doc(order.articleId), { status: 'sold', soldAt: new Date(), soldTo: buyerId, orderId });
      t.update(orderRef, { status: 'livré', buyerConfirmed: true, buyerConfirmedAt: new Date(), confirmations, sellerReceived: amountToSeller, adminCommission: adminTotal });
    });

    await db.collection('notifications').add({ userId: order.sellerId, message: `Vente confirmee ! ${amountToSeller} FCFA credites sur ton wallet.`, type: 'sale_confirmed', read: false, orderId, createdAt: new Date() });
    await db.collection('notifications').add({ userId: order.buyerId, message: `Commande #${orderId.slice(0,8)} confirmee avec succes.`, type: 'order_confirmed', read: false, orderId, createdAt: new Date() });

    res.json({ success: true, message: 'Commande confirmee !', sellerReceived: amountToSeller, adminCommission: adminTotal });
  } catch (error) {
    if (error.message === 'ORDER_ALREADY_PROCESSED') return res.status(400).json({ success: false, message: 'Commande déjà traitée' });
    console.error('Confirm Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/orders/:userId', authenticate, async (req, res) => {
  if (!firebaseReady) return res.json([]);
  try {
    const { userId } = req.params;
    if (userId !== req.userId) return res.status(403).json({ success: false, message: 'Non autorisé' });
    const orders = [];

    const buyerSnapshot = await db.collection('orders').where('buyerId', '==', userId).get();
    const buyerOrders = [];
    for (const doc of buyerSnapshot.docs) {
      const order = doc.data();
      const articleDoc = await db.collection('products').doc(order.articleId).get();
      const article = articleDoc.data();
      const sellerDoc = await db.collection('users').doc(order.sellerId).get();
      const seller = sellerDoc.data();
      buyerOrders.push({ id: doc.id, ...order, article: article ? { title: article.title, image: article.image, price: article.price } : null, seller: seller ? { name: seller.name, photo: seller.photo || '' } : null });
    }

    const sellerSnapshot = await db.collection('orders').where('sellerId', '==', userId).get();
    const sellerOrders = [];
    for (const doc of sellerSnapshot.docs) {
      if (!orders.find(o => o.id === doc.id)) {
        const order = doc.data();
        const articleDoc = await db.collection('products').doc(order.articleId).get();
        const article = articleDoc.data();
        const buyerDoc = await db.collection('users').doc(order.buyerId).get();
        const buyer = buyerDoc.data();
        sellerOrders.push({ id: doc.id, ...order, article: article ? { title: article.title, image: article.image, price: article.price } : null, buyer: buyer ? { name: buyer.name, photo: buyer.photo || '' } : null });
      }
    }

    const allOrders = buyerOrders.concat(sellerOrders);
    allOrders.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return dateB - dateA;
    });

    res.json(allOrders.slice(0, 200));
  } catch (error) {
    console.error('Orders Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/orders/cancel/:orderId', authenticate, async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, message: 'Commande annulee (simulee)' });
  try {
    const { orderId } = req.params;
    const userId = req.userId;
    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    if (!orderDoc.exists) return res.status(404).json({ success: false, message: 'Commande non trouvee' });
    const order = orderDoc.data();
    if (order.buyerId !== userId && order.sellerId !== userId) return res.status(403).json({ success: false, message: 'Non autorise' });
    const now = new Date();
    const createdAt = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
    const hoursSinceCreation = (now - createdAt) / (1000 * 60 * 60);
    if (hoursSinceCreation > 2) return res.status(400).json({ success: false, message: 'Delai de 2h depasse. Annulation impossible.' });

    await db.runTransaction(async (t) => {
      const freshOrderDoc = await t.get(orderRef);
      if (freshOrderDoc.data().status !== 'en attente de confirmation') throw new Error('ORDER_ALREADY_PROCESSED');
      const buyerRef = db.collection('users').doc(order.buyerId);
      const buyerDoc = await t.get(buyerRef);
      const buyerBalance = buyerDoc.data()?.walletBalance || 0;
      t.update(buyerRef, { walletBalance: buyerBalance + order.totalAmount });
      t.update(db.collection('products').doc(order.articleId), { status: 'active', reservedAt: null, reservedBy: null });
      t.update(orderRef, { status: 'annulé', cancelledAt: new Date(), cancelledBy: userId });
    });

    res.json({ success: true, message: 'Commande annulee et remboursee', refunded: order.totalAmount });
  } catch (error) {
    if (error.message === 'ORDER_ALREADY_PROCESSED') return res.status(400).json({ success: false, message: 'Commande déjà traitée' });
    console.error('Cancel Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

async function autoExpireOrders() {
  if (!firebaseReady) return;
  try {
    const now = new Date();
    const snapshot = await db.collection('orders').where('status', '==', 'en attente de confirmation').get();
    for (const doc of snapshot.docs) {
      const order = doc.data();
      const expiresAt = order.expiresAt?.toDate ? order.expiresAt.toDate() : new Date(order.expiresAt);
      if (now > expiresAt) {
        await db.runTransaction(async (t) => {
          const freshOrderDoc = await t.get(doc.ref);
          if (freshOrderDoc.data().status !== 'en attente de confirmation') return;
          const buyerRef = db.collection('users').doc(order.buyerId);
          const buyerDoc = await t.get(buyerRef);
          const buyerBalance = buyerDoc.data()?.walletBalance || 0;
          t.update(buyerRef, { walletBalance: buyerBalance + order.totalAmount });
          t.update(db.collection('products').doc(order.articleId), { status: 'active', reservedAt: null, reservedBy: null });
          t.update(doc.ref, { status: 'expiré', expiredAt: new Date() });
        });
        await db.collection('notifications').add({ userId: order.buyerId, message: 'Ta commande a expire, tu as ete rembourse.', type: 'order_expired', read: false, orderId: doc.id, createdAt: new Date() });
      }
    }
  } catch (error) { console.error('Erreur autoExpireOrders:', error.message); }
}
setInterval(autoExpireOrders, 5 * 60 * 1000);

app.post('/api/flames', authenticate, async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, flames: 5 });
  try {
    const { sellerId } = req.body;
    const buyerId = req.userId;
    if (!sellerId) return res.status(400).json({ success: false, message: 'sellerId requis' });
    if (sellerId === buyerId) return res.status(400).json({ success: false, message: 'Vous ne pouvez pas vous donner une flamme' });
    const existing = await db.collection('flames').where('sellerId', '==', sellerId).where('buyerId', '==', buyerId).get();
    if (!existing.empty) return res.status(400).json({ success: false, message: 'Flamme deja donnee' });
    await db.collection('flames').add({ sellerId, buyerId, createdAt: new Date() });
    const userRef = db.collection('users').doc(sellerId);
    const userDoc = await userRef.get();
    const currentFlames = userDoc.data()?.flames || 0;
    await userRef.update({ flames: currentFlames + 1 });
    res.json({ success: true, flames: currentFlames + 1 });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.get('/api/flames/:userId', async (req, res) => {
  if (!firebaseReady) return res.json({ flames: 3 });
  try {
    const { userId } = req.params;
    const doc = await db.collection('users').doc(userId).get();
    res.json({ flames: doc.data()?.flames || 0 });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.get('/api/stats/:userId', authenticate, async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, data: { totalArticles: 0, totalSales: 0, totalRevenue: 0, totalPurchases: 0, totalSpent: 0, history: [] } });
  try {
    const { userId } = req.params;
    if (userId !== req.userId) return res.status(403).json({ success: false, message: 'Non autorisé' });
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
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.get('/api/messages/:userId', authenticate, async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, data: [] });
  try {
    const { userId } = req.params;
    if (userId !== req.userId) return res.status(403).json({ success: false, message: 'Non autorisé' });
    const snapshot = await db.collection('messages').where('participants', 'array-contains', userId).get();
    let messages = [];
    snapshot.forEach(doc => messages.push({ id: doc.id, ...doc.data() }));
    for (const msg of messages) {
      if (msg.receiverId === userId && !msg.read) {
        await db.collection('messages').doc(msg.id).update({ read: true });
        msg.read = true;
      }
    }
    messages.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return dateB - dateA;
    });
    messages = messages.slice(0, 200);
    res.json({ success: true, data: messages });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.post('/api/messages', authenticate, async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, id: 'mock-' + Date.now() });
  try {
    const { receiverId, text, audioUrl, audioDuration } = req.body;
    const senderId = req.userId;
    if (!receiverId || (!text && !audioUrl)) return res.status(400).json({ success: false, message: 'Message ou audio requis' });

    const senderDoc = await db.collection('users').doc(senderId).get();
    const senderName = senderDoc.data()?.name || 'Anonyme';
    const senderPhoto = senderDoc.data()?.photo || '';

    const receiverDoc = await db.collection('users').doc(receiverId).get();
    const blockedUsers = receiverDoc.data()?.blockedUsers || [];
    if (blockedUsers.includes(senderId)) return res.status(403).json({ success: false, message: 'Vous etes bloque par ce destinataire' });

    const message = {
      senderId, receiverId, text: text || '', audioUrl: audioUrl || '', audioDuration: audioDuration || 0,
      senderName, senderPhoto,
      receiverName: receiverDoc.exists ? (receiverDoc.data().name || 'Utilisateur') : 'Utilisateur',
      receiverPhoto: receiverDoc.exists ? (receiverDoc.data().photo || '') : '',
      participants: [senderId, receiverId], read: false, createdAt: new Date()
    };
    const docRef = await db.collection('messages').add(message);
    await db.collection('notifications').add({ userId: receiverId, message: `Nouveau message de ${senderName}`, type: 'new_message', read: false, messageId: docRef.id, createdAt: new Date() });
    res.json({ success: true, id: docRef.id });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.get('/api/notifications/:userId', authenticate, async (req, res) => {
  if (!firebaseReady) return res.json({ success: true, data: [] });
  try {
    const { userId } = req.params;
    if (userId !== req.userId) return res.status(403).json({ success: false, message: 'Non autorisé' });
    const snapshot = await db.collection('notifications').where('userId', '==', userId).get();
    let notifications = [];
    snapshot.forEach(doc => notifications.push({ id: doc.id, ...doc.data() }));
    notifications.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return dateB - dateA;
    });
    notifications = notifications.slice(0, 50);
    res.json({ success: true, data: notifications });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.post('/api/notifications/read/:id', authenticate, async (req, res) => {
  if (!firebaseReady) return res.json({ success: true });
  try {
    const { id } = req.params;
    await db.collection('notifications').doc(id).update({ read: true });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.listen(PORT, () => {
  console.log(`BLK API running on port ${PORT}`);
  console.log(`Mode: ${firebaseReady ? '100% REEL' : 'SIMULATION'}`);
});