
(function ($) {
    "use strict";
	
jQuery(document).ready(function($){
	
	
/** Plugin For Preloader **/
$(window).on('load', function() {
		$(document).ready(function(){
		$('html').animate({scrollTop:0}, 1);
		$('body').animate({scrollTop:0}, 1);
		});
        var preloaderDelay = 850,
            preloaderFadeOutTime = 800;
        function hidePreloader() {
        var loadingAnimation = $('.loader'),
            preloader = $('.preloader');
            loadingAnimation.fadeOut();
            preloader.delay(preloaderDelay).fadeOut(preloaderFadeOutTime);
        }

        hidePreloader();
});


/** Plugin for Smooth Scrolling **/
$('.section-link').on('click', function(event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top - 0
            }, 1000);
            event.preventDefault();
});


/** Plugin for Navbar Scrolling **/
$(window).scroll(function() {
    if($(this).scrollTop() >= 100) {
        $('body').addClass('nav-scroll');
    } else {
        $('body').removeClass('nav-scroll');
    }
});


/** Plugin for Typed Text in Jumbotron **/
$(function(){
	$(".typed").typed({
		strings: ["Your Favorite Concert.", "Your Favorite Places To Eat.", "Plan Ahead."],
		stringsElement: null,
		// typing speed
		typeSpeed: 30,
		// time before typing starts
		startDelay: 1200,
		// backspacing speed
		backSpeed: 20,
		// time before backspacing
		backDelay: 500,
		// loop
		loop: true,
		// false = infinite
		loopCount: 5,
		// show cursor
		showCursor: false,
		// character for cursor
		cursorChar: "|",
		// attribute to type (null == text)
		attr: null,
		// either html or text
		contentType: 'html',
		// call when done callback function
		callback: function() {},
		// starting callback function before each string
		preStringTyped: function() {},
		//callback for every typed string
		onStringTyped: function() {},
		// callback for reset
		resetCallback: function() {}
	});
});
  
 
/** 07.Plugin For Scrolling To The Top **/
$('.scrollToTop').on('click', function(){
		$('html, body').animate({scrollTop : 0},1000);
		return false;
});


/** 9.Plugin For Wow Animation **/
	new WOW().init();
	
    });
})(jQuery);