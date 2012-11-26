/*=====================
prenaud@riester.com
April 2012
=====================*/

$(document).ready(function(){
    //console.log('document ready');

    universalController();

}); //document.ready




/*==( ^ Call universal functions. Not dependent on tablet/desktop, etc.
Most of these are in .length-called if statements. This helps us avoid
loading unecessary javascript only to find that there are no suitable
DOM elements to run on.
)======================================================*/

function universalController(){

    initializeMap();
    socketHandlers();
    eventHandler();




            // var username = "anonymous";
            
            // $('input[name=setUsername]').click(function(){
            //     if($('input[name=usernameTxt]').val() != ""){
            //         username = $('input[name=usernameTxt]').val();
            //         var msg = {type:'setUsername',user:username};
            //         socket.json.send(msg);
            //     }
            //     $('#username').slideUp("slow",function(){
            //         $('#sendChat').slideDown("slow");
            //     });
            // }); //click setUsername

            // $("input[name=sendBtn]").click(function(){
            //     var msg = {type:'chat',message:username + " : " +  $("input[name=chatTxt]").val()}
            //     socket.json.send(msg);
            //     $("input[name=chatTxt]").val("");
            // }); //click sendBtn

}; //universalController




function initializeMap (){
    map = new GMaps({
        div: '#gmaps-box',
        lat: 0,
        lng: 0,
        maxZoom: 17,
        zoom: 2
    });//gmaps
}; //initializeMap



function socketHandlers(){
    socket = new io.connect(window.location.hostname);
    socket.on('connect', function() {
        console.log("Connected");
        navigator.geolocation.getCurrentPosition(gotGeo, notGeo);
    }); //on connect

    socket.on('message', function(dialog){
        console.log(dialog);
        console.log(dialog.type);
        if (dialog.type == 'usersOnline') {
            $('.users-online').html('Currently there are ' + dialog.message + ' users online.');
        }; //if dialog.type
        if (dialog.type == 'geolocation') {

            map.addMarker({
                lat: dialog.latitude,
                lng: dialog.longitude,
                title: "New user is here!!!",
                infoWindow: {
                    content: "New User is here and stuff"
                },
                click: function(e){
                    console.log('hi! click happened');
                },
                mouseover: function(e){
                    console.log('hi! mouseover happened');
                },
                mouseout: function(e){
                    console.log('hi! mouseout happened');
                }
            }); //addMarker
            $('#container .inner').append('<div class="current-user">User at Lat: ' + dialog.latitude + ' and Long: ' + dialog.longitude + '</div>');


        }; //if geolocation
    }); //on message

    socket.on('disconnect', function() {
        console.log('disconnected');
        $('#container .inner').html("<b>Disconnected!</b>");
    }); //on disconnect
}; //socketHandlers


function eventHandler(){
    $('.look-for').on('blur', function(){
        console.log($('.look-for').val());
    }); //blur look-for

    $('#container .inner').append('<p class="users-online"></p>');
}; //eventHandler




function gotGeo(position){
    console.log(position.coords.latitude +' by ' +  position.coords.longitude)
    msg = {type:'geolocation', latitude: position.coords.latitude, longitude: position.coords.longitude}
    socket.json.send(msg)
};//gotGeo


function notGeo(){
    console.log('no dice');
};//notGeo



function addUserLocation(positionDataLat, positionDataLongi){
    console.log('adding user location');
    map.addMarker({
        lat: positionDataLat,
        lng: positionDataLongi,
        title: "New user is here!!!",
        infoWindow: {
            content: "New User is here and stuff"
        },
        click: function(e){
            console.log('hi! click happened');
        },
        mouseover: function(e){
            console.log('hi! mouseover happened');
        },
        mouseout: function(e){
            console.log('hi! mouseout happened');
        }
    }); //addMarker
}; //addUserLocation












