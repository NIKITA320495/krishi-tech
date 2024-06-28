document.addEventListener('DOMContentLoaded', function () {
    const popupContainer = document.getElementById('popup-container');
    const allowButton = document.getElementById('allow-button');
    const denyButton = document.getElementById('deny-button');
    const soilDataContainer = document.getElementById('weather-soil-data'); // Select the soil-data container

    let latitude, longitude;

    allowButton.addEventListener('click', function () {
        // Request the user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;
                    fetchWeatherAndPredict(); // Initial fetch with default values
                },
                function (error) {
                    console.error("Error Code = " + error.code + " - " + error.message);
                    alert("Location access denied.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }

        // Hide the popup
        popupContainer.style.display = 'none';
    });

    denyButton.addEventListener('click', function () {
        // Hide the popup
        popupContainer.style.display = 'none';
    });

    // Event listeners for soil type and crop type dropdowns
    document.getElementById('soil_type').addEventListener('change', fetchWeatherAndPredict);
    document.getElementById('crop_type').addEventListener('change', fetchWeatherAndPredict);

    function fetchWeatherAndPredict() {
        if (latitude && longitude) {
            // Fetch selected soil type and crop type
            const soilType = document.getElementById('soil_type').value;
            const cropType = document.getElementById('crop_type').value;

            // Send latitude, longitude, soil type, and crop type to Flask backend
            fetch('http://127.0.0.1:8000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ latitude, longitude, soil_type: soilType, crop_type: cropType }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Handle response from Flask backend
                    console.log('Received response from Flask backend:', data);

                    // Update UI with weather and soil data
                    document.getElementById('temperature').textContent = `Temperature: ${data.temperature}°C`;
                    document.getElementById('humidity').textContent = `Humidity: ${data.humidity}%`;
                    document.getElementById('moisture').textContent = `Rainfall: ${data.moisture}mm`;
                    document.getElementById('nitrogen').textContent = `Nitrogen: ${data.nitrogen}`;
                    document.getElementById('potassium').textContent = `Potassium: ${data.potassium}`;
                    document.getElementById('phosphorus').textContent = `Phosphorus: ${data.phosphorus}`;
                    document.getElementById('fertilizer').textContent = `Predicted Fertilizer: ${data.predicted_fertilizer}`;
                    soilDataContainer.style.visibility = 'visible';
                })
                .catch(error => {
                    console.error('Error sending location to Flask backend:', error);
                });
        }
    }
});
