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
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition, showError);
	} else {
		alert("Geolocation is not supported by this browser.");
	}
}

function showPosition(position) {
	const latitude = position.coords.latitude;
	const longitude = position.coords.longitude;
	getCityState(latitude, longitude);
}

function getCityState(lat, lon) {
	var requestOptions = {
		method: 'GET',
	};

	fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=166e6d085f744211a848c9201247c471`, requestOptions)
		.then(response => response.json())
		.then(result => {
			if (result.features && result.features.length > 0) {
				const address = result.features[0].properties;
				const city = address.city || address.town || address.village;
				const state = address.state;
				updateLocation( state);
			} else {
				console.log('No results found');
			}
		})
		.catch(error => console.log('Error:', error));
}

function updateLocation(city, state) {
	document.getElementById('location').innerHTML = `${city}`;
}

function showError(error) {
	switch(error.code) {
		case error.PERMISSION_DENIED:
			alert("User denied the request for Geolocation.");
			break;
		case error.POSITION_UNAVAILABLE:
			alert("Location information is unavailable.");
			break;
		case error.TIMEOUT:
			alert("The request to get user location timed out.");
			break;
		case error.UNKNOWN_ERROR:
			alert("An unknown error occurred.");
			break;
	}
}

// Call getLocation to start the process
getLocation();
document.addEventListener('DOMContentLoaded', function () {
    const weatherApiKey = 'c22109f9a9c43b3bf6aed69688189ec6';

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(fetchWeatherData, showError);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    function fetchWeatherData(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherApiKey}`)
            .then(response => response.json())
            .then(data => {
                const weeklyData = processWeeklyWeatherData(data);
                displayWeeklyWeatherChart(weeklyData);
            })
            .catch(error => console.error('Error fetching weather data:', error));
    }

    function processWeeklyWeatherData(data) {
        const dailyData = {};

        data.list.forEach(entry => {
            const date = new Date(entry.dt * 1000);
            const day = date.toLocaleDateString('en-US', { weekday: 'long' });
            
            if (!dailyData[day]) {
                dailyData[day] = {
                    temperatureSum: 0,
                    temperatureCount: 0,
                    humiditySum: 0,
                    windSpeedSum: 0,
                    windSpeedCount: 0,
                    entries: 0
                };
            }

            dailyData[day].temperatureSum += entry.main.temp;
            dailyData[day].temperatureCount++;
            dailyData[day].humiditySum += entry.main.humidity;
            dailyData[day].windSpeedSum += entry.wind.speed;
            dailyData[day].windSpeedCount++;
            dailyData[day].entries++;
        });

        return Object.keys(dailyData).map(day => ({
            day: day,
            avgTemp: (dailyData[day].temperatureSum / dailyData[day].temperatureCount).toFixed(2),
            avgHumidity: (dailyData[day].humiditySum / dailyData[day].entries).toFixed(2),
            avgWindSpeed: (dailyData[day].windSpeedSum / dailyData[day].windSpeedCount).toFixed(2)
        }));
    }

    function displayWeeklyWeatherChart(weeklyData) {
        const ctx = document.getElementById('weeklyWeatherChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: weeklyData.map(data => data.day),
                datasets: [
                    {
                        label: 'Avg Temperature (°C)',
                        data: weeklyData.map(data => data.avgTemp),
                        borderColor: 'rgba(255, 99, 132, 1)',
                        fill: false,
                        borderWidth: 2
                    },
                    {
                        label: 'Avg Humidity (%)',
                        data: weeklyData.map(data => data.avgHumidity),
                        borderColor: 'rgba(54, 162, 235, 1)',
                        fill: false,
                        borderWidth: 2
                    },
                    {
                        label: 'Avg Wind Speed (m/s)',
                        data: weeklyData.map(data => data.avgWindSpeed),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        fill: false,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
        }
    }

    // Start the process
    getLocation();
});
document.addEventListener('DOMContentLoaded', function () {
    const weatherApiKey = 'c22109f9a9c43b3bf6aed69688189ec6';

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(fetchWeatherData, showError);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    function fetchWeatherData(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherApiKey}`)
            .then(response => response.json())
            .then(data => {
                const weatherData = processWeatherData(data);
                displayWeatherChart(weatherData);
            })
            .catch(error => console.error('Error fetching weather data:', error));
    }

    function processWeatherData(data) {
        return {
            temperature: data.main.temp, // Current temperature in Celsius
            humidity: data.main.humidity, // Humidity percentage
            windSpeed: data.wind.speed // Wind speed in meters/sec
        };
    }

    function displayWeatherChart(weatherData) {
        const ctx = document.getElementById('weatherChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Temperature (°C)', 'Humidity (%)', 'Wind Speed (m/s)'],
                datasets: [{
                    label: 'Current Weather Data',
                    data: [weatherData.temperature, weatherData.humidity, weatherData.windSpeed],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
        }
    }

    // Start the process
    getLocation();
});

