var fs      = require('fs');
var async      = require('async');
var request    = require('request');
var cheerio    = require('cheerio');
var Restaurant = require('./models/restaurant');


module.exports = function(app) {

  // Index Route
  // ----------------------------------------------
  app.get('/', function(req, res) {
    res.render('layout');
  });

  // Scraper Route
  app.post('/', function(req, res, next) {

    var json = {},
        url = 'http://www.opentable.com/s/?datetime=2014-11-14%2019:30&covers=4&metroid=4&regionids=5&showmap=false&popularityalgorithm=NameSearches&tests=EnableMapview,ShowPopularitySortOption,srs,customfilters&sort=Popularity&excludefields=Description&from=0';

    async.series([

      function(callback) {

        request(url, function(error, response, html) {

          if (!error) {

            console.log('URL Reached. Scraper running.');
            var $ = cheerio.load(html);

            $('#search_results_table tbody tr').each(function(key, value) {

              var restaurant = $(this),
                  restaurantName = restaurant.find('.rest-content a').text();

              json[restaurantName] = {};
              json[restaurantName]['name'] = restaurantName;

            });

            callback(null, 'one');

          }
          else {
            console.log(error);
          }

        });

      },

      function(callback) {
        callback(null, 'two')
      }


    ], function() {
      
      fs.writeFile('resturants.json', JSON.stringify(json, null, 4), function(err) {
        console.log('File successfully written.')
      });

      res.send('Scraping Complete.');

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
