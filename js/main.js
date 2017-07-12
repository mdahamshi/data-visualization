

init();

//update progress bar according to downloaded data
function moveBar(value) {
    var elem = document.getElementById("myBar"); 
    if(value === 0){
        elem.style.width = '100' + '%';    
        elem.innerHTML = 'Downloading ... ';
        return;
    }
    if(value === -1){
        elem.style.width = '100' + '%';    
        elem.innerHTML = 'Done !';
        return;
    }
      if(value === -2){
        elem.style.width = '100' + '%';    
        elem.innerHTML = 'Error occured, try to refresh !';
        elem.style.backgroundColor = 'red';
        return;
    }
          if(value === -3){
        elem.style.width = '100' + '%';    
        elem.innerHTML = 'Error occured while parasing the data !';
        elem.style.backgroundColor = 'red';
        return;
    }
    var width = 1;
    elem.style.width = Math.floor(value * 100) + '%';    
    elem.innerHTML = Math.floor(value * 100) + '%';

}

//get the earthquake data
function getData(){
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("progress", updateProgress);
    xhr.addEventListener("error", downloadError);
    xhr.open('GET', dataURL, true);
    xhr.send(null);
    xhr.onload = function(){
        try{
            theData = JSON.parse(xhr.responseText);
        }catch(err){
            moveBar(-3);
            console.log('error parasing ' + err);
            return;
        }
        //after loading the data, extract heat data and add them to map
        extractOurData();        
        extractHeatData();
        heatLayer =  addHeatMap(heatData);
        //hide download bar
        setTimeout(function(){
            moveBar(-1);       
            setTimeout(function(){
                document.getElementById('myProgress').style.display = 'none';    
                windowResizeHandler();  
            }, 2000);
        }, 1000);
        
        
    };
    //calculate downloaded percent to update progress bar
    function updateProgress (oEvent) {
        if (oEvent.lengthComputable) {
            var percentComplete = oEvent.loaded / oEvent.total;
            moveBar(percentComplete);
        } else {
            moveBar(0);
        }
    }
    function downloadError(){
        moveBar(-2);
    }

}
//GeoJSON has coordinates[long, lat, depth]  , heatLayer takes [lat, long, mag] as input
function extractHeatData(){
    heatData = theData.features.map(featureToHeat);
    return heatData;
}

function extractOurData(){
    ourData = theData.features.map(function(element){
        return {'lat':element.geometry.coordinates[1],
        'lng': element.geometry.coordinates[0], 'depth': element.geometry.coordinates[2],
        'mag': element.properties.mag, 'sig': element.properties.sig,
        'title': element.properties.title, 'felt': element.properties.felt,
        'city': element.properties.title.split(',')[1]
        }
    });
}
//update map size according to screen size (avoid scrooling - app like mode)
function windowResizeHandler(){
    var bodyChilds = document.body.children;
    var sumHeight = 0;
    for (var i = 0; i < bodyChilds.length; i++){
        if(! hasClass(bodyChilds[i], 'no-height'))
            sumHeight += bodyChilds[i].clientHeight || 0 ;

    }
    var windwoHeight = $(window).height();
    $('.map-wrapper:first').height(windwoHeight - sumHeight -10); //10 for the download bar
    mymap.invalidateSize();
}

function mapSelectArea(){
    if(selectArea){
        selectArea.remove();
        selectArea = undefined;
    }
    selectArea =  L.areaSelect({width:200, height:250}).addTo(mymap);
    selectButton.show();
    cancelSelect.show();
}
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function resetMap(){
    replaceHeatLayer(extractHeatData());
    hideSelect();
    mymap.setView([0, 0], 2);
}
function init(){
    getData();

    
}

window.onload = function(){
    windowResizeHandler();  
}
window.onresize = windowResizeHandler;