const express = require('express');
const router = express.Router();
const championshipController = require('../controllers/championships.controller');

router.get('/championships/', championshipController.getAll);
router.get('/championships/:id', championshipController.getById);
router.post('/championships/', championshipController.create);
router.put('/championships/:id', championshipController.update);
router.delete('/championships/:id', championshipController.remove);

module.exports = router;
