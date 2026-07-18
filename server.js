const express = require('express'); 
const cors = require('cors');

const app = express(); 
const PORT = process.env.PORT || 10000;

app.use(cors()); 
app.use(express.json());

// Route de base pour vérifier que le serveur tourne 
app.get('/', (req, res) => { 
res.json({ status: 'OK', message: 'BLK API - Version stable' }); 
});

app.get('/api', (req, res) => { 
res.json({ success: true, message: 'API OK' }); 
});

// Route de test pour les articles (simulée pour l'instant) 
app.get('/api/articles', (req, res) => { 
res.json({ success: true, data: [] }); 
});

app.listen(PORT, '0.0.0.0', () => { 
console.log('BLK API running on port ' + PORT); 
});
