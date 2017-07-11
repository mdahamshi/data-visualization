var mapTypes = {
    sat:  ['https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: 'pk.eyJ1IjoibWRhaGFtc2hpIiwiYSI6ImNqNHhxM3pjdzFmMnEzMnFqZnhoc211cDcifQ.UKGiBew-rmYzU29WgEnY_g'
}],
    street: ['https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: 'pk.eyJ1IjoibWRhaGFtc2hpIiwiYSI6ImNqNHhxM3pjdzFmMnEzMnFqZnhoc211cDcifQ.UKGiBew-rmYzU29WgEnY_g'
}],
    light: ['https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: 'pk.eyJ1IjoibWRhaGFtc2hpIiwiYSI6ImNqNHhxM3pjdzFmMnEzMnFqZnhoc211cDcifQ.UKGiBew-rmYzU29WgEnY_g'
}],
    pencil: ['https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.pencil",
    accessToken: 'pk.eyJ1IjoibWRhaGFtc2hpIiwiYSI6ImNqNHhxM3pjdzFmMnEzMnFqZnhoc211cDcifQ.UKGiBew-rmYzU29WgEnY_g'
}],
    openStreet: [
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}
    ],
    toner: [
        'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
					maxZoom : 17
				}
    ],
    terrian: [
        'http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png', {
					maxZoom : 17
				}
    ],
    waterColor: [
        'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png', {
					maxZoom : 17
				}
    ]
}

var dataURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';
// var dataURL = 'https://raw.githubusercontent.com/mdahamshi/reversi/master/reversiQTFinal.zip';
var theData;
var heatData;
var heatLayer;
var mymap;