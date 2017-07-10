var mymap = L.map('mainMap').setView([0, 0], 2);



    var x = ['https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: 'pk.eyJ1IjoibWRhaGFtc2hpIiwiYSI6ImNqNHhxM3pjdzFmMnEzMnFqZnhoc211cDcifQ.UKGiBew-rmYzU29WgEnY_g'
}];
var currentLayer;

function changeMap(type){
    var currentMap; 
    if (currentLayer)
        mymap.removeLayer(currentLayer);
    if (mapTypes[type] == undefined)
        type = 'openStreet';
    currentMap = mapTypes[type];
    currentLayer = L.tileLayer(currentMap[0], currentMap[1]).addTo(mymap);
    
}
    
changeMap("");