/*
 * Prerequisites
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , _redis = require("redis")
  , redis = _redis.createClient();


/*
 * App/Express Configuration 
 */

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

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
  res.sendfile(__dirname + '/views/map.html');
});


/*
 * Socket.io Configuration
 */

io.sockets.on('connection', function (socket) {
    console.log('A socket connected! ' + socket);
    io.sockets.emit('initialConnection', { hello: 'world' });

    socket.on('setGeoData', function(userLat, userLong){
        console.log(userLat+', '+userLong);
        io.sockets.emit('respondedBack', userLat, userLong);
    }); //socket.on setGeoData

}); //io.sockets.on connection















/*
 * Run Server Environment
 */

app.get('/', routes.index);
app.get('/users', user.list);
server.listen(3000);





















