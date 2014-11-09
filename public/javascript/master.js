// Normally we would create modules to match our component structure
$(document).ready(function() {
  
  $('#datetimepicker1').datetimepicker({
      defaultDate: "11/14/2014 7:30 PM",
      minuteStepping: 30
  });

  $('.btn-scrape').on('click', function() {
    $('.btn-text').hide();
    $('.spinner').show();
  })

});
