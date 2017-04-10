//test game objects
var request = require("request");
var base_url = "http://localhost:3000/game";
describe("Game", function() {
  // describe("GET / game", function() {
  //   it("returns status code 200", function() {
  //     request.get(base_url, function(error, response, body) {
  //       expect(response.statusCode).toBe(200);
  //       done();
  //     });
  //   });
  //
  //   it("returns Hello World", function(done) {
  //     request.get(base_url, function(error, response, body) {
  //       console.log("line 15 body is "+body);
  //       // expect(body).toBe("Hello World");
  //       // done();
  //     });
  // });
  //
  // describe("GET / game history", function() {
  //   it("returns status code 200", function() {
  //     request.get(base_url+"/history", function(error, response, body) {
  //       expect(response.statusCode).toBe(200);
  //       done();
  //     });
  //   });
  //
  //   it("returns Hello World", function(done) {
  //     request.get(base_url, function(error, response, body) {
  //       console.log("line 15 body is "+body);
  //       // expect(body).toBe("Hello World");
  //       // done();
  //     });
  // });

    it("is generating a board", function(next) {
        var Game = require('../models/game');
        expect(Game.generateGame().length).toBe(4);
        next();
    });

    // it("is inserting a new game into db", function(next) {
    //     var Game = require('../models/game');
    //     Game.start().then(function(response){
    //       expect(response[0].length).toBe(4);
    //       next();
    //     });
    // });

    it("is finding the number of misplaced pegs", function(next) {
        var Game = require('../models/game');
        expect(Game.checkForMisplacement({1:1, 2:1}, [1])).toBe(1);
        next();
    });

    it("is finding the number of misplaced pegs when same element appear multiple times", function(next) {
        var Game = require('../models/game');
        expect(Game.checkForMisplacement({1:1, 2:1}, [1,1])).toBe(1);
        next();
    });

    it("is finding number of pegs that are being placed correctly", function(next) {
        var Game = require('../models/game');
        expect(JSON.stringify(Game.validateMove([0,0,0,0],[1,0,2,0]))).toBe(JSON.stringify({"correctNo": 2, "misplacedNo": 0}));
        next();
    });

    it("is finding the number of misplaced pegs when validate move", function(next) {
        var Game = require('../models/game');
        expect(JSON.stringify(Game.validateMove([0,1,1,0],[1,0,2,0]))).toBe(JSON.stringify({"correctNo": 1, "misplacedNo": 1}));
        next();
    });

    it("is finding correct and misplaced pegs test 3", function(next) {
        var Game = require('../models/game');
        expect(JSON.stringify(Game.validateMove([1,0,2,0],[1,0,2,0]))).toBe(JSON.stringify({ "correctNo" : 4, "misplacedNo" : 0 }));
        next();
    });

    it("is finding correct and misplaced pegs test 4", function(next) {
        var Game = require('../models/game');
        expect(JSON.stringify(Game.validateMove([1,2,2,0],[1,0,2,0]))).toBe(JSON.stringify({ "correctNo": 3, "misplacedNo": 0}));
        next();
    });

    it("is finding correct and misplaced pegs test 5", function(next) {
        var Game = require('../models/game');
        expect(JSON.stringify(Game.validateMove([0,2,2,1],[1,0,2,0]))).toBe(JSON.stringify({ "correctNo": 1, "misplacedNo": 1}));
        next();
    });

    it("is finding correct and misplaced pegs test 6", function(next) {
        var Game = require('../models/game');
        expect(JSON.stringify(Game.validateMove([1,0,1],[0,1,2]))).toBe(JSON.stringify({ "correctNo": 0, "misplacedNo": 1}));
        next();
    });
});
