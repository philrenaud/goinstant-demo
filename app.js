/*
 * Prerequisites
 */

    var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path')
    , fs = require ('fs');


/*
 * App/Express Configuration 
 */

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// assuming io is the Socket.IO server object
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/views/index.html');
});



/*
 * Run Server Environment
 */
var port = process.env.PORT || 3000;
app.get('/', routes.index);
app.get('/users', user.list);
server.listen(port);






//If you are using RedisToGo with Heroku
if (process.env.REDISTOGO_URL) {
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    var redis1 = require("redis").createClient(rtg.port, rtg.hostname);
    var redis2 = require("redis").createClient(rtg.port, rtg.hostname);
    var redis3 = require("redis").createClient(rtg.port, rtg.hostname);
    var userData = require("redis").createClient(rtg.port, rtg.hostname);

    redis1.auth(rtg.auth.split(":")[1]);
    redis2.auth(rtg.auth.split(":")[1]);
    redis3.auth(rtg.auth.split(":")[1]);
    userData = require("redis").createClient(rtg.port, rtg.hostname);
} else {
    //If you are using your own Redis server
    var redis1 = require("redis").createClient();
    var redis2 = require("redis").createClient();
    var redis3 = require("redis").createClient();
    var userData = require("redis").createClient();
}

io.sockets.on('connection', function (client) {

    userData.sadd('usersOnline', client.id);

    userData.smembers('usersOnline', function(err, data){
        var dialog = {type:'usersOnline', message: data.length};
        io.sockets.json.send(dialog);
    }); //userData.smembers
    
    client.on('message', function(msg) {
        if(msg.type == "chat"){
            //redis2.publish("phil-demo",msg.message);  
        } //if msg.type == chat
        else if(msg.type == "setUsername"){
            //redis2.publish("phil-demo", "A New User is connected : " + msg.user);
        } //if msg.type == setUsername
        else if (msg.type == "geolocation") {
            userData.sadd('userLocation', 'lat: ' + msg.latitude + ', lng: ' + msg.longitude + ',');
            var dialog = {type:'geolocation', latitude: msg.latitude, longitude: msg.longitude};
            io.sockets.json.send(dialog)
        }
    }); //on message

    client.on('disconnect', function() {
        userData.srem('usersOnline', client.id);
    }); //on disconnect
}); //on connection