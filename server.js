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
// FIREBASE (optionnel si variable manquante) 
//  
let db = null; 
try { 
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}'); 
admin.initializeApp({ 
credential: admin.credential.cert(serviceAccount) 
}); 
db = admin.firestore(); 
console.log('✅ Firebase connecté'); 
} catch (error) { 
console.log('⚠️ Firebase non configuré (mode dégradé)'); 
}

//  
// CONFIGURATION 
//  
const IMG_BB_KEY = process.env.IMG_BB_KEY || ''; 
const YABETOO_SECRET = process.env.YABETOO_SECRET_KEY || ''; 
const ADMIN_PHONE = process.env.ADMIN_PHONE || '065918166';

console.log('✅ BLK API - Mode ' + (db ? 'COMPLET' : 'DÉGRADÉ')); 
console.log('✅ Admin Phone: ' + ADMIN_PHONE);

//  
// ROUTE PRINCIPALE 
//  
app.get('/', (req, res) => { 
res.json({ 
status: 'OK', 
message: 'BLK Marketplace API - 100% RÉEL', 
services: { 
firebase: db ? '✅' : '❌', 
imgbb: IMG_BB_KEY ? '✅' : '❌', 
yabetoo: YABETOO_SECRET ? '✅' : '❌' 
} 
}); 
});

//  
// SANTÉ (health check) 
//  
app.get('/health', (req, res) => { 
res.json({ status: 'healthy', timestamp: new Date().toISOString() }); 
});

//  
// ARTICLES 
//  
app.get('/api/articles', async (req, res) => { 
if (!db) return res.json({ success: true, data: [] }); 
try { 
const snapshot = await db.collection('articles') 
.where('status', '', 'active') 
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
if (!db) return res.status(500).json({ success: false, message: 'Base de données non disponible' }); 
try { 
const { title, description, price, category, image, sellerId, sellerName } = req.body; 
const article = { 
title, 
description, 
price: parseInt(price), 
category: category || 'autres', 
image: image || '', 
sellerId, 
sellerName: sellerName || 'Anonyme', 
status: 'active', 
createdAt: new Date() 
}; 
const docRef = await db.collection('articles').add(article); 
res.json({ success: true, id: docRef.id }); 
} catch (error) { 
res.status(500).json({ success: false, message: error.message }); 
} 
});

//  
// UPLOAD IMAGE (ImgBB) 
//  
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

//  
// WALLET 
//  
app.get('/api/wallet/:userId', async (req, res) => { 
if (!db) return res.json({ balance: 0 }); 
try { 
const doc = await db.collection('users').doc(req.params.userId).get(); 
res.json({ balance: doc.data()?.walletBalance || 0 }); 
} catch (error) { 
res.status(500).json({ success: false, message: error.message }); 
} 
});

//  
// CALLBACK YABETOO 
//  
app.post('/api/payment/callback', (req, res) => { 
console.log('📩 Webhook Yabetoo reçu:', req.body); 
res.json({ success: true, received: true }); 
});

//  
// ORDRES 
//  
app.post('/api/orders/create', async (req, res) => { 
if (!db) return res.status(500).json({ success: false, message: 'Base de données non disponible' }); 
try { 
const { articleId, buyerId, sellerId, amount } = req.body; 
if (!articleId || !buyerId || !sellerId || !amount) { 
return res.status(400).json({ success: false, message: 'Champs requis manquants' }); 
} 
// Vérifier le solde 
const buyerDoc = await db.collection('users').doc(buyerId).get(); 
const buyerBalance = buyerDoc.data()?.walletBalance || 0; 
const totalAmount = amount + Math.round(amount * 0.03); 
if (buyerBalance < totalAmount) { 
return res.status(400).json({ 
success: false, 
message: 'Solde insuffisant', 
balance: buyerBalance, 
required: totalAmount 
}); 
} 
// Débiter l'acheteur 
await db.collection('users').doc(buyerId).update({ 
walletBalance: buyerBalance - totalAmount 
}); 
// Créer la commande 
const order = { 
articleId, 
buyerId, 
sellerId, 
amount: parseInt(amount), 
totalAmount, 
status: 'en attente de confirmation', 
expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), 
createdAt: new Date() 
}; 
const orderRef = await db.collection('orders').add(order); 
res.json({ 
success: true, 
orderId: orderRef.id, 
message: '✅ Commande créée avec succès !' 
}); 
} catch (error) { 
res.status(500).json({ success: false, message: error.message }); 
} 
});

//  
// DÉMARRAGE 
// == 
app.listen(PORT, () => { 
console.log('✅ BLK API running on port ' + PORT); 
console.log('📦 Mode: 100% RÉEL'); 
console.log('💳 Paiement: MTN Mobile Money (Yabetoo)'); 
console.log('📱 Admin: ' + ADMIN_PHONE); 
});
