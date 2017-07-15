    

initMap();

//creating leaflet map

function initMap(){
    mymap = L.map('mainMap').setView([0,0],2);
    cancelSelect = new MyButton();
    mymap.addControl(cancelSelect);
    cancelSelect.text('Cancel');
    cancelSelect.container.onclick = hideSelect;
    selectButton = new MyButton();
    mymap.addControl(selectButton);
    selectButton.container.onclick = addSelected;

    
}
//change map type (layer)
function changeMap(type){
    var currentMap; 
    if (currentLayer)
        mymap.removeLayer(currentLayer);
    if (mapTypes[type] == undefined)
        type = 'toner';
    currentMap = mapTypes[type];
    currentLayer = L.tileLayer(currentMap[0], currentMap[1]).addTo(mymap);
    
}
//add heat layer to the map
function addHeatMap(data){
    updateMinMaxVars(data);
    var delta = maxMag - minMag;
    //maping the data to be between 0..1
    if(delta > 0){
        var mappedData = data.map(
            function(element){
                return [element.lat, element.lng, (element.mag - minMag) / delta];
            });
    }
    else
        mappedData = data.map(function(e){return [e.lat,e.lng,0];}) //the case where all mag is -1
    updateQuakeNumber(data.length, maxMag, minMag);
    try{
        return L.heatLayer(data, {
            radius: 19,
            blur: 0, 
            minOpacity: heatIntensity,
            maxZoom: 16,
            gradient:{0:'#ffffb2', 0.2:'#fed976', 0.4:'#feb24c', 0.6:'#fd8d3c', 0.8:'#f03b20', 1:'#bd0026'},
            }).addTo(mymap);
        
    }catch(err){
        console.log('maps.js/addHeatMap Error: '+err);
        console.log(mappedData);
        updateQuakeNumber(0);
        return null;
    }
}
//latitude increase when going up (opposite to screen coordinates...)
function extractAreaData(topLeft, downRight){
    selectData = theData.features.filter(
        function(current){
            var currentPoint = {lat: current.geometry.coordinates[1],
                                lng: current.geometry.coordinates[0]};
            if(pointInRange(currentPoint, topLeft, downRight))
                return true;
        }
    );
}
function updateMinMaxVars(data){
    var minMax = data.reduce(function(accumulator, current){
        return [Math.min(accumulator[0], current.mag),
                Math.max(accumulator[1], current.mag)];
    },[10,-1]);
    maxMag = minMax[1];
    minMag = minMax[0];
}
function pointInRange(point, topLeft, downRight){
    if(point.lat < topLeft.lat && point.lng > topLeft.lng)
        if(point.lat > downRight.lat && point.lng < downRight.lng)
            return true;
    return false;
}

function updateQuakeNumber(num, max, min){
    document.getElementById('quakeNum').innerText = num;
    document.getElementById('maxMag').innerText = max;
    document.getElementById('minMag').innerText = min;
}

function replaceHeatLayer(data){
    if(heatLayer)
        heatLayer.remove();
    heatLayer = addHeatMap(data);

}
function addSelected(){
    var topLeft = selectArea.getBounds().getNorthWest();
    var downRight = selectArea.getBounds().getSouthEast();
    extractAreaData(topLeft,downRight);
    replaceHeatLayer(selectData.map(featureToHeat));
    hideSelect();
    mymap.fitBounds([topLeft, downRight]);
    
}
function hideSelect(){
    selectButton.hide();
    cancelSelect.hide();
    if(selectArea)
        selectArea.remove();
    selectArea = undefined;
}
function featureToHeat(element){
        
    return {'lat':element.geometry.coordinates[1],
            'lng': element.geometry.coordinates[0], 
            'mag': element.properties.mag
    }
}
//to set default map at startup
changeMap("");
