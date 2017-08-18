


//update progress bar according to downloaded data
function moveBar(value) {

    if ( $('#myProgress').css('display') == 'none' )
        $('#myProgress').fadeIn('slow');
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
        if(! isMobile &&  localStorage.getItem('visited') == null){
            introJs().setOptions({groupClass:'.myintro'}).start();
            localStorage.setItem('visited', true)
        }
        $("html, body").animate({ scrollTop: 0 }, "slow");
        setTimeout(function(){
            
                $('#myProgress').fadeOut('slow');   
                enableMenue();    
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
           $('#filterDiv').slideUp();
        return;
    }
    elem.style.width = Math.floor(value * 100) + '%';    
    elem.innerHTML = Math.floor(value * 100) + '%';

}

function getData(dataurl=dataURL, delay = 600){
    if(navigator.onLine){
        moveBar(0);
        setTimeout(function(){
            downloadData(dataurl);
        },delay);    
        return true;
    }
    else
        showInfo("You are offline, cannot retrive new data.", 'alert-danger',0 ,5000);
    return false;
}
//get the earthquake data
function downloadData(dataurl){
    dataURL = dataurl;
    disableMenue();
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("progress", updateProgress);
    xhr.addEventListener("error", downloadError);
    xhr.open('GET',dataurl, true);
    xhr.send(null);
    xhr.onload = function(){
        try{
            theData = JSON.parse(xhr.responseText);
            currentData = theData.features;
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
        if(!mymap)
            initMap();
        else
            initQuakeData();
       
        
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

function windowResizeHandler(){

    var totalHeight = 0;
    var totalWidth = 0;
    var windwoHeight = $(window).height();
    var windowWidth = $(window).width();
    $(".height-calc").each(function(){
        totalHeight += $(this).height();
    });
    var suggestedHeight = windwoHeight - totalHeight -30 ;
    $('.map-wrapper').animate({ height: Math.max(suggestedHeight,380)},600);
    if(mymap){
        mymap.invalidateSize();    
        // mymap.fitWorld();
    }
    try{
        drawXAxis(currentAxisType);
    }catch (e){

    }
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
function handleRefresh(){
    var autoRefreshON = refreshID ? true: false;
    toggleRefresh('off');
    getData();
    if(autoRefreshON)
        toggleRefresh('on');
}
function toggleRefresh(state="on"){
    if(state === 'off' || refreshID){
        if(refreshID)
            clearInterval(refreshID);
        refreshID = undefined;
        $('#refreshBtn').removeClass('btn-success');
        $('#refreshBtn').addClass('btn-danger');
    }else {
        refreshID = setInterval(getData, refreshInterval);
        $('#refreshBtn').removeClass('btn-danger');
        $('#refreshBtn').addClass('btn-success');
    }
}
function updateCurrentData(type, who){
    var autoRefreshON = refreshID ? true: false;
    toggleRefresh('off');
    if(getData(type)){
        $(who).parent().parent().children().removeClass('active');
        $(who).parent().addClass('active');
    }
    if(autoRefreshON)
        toggleRefresh('on');
}
function animateBtnHandler(){
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $('#animateForm').slideDown();
    disableMenue();
}

function hideMe(item){
    $(item).hide();
}
function showMe(item){
    $(item).show();
}
function filterDivHandler(type){
    if(currentData.length <= 1){
        showInfo('Not enough Data available ! Reset the Map', 'alert-danger')
        return;
    }
    $("html, body").animate({ scrollTop: 0 }, "slow");
    if(type === 'felt'){
        filterData('felt');
        $("html, body").animate({ scrollTop: $(document).height() }, "slow");
        setTimeout(function() {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        }, 2000);
        return;
    }
    currentAxisType = type;
    disableMenue();
    drawXAxis(type);
    $('#filterDiv').slideDown();
}
function filterDataHandler(){
    filterData(currentAxisType, filterMin, filterMax);
    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
    $('#filterDiv').slideUp();
    enableMenue();
    setTimeout(function() {
        $("html, body").animate({ scrollTop: 0 }, "slow");
    }, 2000);
}

function mapSelectArea(){
    if(selectArea){
        selectArea.remove();
        selectArea = undefined;
    }
    selectArea =  L.areaSelect({width:200, height:130}).addTo(mymap);
    selectArea.legendWasOn = legendOn;
    mymap.invalidateSize();    
    selectButton.show();
    cancelSelect.show();
    toggleLegend('off');
}
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
function stopAnimate(){
    stopRequest = true;
}

function resetMap(){
    toggleRefresh('off');
    moveBar(-4);
    hideSelect();
    changeMap("");
    selectData = undefined;
    currentData = theData.features;
    replaceData(theData.features);
    mymap.setView([0,0],2);
    $('#filterTable > tbody').empty();
    $('#filterTable').hide('slow');    

    moveBar(-1);
    $("html, body").animate({ scrollTop: 0 }, "slow");
}


function showInfo(msg, type, after = 0, duration = 3000){
    setTimeout(function(){
        $('#success-alert').text(msg);
        $('#success-alert').addClass(type);
        $('#success-alert').slideDown();
        setTimeout(function(){
        $('#success-alert').slideUp();
        setTimeout(a =>{$('#success-alert').removeClass(type);}, 1000);        
        }, duration);
    }, after);
}
function enableMenue(){
    $('#collapseBtn').attr('data-toggle','collapse');
    $('#mainNav .dropdown, .navbar-btn').show('slow');
}
function disableMenue(){
    $('#collapseBtn').removeAttr('data-toggle');
    $('#mainNav .dropdown, .navbar-btn').hide();
    $('#fullScreenBtn').show();
}

function init(){
     $('body').animate({ paddingTop: $('#mainNav').height() });
     moveBar(0);
     getData(dataURL, 1000);


}

function toggleLegend(state='on'){
    if(state === 'off' || legendOn){
        $('.legends').hide('slow');
        d3.select('#toggleLegendButton')
        .style('background-color', 'white')
        legendOn = false;
    }
    else{
        $('.legends').show('slow');
        d3.select('#toggleLegendButton')
        .style('background-color', '#68ff7f')
        legendOn = true;
    }
}
function legendHover(type){
    if(legendOn === false)
        if(type === 'out')
            $('.legends').hide('slow');
        else
            $('.legends').show('slow');
}
 function toggleFullScreen(){
        var element = document.documentElement;
        
        if(document.webkitIsFullScreen || window.fullScreen){
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
            $('#fullScreenImg').attr('src', 'css/full.png');
            return;
        }
        $('#fullScreenImg').attr('src', 'css/unfull.png');
        if (element.requestFullscreen) {
            element.requestFullscreen();
        }
        else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }
        else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
        
    }

window.onresize = windowResizeHandler;

window.onload = function(){
    init();
        
        
    $("html, body").animate({ scrollTop: 0 }, "slow");

    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

    if(isMobile){
        $('#allMonths').hide(); //mobile device get slow with many data
        $('#introButton').remove();
        showInfo('Some features are disabled for mobile devices.', 'alert-danger', 2000, 8000);    

    }
     
    //navbar hide on click outside
    $(document).click(function (event) {
        event.stopPropagation();
        var clickover = $(event.target);
        var _opened = $("#myNavbar").hasClass("collapse in");
        if (_opened === true && clickover.id !== 'collapseBtn') {
              $('.collapse').collapse('hide');   
        }
        
    });

   
    //info table tooltip
    $('#infoHead th').on({
    'mouseenter': function() {
        var $cell = ($(this));
        if (true) {
            $cell.tooltip({
                    container: 'body',
                    html: true,
                    trigger: 'manual',
                    title: function() {
                        return {
                            0: "Number of earhquakes.",
                            1: "Earthquake magnitude is a measure of the size of an earthquake at its source. ",
                            2:"A number describing how significant the event is. Larger numbers indicate a more significant event.",
                            3:"At least one person felt the event.",
                            4: "The depth where the earthquake begins to rupture. "
                        }[$(this)[0].cellIndex];
                    }
                });
        }
        $cell.tooltip('show');

    },
    'mouseleave': function() {
        $(this).tooltip('hide');
    }
});

   
};
