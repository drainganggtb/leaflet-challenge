var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//perform GET request to query url
d3.json(queryUrl, function(data) {
    //once we get a response, send data to data.features object to createFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    //define a function we want to run once for each feature in the features array 
    // give each feature a popup
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.title + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        
    }
    
    //create the GeoJSON layer containing features array on the earthquakeData object 
    //Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });
    console.log(earthquakeData);
    //send earthquakes layer to createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {
    //define basemaps
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "outdoors/v-11",
        accessToken: API_KEY
    });
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
        id: "dark-v10",
        accessToken: API_KEY
    });
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite-streets-v11",
        accessToken: API_KEY
    });

    //define basemaps object to hold layers
    var baseMaps = {
        "Outdoors": outdoors,
        "Dark Map": darkmap,
        "Satellite": satellite
    };

    //create overlay object to hold overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    
    
    };
    var myMap = L.map("mapid", {
        center: [19.741755, -155.844437],
        zoom: 5,
        layers: [satellite, earthquakes]
    });

    //layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

}