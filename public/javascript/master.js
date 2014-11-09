$(document).ready(function() {
  $('#datetimepicker1').datetimepicker({
      defaultDate: "11/14/2014 7:00 PM",
      minuteStepping:30               //set the minute stepping
  });

  $('.btn-scrape').on('click', function() {
    $('.btn-text').hide();
    $('.spinner').show();
  })

});
