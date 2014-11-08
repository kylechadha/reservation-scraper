var User = require('./models/user');

module.exports = function(app, passport) {

  // Index Route
  // ----------------------------------------------
  app.get('/', function(req, res) {
    res.render('layout', { message: req.flash('userMessage') });
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
