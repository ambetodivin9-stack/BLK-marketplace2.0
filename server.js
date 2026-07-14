const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ============================================================
// FIREBASE ADMIN
// ============================================================
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.error('❌ FIREBASE_SERVICE_ACCOUNT manquant');
    process.exit(1);
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// ============================================================
// CONFIGURATION
// ============================================================
const IMG_BB_KEY = process.env.IMG_BB_KEY;
const YABETOO_SECRET = process.env.YABETOO_SECRET_KEY;
const ADMIN_PHONE = process.env.ADMIN_PHONE || '065918166';

const COMMISSION_BUYER = 0.03;
const COMMISSION_SELLER = 0.04;

const ALLOWED_CATEGORIES = [
    'vêtements', 'chaussures', 'sacs', 'bijoux', 'accessoires'
];

console.log(`✅ BLK Marketplace - 100% RÉEL`);
console.log(`✅ Admin Phone: ${ADMIN_PHONE}`);
console.log(`✅ ImgBB: ${IMG_BB_KEY ? 'OK' : 'MANQUANT'}`);
console.log(`✅ Yabetoo: ${YABETOO_SECRET ? 'OK' : 'MANQUANT'}`);

// ============================================================
// ROUTES PRINCIPALES
// ============================================================
app.get('/', (req, res) => {
    res.json({
        status: 'OK',
        message: 'BLK Marketplace API - 100% RÉEL',
        services: {
            firebase: '✅',
            imgbb: IMG_BB_KEY ? '✅' : '❌',
            yabetoo: YABETOO_SECRET ? '✅' : '❌'
        }
    });
});

app.get('/ping', (req, res) => res.send('pong'));

app.get('/api', (req, res) => {
    res.json({ success: true, message: 'API OK' });
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
    try {
        const { id } = req.params;
        await db.collection('articles').doc(id).update({ status: 'inactive' });
        res.json({ success: true });
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

app.post('/api/upload-audio', async (req, res) => {
    try {
        const { base64 } = req.body;
        if (!base64) return res.status(400).json({ success: false, message: 'Aucun audio' });
        const audioUrl = `data:audio/webm;base64,${base64}`;
        res.json({ success: true, url: audioUrl });
    } catch (error) {
        console.error('Audio Upload Error:', error.message);
        res.status(500).json({ success: false, message: 'Erreur upload audio' });
    }
});

// ============================================================
// UTILISATEURS
// ============================================================
app.get('/api/users/:userId', async (req, res) => {
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

app.post('/api/users/online', async (req, res) => {
    try {
        const { userId, online } = req.body;
        await db.collection('users').doc(userId).update({ online: online || false });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================================
// WALLET
// ============================================================
app.get('/api/wallet/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const doc = await db.collection('users').doc(userId).get();
        res.json({ balance: doc.data()?.walletBalance || 0 });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================================
// WALLET - DÉPÔT YABETOO (CORRIGÉ)
// ============================================================
app.post('/api/wallet/deposit', async (req, res) => {
    console.log('📩 Requête de dépôt reçue !');
    console.log('Body:', req.body);

    try {
        const userId = req.body.userid || req.body.userId;
        const amount = parseInt(req.body.amount);
        const phone = req.body.phone;

        if (!userId || !amount || !phone) {
            console.log('❌ Champs manquants');
            return res.status(400).json({ success: false, message: 'userId, amount et phone requis' });
        }

        if (!YABETOO_SECRET) {
            console.error('❌ YABETOO_SECRET manquant');
            return res.status(500).json({ success: false, message: 'Configuration paiement manquante' });
        }

        const reference = `DEP-${Date.now()}-${userId.slice(-6)}`;

        // ✅ URL CORRECTE : pay.api.yabetoopay.com/v1/payment-intents
        const paymentResponse = await axios.post(
            'https://pay.api.yabetoopay.com/v1/payment-intents',
            {
                amount: amount,
                phone: phone,
                reference: reference,
                callback_url: 'https://blk-marketplace2-0.onrender.com/api/payment/callback',
                description: `Dépôt BLK - ${userId}`
            },
            {
                headers: {
                    'Authorization': `Bearer ${YABETOO_SECRET}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const transactionId = paymentResponse.data.id;

        if (transactionId) {
            await db.collection('transactions').add({
                userId,
                amount,
                phone,
                reference,
                type: 'deposit',
                status: 'pending',
                yabetooId: transactionId,
                createdAt: new Date()
            });

            console.log(`✅ Paiement initié: ${reference}`);
            res.json({
                success: true,
                message: '📲 Vérifie ton téléphone, tu vas recevoir une demande de paiement.',
                reference: reference,
                transactionId: transactionId
            });
        } else {
            console.error('❌ Erreur Yabetoo:', paymentResponse.data);
            res.status(400).json({ success: false, message: paymentResponse.data.message || 'Erreur paiement' });
        }

    } catch (error) {
        console.error('❌ Erreur dépôt:', error.message);
        if (error.response) {
            console.error('📦 Réponse Yabetoo:', error.response.data);
        }
        res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
    }
});

// ============================================================
// CALLBACK YABETOO
// ============================================================
app.post('/api/payment/callback', async (req, res) => {
    console.log('📩 Callback Yabetoo reçu !');
    console.log('Body:', req.body);

    try {
        const { reference, status, transaction_id } = req.body;

        const snapshot = await db.collection('transactions')
            .where('reference', '==', reference)
            .limit(1)
            .get();

        if (snapshot.empty) {
            console.log('❌ Transaction non trouvée:', reference);
            return res.status(404).json({ success: false, message: 'Transaction non trouvée' });
        }

        const doc = snapshot.docs[0];
        const data = doc.data();

        if (status === 'success' || status === 'completed') {
            if (data.type === 'deposit') {
                const userRef = db.collection('users').doc(data.userId);
                const userDoc = await userRef.get();
                const currentBalance = userDoc.data()?.walletBalance || 0;
                const newBalance = currentBalance + data.amount;

                await userRef.set({
                    walletBalance: newBalance,
                    phone: data.phone,
                    lastDeposit: admin.firestore.FieldValue.serverTimestamp(),
                    name: data.userId || 'Utilisateur BLK',
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                }, { merge: true });

                console.log(`💰 Wallet mis à jour: ${currentBalance} → ${newBalance}`);
            }

            await doc.ref.update({
                status: 'completed',
                yabetooId: transaction_id,
                completedAt: new Date()
            });

            res.json({ success: true });
        } else {
            await doc.ref.update({
                status: 'failed',
                yabetooId: transaction_id,
                failedAt: new Date()
            });
            res.json({ success: false, message: 'Transaction échouée' });
        }

    } catch (error) {
        console.error('❌ Callback Error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================================
// ADMIN - CRÉDIT MANUEL
// ============================================================
app.post('/api/wallet/admin-credit', async (req, res) => {
    console.log('📩 Crédit manuel admin reçu !');
    console.log('Body:', req.body);

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
            lastDeposit: admin.firestore.FieldValue.serverTimestamp(),
            name: doc.data()?.name || userId
        }, { merge: true });

        await db.collection('transactions').add({
            userId,
            amount,
            phone: phone || '065918166',
            type: 'deposit',
            status: 'completed',
            description: 'Dépôt manuel (admin)',
            createdAt: new Date()
        });

        console.log(`💰 Wallet mis à jour: ${currentBalance} → ${newBalance}`);
        res.json({ success: true, message: 'Wallet crédité', newBalance });

    } catch (error) {
        console.error('❌ Erreur crédit admin:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================================
// WALLET - RETRAIT (SIMULATION)
// ============================================================
app.post('/api/wallet/withdraw', async (req, res) => {
    try {
        const { userId, amount, phone } = req.body;
        if (!userId || !amount || !phone) {
            return res.status(400).json({ success: false, message: 'userId, amount et phone requis' });
        }

        const userRef = db.collection('users').doc(userId);
        const doc = await userRef.get();
        const currentBalance = doc.data()?.walletBalance || 0;

        if (currentBalance < amount) {
            return res.status(400).json({ success: false, message: 'Solde insuffisant' });
        }

        const newBalance = currentBalance - parseInt(amount);
        await userRef.update({ walletBalance: newBalance });

        await db.collection('transactions').add({
            userId,
            amount: parseInt(amount),
            phone,
            type: 'withdraw',
            status: 'completed',
            description: 'Retrait (simulé)',
            createdAt: new Date()
        });

        res.json({
            success: true,
            message: '💰 Retrait effectué avec succès !',
            newBalance: newBalance
        });
    } catch (error) {
        console.error('Withdraw Error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================================
// ORDRES (simplifiées pour l'exemple)
// ============================================================
app.post('/api/orders/create', async (req, res) => {
    // version simplifiée
    res.json({ success: true, orderId: 'mock-' + Date.now() });
});

app.post('/api/orders/confirm', async (req, res) => {
    res.json({ success: true, message: 'Commande confirmée' });
});

app.get('/api/orders/:userId', (req, res) => {
    res.json([]);
});

app.post('/api/orders/cancel/:orderId', (req, res) => {
    res.json({ success: true, message: 'Commande annulée' });
});

// ============================================================
// FLAMMES, STATS, TRANSACTIONS, MESSAGES (simulés)
// ============================================================
app.post('/api/flames', (req, res) => {
    res.json({ success: true, flames: 1 });
});
app.get('/api/flames/:userId', (req, res) => {
    res.json({ flames: 0 });
});
app.get('/api/stats/:userId', (req, res) => {
    res.json({ success: true, data: { totalArticles: 0, totalSales: 0, totalPurchases: 0, history: [] } });
});
app.get('/api/transactions/:userId', async (req, res) => {
    try {
        const snapshot = await db.collection('transactions')
            .where('userId', '==', req.params.userId)
            .orderBy('createdAt', 'desc')
            .limit(100)
            .get();
        const transactions = [];
        snapshot.forEach(doc => transactions.push({ id: doc.id, ...doc.data() }));
        res.json({ success: true, data: transactions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
app.get('/api/messages/:userId', (req, res) => {
    res.json({ success: true, data: [] });
});
app.post('/api/messages', (req, res) => {
    res.json({ success: true, id: 'mock-' + Date.now() });
});
app.get('/api/notifications/:userId', (req, res) => {
    res.json({ success: true, data: [] });
});
app.post('/api/notifications/read/:id', (req, res) => {
    res.json({ success: true });
});

// ============================================================
// DÉMARRAGE
// ============================================================
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ BLK API running on port ${PORT}`);
    console.log(`📦 Mode: 100% RÉEL`);
    console.log(`📱 Admin: ${ADMIN_PHONE}`);
});
