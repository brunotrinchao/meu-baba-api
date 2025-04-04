const express = require('express');
const router = express.Router();

// Rotas CRUD
router.get('/', function (req, res) {
  res.send('Server online');
});

module.exports = router;
