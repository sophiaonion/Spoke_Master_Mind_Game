
var getHomepage= function(req, res, next) {
  res.render('index', { title: 'Master Mind Game', Game_Address:'../game', History_Address:'../game/history'});
};

module.exports = {
  getHomepage:getHomepage
}
