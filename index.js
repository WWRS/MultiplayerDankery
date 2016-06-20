var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var players = [];

app.get('/', function(req, res){
	res.send('The secret code is "BD9/11".');
});

io.on('connection', function(socket){
	console.log("Player connected.");
	socket.emit('socketID', {id: socket.id});
	socket.emit('getPlayers', players);
	socket.broadcast.emit('newPlayer', {id: socket.id});
	socket.on('playerMoved', function(data){
		data.id = socket.id;
		socket.broadcast.emit('playerMoved', data);
		
		for(var i = 0; i < players.length; i++){
			if(players[i].id == data.id){
				players[i].x = data.x;
				players[i].y = data.y;
				players[i].isRight = data.isRight;
			}
		}
	});
	
	socket.on('disconnect', function(){
		console.log("Player disconnected");
		socket.broadcast.emit('playerDisconnected', {id:socket.id});
		for(var i = 0; i < players.length; i++){
			if(players[i].id == socket.id){
				players.splice(i, 1);
			}
		}
	});
	
	players.push(new player(socket.id, 64, 64, true));
});

const port = 51337;
server.listen(port, function(){
	console.log("Server started, running. Port: " + port);
});

function player(id, x, y, isRight){
	this.id = id;
	this.x = x;
	this.y = y;
	this.isRight = isRight;
}