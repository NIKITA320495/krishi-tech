document.addEventListener('DOMContentLoaded', function() {
    const popupContainer = document.getElementById('popup-container');
    const allowButton = document.getElementById('allow-button');
    const denyButton = document.getElementById('deny-button');
    const soilDataContainer = document.querySelector('.soil-data'); // Select the soil-data container


    // Show the popup
    popupContainer.style.visibility = 'visible';

    allowButton.addEventListener('click', function() {
        // Request the user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    // Send latitude and longitude to Flask backend
                    fetch('http://127.0.0.1:5001/predict', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ latitude, longitude }),
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

                        // Example: Update UI with weather and soil data
                        document.getElementById('temperature').textContent = `Temperature: ${data.temperature}°C`;
                        document.getElementById('humidity').textContent = `Humidity: ${data.humidity}%`;
                        document.getElementById('rainfall').textContent = `Rainfall: ${data.rainfall}mm`;
                        document.getElementById('ph-value').textContent = `pH value: ${data.ph_value}`;
                        document.getElementById('nitrogen').textContent = `Nitrogen: ${data.nitrogen}`;
                        document.getElementById('phosphorus').textContent = `Phosphorus: ${data.phosphorous}`;
                        document.getElementById('potassium').textContent = `Potassium: ${data.potassium}`;
                        document.getElementById('crop').textContent = `Crop: ${data.predicted_crop}`;
                        soilDataContainer.style.visibility = 'visible';
                    })
                    .catch(error => {
                        console.error('Error sending location to Flask backend:', error);
                    });
                },
                function(error) {
                    console.error("Error Code = " + error.code + " - " + error.message);
                    alert("Location access denied.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }

        // Hide the popup
        popupContainer.style.visibility = 'hidden';
    });

    denyButton.addEventListener('click', function() {
        // Hide the popup
        popupContainer.style.visibility = 'hidden';
    });
});
