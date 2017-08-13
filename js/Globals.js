
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
        // pane: 'labels'
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
var ResetZoom = L.Control.extend({
 
  options: {
    position: 'topleft' 
    //control position - allowed: 'topleft', 'topright', 'bottomleft', 'bottomright'
  },
 
  onAdd: function (map) {
    var container = L.DomUtil.create('button', 'leaflet-bar btn leaflet-control leaflet-control-custom');
    container.style.cursor = 'pointer';
    container.style.display = 'block';
    container.setAttribute("title",'Reset Zoom');
    container.innerText = 'O';
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
       mymap.setView([0,0],1);
    }
    container.onmouseover = function(){
        if(! isMobile)
            $('.legends').show('slow');
    }
    container.onmouseout = function(){
        if(! isMobile)
            $('.legends').hide('slow');
    }
    return container;
  },
 
});



var allMonth = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

var pastSeven = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
var pastDay = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
var dataURL = pastDay;
// var dataURL = 'https://raw.githubusercontent.com/mdahamshi/reversi/master/reversiQTFinal.zip';
var theData;    //save GEOjson data
var dataDisplayed = 0;
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
    geojson,    //geojson world map
    path,
    transform,
    worldFeature,
    legendOn = true,
    colorProperty = 'sig',
    radiusProperty = 'mag',
    quakeG,
    quakeFeature,
    drag = d3.behavior.drag(),
    myScale,
    colorRangeWhiteToRed = ['#ffffb2', '#fed976','#feb24c','#fd8d3c', '#fc4e2a','#e31a1c', '#b10026'],
    colorRangeRed = ['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#99000d'],
    colorRange = colorRangeWhiteToRed,
    radiusRange = [1, 1, 2, 4, 6, 9, 12, 16, 20],
    transRange = [0.1,1],
    lightBackground = 'rgb(160, 195, 255)',
    
    transScale,
    transProperty = 'sig',
    strokeProperty = 'felt',
    strokeScale,
    strokeRange = ['black','green'],
    felt = 0,
    unfelt = 0,
    maxMag,
    animateDelta = 0,
    radiusScale,
    colorScale,
    currentDataLength,
    minMag,
    feltOn = false,
    minDate,
    dayInSeconds = 86400,
    dayInMlSeconds = dayInSeconds * 1000,
    maxDate,
    isMobile = false,
    logBase = 2,
    maxDepth,
    themeLight = true,
    minDepth,
    maxSig,
    minSig = 0,
    pointInfo,
    dateOptions = {  
        weekday: "short", year: "numeric", month: "short",  
        day: "numeric", hour: "2-digit", minute: "2-digit"  
        }, 
    currentData,
    filterMin,
    filterMax,
    currentAxisType = 'time';

    

    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
