var Game = require('../models/game');

/**
 * Start a new game
 */
var getGame = function(req, res, next) {
  Game.start().then(function(response){
    req.session.game_answer = JSON.stringify(response[0]);
    req.session.attempts_left = 8;
    req.session.game_id = response[1];

    res.render('game');
  }).catch(function(err){
    console.log("Controller/game.js getGame function error: "+err);
  });
};

var postGame = function(req, res, next) {
  req.session.attempts_left -= 1;
  var msg = Game.move(req.body.p1, req.body.p2, req.body.p3, req.body.p4,
    req.session.game_answer, req.session.attempts_left, req.session.game_id);
  res.render('game', { message: JSON.stringify(msg)});
};

var getHistory = function(req, res, next) {
  Game.history().then(function(response){
    res.render('history', { title: 'History', msg:response});
  }).catch(function(err){
    console.log("Controller/game.js getHistory function error: "+err);
  });
};

module.exports = {
  getGame: getGame,
  postGame: postGame,
  getHistory: getHistory
};
