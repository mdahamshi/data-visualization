
//hash map for differnet maps types
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
    ],
    simple:[
        'http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png'
        , {
        attribution: '©OpenStreetMap, ©CartoDB',
        pane: 'labels'
}]
}
var MyButton = L.Control.extend({
 
  options: {
    position: 'bottomleft' 
    //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
  },
 
  onAdd: function (map) {
    var container = L.DomUtil.create('button', 'leaflet-bar btn leaflet-control leaflet-control-custom');
    container.style.cursor = 'pointer';
    container.style.display = 'none';
    // container.style.backgroundColor = '#293f50';
    // container.style.width = mymap.getSize().y / 2;
    // container.style.height = '40px';
    container.innerText = 'Done';
    this.show = function(){
        container.style.display = 'inline-block';
    }
    this.hide = function(){
        container.style.display = 'none';
    }
    this.container = container;
    this.text = function(txt){
        container.innerText = txt;
    }
    container.onclick = function(){
        this.style.display = 'none';
    }
    return container;
  },
 
});




var dataURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';
// var dataURL = 'https://raw.githubusercontent.com/mdahamshi/reversi/master/reversiQTFinal.zip';
var theData;    //save GEOjson data
var heatData;   //save heatLayer requiered data from GEOjson data
var tileLayer;  //save heatLayer object
var mymap;      //save the main map
var currentLayer;//save current baseLayer
var ourData;    //map raw data to data that we use: lat, lng, depth, mag, title, sig
var selectData; //to hold selected area data
var maxValue = 10;     // save current max data value
var minValue = -1;     //save current min data value
var selectArea; //save selected area, avoid multi select
var buttonWrapper;
var selectButton;
var temp;
var heatIntensity = 0.7;
var cancelSelect;
var svg,
    worldG,
    path,
    transform,
    worldFeature,
    quakeG,
    quakeFeature,
    drag = d3.behavior.drag(),
    myScale,
    scaleRangeStart = '#ffffb2',
    scaleRangeEnd = '#bd0026',
    felt = 0,
    unfelt = 0,
    maxMag,
    currentDataLength,
    minMag,
    maxDepth,
    minDepth,
    maxSig,
    minSig = 0,
    currentData = 'mag';  //current viewed data (mag, depth ...)

    

