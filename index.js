require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: "Tezro Core is Online", security: "Elite" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('🚀 Tezro Mountain Core running on port ' + PORT));
