// Handles the map, markers, and calculating distances

var map;

var guessLat;
var guessLng;

var trueMarker;
var guessMarker;

var line;

// Initialization function for the map
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 37.0902, lng: -95.7129 }, // Center of the U.S
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        zoom: 4
    });

    const markerSvg = {
        path: "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z",
        fillColor: "#f44336",
        fillOpacity: 1.0,
        strokeColor: "#ba000d",
        strokeOpacity: 1.0,
        strokeWeight: 1.0,
        rotation: 0,
        scale: 1.5,
        anchor: new google.maps.Point(12, 23),
    };

    const houseSvg = {
        path: "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z",
        fillColor: "#f44336",
        fillOpacity: 1.0,
        strokeColor: "#ba000d",
        strokeOpacity: 1.0,
        strokeWeight: 1.0,
        rotation: 0,
        scale: 1.5,
        anchor: new google.maps.Point(12, 12),
    };

    guessMarker = new google.maps.Marker({
        position: { lat: 0, lng: 0 },
        icon: markerSvg
    });

    trueMarker = new google.maps.Marker({
        position: { lat: 0, lng: 0 },
        icon: houseSvg
    });

    google.maps.event.addListener(map, 'click', function (e) {
        clickMap(e.latLng);
    });
}

// Removes all markers and lines from the map + re-centers it
function resetMap() {
    guessMarker.setMap(null);
    trueMarker.setMap(null);
    line.setMap(null);

    map.panTo({ lat: 37.0902, lng: -95.7129 });
    map.setZoom(4);
}

// Called whenever the user places a guess
function placeGuessMarker(latlng) {
    guessMarker.setPosition(latlng);

    // Keep track of the position
    guessLat = latlng.lat();
    guessLng = latlng.lng();

    guessMarker.setMap(map);
}

// Called when the "Guess" button is pressed
function makeGuess() {
    // Make trueMarker visible
    trueMarker.setPosition({ "lat": trueLat, "lng": trueLng })
    trueMarker.setMap(map)

    const path = [
        { "lat": guessLat, "lng": guessLng },
        { "lat": trueLat, "lng": trueLng }
    ]

    // Draw line
    line = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: "#212121",
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });
    line.setMap(map);

    // Pan / Zoom to Guess
    bounds = new google.maps.LatLngBounds();
    bounds.extend(path[0]);
    bounds.extend(path[1]);

    map.fitBounds(bounds);

    // Zoom out a bit
    map.setZoom(map.getZoom() - 1);

    // Return distance in miles
    return google.maps.geometry.spherical.computeLength(line.getPath().getArray()) * 0.000621371;
}