const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teams.controller');

// Rotas CRUD
router.get('/:championship_id/teams/', teamController.getAll);
router.get('/:championship_id/teams/:id', teamController.getById);
router.get('/:championship_id/teams/:id/matchs', teamController.getMatchs);
router.post('/:championship_id/teams/', teamController.create);
router.put('/:championship_id/teams/:id', teamController.update);
router.delete('/:championship_id/teams/:id', teamController.remove);

module.exports = router;
