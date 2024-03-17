//// lab 3 ////
//// point data - state capital geojson ////

// following code from https://leafletjs.com/examples/quick-start/
var map41 = L.map('mappy1_lab4').setView([47, -115], 3); // leaflet; make a map object called map; add it to the DOM object where mappy is
mapbox://styles/
L.tileLayer('https://api.mapbox.com/styles/v1/nomurak/cltw57mts01f701r57tp16jyn/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoibm9tdXJhayIsImEiOiJjbHNqOXJxaTkxbWl1MmtwcXpzbDRlMHR0In0.Rwo3u1FWmzmQKsDy8ztz8w', {
	minZoom: 0,
	maxZoom: 20
}).addTo(map41); // add that tile layer to the map object

// this fetches the local geojson data
fetch('/data/Principal_Ports.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                var portName = feature.properties.PORT_NAME;
                var markerSize = feature.properties.TOTAL * 0.00000005; 
                markerSize = Math.max(markerSize, 2); // set minimum size         

                var marker = L.circleMarker(latlng, {
                    radius: markerSize,
                    fillColor: "orange",
                    color: "black",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
                // make popup
                marker.bindPopup(portName);
                // make mouseover event
                marker.on('mouseover', function(e) {
                    this.openPopup();
                });
                marker.on('mouseout', function(e) {
                    this.closePopup();
                });

                return marker;
            }
        })
        .addTo(map41);
    })
    .catch(error => console.error('Error: ', error));


