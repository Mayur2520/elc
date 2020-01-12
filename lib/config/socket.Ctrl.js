module.exports = function (socketio) {
console.log('--------------- inside controller')
  socketio.on('connection', function(client) {
    console.log('connec user');
    client.on('disconnect', function() {
    console.log("disconnected")
    });
    });

     
};