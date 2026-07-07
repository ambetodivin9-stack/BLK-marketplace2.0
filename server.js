const express = require('express'); 
const cors = require('cors'); 
const app = express(); 
const PORT = process.env.PORT || 10000;

app.use(cors()); 
app.use(express.json());

app.get('/', (req, res) => { 
res.json({ 
status: 'OK', 
message: 'BLK API - TEST MODE', 
timestamp: new Date().toISOString() 
}); 
});

app.get('/api/wallet/:userId', (req, res) => { 
res.json({ balance: 15000 }); 
});

app.listen(PORT, () => { 
console.log('✅ API tourne sur le port ' + PORT); 
});
