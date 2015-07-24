// setup my map
L.mapbox.accessToken = 'pk.eyJ1IjoiamVmZnN0ZXJuIiwiYSI6IlAzRFFiN0EifQ.mNWvayrLEw9wULuq0sopyA';
var map = L.mapbox.map('map', 'mapbox.streets');

// initialize the layer and json objects
var myLayer = L.mapbox.featureLayer().addTo(map);
var geojson;
var origjson;

// pull data from the spreadsheet and convert to json objects
$(document).ready(function(){
    var URL = "https://docs.google.com/spreadsheets/d/1OjKaKeiDDj0Qh4tHXHo7PhwmtJhiF4eLCkfStkZ6f6w/pubhtml";
    Tabletop.init( { key: URL, callback: convertToGeoJSON, simpleSheet: true } );
});

// convert json objects to geojson objects
function convertToGeoJSON(data) {
    console.log(data);
    origjson = data;
    places = [];
    for(i = 0; i < data.length; i++) {
		place = { type: 'Feature',             
			properties: {
                title: data[i]["name"],
                description: getDescription(data[i]),
				'marker-symbol': getMarker(data[i]["symbol"]),
                'marker-color': getColor(data[i]["color"]),
                'marker-size': "large"
			},
			categories: { 
				city: isCity(data[i]["categories"]),
				education: isEducation(data[i]["categories"]),
				entertainment: isEntertainment(data[i]["categories"]),
				food: isFood(data[i]["categories"]),
				outdoors: isOutdoors(data[i]["categories"])
			},
			geometry: {
				type: 'Point',
				coordinates: [data[i]["longitude"], data[i]["latitude"]]
			}
        }
        places.push(place);
    }
    geojson = { type: 'FeaturesCollection', features: places};
    setupMap(geojson);
};

// add points to the map and set the initial zoom
function setupMap(geo) {
    myLayer.setGeoJSON(geo);
    map.fitBounds(myLayer.getBounds());
};

// get the formatted description (some contain images and some do not)
function getDescription(myData) {
	var description = "";
	if (myData["imageurl"] !== "") {
		description += "<img width='200px' src='" + myData["imageurl"] + "'><br>";
	}
	description += myData["description"];
	if (myData["yourname"] !== "") {
		description += "<br><em>Added by " + myData["yourname"] + "</em>";
	}
	return description;
};

// get the marker-style attribute
function getMarker(mySymbol) {
	if (mySymbol === "Star") {
		return "star";
	} else if (mySymbol === "Heart") {
		return "heart";
	} else if (mySymbol === "Music") {
		return "music";
	} else if (mySymbol === "Tree") {
		return "park";
	} else if (mySymbol === "Monument") {
		return "restaurant";
	} else if (mySymbol === "Library") {
		return "library";
	} else if (mySymbol === "School") {
		return "college";
	} else if (mySymbol === "City") {
		return "city";
	} else if (mySymbol === "Village") {
		return "village";
	} else if (mySymbol === "Restaurant") {
		return "restaurant";
	} else if (mySymbol === "Cafe") {
		return "cafe";
	} else if (mySymbol === "Ice cream") {
		return "ice-cream";
	} else {
		return "marker"; // default marker
	}
};

// get the marker-color attribute
function getColor(myColor) {
	if (myColor === "Red") {
		return "#FF0000";
	} else if (myColor === "Orange") {
		return "#FFA500";
	} else if (myColor === "Yellow") {
		return "#FFFF00";
	} else if (myColor === "Green") {
		return "#008000";
	} else if (myColor === "Blue") {
		return "#0000FF";
	} else if (myColor === "Purple") {
		return "#800080";
	} else if (myColor === "Pink") {
		return "#FF3399";
	} else {
		return "#808080"; // default color is grey
	}
};

function isCity(myCategories) {
	return /city/i.test(myCategories);
};

function isEducation(myCategories) {
	return /education/i.test(myCategories);
};

function isEntertainment(myCategories) {
	return /entertainment/i.test(myCategories);
};

function isFood(myCategories) {
	return /food/i.test(myCategories);
};

function isOutdoors(myCategories) {
	return /outdoors/i.test(myCategories);
};
function getCategories(myCategories) {
	return "city: " + /city/i.test(myCategories) + ", education: " + /education/i.test(myCategories) + ", entertainment: " + /entertainment/i.test(myCategories) + ", food: " + /food/i.test(myCategories) + ", outdoors: " + /outdoors/i.test(myCategories);
};

$(document).ready(function() {
	$("#city").click(myFilter);
	$("#education").click(myFilter);
	$("#entertainment").click(myFilter);
	$("#food").click(myFilter);
	$("#outdoors").click(myFilter);
});

function myFilter() {
	myLayer.setFilter(function(marker) {
		if ($("#city").prop("checked") && !(marker.categories.city)) {
			return false;
		}
		if ($("#education").prop("checked") && !(marker.categories.education)) {
			return false;
		}
		if ($("#entertainment").prop("checked") && !(marker.categories.entertainment)) {
			return false;
		}
		if ($("#food").prop("checked") && !(marker.categories.food)) {
			return false;
		}
		if ($("#outdoors").prop("checked") && !(marker.categories.food)) {
			return false;
		}
		return true;
	});
};
