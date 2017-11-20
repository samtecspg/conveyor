$(document).ready(function(){

  var nav_h = $( 'header .nav-links' ).height();
  var $nav_height = $('header div nav');

  $(window).on('resize',function() {
    var win = $(this);
    if (win.width() <= 599 ) {
      nav_h = $( 'header .nav-links' ).height();
    } 

  });

  $('#nav-icon').click(function(){
    $(this).toggleClass('open');

    if ( $(this).hasClass('open') ) {
      $('header div nav').css('height', nav_h);
    } else {
      $nav_height.css('height', '');
    }

  });

});
