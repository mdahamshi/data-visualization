


function moveBar(value) {
    var elem = document.getElementById("myBar"); 
    var width = 1;
    elem.style.width = Math.floor(value * 100) + '%';    
    elem.innerHTML = Math.floor(value * 100) + '%';

}


function getData(){
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("progress", updateProgress);
    xhr.open('GET', dataURL, true);
    xhr.send(null);
    xhr.onload = function(){
        document.getElementById('myProgress').style.display = 'none';
        try{
            theData = JSON.parse(xhr.responseText);
        }catch(err){
            console.log('error parasing ' + err);
        }
    };
    function updateProgress (oEvent) {
        if (oEvent.lengthComputable) {
            var percentComplete = oEvent.loaded / oEvent.total;
            moveBar(percentComplete);
            // ...
        } else {
            console.log('unknow data size !');
            // Unable to compute progress information since the total size is unknown
        }
    }

    console.log(xhr.status,xhr.readyState);   
}

getData();