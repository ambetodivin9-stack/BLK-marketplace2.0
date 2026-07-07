const express = require('express'); 
const cors = require('cors'); 
const app = express(); 
const PORT = process.env.PORT || 10000;

app.use(cors()); 
app.use(express.json());

app.get('/', (req, res) => { 
res.json({ status: 'OK', message: 'BLK API - LIVE' }); 
});

app.get('/api/users', (req, res) => { 
res.json({ success: true, users: [] }); 
});

// ✅ Route de connexion 
app.post('/api/login', (req, res) => { 
const { phone, name } = req.body; 
if (!phone) { 
return res.status(400).json({ success: false, message: 'Numéro requis' }); 
} 
res.json({ success: true, message: 'Connexion réussie', user: { phone, name: name || 'Anonyme' } }); 
});

app.listen(PORT, () => { 
console.log('✅ API tourne sur le port ' + PORT); 
});
