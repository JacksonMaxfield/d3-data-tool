$(document).ready(function() {
	$('a[href^="#"]').on('click',function (event) {
	    event.preventDefault();

	    var target = this.hash;
	    var $target = $(target);

			$('html, body').stop().animate( {
					'scrollTop': $target.offset().top - 59
			}, 800, 'swing');
	});
});
