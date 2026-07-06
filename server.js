const express = require('express'); 
const cors = require('cors'); 
const admin = require('firebase-admin'); 
const fetch = require('node-fetch'); 
const FormData = require('form-data'); 
const fs = require('fs');

const app = express(); 
app.use(cors()); 
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb' }));

// = FIREBASE INIT = 
if (!process.env.FIREBASE_SERVICE_ACCOUNT) { 
console.error('Erreur: FIREBASE_SERVICE_ACCOUNT manquante'); 
process.exit(1); 
}

try { 
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT); 
admin.initializeApp({ 
credential: admin.credential.cert(serviceAccount) 
}); 
console.log('Firebase Admin initialisé'); 
} catch (error) { 
console.error('Erreur Firebase:', error.message); 
process.exit(1); 
}

const db = admin.firestore();

// = HEALTH CHECK = 
app.get('/health', (req, res) => { 
res.json({ status: 'OK', timestamp: new Date().toISOString() }); 
});

// = ARTICLES/PRODUCTS = 
app.post('/api/articles', async (req, res) => { 
try { 
const { title, description, price, category, image, sellerId, sellerName } = req.body; 
const docRef = await db.collection('products').add({ 
title, 
description, 
price: parseInt(price), 
category, 
image, 
sellerId, 
sellerName, 
createdAt: admin.firestore.FieldValue.serverTimestamp(), 
flames: 0, 
active: true 
}); 
res.json({ success: true, articleId: docRef.id }); 
} catch (error) { 
res.status(500).json({ error: error.message }); 
} 
});

app.get('/api/articles', async (req, res) => { 
try { 
const snapshot = await db.collection('products') 
.where('active', '', true) 
.limit(100) 
.get(); 
const articles = []; 
snapshot.forEach(doc => { 
articles.push({ id: doc.id, ...doc.data() }); 
}); 
res.json({ success: true, data: articles }); 
} catch (error) { 
res.status(500).json({ error: error.message }); 
} 
});

app.get('/api/articles/:articleId', async (req, res) => { 
try { 
const doc = await db.collection('products').doc(req.params.articleId).get(); 
if (!doc.exists) return res.status(404).json({ error: 'Article non trouvé' }); 
res.json({ success: true, data: { id: doc.id, ...doc.data() } }); 
} catch (error) { 
res.status(500).json({ error: error.message }); 
} 
});

// = UPLOAD IMGBB = 
app.post('/api/upload', async (req, res) => { 
try { 
const { base64 } = req.body;

if (!process.env.IMGBB_API_KEY) {
  return res.status(500).json({ error: 'IMGBB_API_KEY manquante' });
}

// Extraire le base64 sans le préfixe data:image/...;base64,
const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;

const formData = new FormData();
formData.append('image', cleanBase64);
formData.append('key', process.env.IMGBB_API_KEY);

const response = await fetch('https://api.imgbb.com/1/upload', {
  method: 'POST',
  body: formData
});

const data = await response.json();

if (data.success) {
  res.json({ success: true, url: data.data.url });
} else {
  res.status(400).json({ error: data.error?.message || 'Erreur ImgBB' });
}
} catch (error) { 
res.status(500).json({ error: error.message }); 
} 
});

// = ORDERS = 
app.post('/api/orders', async (req, res) => { 
try { 
const { buyerId, items, total, sellerId } = req.body; 
const orderData = { 
buyerId, 
items, 
total, 
sellerId, 
status: 'pending', 
createdAt: admin.firestore.FieldValue.serverTimestamp(), 
expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) 
}; 
const docRef = await db.collection('orders').add(orderData); 
res.json({ success: true, orderId: docRef.id }); 
} catch (error) { 
res.status(500).json({ error: error.message }); 
} 
});

app.get('/api/orders/:userId', async (req, res) => { 
try { 
const snapshot = await db.collection('orders') 
.where('buyerId', '', req.params.userId) 
.orderBy('createdAt', 'desc') 
.limit(20) 
.get(); 
const orders = []; 
snapshot.forEach(doc => { 
orders.push({ id: doc.id, ...doc.data() }); 
}); 
res.json(orders); 
} catch (error) { 
res.status(500).json({ error: error.message }); 
} 
});

app.post('/api/orders/:orderId/cancel', async (req, res) => { 
try { 
await db.collection('orders').doc(req.params.orderId).update({ 
status: 'cancelled', 
cancelledAt: admin.firestore.FieldValue.serverTimestamp() 
}); 
res.json({ success: true }); 
} catch (error) { 
res.status(500).json({ error: error.message }); 
} 
});

app.post('/api/orders/:orderId/extend', async (req, res) => { 
try { 
await db.collection('orders').doc(req.params.orderId).update({ 
expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) 
}); 
res.json({ success: true }); 
} catch (error) { 
res.status(500).json({ error: error.message }); 
} 
});

// = PANIER = 
app.post('/api/cart/add', async (req, res) => { 
try { 
const { userId, productId, quantity } = req.body; 
const cartRef = db.collection('carts').doc(userId);

const cartDoc = await cartRef.get();
let items = cartDoc.exists ? cartDoc.data().items || [] : [];

const existingItem = items.find(i => i.productId === productId);
if (existingItem) {
  existingItem.quantity += quantity;
} else {
  items.push({ productId, quantity });
}

await cartRef.set({ items, userId, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
res.json({ success: true });
} catch (error) { 
res.status(500).json({ error: error.message }); 
} 
});

app.get('/api/cart/:userId', async (req, res) => { 
try { 
const cartDoc = await db.collection('carts').doc(req.params.userId).get(); 
const items = cartDoc.exists ? cartDoc.data().items || [] : []; 
res.json({ success: true, items }); 
} catch (error) { 
res.status(500).json({ error: error.message }); 
} 
});

app.post('/api/cart/clear', async (req, res) => { 
try { 
const { userId } = req.body; 
await db.collection('carts').doc(userId).delete(); 
res.json({ success: true }); 
} catch (error) { 
res.status(500).json({ error: error.message }); 
} 
});

// = WALLET = 
app.get('/api/wallet/:userId', async (req, res) => { 
try { 
const userDoc = await db.collection('users').doc(req.params.userId).get(); 
const balance = userDoc.data()?.walletBalance || 0; 
res.json({ success: true, balance }); 
} catch (error) { 
res.status(500).json({ error: error.message }); 
} 
});

app.post('/api/wallet/deposit', async (req, res) => { 
try { 
const { userId, amount } = req.body; 
await db.collection('users').doc(userId).update({ 
walletBalance: admin.firestore.FieldValue.increment(parseInt(amount)) 
}); 
await db.collection('transactions').add({ 
userId, 
type: 'deposit', 
amount: parseInt(amount), 
status: 'completed', 
createdAt: admin.firestore.FieldValue.serverTimestamp() 
}); 
res.json({ success: true, message: 'Dépôt ajouté' }); 
} catch (error) { 
res.status(500).json({ error: error.message }); 
} 
});

app.post('/api/wallet/withdraw', async (req, res) => { 
try { 
const { userId, amount } = req.body; 
const userDoc = await db.collection('users').doc(userId).get(); 
const balance = userDoc.data()?.walletBalance || 0;

if (balance < parseInt(amount)) {
  return res.status(400).json({ error: 'Solde insuffisant' });
}

await db.collection('users').doc(userId).update({
  walletBalance: admin.firestore.FieldValue.increment(-parseInt(amount))
});
await db.collection('transactions').add({
  userId,
  type: 'withdrawal',
  amount: parseInt(amount),
  status: 'pending',
  createdAt: admin.firestore.FieldValue.serverTimestamp()
});
res.json({ success: true, message: 'Retrait demandé' });
} catch (error) { 
res.status(500).json({ error: error.message }); 
} 
});

// = PAIEMENTS YABETOO = 
app.post('/api/payment/initiate', async (req, res) => { 
try { 
const { amount, phone, userId, articleId, type } = req.body;

const txRef = await db.collection('transactions').add({
  userId,
  amount: parseInt(amount),
  phone,
  articleId: articleId || null,
  type,
  status: 'pending',
  yabetooStatus: 'initiated',
  createdAt: admin.firestore.FieldValue.serverTimestamp()
});

res.json({ 
  success: true, 
  transactionId: txRef.id,
  message: 'Paiement initié - Confirme sur ton mobile' 
});
} catch (error) { 
res.status(500).json({ error: error.message }); 
} 
});

app.post('/api/payment/webhook', async (req, res) => { 
try { 
const { transactionId, status } = req.body;

await db.collection('transactions').doc(transactionId).update({
  yabetooStatus: status,
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
});

if (status === 'completed') {
  const txDoc = await db.collection('transactions').doc(transactionId).get();
  const txData = txDoc.data();
  
  if (txData.type === 'deposit') {
    await db.collection('users').doc(txData.userId).update({
      walletBalance: admin.firestore.FieldValue.increment(txData.amount)
    });
  }
}

res.json({ success: true });
} catch (error) { 
res.status(500).json({ error: error.message }); 
} 
});

// = MESSAGES/CHAT = 
app.post('/api/messages', async (req, res) => { 
try { 
const { senderId, receiverId, text, productId } = req.body; 
await db.collection('messages').add({ 
senderId, 
receiverId, 
productId: productId || null, 
text, 
read: false, 
createdAt: admin.firestore.FieldValue.serverTimestamp() 
}); 
res.json({ success: true }); 
} catch (error) { 
res.status(500).json({ error: error.message }); 
} 
});

app.get('/api/messages/:userId', async (req, res) => { 
try { 
const snapshot = await db.collection('messages') 
.where('receiverId', '', req.params.userId) 
.orderBy('createdAt', 'desc') 
.limit(50) 
.get(); 
const messages = []; 
snapshot.forEach(doc => { 
messages.push({ id: doc.id, ...doc.data() }); 
}); 
res.json({ success: true, data: messages }); 
} catch (error) { 
res.status(500).json({ error: error.message }); 
} 
});

// = FLAMMES (FIABILITÉ) = 
app.post('/api/flames/add', async (req, res) => { 
try { 
const { sellerId, buyerId } = req.body;

const existingFlame = await db.collection('flammes')
  .where('sellerId', '==', sellerId)
  .where('buyerId', '==', buyerId)
  .get();

if (!existingFlame.empty) {
  return res.status(400).json({ error: 'Vous avez déjà noté ce vendeur' });
}

await db.collection('flammes').add({
  sellerId,
  buyerId,
  createdAt: admin.firestore.FieldValue.serverTimestamp()
});

await db.collection('users').doc(sellerId).update({
  flames: admin.firestore.FieldValue.increment(1)
});

res.json({ success: true });
} catch (error) { 
res.status(500).json({ error: error.message }); 
} 
});

app.get('/api/seller/:sellerId/flames', async (req, res) => { 
try { 
const userDoc = await db.collection('users').doc(req.params.sellerId).get(); 
const flames = userDoc.data()?.flames || 0; 
res.json({ success: true, flames }); 
} catch (error) { 
res.status(500).json({ error: error.message }); 
} 
});

// = USERS = 
app.post('/api/users', async (req, res) => { 
try { 
const { uid, name, phone, photoUrl } = req.body; 
await db.collection('users').doc(uid).set({ 
name, 
phone, 
photoUrl: photoUrl || '', 
walletBalance: 0, 
flames: 0, 
createdAt: admin.firestore.FieldValue.serverTimestamp() 
}); 
res.json({ success: true }); 
} catch (error) { 
res.status(500).json({ error: error.message }); 
} 
});

app.get('/api/users/:userId', async (req, res) => { 
try { 
const userDoc = await db.collection('users').doc(req.params.userId).get(); 
if (!userDoc.exists) { 
return res.status(404).json({ error: 'Utilisateur non trouvé' }); 
} 
res.json({ success: true, data: { id: userDoc.id, ...userDoc.data() } }); 
} catch (error) { 
res.status(500).json({ error: error.message }); 
} 
});

// = PORT & LISTEN === 
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => { 
console.log(Backend BLK sur port ${PORT}); 
});
