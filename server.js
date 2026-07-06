const express = require('express'); 
const cors = require('cors'); 
const admin = require('firebase-admin'); 
const axios = require('axios'); 
const FormData = require('form-data');

const app = express(); 
const PORT = process.env.PORT || 10000;

app.use(cors()); 
app.use(express.json({ limit: '10mb' }));

//  
// FIREBASE - Service Account 
//  
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT); 
admin.initializeApp({ 
credential: admin.credential.cert(serviceAccount) 
}); 
const db = admin.firestore();

//  
// CONFIGURATION DES CLÉS API (depuis les variables d'environnement) 
//  
const IMG_BB_KEY = process.env.IMG_BB_KEY; 
const YABETOO_SECRET = process.env.YABETOO_SECRET_KEY;

console.log('✅ Configuration chargée:'); 
console.log(  - ImgBB: ${IMG_BB_KEY ? '✅' : '❌'}); 
console.log(  - Yabetoo: ${YABETOO_SECRET ? '✅' : '❌'});

//  
// ROUTE PRINCIPALE 
//  
app.get('/', (req, res) => { 
res.json({ 
status: 'OK', 
message: 'BLK Marketplace API', 
services: { 
imgbb: IMG_BB_KEY ? '✅' : '❌', 
yabetoo: YABETOO_SECRET ? '✅' : '❌', 
firebase: '✅' 
} 
}); 
});

//  
// ARTICLES 
// 

app.get('/api/articles', async (req, res) => { 
try { 
const snapshot = await db.collection('articles').orderBy('createdAt', 'desc').get(); 
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
try { 
const { title, description, price, category, image, sellerId, sellerName } = req.body; 
const article = { 
title, 
description, 
price, 
category, 
image: image || '', 
sellerId, 
sellerName: sellerName || 'Anonyme', 
createdAt: new Date(), 
status: 'active' 
}; 
const docRef = await db.collection('articles').add(article); 
res.json({ success: true, id: docRef.id }); 
} catch (error) { 
res.status(500).json({ success: false, message: error.message }); 
} 
});

//  
// IMAGE UPLOAD - ImgBB 
// 

app.post('/api/upload', async (req, res) => { 
try { 
const { base64 } = req.body;

if (!base64) {
  return res.status(400).json({ success: false, message: 'Aucune image fournie' });
}

if (!IMG_BB_KEY) {
  return res.status(500).json({ success: false, message: 'Clé ImgBB non configurée' });
}

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

//  
// WALLET 
// 

app.get('/api/wallet/:userId', async (req, res) => { 
try { 
const { userId } = req.params; 
const doc = await db.collection('users').doc(userId).get(); 
res.json({ balance: doc.data()?.walletBalance || 0 }); 
} catch (error) { 
res.status(500).json({ success: false, message: error.message }); 
} 
});

app.post('/api/wallet/withdraw', async (req, res) => { 
try { 
const { userId, amount } = req.body; 
const userRef = db.collection('users').doc(userId); 
const doc = await userRef.get(); 
const currentBalance = doc.data()?.walletBalance || 0;

if (currentBalance < amount) {
  return res.status(400).json({ success: false, message: 'Solde insuffisant' });
}

await userRef.update({ walletBalance: currentBalance - amount });
res.json({ success: true, newBalance: currentBalance - amount });
} catch (error) { 
res.status(500).json({ success: false, message: error.message }); 
} 
});

//  
// PAIEMENT - Yabetoo 
// 

app.post('/api/payment/initiate', async (req, res) => { 
try { 
const { amount, phone, userId } = req.body;

if (!amount || !phone || !userId) {
  return res.status(400).json({ success: false, message: 'Montant, téléphone et userId requis' });
}

if (!YABETOO_SECRET) {
  return res.status(500).json({ success: false, message: 'Clé Yabetoo non configurée' });
}

// Simulation pour l'instant (car Yabetoo est en test)
const reference = `BLK-${userId.slice(0, 8)}-${Date.now().toString().slice(-6)}`;

// Créditer le wallet directement (en mode test)
const userRef = db.collection('users').doc(userId);
const doc = await userRef.get();
const currentBalance = doc.data()?.walletBalance || 0;
await userRef.update({ walletBalance: currentBalance + amount });

// Enregistrer la transaction
await db.collection('transactions').add({
  userId,
  amount,
  phone,
  reference,
  status: 'completed',
  type: 'deposit',
  createdAt: new Date()
});

res.json({
  success: true,
  message: '💰 Paiement simulé avec succès (mode test)',
  reference: reference,
  newBalance: currentBalance + amount
});

// NOTE: En production, remplacer par:
// const response = await axios.post('https://api.yabetoo.com/v1/payment/initiate', {
//   amount, phone, reference,
//   callback_url: 'https://blk-marketplace-7vig.onrender.com/api/payment/callback'
// }, { headers: { 'Authorization': `Bearer ${YABETOO_SECRET}` } });
// if (response.data.status === 'success') { ... }
} catch (error) { 
console.error('Payment Error:', error.message); 
res.status(500).json({ success: false, message: 'Erreur paiement' }); 
} 
});

//  
// ORDRES 
// 

app.get('/api/orders/:userId', async (req, res) => { 
try { 
const { userId } = req.params; 
const snapshot = await db.collection('orders').where('userId', '', userId).get(); 
const orders = []; 
snapshot.forEach(doc => { 
orders.push({ id: doc.id, ...doc.data() }); 
}); 
res.json(orders); 
} catch (error) { 
res.status(500).json({ success: false, message: error.message }); 
} 
});

app.post('/api/orders/:id/cancel', async (req, res) => { 
try { 
const { id } = req.params; 
await db.collection('orders').doc(id).update({ status: 'annulé' }); 
res.json({ success: true }); 
} catch (error) { 
res.status(500).json({ success: false, message: error.message }); 
} 
});

app.post('/api/orders/:id/extend', async (req, res) => { 
try { 
const { id } = req.params; 
const doc = await db.collection('orders').doc(id).get(); 
const currentExpires = doc.data()?.expiresAt?.toDate() || new Date(); 
const newExpires = new Date(currentExpires.getTime() + 24 * 60 * 60 * 1000); 
await db.collection('orders').doc(id).update({ expiresAt: newExpires }); 
res.json({ success: true }); 
} catch (error) { 
res.status(500).json({ success: false, message: error.message }); 
} 
});

//  
// FLAMES 
// 

app.get('/api/seller/:userId/flames', async (req, res) => { 
try { 
const { userId } = req.params; 
const doc = await db.collection('users').doc(userId).get(); 
res.json({ flames: doc.data()?.flames || 0 }); 
} catch (error) { 
res.status(500).json({ success: false, message: error.message }); 
} 
});

//  
// DÉMARRAGE 
// ==

app.listen(PORT, () => { 
console.log(✅ BLK API running on port ${PORT}); 
});
