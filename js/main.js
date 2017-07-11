


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
        extractHeatData();
        addHeatMap();

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
    heatData = theData.features.map(function(element){
        return [element.geometry.coordinates[1], 
        element.geometry.coordinates[0],
        element.properties.mag ];
    });
}

function windowResizeHandler(){
    var bodyChilds = document.body.children;
    var sumHeight = 0;
    for (var i = 0; i < bodyChilds.length; i++){
        if(bodyChilds[i].className !== 'map-wrapper')
            sumHeight += bodyChilds[i].clientHeight || 0 ;

    }
    var windwoHeight = $(window).height();
    $('.map-wrapper').height(windwoHeight - sumHeight -10); //10 for the download bar
}

getData();
window.onload = function(){
    windowResizeHandler();  
}