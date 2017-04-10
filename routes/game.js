var express = require('express');
var router = express.Router();
var Game = require('../controllers/game');
var session = require('cookie-session');

//TODO think about route param

/* GET Game page route, start game */
router.get('/', Game.getGame);

/* POST make a guess in the game */
router.post('/', Game.postGame);

/* GET History page route */
router.get('/history', Game.getHistory);

module.exports = router;
