    



//creating leaflet map
var mapOpacity = 0.5,
    strokeOpacity = 0.5;
function initMap(){
    mymap = L.map('mainMap').setView([0,0],2);
    // mymap.createPane('geoJsonPane');
    // mymap.getPane('geoJsonPane').style.pointerEvents = 'visible';
    // mymap.createPane('labels');
    cancelSelect = new MyButton();
    mymap.addControl(cancelSelect);
    cancelSelect.text('Cancel');
    cancelSelect.container.onclick = hideSelect;
    selectButton = new MyButton();
    mymap.addControl(selectButton);
    selectButton.container.onclick = addSelected;
    mymap.addControl(new ResetZoom());

    geojson = L.geoJson(worldgeo.features,
        {
            style:function(){
            return {
                fillOpacity: mapOpacity,fillColor:'white',
                weight: 0.5,color: 'white',opacity: strokeOpacity};
            },
            onEachFeature: onEachFeature,
        }
).addTo(mymap);

    
    svg = d3.select("#mainMap").select('svg').attr('pointer-events','visible');
    svg.select('g').attr('id','worldLayer');
    // worldG = svg.append('g')
    // .attr('id', 'basicMap');    
    // worldG.attr("class", "leaflet-zoom-hide")
    transform = d3.geo.transform({point:projectPoint});
    path = d3.geo.path().projection(transform);
    // worldFeature = worldG.selectAll('path')
    // .data(worldgeo.features)
    // .enter()
    // .append('path');
    // worldFeature.attr('style', 'pointer-events:visiblePainted;');


    // inserting quake graph
    quakeG = svg.append('g')
        .attr('id', 'quakeMap');
    theData.features.forEach(function(d) {
            d.LatLng = new L.LatLng(getFeatureProperty(d,'lat'),
                                    getFeatureProperty(d,'lng'))
        }
    );
    //inserting info popup (right)
    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h4>Country Name</h4>' +  (props ?
            '<b>' + props.name + '</b>' : 'Click a country to zoom it');
    };

    info.addTo(mymap);
    replaceQuakeData(theData.features);
    
    
    function highlightFeature(e) {
        if(mymap.getZoom() > 2)
            return;         //no need to highlite with zoomed map
        var layer = e.target;
        info.update(layer.feature.properties);
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            cursor: 'pointer',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }
    function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

    function zoomToFeature(e) {
        mymap.fitBounds(e.target.getBounds());
}


    // worldFeature.on('click', function(d){
    // if (d3.event.defaultPrevented) 
    //     return; // dragged
    // var bounds = path.bounds(d);
    // console.log('world clicked');
    // mymap.fitBounds(layerToLatLng(bounds));
    // }).call(drag);
    // quakeFeature.on('click', function(d){
    // if (d3.event.defaultPrevented) 
    //     return; // dragged
    // console.log('quake clicked');
    // }).call(drag);
    mymap.on("zoom",zoomReset);

    zoomReset();    //to set default map at startup
    changeMap("");

}

function updateDataSummary(geoJsonFeatures){
    felt = unfelt = 0;
    maxMag = maxDepth = maxSig = -Number.MAX_VALUE;
    minMag = minDepth = minSig = Number.MAX_VALUE;
    
    geoJsonFeatures.forEach(function(element){
        felt += getFeatureProperty(element, 'felt') & 1;
        maxMag = Math.max(getFeatureProperty(element,'mag'), maxMag);
        minMag = Math.min(getFeatureProperty(element,'mag'), minMag);
        maxDepth = Math.max(getFeatureProperty(element,'depth'), maxDepth);
        minDepth = Math.min(getFeatureProperty(element,'depth'), minDepth);
        maxSig = Math.max(getFeatureProperty(element,'sig'), maxSig);
        minSig = Math.min(getFeatureProperty(element,'sig'), minSig);
    });
    unfelt = geoJsonFeatures.length - felt;
    minDate = getFeatureProperty(geoJsonFeatures[0],'time');
    maxDate = getFeatureProperty(geoJsonFeatures[geoJsonFeatures.length - 1], 'time');
    currentDataLength = geoJsonFeatures.length;
    updateScale();
    drawXAxis(minDate, maxDate);
    updateQuakeNumber();
    
}

function drawXAxis(start, end){
    $('#timeSvg').empty();
    var x= d3.time.scale().domain([new Date(start),new Date(end)]).range([20,$(window).width()-20]);
    x.nice();
    var axisSvg = d3.select('#timeSvg');
    var xAxis = axisSvg.append('g').attr('id','xAxis').call(d3.svg.axis().scale(x));
}

function updateScale(){
    colorScale =  d3.scale.quantize()
    .domain(getScaleDomain(colorProperty))
    .range(colorRange);

    radiusScale = d3.scale.quantize()
    .domain(getScaleDomain(radiusProperty))
    .range(radiusRange);

    transScale = d3.scale.linear()
    .domain(getScaleDomain(transProperty))
    .range(transRange);
    
    strokeScale = d3.scale.quantize()
    .domain(getScaleDomain(strokeProperty))
    .range(strokeRange);
}
function getScaleDomain(property){
    return {
        'depth': [minDepth, maxDepth],
        'mag': [-1, 8],  //typical mag
        'sig':[0, 1000],  //typical sig
        'felt': [0,1],      
    }[property];
}

function zoomReset(){

    // var bounds = path.bounds(worldgeo),
    // topLeft = bounds[0], 
    // bottomRight = bounds[1];
    // svg.attr('width', bottomRight[0] -topLeft[0])
    // .attr('height', bottomRight[1] -topLeft[1])
    // .style('left', topLeft[0] + 'px')
    // .style('top', topLeft[1] + 'px');
    // // worldG.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
    // // worldFeature.attr('d', path);    
    // quakeG.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
    // quakeFeature.attr('d', path);
   
    quakeFeature.attr("transform", 
        function(d) { 
            return "translate("+ 
                mymap.latLngToLayerPoint(d.LatLng).x +","+ 
                mymap.latLngToLayerPoint(d.LatLng).y +")";
            }
        );
    // updateQuakeProperties();
            
}
function toggleThemeTo(type){
    if(type === 'dark'){
        d3.select('#worldLayer').selectAll('path')
        // .transition()
        // .duration(1000)
        .attr('fill-opacity',0.1)
        .attr('stroke-opacity', 0.1);
        d3.select('.map-wrapper')
        .transition()
        .duration(1000)
        .style('background-color', 'black')
        
        mapOpacity = 0.1;
        strokeOpacity = 0.1;
    }
    else if(type === 'light'){
        d3.select('#worldLayer').selectAll('path')
        // .transition()
        // .duration(1000)    the transition is laggy with big dataset
        .attr('fill-opacity',0.5)
        .attr('stroke-opacity', 0.7);
        d3.select('.map-wrapper')
        .transition()
        .duration(1000)
        .style('background-color', lightBackground);
        mapOpacity = 0.5;
        strokeOpacity = 0.5;
    }
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
function radiusAttr(d){
    if(d)
        return  radiusScale(getFeatureProperty(d,radiusProperty));
}
function transAttr(d){
      if(d)
        return transScale(getFeatureProperty(d,transProperty));
        
}
function circleColorAttr(d){
    if(d) 
        return colorScale(getFeatureProperty(d,colorProperty));
}
function strokeAttr(d){
    if(d) 
        if(getFeatureProperty(d,strokeProperty) === 1)
            return strokeScale(getFeatureProperty(d,strokeProperty));
        else
            return circleColorAttr(d);
}
function changeMapWrap(who, type){
    navBarHide();
    $(who).parent().parent().children().removeClass('active');
    $(who).parent().addClass('active');
    toggleThemeTo('light');
    changeMap(type);
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
        if($('#worldLayer').css('display') !== 'none')
            $('.info').show();
    }
    else{
        currentMap = mapTypes['simple'];
        tileLayer = L.tileLayer(currentMap[0], currentMap[1]).addTo(mymap);
        $('.info').hide();
    }
}
function worldLayerToggle(){
    if($('#worldLayer').css('display') == 'none'){
        $('#worldLayer').css('display','block');
        $('.info').css('display','block');
    }else{
        $('#worldLayer').css('display','none');
        $('.info').css('display','none');
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
    enableMenue();
    var topLeft = selectArea.getBounds().getNorthWest();
    var downRight = selectArea.getBounds().getSouthEast();
    console.log(topLeft,downRight);
    extractAreaData(topLeft,downRight);
    replaceData(selectData);
    hideSelect();
    mymap.fitBounds([topLeft, downRight]);
    zoomReset();
    
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
  
    quakeFeature = d3.select('#quakeMap').selectAll('circle')
    .data(data);
    
    quakeFeature.exit().remove();   
    quakeFeature.enter()
    .append('circle')
        // .classed('leaflet-interactive', true)
    // .on('mouseover' ,function(){
    //     var oldFill = d3.select(this).style('fill')
    //     d3.select(this).attr('oldFill',oldFill)
    //     d3.select(this).style('fill','gray');
    // })
    // .on('mouseout', function(){
    //     var oldFill = d3.select(this).attr('oldFill');
    //     d3.select(this).style('fill',oldFill);
    // })
    .on('click', function(d){
        if (d3.event.defaultPrevented) 
            return; // dragged
        console.log('quake clicked',this,d);
    }).call(drag);
      
    updateQuakeProperties();
    zoomReset();
}

function updateQuakeProperties(){
    quakeFeature.attr('r', radiusAttr)
    .style('fill', circleColorAttr)
    .style('stroke',strokeAttr)
    .style("stroke-opacity", 0.5)
    .style('stroke-width', 0)
    .style("fill-opacity", 1) 
    // .style('fill-opacity',transAttr)
    // .style('stroke-opacity', transAttr);
}

function animateFormHandler(){
    var time = $('#animateTime').val();
    if(isNaN(time) || time < 0 || time ===''){
        $('#animateForm:first').addClass('has-error');
        return;        
    }
    $('#animateForm:first').removeClass('has-error');
    animateDelta = time;
    $('#animateForm').slideUp();
    $('#timeDiv').slideUp();
    var darkThemeChecked = ($('#animateForm .checkbox label input:checked').length ===1); 
    animateMap(darkThemeChecked);
}
function myvoid(){}
function updateQuakePropertiesDynamic(){
    
    var earthquakes = quakeFeature;
    if(earthquakes[0].length === dataDisplayed)
        return;
    var c = earthquakes[0][dataDisplayed];
        d3.select(c)
        .attr("r", 1)
        .style("fill", circleColorAttr)
        .style("fill-opacity", 0.9)
        .style("stroke", strokeAttr)
        .style("stroke-opacity", 0.7)
        .transition()
        .duration(2000)
        .ease(Math.sqrt)
        .attr("r", radiusAttr)
        .style("fill-opacity", 1e-6)
        .style("stroke-opacity", 1e-6)
        setTimeout(updateQuakePropertiesDynamic, animateDelta);
        dataDisplayed++;
        if (earthquakes[0].length === dataDisplayed){ 
            enableMenue();
            $("#success-alert").slideDown();
            setTimeout(function(){

                $("#success-alert").slideUp(2000);
                $('#timeDiv').slideDown();
                // replaceQuakeData(theData.features);
                updateQuakeProperties();
                dataDisplayed = 0;
                if(themeLight)
                    toggleThemeTo('light');
                windowResizeHandler();
            },4000);

      }
    }
    // .style('opacity',transAttr)


function animateMap(toggleTheme){
        quakeFeature.style('fill-opacity',0)
        .style("stroke-opacity", 0)
        if(themeLight && toggleTheme)
            toggleThemeTo('dark');
        disableMenue();
        mymap.fitBounds(geojson.getBounds());
        windowResizeHandler();        
        setTimeout(updateQuakePropertiesDynamic,2000);
        
}
function hideSelect(){
    enableMenue();
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
        'title': feature.properties.title, 'felt': (feature.properties.felt || 0),
        'city': feature.properties.title.split(',')[1],
        'time': feature.properties.time
        
    }[property];
}
function featureToHeat(element){
        
    return {'lat':element.geometry.coordinates[1],
            'lng': element.geometry.coordinates[0], 
            'mag': element.properties.mag
    }
}
