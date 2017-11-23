/* onclick scroll animation */
$('a.page-scroll[href^="#"]').on('click', function (event) {
	var href = $(this).attr('href');
	var target = $(this.getAttribute('href'));
	var speed = $(this).data('scroll-speed');
	if (false === $.isNumeric(speed)) {
		speed = 600;
	}
	if (target.length) {
		event.preventDefault();
		if ($('.navbar-collapse.collapse.in').length > 0) {
			$('.navbar-toggle').trigger('click');
		}
		$('.nav li').removeClass('active');
		$('.nav li a[href="' + href + '"]').parent('li').addClass('active');
		var offset = parseInt($('#navbar').height()) + parseInt($(target).css('margin-top'));
		$('html, body').stop().animate({
			scrollTop: (target.offset().top - offset)
		}, speed);
	}
});

/* scroll */
$(document).on("scroll", function () {
	var scroll = $(document).scrollTop();

	$('section').each(function (index, element) {
		var id = $(this).attr('id');
		var offset = (parseInt($('#navbar').height()) + parseInt($(this).css('margin-top')) + parseInt($(this).css('padding-top')));
		var top = parseInt($(this).offset().top);
		var bottom = top + parseInt($(this).height());
		if (scroll >= (top - offset) && scroll < bottom && $(this).is(':visible')) {
			$('.nav li').removeClass('active');
			$('.nav li a[href="#' + id + '"]').parent('li').addClass('active');
		}
	});
});
