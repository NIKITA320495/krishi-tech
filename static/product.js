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
		if (prevSlide) {
			const prevIndex = slides.findIndex(slide => slide === prevSlide);
			moveToSlide(track, currentSlide, prevSlide);
			updateButtons(slides, prevButton, nextButton, prevIndex);
		}
	});

	nextButton.addEventListener('click', e => {
		const currentSlide = track.querySelector('.current-slide');
		const nextSlide = currentSlide.nextElementSibling;
		if (nextSlide) {
			const nextIndex = slides.findIndex(slide => slide === nextSlide);
			moveToSlide(track, currentSlide, nextSlide);
			updateButtons(slides, prevButton, nextButton, nextIndex);
		}
	});

	// Automatic slide change every 5 seconds
	let autoSlideIndex = 0;
	setInterval(() => {
		autoSlideIndex = (autoSlideIndex + 1) % slides.length;
		const currentSlide = track.querySelector('.current-slide');
		const nextSlide = slides[autoSlideIndex];
		moveToSlide(track, currentSlide, nextSlide);
		updateButtons(slides, prevButton, nextButton, autoSlideIndex);
	}, 5000);
});
