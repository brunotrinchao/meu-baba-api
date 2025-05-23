require('dotenv').config();
const express = require('express');
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const verifyToken = require('../middlewares/authMiddleware');

// Importando rotas
const health = require('../routes/health.routes');
const teamRoutes = require('../routes/teams.routes');
const championshipRoutes = require('../routes/championships.routes');
const matchRoutes = require('../routes/matches.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
// Rotas
app.use('', health);
app.use('', verifyToken, teamRoutes);
app.use('', verifyToken, championshipRoutes);
app.use('', verifyToken, matchRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;