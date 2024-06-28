/*
	Transitive by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/

(function($) {

	skel.breakpoints({
		xlarge:	'(max-width: 1680px)',
		large:	'(max-width: 1280px)',
		medium:	'(max-width: 980px)',
		small:	'(max-width: 736px)',
		xsmall:	'(max-width: 480px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$header = $('#header'),
			$banner = $('#banner');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Header.
			if (skel.vars.IEVersion < 9)
				$header.removeClass('alt');

			if ($banner.length > 0
			&&	$header.hasClass('alt')) {

				$window.on('resize', function() { $window.trigger('scroll'); });

				$banner.scrollex({
					bottom:		$header.outerHeight(),
					terminate:	function() { $header.removeClass('alt'); },
					enter:		function() { $header.addClass('alt'); },
					leave:		function() { $header.removeClass('alt'); $header.addClass('reveal'); }
				});

			}

		// Banner.

			if ($banner.length > 0) {

				// IE fix.
					if (skel.vars.IEVersion < 12) {

						$window.on('resize', function() {

							var wh = $window.height() * 0.60,
								bh = $banner.height();

							$banner.css('height', 'auto');

							window.setTimeout(function() {

								if (bh < wh)
									$banner.css('height', wh + 'px');

							}, 0);

						});

						$window.on('load', function() {
							$window.triggerHandler('resize');
						});

					}

				// Video check.
					var video = $banner.data('video');

					if (video)
						$window.on('load.banner', function() {

							// Disable banner load event (so it doesn't fire again).
								$window.off('load.banner');

							// Append video if supported.
								if (!skel.vars.mobile
								&&	!skel.breakpoint('large').active
								&&	skel.vars.IEVersion > 9)
									$banner.append('<video autoplay loop><source src="' + video + '.mp4" type="video/mp4" /><source src="' + video + '.webm" type="video/webm" /></video>');

						});

				// More button.
					$banner.find('.more')
						.addClass('scrolly');

			}

		// Scrolly.
			if ( $( ".scrolly" ).length ) {

				var $height = $('#header').height() * 0.95;

				$('.scrolly').scrolly({
					offset: $height
				});
			}

		// Menu.
			$('#menu')
				.append('<a href="#menu" class="close"></a>')
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right'
				});

	});

})(jQuery);

document.addEventListener('DOMContentLoaded', function() {
	const track = document.querySelector('.carousel-track');
	const slides = Array.from(track.children);
	const nextButton = document.querySelector('.carousel-button.right');
	const prevButton = document.querySelector('.carousel-button.left');
	const slideWidth = slides[0].getBoundingClientRect().width;

	// Arrange the slides next to one another
	const setSlidePosition = (slide, index) => {
		slide.style.left = slideWidth * index + 'px';
	};
	slides.forEach(setSlidePosition);

	const moveToSlide = (track, currentSlide, targetSlide) => {
		track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
		currentSlide.classList.remove('current-slide');
		targetSlide.classList.add('current-slide');
	};

	const updateButtons = (slides, prevButton, nextButton, targetIndex) => {
		if (targetIndex === 0) {
			prevButton.classList.add('is-hidden');
			nextButton.classList.remove('is-hidden');
		} else if (targetIndex === slides.length - 1) {
			prevButton.classList.remove('is-hidden');
			nextButton.classList.add('is-hidden');
		} else {
			prevButton.classList.remove('is-hidden');
			nextButton.classList.remove('is-hidden');
		}
	};

	prevButton.addEventListener('click', e => {
		const currentSlide = track.querySelector('.current-slide');
		const prevSlide = currentSlide.previousElementSibling;
		const prevIndex = slides.findIndex(slide => slide === prevSlide);

		moveToSlide(track, currentSlide, prevSlide);
		updateButtons(slides, prevButton, nextButton, prevIndex);
	});

	nextButton.addEventListener('click', e => {
		const currentSlide = track.querySelector('.current-slide');
		const nextSlide = currentSlide.nextElementSibling;
		const nextIndex = slides.findIndex(slide => slide === nextSlide);

		moveToSlide(track, currentSlide, nextSlide);
		updateButtons(slides, prevButton, nextButton, nextIndex);
	});

	// Automatic slide change every 5 seconds
	let autoSlideIndex = 0;
	setInterval(() => {
		autoSlideIndex = (autoSlideIndex + 2) % slides.length;
		const currentSlide = track.querySelector('.current-slide');
		const nextSlide = slides[autoSlideIndex];
		moveToSlide(track, currentSlide, nextSlide);
		updateButtons(slides, prevButton, nextButton, autoSlideIndex);
	}, 5000);
});

