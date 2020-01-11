
	var dbcreation = require('./lib/config/dbCreation');
	
var express = require('express'),
	path = require('path'),
	bodypareser = require('body-parser'),
	fs = require('fs'),
	env = require('./lib/config/env'),
	morgan = require('morgan'),
	cryptconf = require('./lib/config/crypt.config');

	var routes = require('./lib/routes');

	var app = express();

	let http = require('http').Server(app);

	// Socket setting
	let io = require('socket.io')(http);
	require('./lib/config/socket.Ctrl')(io);
	// Socket setting

app.use(bodypareser.urlencoded({limit:'20mb',extended:true}));
app.use(bodypareser.json({limit:'20mb'}));
	
app.use(express.static(path.join(__dirname,'app')));

routes.configure(app);

 dbcreation.createDB();
dbcreation.CreateTables();
 
var server = app.listen(parseInt(env.port),function(){
	console.log('server start on '+ server.address().port+ ' port');
})	


