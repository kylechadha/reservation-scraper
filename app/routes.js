var async      = require("async");
var cheerio    = require('cheerio');
var Restaurant = require('./models/restaurant');


module.exports = function(app) {

  // Index Route
  // ----------------------------------------------
  app.get('/', function(req, res) {
    res.render('layout');
  });

  // Sign Up Route
  app.post('/', function(req, res, next) {

    var json = {},
        url = 'http://www.opentable.com/s/?datetime=2014-11-14%2019:30&covers=4&metroid=4&regionids=5&showmap=false&popularityalgorithm=NameSearches&tests=EnableMapview,ShowPopularitySortOption,srs,customfilters&sort=Popularity&excludefields=Description&from=0';

    request(url, function(error, response, html) {

      if (!error) {

        var $ = cheerio.load(html)

        $('.columns_block li').filter(function() {

        });


      }
      else {
        console.log(error);
      }

    });


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
