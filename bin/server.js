const app = require('../src/app');
const debug = require('debug')('e-cattle:server');
const http = require('http');
const mongoose = require('mongoose');
const config = require('../src/config');

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

let delay = process.env.NODE_ENV == 'production' ? 30000 : 1;

// Connecta ao banco
setTimeout(function() {
  if(process.env.NODE_ENV == 'production'){
      mongoose.connect( config.db.production, {useMongoClient: true});
  } else if(process.env.NODE_ENV == 'docker'){
      mongoose.connect( config.db.docker, {useMongoClient: true});
  } else{
      mongoose.connect( config.db.development, {useMongoClient: true});
  }

  mongoose.connection.once('open', function() {
    app.emit('ready'); 
  });
}, delay);

const server = http.createServer(app);

app.on('ready', function() {
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
  console.log('API rodando na porta ' + port);
});

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}