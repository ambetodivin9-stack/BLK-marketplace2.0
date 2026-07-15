const express = require('express'); 
const cors = require('cors'); 
const admin = require('firebase-admin'); 
const axios = require('axios'); 
const FormData = require('form-data');

const app = express(); 
const PORT = process.env.PORT || 10000;

app.use(cors()); 
app.use(express.json({ limit: '10mb' }));

if (!process.env.FIREBASE_SERVICE_ACCOUNT) { 
console.error('❌ FIREBASE_SERVICE_ACCOUNT manquant'); 
process.exit(1); 
} 
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT); 
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) }); 
const db = admin.firestore();

console.log('✅ BLK API - 100% RÉEL');

app.get('/', (req, res) => res.json({ status: 'OK', message: 'BLK API' })); 
app.get('/api', (req, res) => res.json({ success: true, message: 'API OK' }));

app.post('/api/users/online', async (req, res) => { 
try { 
const { userId, online } = req.body; 
if (!userId) return res.status(400).json({ success: false, message: 'userId requis' }); 
await db.collection('users').doc(userId).set({ online: online || false }, { merge: true }); 
res.json({ success: true }); 
} catch (error) { 
res.status(500).json({ success: false, message: error.message }); 
} 
});

app.get('/api/users/:userId', async (req, res) => { 
try { 
const doc = await db.collection('users').doc(req.params.userId).get(); 
if (!doc.exists) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' }); 
res.json({ success: true, data: doc.data() }); 
} catch (error) { 
res.status(500).json({ success: false, message: error.message }); 
} 
});

app.get('/api/articles', async (req, res) => { 
try { 
const snapshot = await db.collection('products') 
.where('status', '', 'active') 
.orderBy('createdAt', 'desc') 
.get(); 
const articles = []; 
snapshot.forEach(doc => articles.push({ id: doc.id, ...doc.data() })); 
res.json({ success: true, data: articles }); 
} catch (error) { 
res.status(500).json({ success: false, message: error.message }); 
} 
});

app.post('/api/articles', async (req, res) => { 
try { 
const { title, description, price, category, image, sellerId, sellerName } = req.body; 
if (!title || !description || !price || !category || !sellerId) { 
return res.status(400).json({ success: false, message: 'Champs requis' }); 
} 
const article = { 
title, 
description, 
price: parseInt(price), 
category, 
image: image || '', 
sellerId, 
sellerName: sellerName || 'Anonyme', 
status: 'active', 
views: 0, 
createdAt: new Date() 
}; 
const docRef = await db.collection('products').add(article); 
res.json({ success: true, id: docRef.id }); 
} catch (error) { 
res.status(500).json({ success: false, message: error.message }); 
} 
});

app.delete('/api/articles/:id', async (req, res) => { 
try { 
const doc = await db.collection('products').doc(req.params.id).get(); 
if (!doc.exists) return res.status(404).json({ success: false, message: 'Article non trouvé' }); 
if (doc.data().status = 'sold') { 
return res.status(400).json({ success: false, message: 'Cet article a déjà été vendu' }); 
} 
await db.collection('products').doc(req.params.id).update({ status: 'inactive' }); 
res.json({ success: true }); 
} catch (error) { 
res.status(500).json({ success: false, message: error.message }); 
} 
});

app.post('/api/upload', async (req, res) => { 
try { 
const { base64 } = req.body; 
if (!base64) return res.status(400).json({ success: false, message: 'Aucune image' }); 
const API_KEY = process.env.IMG_BB_KEY || '2b3e869d8b6f382027e70cd216f65580'; 
const base64Data = base64.includes('base64,') ? base64.split('base64,')[1] : base64; 
const formData = new FormData(); 
formData.append('key', API_KEY); 
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
res.status(500).json({ success: false, message: 'Erreur upload' }); 
} 
});

app.get('/api/wallet/:userId', async (req, res) => { 
try { 
const doc = await db.collection('users').doc(req.params.userId).get(); 
res.json({ balance: doc.data()?.walletBalance || 0 }); 
} catch (error) { 
res.status(500).json({ success: false, message: error.message }); 
} 
});

app.post('/api/wallet/deposit', async (req, res) => { 
try { 
const userId = req.body.userId || req.body.userid; 
const amount = parseInt(req.body.amount); 
const phone = req.body.phone; 
if (!userId || !amount || !phone) { 
return res.status(400).json({ success: false, message: 'userId, amount et phone requis' }); 
} 
const userRef = db.collection('users').doc(userId); 
const doc = await userRef.get(); 
const currentBalance = doc.data()?.walletBalance || 0; 
const newBalance = currentBalance + amount; 
await userRef.set({ walletBalance: newBalance, phone: phone, lastDeposit: admin.firestore.FieldValue.serverTimestamp() }, { merge: true }); 
await db.collection('transactions').add({ userId, amount, phone, type: 'deposit', status: 'completed', description: 'Dépôt (simulé)', createdAt: new Date() }); 
res.json({ success: true, message: '💰 Dépôt effectué !', newBalance }); 
} catch (error) { 
res.status(500).json({ success: false, message: 'Erreur interne' }); 
} 
});

app.post('/api/wallet/admin-credit', async (req, res) => { 
try { 
const { userId, amount, phone } = req.body; 
if (!userId || !amount) return res.status(400).json({ success: false, message: 'userId et amount requis' }); 
const userRef = db.collection('users').doc(userId); 
const doc = await userRef.get(); 
const currentBalance = doc.data()?.walletBalance || 0; 
const newBalance = currentBalance + amount; 
await userRef.set({ walletBalance: newBalance, phone: phone || doc.data()?.phone || '', lastDeposit: admin.firestore.FieldValue.serverTimestamp() }, { merge: true }); 
await db.collection('transactions').add({ userId, amount, phone: phone || '065918166', type: 'deposit', status: 'completed', description: 'Dépôt manuel (admin)', createdAt: new Date() }); 
res.json({ success: true, message: 'Wallet crédité', newBalance }); 
} catch (error) { 
res.status(500).json({ success: false, message: error.message }); 
} 
});

app.post('/api/orders/create', async (req, res) => { 
try { 
const { articleId, buyerId, sellerId, amount, buyerPhone } = req.body; 
if (!articleId || !buyerId || !sellerId || !amount) { 
return res.status(400).json({ success: false, message: 'Champs requis' }); 
} 
const buyerDoc = await db.collection('users').doc(buyerId).get(); 
const buyerBalance = buyerDoc.data()?.walletBalance || 0; 
const buyerCommission = Math.round(amount * 0.03); 
const totalAmount = amount + buyerCommission; 
if (buyerBalance < totalAmount) { 
return res.status(400).json({ success: false, message: '❌ Solde insuffisant' }); 
} 
await buyerDoc.ref.update({ walletBalance: buyerBalance - totalAmount }); 
const order = { 
articleId, 
buyerId, 
sellerId, 
buyerPhone: buyerPhone || buyerDoc.data()?.phone || '', 
amount: parseInt(amount), 
buyerCommission, 
totalAmount, 
sellerCommission: Math.round(amount * 0.04), 
status: 'en attente de confirmation', 
buyerConfirmed: false, 
buyerConfirmedAt: null, 
flamesGiven: false, 
expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), 
createdAt: new Date() 
}; 
const orderRef = await db.collection('orders').add(order); 
const orderId = orderRef.id; 
await db.collection('products').doc(articleId).update({ status: 'sold' }); 
res.json({ success: true, orderId, message: '✅ Commande créée !', totalAmount }); 
} catch (error) { 
res.status(500).json({ success: false, message: error.message }); 
} 
});

app.get('/api/orders/:userId', (req, res) => res.json([])); 
app.get('/api/messages/:userId', (req, res) => res.json({ success: true, data: [] })); 
app.post('/api/messages', (req, res) => res.json({ success: true, id: 'mock-' + Date.now() })); 
app.post('/api/flames', (req, res) => res.json({ success: true })); 
app.get('/api/flames/:userId', (req, res) => res.json({ flames: 0 })); 
app.get('/api/transactions/:userId', (req, res) => res.json({ success: true, data: [] })); 
app.get('/api/stats/:userId', (req, res) => res.json({ success: true, data: {} }));

app.listen(PORT, '0.0.0.0', () => { 
console.log('✅ BLK API running on port', PORT); 
});
