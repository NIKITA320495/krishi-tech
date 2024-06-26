document.addEventListener('DOMContentLoaded', function() {
    const popupContainer = document.getElementById('popup-container');
    const allowButton = document.getElementById('allow-button');
    const denyButton = document.getElementById('deny-button');

    // Show the popup
    popupContainer.style.visibility = 'visible';

    allowButton.addEventListener('click', function() {
        // Request the user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    console.log("Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude);
                    alert("Location access granted. Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude);
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
