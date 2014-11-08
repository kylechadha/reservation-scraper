var Restaurant = require('./models/restaurant');

module.exports = function(app) {

  // Index Route
  // ----------------------------------------------
  app.get('/', function(req, res) {
    res.render('layout');
  });

  // Sign Up Route
  app.post('/', function(req, res, next) {

  });

  // Users Route
  // ----------------------------------------------
  app.get('/restaurants', function(req, res) {

    // User.find(function(err, users) {
    //   if (err) {
    //     res.send(err);
    //   }
    //   res.json(users);
    // });

  });

};
