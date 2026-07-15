const express = require('express'); 
const cors = require('cors'); 
const admin = require('firebase-admin');

const app = express(); 
const PORT = process.env.PORT || 10000;

app.use(cors()); 
app.use(express.json({ limit: '10mb' }));

//  
// FIREBASE 
//  
if (!process.env.FIREBASE_SERVICE_ACCOUNT) { 
console.error('❌ FIREBASE_SERVICE_ACCOUNT manquant'); 
process.exit(1); 
} 
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT); 
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) }); 
const db = admin.firestore();

console.log('✅ BLK API - 100% RÉEL (simulation paiement)');

//  
// ROUTES 
//  
app.get('/', (req, res) => res.json({ status: 'OK', message: 'BLK API' })); 
app.get('/api', (req, res) => res.json({ success: true, message: 'API OK' }));

//  
// UTILISATEURS 
//  
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
const data = doc.data(); 
res.json({ success: true, data: { 
name: data.name, 
photo: data.photo || '', 
flames: data.flames || 0, 
walletBalance: data.walletBalance || 0, 
phone: data.phone || '', 
email: data.email || '', 
isSeller: data.isSeller || false, 
blockedUsers: data.blockedUsers || [], 
online: data.online || false 
}}); 
} catch (error) { 
res.status(500).json({ success: false, message: error.message }); 
} 
});

app.put('/api/users/:userId', async (req, res) => { 
try { 
const { userId } = req.params; 
const { name, email, phone, photo, isSeller } = req.body; 
const updateData = {}; 
if (name) updateData.name = name; 
if (email) updateData.email = email; 
if (phone) updateData.phone = phone; 
if (photo) updateData.photo = photo; 
if (isSeller ! undefined) updateData.isSeller = isSeller; 
await db.collection('users').doc(userId).update(updateData); 
res.json({ success: true }); 
} catch (error) { 
res.status(500).json({ success: false, message: error.message }); 
} 
});

//  
// ARTICLES 
//  
app.get('/api/articles', async (req, res) => { 
try { 
const snapshot = await db.collection('articles') 
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

app.get('/api/articles/seller/:sellerId', async (req, res) => { 
try { 
const { sellerId } = req.params; 
const snapshot = await db.collection('articles') 
.where('sellerId', '', sellerId) 
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
const { title, description, price, category, image, sellerId, sellerName, sellerPhoto } = req.body; 
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
try { 
const { id } = req.params; 
await db.collection('articles').doc(id).update({ status: 'inactive' }); 
res.json({ success: true }); 
} catch (error) { 
res.status(500).json({ success: false, message: error.message }); 
} 
});

//  
// STATISTIQUES (pour Mon Magasin) 
//  
app.get('/api/stats/:userId', async (req, res) => { 
try { 
const { userId } = req.params; 
const articlesSnapshot = await db.collection('articles') 
.where('sellerId', '', userId) 
.where('status', '', 'active') 
.get();

    const ordersSnapshot = await db.collection('orders')
        .where('sellerId', '==', userId)
        .where('status', '==', 'livré')
        .get();

    let totalSales = 0;
    let totalRevenue = 0;
    ordersSnapshot.forEach(doc => {
        const order = doc.data();
        totalSales += 1;
        totalRevenue += order.sellerReceived || (order.amount - (order.amount * 0.04));
    });

    const purchasesSnapshot = await db.collection('orders')
        .where('buyerId', '==', userId)
        .where('status', '==', 'livré')
        .get();

    let totalPurchases = 0;
    let totalSpent = 0;
    purchasesSnapshot.forEach(doc => {
        const order = doc.data();
        totalPurchases += 1;
        totalSpent += order.totalAmount || order.amount;
    });

    const history = {};
    ordersSnapshot.forEach(doc => {
        const order = doc.data();
        const date = order.createdAt?.toDate?.() || new Date(order.createdAt);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!history[month]) history[month] = { ventes: 0, revenu: 0 };
        history[month].ventes += 1;
        history[month].revenu += order.sellerReceived || (order.amount - (order.amount * 0.04));
    });

    const historyArray = Object.keys(history).sort().map(month => ({
        month,
        ventes: history[month].ventes,
        revenu: Math.round(history[month].revenu)
    }));

    res.json({
        success: true,
        data: {
            totalArticles: articlesSnapshot.size,
            totalSales,
            totalRevenue: Math.round(totalRevenue),
            totalPurchases,
            totalSpent,
            history: historyArray
        }
    });
} catch (error) {
    res.status(500).json({ success: false, message: error.message });
}
});

//  
// WALLET 
//  
app.get('/api/wallet/:userId', async (req, res) => { 
try { 
const doc = await db.collection('users').doc(req.params.userId).get(); 
res.json({ balance: doc.data()?.walletBalance || 0 }); 
} catch (error) { 
res.status(500).json({ success: false, message: error.message }); 
} 
});

app.post('/api/wallet/deposit', async (req, res) => { 
console.log('📩 Dépôt reçu:', req.body); 
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
await userRef.set({ 
walletBalance: newBalance, 
phone: phone, 
lastDeposit: admin.firestore.FieldValue.serverTimestamp() 
}, { merge: true }); 
await db.collection('transactions').add({ 
userId, amount, phone, 
type: 'deposit', 
status: 'completed', 
description: 'Dépôt (simulé)', 
createdAt: new Date() 
}); 
console.log(💰 Wallet mis à jour: ${currentBalance} → ${newBalance}); 
res.json({ success: true, message: '💰 Dépôt effectué !', newBalance }); 
} catch (error) { 
console.error('❌ Erreur dépôt:', error.message); 
res.status(500).json({ success: false, message: 'Erreur interne' }); 
} 
});

app.post('/api/wallet/admin-credit', async (req, res) => { 
console.log('📩 Crédit admin reçu:', req.body); 
try { 
const { userId, amount, phone } = req.body; 
if (!userId || !amount) { 
return res.status(400).json({ success: false, message: 'userId et amount requis' }); 
} 
const userRef = db.collection('users').doc(userId); 
const doc = await userRef.get(); 
const currentBalance = doc.data()?.walletBalance || 0; 
const newBalance = currentBalance + amount; 
await userRef.set({ 
walletBalance: newBalance, 
phone: phone || doc.data()?.phone || '', 
lastDeposit: admin.firestore.FieldValue.serverTimestamp() 
}, { merge: true }); 
await db.collection('transactions').add({ 
userId, amount, 
phone: phone || '065918166', 
type: 'deposit', 
status: 'completed', 
description: 'Dépôt manuel (admin)', 
createdAt: new Date() 
}); 
console.log(💰 Wallet admin mis à jour: ${currentBalance} → ${newBalance}); 
res.json({ success: true, message: 'Wallet crédité', newBalance }); 
} catch (error) { 
console.error('❌ Erreur crédit admin:', error.message); 
res.status(500).json({ success: false, message: error.message }); 
} 
});

//  
// ORDRES (simplifiées) 
//  
app.post('/api/orders/create', async (req, res) => { 
res.json({ success: true, orderId: 'mock-' + Date.now() }); 
});

app.post('/api/orders/confirm-by-qr', async (req, res) => { 
res.json({ success: true, message: 'Commande confirmée par QR (simulée)' }); 
});

app.get('/api/orders/:userId', async (req, res) => { 
res.json([]); 
});

//  
// FLAMMES, TRANSACTIONS, MESSAGES (simplifiés) 
//  
app.post('/api/flames', (req, res) => res.json({ success: true })); 
app.get('/api/flames/:userId', (req, res) => res.json({ flames: 0 })); 
app.get('/api/transactions/:userId', (req, res) => res.json({ success: true, data: [] })); 
app.get('/api/messages/:userId', (req, res) => res.json({ success: true, data: [] })); 
app.post('/api/messages', (req, res) => res.json({ success: true, id: 'mock-' + Date.now() })); 
app.get('/api/notifications/:userId', (req, res) => res.json({ success: true, data: [] })); 
app.post('/api/notifications/read/:id', (req, res) => res.json({ success: true }));

//  
// DÉMARRAGE 
//  
app.listen(PORT, '0.0.0.0', () => { 
console.log('✅ BLK API running on port', PORT); 
});
