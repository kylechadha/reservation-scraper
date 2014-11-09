//
// Master JavaScript File
// -----------------------------------

// Normally we would create modules to match our component structure, but in the interest of time / simplicity we haven't here.
$(document).ready(function() {
  
  var now = moment();

  // Config the date and time picker.
  $('#datetimepicker1').datetimepicker({
      defaultDate: "11/14/2014 7:30 PM",
      minDate: now,
      minuteStepping: 30
  });

  // Set the CSS3 spinner to run on button click.
  $('.btn-scrape').on('click', function() {
    $('.btn-text').hide();
    $('.spinner').show();
  })

});
