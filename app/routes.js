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

            $('#search_results_table tbody tr').each(function() {

              var restaurant = $(this),
                  name,
                  url,
                  content,
                  neighborhood,
                  cuisine,
                  reviewCount,
                  slots,
                  slotsArray,
                  peakStart,
                  peakEnd,
                  startTime,
                  endTime,
                  timeWindow;

              var parseTime = function(s) {
                 var c = s.split(':');
                 return parseInt(c[0]) * 60 + parseInt(c[1]);
              }

              name = restaurant.find('.rest-content a').text();
              url = 'http://www.opentable.com' + restaurant.find('.rest-content a').attr('href');

              content = restaurant.find('.rest-content div').text().split('|');
              neighborhood = content[0].trim();
              cuisine = content[1].trim();

              reviewCount = restaurant.find('.reviews').text().trim();

              slotsArray = [];
              slots = restaurant.find('.timeslots li');
              slots.each(function() {
                var slot = $(this);
                if (slot.find('a').length > 0) {
                  slotsArray.push(slot.find('a').attr('href').split('&sd=')[1].split(' ')[1].substring(0,5));
                } else {
                  slotsArray.push('unavailable');
                }
              })

              peakStart = '16:59';
              peakEnd = '22:01';
              timeWindow = 0;
              startTime = peakStart;
              slotsArray.forEach(function(slot, index) {

                if (index !== 4) {
                  if (slot !== 'unavailable') {
                    if (slotsArray[index - 1] == 'unavailable') {
                      timeWindow = timeWindow + (parseTime(slot) - parseTime(startTime));
                    }
                    startTime = slot;
                  }
                } else if (index == 4) {
                  if (slot == 'unavailable') {
                    timeWindow = timeWindow + (parseTime(peakEnd) - parseTime(startTime));
                  }
                }

              })

              json[name] = {};
              json[name]['name'] = name;
              json[name]['url'] = url;
              json[name]['neighborhood'] = neighborhood;
              json[name]['cuisine'] = cuisine;
              json[name]['reviewCount'] = reviewCount;
              json[name]['slots'] = slotsArray;
              json[name]['timeWindow'] = timeWindow;

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
