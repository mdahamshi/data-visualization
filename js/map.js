    



//creating leaflet map

function initMap(){
    mymap = L.map('mainMap').setView([0,0],2);
    mymap.createPane('geoJsonPane');
    mymap.getPane('geoJsonPane').style.pointerEvents = 'visible';
    mymap.createPane('labels');
    cancelSelect = new MyButton();
    mymap.addControl(cancelSelect);
    cancelSelect.text('Cancel');
    cancelSelect.container.onclick = hideSelect;
    selectButton = new MyButton();
    mymap.addControl(selectButton);
    selectButton.container.onclick = addSelected;

    svg = d3.select(mymap.getPane('geoJsonPane')).append('svg');
    worldG = svg.append('g')
    .attr('id', 'basicMap');    
    worldG.attr("class", "leaflet-zoom-hide")
    transform = d3.geo.transform({point:projectPoint});
    path = d3.geo.path().projection(transform);
    worldFeature = worldG.selectAll('path')
    .data(worldgeo.features)
    .enter()
    .append('path');
    worldFeature.attr('style', 'pointer-events:visiblePainted;');
    quakeG = svg.append('g')
    .attr('id', 'quakeMap');
    quakeG.attr("class", "leaflet-zoom-hide");
    quakeFeature =quakeG.selectAll('path')
    .data(theData.features)
    .enter()
    .append('path');
    replaceQuakeData(theData.features);
    
    worldFeature.on('click', function(d){
    if (d3.event.defaultPrevented) 
        return; // dragged
    var bounds = path.bounds(d);

    mymap.fitBounds(layerToLatLng(bounds));
    }).call(drag);
    mymap.on("zoom",zoomReset);

    zoomReset();    //to set default map at startup
    changeMap("");

}

function updateDataSummary(geoJsonFeatures){
    felt = unfelt = 0;
    maxMag = maxDepth = maxSig = -Number.MAX_VALUE;
    minMag = minDepth = minSig = Number.MAX_VALUE;
    
    geoJsonFeatures.forEach(function(element){
        felt += getFeatureProperty(element, 'felt');
        maxMag = Math.max(getFeatureProperty(element,'mag'), maxMag);
        minMag = Math.min(getFeatureProperty(element,'mag'), minMag);
        maxDepth = Math.max(getFeatureProperty(element,'depth'), maxDepth);
        minDepth = Math.min(getFeatureProperty(element,'depth'), minDepth);
        maxSig = Math.max(getFeatureProperty(element,'sig'), maxSig);
        minSig = Math.min(getFeatureProperty(element,'sig'), minSig);
    });
    unfelt = geoJsonFeatures.length - felt;
    currentDataLength = geoJsonFeatures.length;
    updateQuakeNumber();
    
}
function updateScale(property=currentData){
    myScale =  d3.scale.linear()
    .domain(getScaleDomain(property))
    .range([scaleRangeStart, scaleRangeEnd]);
}
function getScaleDomain(property){
    return {
        'depth': [minDepth, maxDepth],
        'mag': [minMag, maxMag], 
        'sig':[minSig, maxSig],
        'felt': [0,1],
    }[property];
}

function zoomReset(){
    var bounds = path.bounds(worldgeo),
    topLeft = bounds[0], 
    bottomRight = bounds[1];
    svg.attr('width', bottomRight[0] -topLeft[0])
    .attr('height', bottomRight[1] -topLeft[1])
    .style('left', topLeft[0] + 'px')
    .style('top', topLeft[1] + 'px');
    worldG.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
    quakeG.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
    worldFeature.attr('d', path);
    quakeFeature.attr('d', path);
   
}

//convert layer point to lat lng
function layerToLatLng(bounds){
    return [mymap.layerPointToLatLng(bounds[1]),mymap.layerPointToLatLng(bounds[0])];
}
//convert from lat lng to layer point
 function projectPoint(x,y){
        var point = mymap.latLngToLayerPoint(new L.LatLng(y,x));
        this.stream.point(point.x, point.y);
    }

//change map type (layer)
function changeMap(type){
    var currentMap; 
    if (tileLayer){
        mymap.removeLayer(tileLayer);        
        tileLayer = undefined;
    }
    if (mapTypes[type] == undefined)
        type = 'simple';
    if(type === 'simple'){
        $('#basicMap').show();
        $('#toggleLabel').show();
        return;
    }
    else{
        $('#basicMap').hide();
        $('#toggleLabel').hide();
    }
    currentMap = mapTypes[type];
    tileLayer = L.tileLayer(currentMap[0], currentMap[1]).addTo(mymap);
    
}
function simpleToggleLabels(){
    if(tileLayer){
        mymap.removeLayer(tileLayer);
        tileLayer = undefined;
    }
    else
        {
            var currentMap = mapTypes['simple'];
            tileLayer = L.tileLayer(currentMap[0], currentMap[1]).addTo(mymap);
        }
        
}
//add heat layer to the map
function addHeatMap(data){
    
    var delta = maxValue - minValue;
    //maping the data to be between 0..1
    if(delta > 0){
        var mappedData = data.map(
            function(element){
                return [element.lat, element.lng, (element.mag - minValue) / delta];
            });
    }
    else
        mappedData = data.map(function(e){return [e.lat,e.lng,0];}) //the case where all mag is -1
    updateDataSummary(data);
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
        updateQuakeNumber();
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

function pointInRange(point, topLeft, downRight){
    if(point.lat < topLeft.lat && point.lng > topLeft.lng)
        if(point.lat > downRight.lat && point.lng < downRight.lng)
            return true;
    return false;
}

function updateQuakeNumber(){
    document.getElementById('quakeNum').innerText = currentDataLength;
    document.getElementById('magRange').innerText = minMag + ' <-> ' + maxMag;
    document.getElementById('sigRange').innerText = minSig + ' <-> ' + maxSig;
    document.getElementById('depthRange').innerText = minDepth + ' <-> ' + maxDepth;    
    document.getElementById('numFelt').innerText = felt + ' / ' + unfelt;
}

function replaceHeatLayer(data){
    if(tileLayer)
        mymap.remove(tileLayer);
    tileLayer = addHeatMap(data);

}
function addSelected(){
    var topLeft = selectArea.getBounds().getNorthWest();
    var downRight = selectArea.getBounds().getSouthEast();
    extractAreaData(topLeft,downRight);
    replaceData(selectData);
    hideSelect();
    mymap.fitBounds([topLeft, downRight]);
    
}
function replaceData(data, type){
    updateDataSummary(data);    
    if(type === 'heat')
        replaceHeatLayer(data.map(featureToHeat));
    else
        replaceQuakeData(data);
}
//GeoJSON has coordinates[long, lat, depth]  , heatLayer takes [lat, long, mag] as input
function extractHeatData(){
    heatData = theData.features.map(featureToHeat);
    return heatData;
}

function replaceQuakeData(data){
    updateScale(currentData);
    quakeFeature = d3.select('#quakeMap').selectAll('*')
    .data(data);
    quakeFeature.enter()
    .append('path');
    quakeFeature.attr('style', 'pointer-events:visiblePainted;')
    .style('z-index', 3);
     quakeFeature.attr('fill', d =>{
    if(d) return myScale(getFeatureProperty(d,currentData));});
    quakeFeature.exit().remove();
    // zoomReset();
}


function hideSelect(){
    selectButton.hide();
    cancelSelect.hide();
    if(selectArea)
        selectArea.remove();
    selectArea = undefined;
}


function getFeatureProperty(feature, property){
    return {
        'lat':feature.geometry.coordinates[1],
        'lng': feature.geometry.coordinates[0], 'depth': feature.geometry.coordinates[2],
        'mag': feature.properties.mag, 'sig': feature.properties.sig,
        'title': feature.properties.title, 'felt': (feature.properties.felt == null ? 0:1),
        'city': feature.properties.title.split(',')[1]
        
    }[property];
}
function featureToHeat(element){
        
    return {'lat':element.geometry.coordinates[1],
            'lng': element.geometry.coordinates[0], 
            'mag': element.properties.mag
    }
}
