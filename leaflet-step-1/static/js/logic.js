// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//colorbrewer colors to be used in getColor function
// ['#ffffb2','#fed976','#feb24c','#fd8d3c','#f03b20','#bd0026']

//function to determine color of markers
function getColor(d) {
    if (d < 1) {
        color = '#ffffb2';
    } else if (d <2) {
        color= '#fed976';
    } else if (d <3) {
        color= '#feb24c';
    } else if (d <4) {
        color= '#fd8d3c';
    } else if (d <5) {
        color= '#f03b20';
    } else {
        color= '#bd0026';
    }
    return color
}

//function based on depth (m) to get radius of markers(pixels)
function getRadius(d) {
    return 15000 * d;
}


// Perform a GET request to the query URL
d3.json(queryUrl, function(earthquakeData) {
    createFeatures(earthquakeData.features);
});

function createFeatures(earthquakeData) {

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, latlng) {

            var color = getColor(feature.properties.mag);

            //add circles
            return L.circle(latlng, {
                weight: 1,
                color: color,
                fillColor: color,
                opacity: 0.75,
                radius: getRadius(feature.geometry.coordinates[2])
            }).bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        }
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }
  

function createMap(earthquakes) {

  // Define basemap layers and call for tile layers
  var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });
  var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light": light,
    "Dark": dark
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [light, dark, earthquakes]
  });
  
 

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

