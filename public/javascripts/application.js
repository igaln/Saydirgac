$(document).ready(function(){
  $('img.tutanak')
    .wrap('<span style="display:inline-block;"></span>')
    .css('display', 'block')
    .parent()
    .zoom({
      magnify:1.5,
      touch:false,
    });
});

$(function(){
  $("#evidence-table").tablesorter({
    sortList: [[1,0], [2,0], [3,0]] 
  });
});

$('.tutanak-popover').popover({html: 'true' });