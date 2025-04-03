const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matches.controller');

router.get('/:championship_id/matches/', matchController.getAll);
router.get('/:championship_id/matches/team/:team_id', matchController.getByTeam);
router.get('/:championship_id/matches/:id', matchController.getById);
router.post('/:championship_id/matches/', matchController.create);
router.put('/:championship_id/matches/:id', matchController.update);
router.put('/:championship_id/matches/:id/score', matchController.updateScore);
router.delete('/:championship_id/matches/:id', matchController.remove);

module.exports = router;
