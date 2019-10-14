const app = require('./src/app');
const debug = require('debug')('e-cattle:server');
const http = require('http');
const mongoose = require('mongoose');
const config = require('./src/config');
var lorawan = require('lorawan-js');

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

let delay = process.env.NODE_ENV == 'production' ? 30000 : 1;

// Connecta ao banco
setTimeout(function () {
  if (process.env.NODE_ENV == 'production') {
    mongoose.connect(config.db.production);
  } else if (process.env.NODE_ENV == 'docker') {
    mongoose.connect(config.db.docker);
  } else {
    mongoose.connect(config.db.development);
  }

  mongoose.connection.once('open', function () {
    app.emit('ready');
  });
}, delay);

const server = http.createServer(app);

const lora = new lorawan.Server({ port: 3005 });

app.on('ready', function () {
  // HTTP Server
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
  console.log('API HTTP Ready. Port: ', port);

  // LoRa Server
  lora.start();
  lora.on('pushdata_rxpk', onPushData);
  lora.on('ready', (info, loraServer) => {
    console.log('API LoRa Ready: ', info);
  });
});

function normalizePort (val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError (error) {
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

function onListening () {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

function onPushData (message, clientInfo) {
  console.log('clientInfo: ', clientInfo)
  var pdata = message.data.rxpk[0].data;
  var buff = new Buffer(pdata, 'Base64');

  var MYpacket = lorawan.Packet(buff);

  console.log("[Upstream] IN pushdata RXPK - ", MYpacket.MType.Description, " from: ", MYpacket.Buffers.MACPayload.FHDR.DevAddr);

  if (MYpacket.Buffers.MACPayload.FHDR.DevAddr.toString('hex') == "be7a0000") {
    var NwkSKey = new Buffer('000102030405060708090A0B0C0D0E0F', 'hex');
    var AppSKey = new Buffer('000102030405060708090A0B0C0D0E0F', 'hex');

    var MYdec = MYpacket.decryptWithKeys(AppSKey, NwkSKey);

    console.log("MY Time: " + MYdec.readUInt32LE(0).toString() + " Battery: " + MYdec.readUInt8(4).toString() + " Temperature: " + MYdec.readUInt8(5).toString() + " Lat: " + MYdec.readUInt32LE(6).toString() + " - Long: " + MYdec.readUInt32LE(10).toString());
  } else if (MYpacket.Buffers.MACPayload.FHDR.DevAddr.toString('hex') == "03ff0001") {
    var NwkSKey = new Buffer('2B7E151628AED2A6ABF7158809CF4F3C', 'hex');
    var AppSKey = new Buffer('2B7E151628AED2A6ABF7158809CF4F3C', 'hex');

    var MYdec = MYpacket.decryptWithKeys(AppSKey, NwkSKey);
    console.log("MYdec: ", MYdec.toString('utf8'), " - ", MYdec.length);
  } else {
    console.log("New device: ", MYpacket.Buffers.MACPayload.FHDR.DevAddr.toString('hex'));
  }
}
