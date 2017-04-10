var db = require('../db');

/**
 * start the game: generate an answer, and save the answer to db
 */
var start = function() {
  var game = generateGame();
  return insertNewGameToDB(game);
};

/**
 * generate four random color pegs
 */
var generateGame = function(){
  var game=[];
  for(var i=0; i<=3;i++){
    game.push(Math.floor(Math.random() * 3));
  }
  return game;
};

/**
 * insert a new game into DB
 */
var insertNewGameToDB = function(game){
  return db.get().collection('Games').insert({
    Answer:game,
    Guesses: [],
    Result: false
   }).then(function (inserted){
      var id = inserted["insertedIds"][0];
      return [game, id];
   }).catch(function(err){
      console.log("Models/game.js insertNewGameToDB function error: "+err);
   });
}

/**
 * user make a move, we validate the move, put this move into DB,
 * and return corresponding message
 */
var move = function(p1, p2, p3, p4, answer, attempt, id) {
  var move =[];
  move.push(parseInt(p1), parseInt(p2), parseInt(p3), parseInt(p4));
  var move_result = validateMove(move, JSON.parse(answer));
  findDocNInsertDB(id, move, move_result);
  return generateMoveMsg(move_result, attempt, move);
};

/**
 * check user's move, i.e. check how many they got correctly,
 * and how many they misplaced
 * input @param [], @param []
 */
var validateMove = function(move, answer){
  var correctNo =0;
  var not_matching_answer = [];
  var hash = {}; //hash record the answer peg that wasn't correctly guessed
                 //0 is not being recorded in the hash
  for(var i=0; i<answer.length;i++){
    //check for how many pegs are correct
    if(move[i] === answer[i]){
      correctNo++;
    }else{
      not_matching_answer.push(move[i]);
      if(answer[i] === 0){continue;}
      if (hash[answer[i]]==null){
        hash[answer[i]] = 1;
      }else{
        hash[answer[i]] += 1;
      }
    }
  }
  var misplacedNo = checkForMisplacement(hash, not_matching_answer);

  return {"correctNo":correctNo,
    "misplacedNo": misplacedNo};
};

/**
 *check for misplaced peg by comparing nont matching answer with the answer hashmap.
 *based on the description, it seems if a peg is 0, and has been displaced, is not
 *counted as misplaced. I'll based my count of mispalcement on this assumption
 *input @param obj, @param []
 */
var checkForMisplacement = function(hash, not_matching_move){
  var i=0, misplacementNo=0;
  for(var i=0; i<not_matching_move.length;i++){
    if (hash[not_matching_move[i]] != null){
      if(hash[not_matching_move[i]]>0){
        misplacementNo++;
        hash[not_matching_move[i]]--;
      }
    }
  }
  return misplacementNo;
}

/**
 * find the corresponding document in DB based on id, and insert guesses
 */
var findDocNInsertDB = function(id, move, move_result){
  var ObjectID = require('mongodb').ObjectID;
  var o_id = new ObjectID(id);
  db.get().collection('Games').findOne({"_id": o_id}).then(function(result) {
      result["Guesses"].push(move);
      return addGuessToDB(o_id, move_result, result);
  }).catch(function(err){
    console.log("Game.js move function error line 32 "+err);
  });
}

/**
 * insert guesses into a document
 */
var addGuessToDB = function(o_id, move_result, result){
  if(move_result["correctNo"]===4){
      db.get().collection('Games').update({"_id": o_id},
      {$set: {"Guesses": result["Guesses"], "Result":true}});
  }else{
    db.get().collection('Games').update({"_id": o_id},
      {$set: {"Guesses": result["Guesses"]}});
  }
}

/**
 * decide what message to print
 */
var generateMoveMsg = function(move_result, attempt, move){
  var msg = "";

  if(move_result["correctNo"] === 4){
    msg = "You Win!";
  }else if (attempt === 0){
    msg= "Game Over!";
  }else{
    msg = "Correct: "+move_result["correctNo"]+", Misplaced: "+
    move_result["misplacedNo"]+", Attempts left: "+attempt;
  }

  return "Guess "+JSON.stringify(move)+" "+msg;
}

/**
 * return all games' history
 */
var history = function() {
  return db.get().collection('Games').find().toArray().then(function(games){
    var msg="";
    games.forEach(function(game){
      msg+=generateGameHistoryStr(game);
    });
    return msg;
  }).catch(function(err){
    console.log("Game.js history function error line 42 "+err);
  });
};

/**
 * return a game's history into a string
 */
var generateGameHistoryStr = function(item){
  var game_str="The game's answer is "+item["Answer"]+". <br /> Your guesses are <br />";
  for(var i=0; i<item["Guesses"].length;i++){
    game_str+=item["Guesses"][i]+" <br />";
  }

  if(item["Result"] == true){
    game_str+="You won this game.<br /><br />";
  }else{
    game_str+="You lost this game.<br /><br />";
  }
  return game_str;
}

module.exports = {
  start:start,
  move: move,
  history: history,
  generateGame: generateGame,
  validateMove: validateMove,
  insertNewGameToDB: insertNewGameToDB,
  checkForMisplacement:checkForMisplacement
};
