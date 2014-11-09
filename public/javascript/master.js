// Normally we would create modules to match our component structure, but in the interest of time / simplicity...
$(document).ready(function() {
  
  var now = moment();

  $('#datetimepicker1').datetimepicker({
      defaultDate: "11/14/2014 7:30 PM",
      minDate: now,
      minuteStepping: 30
  });

  $('.btn-scrape').on('click', function() {
    $('.btn-text').hide();
    $('.spinner').show();
  })

});
