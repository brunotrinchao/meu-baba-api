const express = require('express');
const router = express.Router();
const championshipController = require('../controllers/championships.controller');

router.get('/', championshipController.getAll);
router.get('/:id', championshipController.getById);
router.post('/', championshipController.create);
router.put('/:id', championshipController.update);
router.delete('/:id', championshipController.remove);

module.exports = router;
