const express = require('express'); 
const app = express(); 
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => { 
res.json({ status: 'OK' }); 
});

// Test Firebase séparément 
try { 
const admin = require('firebase-admin'); 
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT); 
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) }); 
console.log('✅ Firebase OK'); 
} catch (error) { 
console.error('❌ Firebase ERROR:', error.message); 
console.error('❌ Stack:', error.stack); 
}

app.listen(PORT, () => { 
console.log('✅ API tourne sur le port ' + PORT); 
});
