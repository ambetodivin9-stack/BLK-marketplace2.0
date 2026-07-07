const express = require('express'); 
const cors = require('cors'); 
const app = express(); 
const PORT = process.env.PORT || 10000;

app.use(cors()); 
app.use(express.json());

app.get('/', (req, res) => { 
res.json({ status: 'OK', message: 'BLK API - TEST MODE' }); 
});

app.get('/api/test', (req, res) => { 
res.json({ success: true, message: 'API fonctionne !' }); 
});

app.listen(PORT, () => { 
console.log('✅ API tourne sur le port ' + PORT); 
});const express = require('express'); 
const cors = require('cors'); 
const app = express(); 
const PORT = process.env.PORT || 10000;

app.use(cors()); 
app.use(express.json());

app.get('/', (req, res) => { 
res.json({ status: 'OK', message: 'BLK API - TEST MODE' }); 
});

app.get('/api/test', (req, res) => { 
res.json({ success: true, message: 'API fonctionne !' }); 
});

app.listen(PORT, () => { 
console.log('✅ API tourne sur le port ' + PORT); 
});
