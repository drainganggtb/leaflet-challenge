// Store API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var tectonicURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

//colorbrewer colors to be used in getColor function
//['#fee5d9','#fcbba1','#fc9272','#fb6a4a','#de2d26','#a50f15']

//function to determine color of markers
function getColor(d) {
    if (d < 1) {
        color = '#fee5d9';
    } else if (d <2) {
        color= '#fcbba1';
    } else if (d <3) {
        color= '#fc9272';
    } else if (d <4) {
        color= '#fb6a4a';
    } else if (d <5) {
        color= '#de2d26';
    } else {
        color= '#a50f15';
    }
    return color
}

//function based on depth (m) to get radius of markers(pixels)
function getRadius(d) {
    return 1500 * d;
}


// Perform a GET request to the query URL
d3.json(queryUrl, function(earthquakeData) {
  //once we get response, query second source of data
  d3.json(tectonicURL, function(plateData) {
    console.log(plateData);

    createFeatures(earthquakeData.features, plateData.features);
  });
    
});

function createFeatures(earthquakeData, plateData) {
    //point to layer used to apply circles
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {

            var color = getColor(feature.properties.mag);

            //add circles
            return L.circle(latlng, {
                weight: 1,
                color: color,
                fillColor: color,
                opacity: 0.75,
                fillOpacity: .75,
                // radius is related to depth
                radius: getRadius(feature.geometry.coordinates[2])
            }).bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "<br>"+ "Magnitude: "  + feature.properties.mag + "</p>");
        }
    });

    //plate layer
    var plates = L.geoJSON(plateData, {
      style: function (feature) {
        return {
          color: '#f768a1',
          weight: 1
        };
      }
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes, plates);
  }
  

function createMap(earthquakes, plates) {

  // Define basemap layers and call for tile layers
  var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 80,
    id: "satellite-v9",
    accessToken: API_KEY
  });
  var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });
  var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite": satelliteMap,
    "Dark": dark,
    "Greyscale": light
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic Plate Boundaries": plates
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      -.777259, -91.142578
    ],
    zoom: 3,
    pitch: 60,
    layers: [satelliteMap, dark, light, plates, earthquakes]
  });
  
  //create legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd=function(map){
    var div = L.DomUtil.create('div', 'info legend');
    var labels=["Minor", "Light", "Moderate", "Strong", "Major", "Great"];
    var magnitudes = [0,1,2,3,4,5];
    div.innerHTML='<div><b>Earthquakes</b> <br> 1/21/2021-1/28/2021</div';
    for (var i = 0; i < magnitudes.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(magnitudes[i]) + '"></i> ' + labels[i] + '<br>';
    }
    return div;
  };
  legend.addTo(myMap);

 

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

