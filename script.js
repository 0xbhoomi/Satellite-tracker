/*
    Satellite Tracker Script
    This file handles fetching data and updating the map.
*/

// 1. Initialize the Map
// We start looking at position [0, 0] with a zoom level of 2 (whole world)
const myMap = L.map('map').setView([0, 0], 2);

// 2. Add the map tiles (the actual map images)
// We use OpenStreetMap contributors' tiles which are free
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// 3. Create a custom icon for the ISS
const issIcon = L.icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg', // Wikimedia public domain image
    iconSize: [50, 32],     // Size of the icon
    iconAnchor: [25, 16],   // Point of the icon which will correspond to marker's location (center)
});

// 4. Create the marker and add it to the map
// We start it at [0, 0] but it will move instantly when data loads
const marker = L.marker([0, 0], { icon: issIcon }).addTo(myMap);

// The API URL to get ISS data
const api_url = 'https://api.wheretheiss.at/v1/satellites/25544';

// 5. Function to fetch data and update everything
async function getISS() {
    try {
        // Fetch the data from the API
        const response = await fetch(api_url);
        const data = await response.json();

        // Extract the pieces of data we need
        const { latitude, longitude, altitude, velocity } = data;

        // Update the marker position on the map
        marker.setLatLng([latitude, longitude]);

        // Sometimes it's nice to center the map on the ISS, 
        // but for a tracker it might be better to let the user pan around.
        // Uncomment the next line if you want the map to follow the ISS automatically:
        // myMap.setView([latitude, longitude], myMap.getZoom());

        // Update the text on our dashboard
        // .toFixed(2) keeps just 2 decimal places so numbers aren't too long
        document.getElementById('lat').textContent = latitude.toFixed(2);
        document.getElementById('long').textContent = longitude.toFixed(2);
        document.getElementById('alt').textContent = altitude.toFixed(2);
        document.getElementById('speed').textContent = velocity.toFixed(2);

    } catch (error) {
        console.error('Error fetching ISS data:', error);
        // Simple error handling for learning purposes
        document.getElementById('lat').textContent = 'Error';
    }
}

// 6. Run the function once immediately when the page loads
getISS();

// 7. Run the function again every 5000 milliseconds (5 seconds)
setInterval(getISS, 5000);
