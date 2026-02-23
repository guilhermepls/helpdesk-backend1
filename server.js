require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/status', (req, res) => {
	res.json({ status: "online", message: "O Servidor HelpDesk está ativo!"});
  });

app.listen(PORT, () => {
	console.log(`Servidor rodando em http://localhost:${PORT}`);
  });