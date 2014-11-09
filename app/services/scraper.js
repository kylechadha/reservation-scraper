var request    = require('request');
var cheerio    = require('cheerio');


//
// Scraper Service
// -----------------------------------

module.exports = function(queryUrl, json, csv, callback) {

  // Load the OpenTable url to be scraped.
  request(queryUrl, function(error, response, html) {

    if (!error) {

      console.log('URL Reached. Scraper running.');

      // Use Cheerio to load the page.
      var $ = cheerio.load(html);

      // Iterate through each restaurant on the page.
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

        // Scrape the restaurant Name and URL.
        name = restaurant.find('.rest-content a').text();
        url = 'http://www.opentable.com' + restaurant.find('.rest-content a').attr('href');

        // Scrape the Neighborhood and Cuisine Type.
        content = restaurant.find('.rest-content div').text().split('|');
        neighborhood = content[0].trim();
        cuisine = content[1].trim();

        // Scrape the Review Count.
        reviewCount = restaurant.find('.reviews').text().trim();

        // Pull the list of available time slots.
        slotsArray = [];
        slots = restaurant.find('.timeslots li');
        // Note: Now that we've added time as a user preference, we'll need to update peakStart and peakEnd dynamically
        peakStart = '16:59';
        peakEnd = '22:01';
        timeWindow = 0;

        if (slots.length > 0) {
          // If slots are available, push them into the slotsArray.
          slots.each(function() {
            var slot = $(this);
            if (slot.find('a').length > 0) {
              slotsArray.push(slot.find('a').attr('href').split('&sd=')[1].split(' ')[1].substring(0,5));
            } else {
              slotsArray.push('unavailable');
            }
          })

          // Iterate through the slotsArray and track unavailable times.
          startTime = peakStart;
          slotsArray.forEach(function(slot, index) {

            if (index !== 4) {
              if (slot !== 'unavailable') {
                if (slotsArray[index - 1] == 'unavailable') {
                  // Add gaps to timeWindow as they're found.
                  timeWindow = timeWindow + (parseTime(slot) - parseTime(startTime));
                }
                startTime = slot;
              }
            } else if (index == 4) {
              if (slot == 'unavailable') {
                // If the last slot is unavailable, calculate the gap from the last available time to peakEnd.
                timeWindow = timeWindow + (parseTime(peakEnd) - parseTime(startTime));
              }
            }

          })
        } else {
          // If no slots are available, simply calculate the time window based on the difference between peakStart and peakEnd.
          timeWindow = parseTime(peakEnd) - parseTime(peakStart);
        }

        // Convert the timeWindow to HH:mm.
        hours = Math.floor(timeWindow / 60);
        minutes = timeWindow %= 60;
        timeWindow = hours + ':' + ('0' + minutes).slice(-2);

        // Save the data in CSV format.
        csv['data'] = csv['data'] + '"' + name + '","' + url + '","' + neighborhood + '","' + cuisine + '","' + reviewCount + '",' + timeWindow + '\r\n';

        // Save the data in JSON format.
        json[name] = {};
        json[name]['name'] = name;
        json[name]['url'] = url;
        json[name]['neighborhood'] = neighborhood;
        json[name]['cuisine'] = cuisine;
        json[name]['reviewCount'] = reviewCount;
        json[name]['slots'] = slotsArray;
        json[name]['timeWindow'] = timeWindow;

      });

      // Let async know we're done.
      callback(null);

    }
    else {
      callback(error);
    }

  });

}
