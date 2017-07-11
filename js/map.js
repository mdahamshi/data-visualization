    
mymap = L.map('mainMap').setView([0, 0], 2);

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

function addHeatMap(){
    try{
        heatLayer = L.heatLayer(heatData, {
            radius: 20,
            blur: 10, 
            maxZoom: 12,
            }).addTo(mymap);
    }catch(err){
        console.log('maps.js/addHeatMap Error: '+err);
        return;
    }
}
    
changeMap("");