var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope) {
    $scope.templateURL = 'views/main.htm';
    $scope.switchView = function(url){
        $scope.templateURL = url;
    }
});        
window.onload = function(){

        

    // var dropContent = document.getElementsByClassName('dropdown-content');
    // for(var i = 0; i < dropContent.length; i++){
    //     dropContent[i].onclick = function(ev){
    //         ev.stopPropagation();
    //         ev.target.parentElement.style.display = 'none';
    //     };
    // }
    // var dropBtn = document.getElementsByClassName('dropbtn');
    // for(var i = 0; i < dropContent.length; i++){
    //     dropBtn[i].onclick = function(ev){
    //         ev.stopPropagation();
    //         toggle(ev.srcElement.nextElementSibling);
    //     };
    // }
    // function toggle(element){
    //     if(element.style.display === 'none' || element.style.display == "")
    //         element.style.display = 'block';
    //     else
    //         element.style.display = 'none';
    // }
};