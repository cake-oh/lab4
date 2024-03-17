//// lab 3 ////
//// point data - state capital geojson ////

// following code from https://leafletjs.com/examples/quick-start/
var map31 = L.map('mappy1_lab3').setView([45, -105], 3); // leaflet; make a map object called map; add it to the DOM object where mappy is

L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
}).addTo(map31); // add that tile layer to the map object

// this fetches the local geojson data
fetch('/data/map_points.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, 
            {
            pointToLayer: function(feature, latlng) {
                var capitalName = feature.properties.name;
                var stateName = feature.properties.state;
                var capitalPop = feature.properties.pop2024;
                var markerSize = capitalPop*.000008; // Adjust multiplier as needed
                return L.circleMarker(latlng, {
                    radius: markerSize,
                    fillColor: "#ff7800",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).bindPopup(capitalName + ", " + stateName + "<br>Population: " + numberWithCommas(capitalPop));
            }
        })
        .addTo(map31);
    })
    .catch(error => console.error('Error: ', error));



//// choropleth data - state capital geojson ////
var map32 = L.map('mappy2_lab3').setView([45, -105], 3); // leaflet; make a map object called map; add it to the DOM object where mappy is

L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
}).addTo(map32); // add that tile layer to the map object

fetch('/data/map_choro.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            // color each state based on water-land ratio values
            style: function(feature) {
                var awater = feature.properties.AWATER;
                var aland = feature.properties.ALAND;
                var ratio = awater / aland;
                var colors = ["#ffffcc", "#a1dab4", "#41b6c4", "#225ea8"];

                // establish bins
                if (ratio <= 0.02) {
                    color = colors[0];
                } else if (ratio <= 0.10) {
                    color = colors[1];
                } else if (ratio <= 0.30) {
                    color = colors[2];
                } else {
                    color = colors[3];
                }

                // set aesthetics
                return {
                    fillColor: color,
                    weight: 2,
                    opacity: 1,
                    color: 'grey',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            },
            // establish popup w/ ratio values
            onEachFeature: function(feature, layer) {
                var awater = feature.properties.AWATER;
                var aland = feature.properties.ALAND;
                var ratio = awater / aland;

                layer.bindPopup("Water-to-Land Ratio: " + ratio.toFixed(2));
                layer.on({
                    mouseover: function(e) {
                        layer.openPopup();
                    },
                    mouseout: function(e) {
                        layer.closePopup();
                    }
                });
            },
        }).addTo(map32);
        
        // add legend
        var legend = L.control({position: 'bottomright'}); // specify placement

        legend.onAdd = function(map) {
            var div = L.DomUtil.create('div', 'info legend');
            var grades = [0.02, 0.10, 0.30, 1];
            var labels = [];
            var colors = ["#ffffcc", "#a1dab4", "#41b6c4", "#225ea8"]; // create colors (same as above)
            // var legendContent = '<div style="background-color: white; padding: 10px;">'; // create legend background

            // loop through ratio intervals to make a colored square
            for (var i = 0; i < grades.length; i++) {
                var label = "";
                if (i === 0) { // if 0, add first ratio bin <= 0.02
                    label = "&le; " + grades[i];
                } else {
                    label = "&gt; " + grades[i - 1] + " and &le; " + grades[i]; // if not, add respective ratio bin between previous and next
                }
                
                div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                label + '<br>';
        }
    
        return div;
    };
    legend.addTo(map32);

    })
    .catch(error => console.error('Error: ', error));



    
//// establish functions ////
/// number formatting
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
