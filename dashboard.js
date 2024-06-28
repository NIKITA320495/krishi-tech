document.addEventListener('DOMContentLoaded', function() {
    var ctx1 = document.getElementById('chart1').getContext('2d');
    var ctx2 = document.getElementById('chart2').getContext('2d');

    var chart1 = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: ['', '', '', '', '', '', ''],
            datasets: [{
                data: [0, 2, 4, 6, 8, 10, 14],
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
            }]
        },
        options: {
            responsive: true,
            legend: {
                display: false
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            }
        }
    });

    var chart2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: ['', '', '', '', '', '', ''],
            datasets: [{
                data: [0, -1, 1, 3, 5, 7, 14],
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false
            }]
        },
        options: {
            responsive: true,
            legend: {
                display: false
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            }
        }
    });
});
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
