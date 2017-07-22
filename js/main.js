

init();

//update progress bar according to downloaded data
function moveBar(value) {

    if ( $('#myProgress').css('display') == 'none' )
        $('#myProgress').slideDown();
    var elem = document.getElementById("myBar"); 
    if(elem == null)
        return;
    if(value === 0){
        elem.style.width = '100' + '%';    
        elem.innerHTML = 'Downloading ... ';
        return;
    }
    if(value === -1){
        elem.style.width = '100' + '%';    
        elem.innerHTML = 'Done !';
        setTimeout(function(){
                $('#timeDiv').slideDown();
            
                $('#myProgress').slideUp();   
                
                windowResizeHandler();  
            }, 2000);
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
    if(value === -4){
        elem.style.width = '100' + '%';    
        elem.innerHTML = 'Loading...';
        return;
    }
    elem.style.width = Math.floor(value * 100) + '%';    
    elem.innerHTML = Math.floor(value * 100) + '%';

}

//get the earthquake data
function getData(dataurl){
    dataURL = dataurl;
    disableMenue();
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("progress", updateProgress);
    xhr.addEventListener("error", downloadError);
    xhr.open('GET', dataurl, true);
    xhr.send(null);
    xhr.onload = function(){
        try{
            theData = JSON.parse(xhr.responseText);
            theData.features = theData.features.sort(function(a,b){
                return (getFeatureProperty(a,'time') - getFeatureProperty(b, 'time'));
            });
        }catch(err){
            moveBar(-3);
            console.log('error parasing ' + err);
            return;
        }
        //after loading the data, extract heat data and add them to map

        updateDataSummary(theData.features);
        if(mymap)
            mymap.remove();
        
        $('#mainMap').empty();
        $('#mainMap').removeClass();
        dataDisplayed = 0;  

        initMap();
        enableMenue();

        //hide download bar
        setTimeout(function(){
            moveBar(-1);       
            
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
// function windowResizeHandler(){
//     var bodyChilds = document.body.children;
//     var sumHeight = 0;
//     for (var i = 0; i < bodyChilds.length; i++){
//         if(! hasClass(bodyChilds[i], 'no-height'))
//             sumHeight += bodyChilds[i].clientHeight || 0 ;

//     }
//     var windwoHeight = $(window).height();
//     $('.map-wrapper:first').height(windwoHeight - sumHeight -10); //10 for the download bar
// }
function windowResizeHandler(){

    var totalHeight = 0;
    var totalWidth = 0;
    var windwoHeight = $(window).height();
    var windowWidth = $(window).width();
    $(".height-calc").each(function(){
        totalHeight += $(this).height();
    });
    $(".width-calc").each(function(){
        totalWidth += $(this).width();
    });
    if($('body').css('padding-top') !== $('#mainNav').height())
        $('body').animate({ paddingTop: $('#mainNav').height() });
    var suggestedHeight = windwoHeight - totalHeight -50 -18;//34 xAxis, 50 navbar
    var suugestedWidth = windowWidth - totalWidth + 15;
    $('.map-wrapper').height(Math.max(suggestedHeight,380) ); 
    $('.map-wrapper').width(Math.max(suugestedWidth,380) ); 
    if(mymap){
        mymap.invalidateSize();    
        // mymap.fitWorld();
    }
    drawXAxis(minDate, maxDate);
}
function toggleThemeWrapper(){
    if(themeLight){
        toggleThemeTo('dark');
        themeLight = false;
    }else{
        toggleThemeTo('light');
        themeLight = true;
    }
}

function updateCurrentData(type, who){
    moveBar(0);
    $('#timeDiv').slideUp();
    navBarHide();
    currentData = type;
    $(who).parent().parent().children().removeClass('active');
    $(who).parent().addClass('active');
    setTimeout(function(){getData(type);},400); //300 to avoid progressbar slidedown lag
}
function animateBtnHandler(){
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $('#animateForm').slideDown();
    navBarHide();
    disableMenue();
}

function hideMe(item){
    $(item).hide();
}
function showMe(item){
    $(item).show();
}

function navBarHide(){
    if($('#collapseBtn').css('display') !== 'none')
        $('.navbar-toggle').click();

}
function mapSelectArea(){
    if(selectArea){
        selectArea.remove();
        selectArea = undefined;
    }
    selectArea =  L.areaSelect({width:200, height:130}).addTo(mymap);
    selectButton.show();
    cancelSelect.show();
}
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function resetMap(){
    currentData = 'mag';
    moveBar(-4);
    hideSelect();
    changeMap("");
    $('.info').css('display','block');
    selectData = undefined;
    replaceData(theData.features);
    mymap.setView([0,0],2);
    moveBar(-1);
    dynamicTurns = 10;
    i = 0;    
}
function enableMenue(){
    $('#collapseBtn').attr('data-toggle','collapse');
    $('#mainNav .dropdown, .navbar-btn').show();
}
function disableMenue(){
    $('#collapseBtn').removeAttr('data-toggle');
    $('#mainNav .dropdown, .navbar-btn').hide();
}

function init(){
     $('body').animate({ paddingTop: $('#mainNav').height() });
     moveBar(0);
     setTimeout(function(){getData(dataURL);},1000); //300 to avoid progressbar slidedown lag
    
    
}




window.onresize = windowResizeHandler;