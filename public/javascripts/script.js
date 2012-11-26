/*=====================
phil@riotindustries.com
Nov. 2012
=====================*/

$(document).ready(function(){
    //console.log('document ready');

    universalController();

}); //document.ready




/*==( ^ Call universal functions. Not dependent on tablet/desktop, etc.
Generally these are in .length-called if statements. This helps us avoid
loading unecessary javascript only to find that there are no suitable
DOM elements to run on.
)======================================================*/

function universalController(){

    initializeMap();
    socketHandlers();
    eventHandler();

}; //universalController


/*==( ^ Load Google Map using gmaps.js syntax
)======================================================*/


function initializeMap (){
    map = new GMaps({
        div: '#gmaps-box',
        lat: 0,
        lng: 0,
        maxZoom: 17,
        zoom: 2
    });//gmaps
}; //initializeMap


/*==( ^ Handle socket connections and messages
)======================================================*/

function socketHandlers(){
    var here = "there";
    socket = new io.connect(window.location.hostname);
    socket.on('connect', function() {
        //console.log("Connected");
        navigator.geolocation.getCurrentPosition(gotGeo, notGeo);
    }); //on connect

    socket.on('message', function(dialog){
        if (dialog.type == 'usersOnline') {
            $('.users-online').html('Currently there are ' + dialog.message + ' users online.');
        }; //if dialog.type
        // if (dialog.type == 'geolocation') {
        //     map.addMarker({
        //         lat: dialog.latitude,
        //         lng: dialog.longitude,
        //         title: "New user is here!!!",
        //         infoWindow: {
        //             content: "New User is here and stuff"
        //         },
        //         click: function(e){
        //         },
        //         mouseover: function(e){
        //         },
        //         mouseout: function(e){
        //         }
        //     }); //addMarker
        //     $('#container .inner').append('<div class="current-user">User at Lat: ' + dialog.latitude + ' and Long: ' + dialog.longitude + '</div>');
        // }; //if geolocation

        if (dialog.type == 'recentUsers'){
            console.log(dialog.list);
            console.log(dialog.list.length);
            $('#container .inner .recent').children().remove();
            $.each(dialog.list, function(i){
                //console.log(dialog.list[i].split(','));
            map.addMarker({
                lat: dialog.list[i].split(',')[0],
                lng: dialog.list[i].split(',')[1],
                title: "User at " + dialog.list[i],
                infoWindow: {
                    content: "User at " + dialog.list[i]
                },
                click: function(e){
                },
                mouseover: function(e){
                },
                mouseout: function(e){
                }
            }); //addMarker
            $('#container .inner .recent').append('<div class="current-user">User at ' + dialog.list[i] + '</div>');
            })
        }; //if recentUsers
    }); //on message

    socket.on('disconnect', function() {
        console.log('disconnected');
        $('#container .inner').html("<b>Disconnected!</b>");
    }); //on disconnect
}; //socketHandlers


function eventHandler(){
    $('#container h1').after('<p class="users-online"></p>');
}; //eventHandler



/*==( ^ Feed geolocation data if available, and add to map in gmaps
)======================================================*/

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












