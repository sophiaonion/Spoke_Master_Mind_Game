var express = require('express');
var router = express.Router();
var session = require('cookie-session');
var index = require('../controllers/index');

/* GET home page. */
router.get('/', index.getHomepage);

// /* GET set cookie */
// router.get('/cookie',function(req, res){
//      res.cookie(cookie_name , 'cookie_value',
//      {expire : new Date() + 9999}).send('Cookie is set');
// });
//
// /* GET delete cookie */
// router.get('/clearcookie', function(req,res){
//      clearCookie('cookie_name');
//      res.send('Cookie deleted');
// });

module.exports = router;
