var config = require('./config');
var serverModule = require('./server');
var UserHandling = require('./userhandling');
var userHandling = new UserHandling(serverModule.socketIO);

serverModule.http.listen(config.express.port, function() {
  console.log('HTTP Server listening on *:' + config.express.port);
});
