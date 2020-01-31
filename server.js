
const __ = require('./src/services/log-service')

__('Including dependencies:')

__('Trying dotenv...')
const dotenv = require('dotenv')

__('Loading .env settings...')

__('SNAP_COMMON=' + process.env.SNAP_COMMON)
__('SNAP_DATA=' + process.env.SNAP_DATA)

if (process.env.SNAP_COMMON) {
  dotenv.config({ path: process.env.SNAP_COMMON + '/.env' })
} else {
  dotenv.config()
}

__('Settings loaded for \'' + process.env.NODE_ENV + '\'', {
  device: process.env.DEVICE_PK,
  totem: process.env.TOTEM_PK,
  app: process.env.APP_PK,
  transient: process.env.TRANSIENT_PK
})

__('Trying app...')
const app = require('./src/app')

__('Trying http...')
const http = require('http')

__('Trying mongoose...')
const mongoose = require('mongoose')

__('Trying lorawan...')
var lorawan = require('lorawan-js')

__('Trying node-persist...')
const storage = require('node-persist')

__('All dependencies included!')

if (process.env.SNAP_DATA) {
  storage.init({ dir: process.env.SNAP_DATA })
} else {
  storage.init()
}

const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

__('Starting server to environment \'' + process.env.NODE_ENV + '\'...')

__('Trying loading settings to ' + process.env.NODE_ENV + '...')
const settings = require('./settings/' + process.env.NODE_ENV + '.json')

const uri = settings.db

if (!uri) {
  __('Invalid URI for MongoDB connection: ' + uri)
  process.exit(1)
}

__('Trying connect to MongoDB: ' + uri)

connect()

const server = http.createServer(app)

const lora = new lorawan.Server({ port: 3005 })

app.on('ready', function () {
  // HTTP Server
  server.listen(port)
  server.on('error', onError)
  server.on('listening', onListening)
  __('API HTTP Ready. Port: ', port)

  // LoRa Server
  lora.start()
  lora.on('pushdata_rxpk', onPushData)
  lora.on('ready', (info, loraServer) => {
    __('API LoRa Ready: ', info)
  })
})

function connect () {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    connectTimeoutMS: 12000
  }).then(() => {
    __('MongoDB connected!')
    app.emit('ready')
  }).catch((error) => {
    __('Error on MongoDB connection: ' + error)
    setTimeout(connect, 6000)
  })
}

function normalizePort (val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)

    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)

    default:
      throw error
  }
}

function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  __('Listening on ' + bind)
}

function onPushData (message, clientInfo) {
  __('clientInfo: ', clientInfo)
  var pdata = message.data.rxpk[0].data
  var buff = Buffer.from(pdata, 'Base64')

  var MYpacket = lorawan.Packet(buff)

  __('[Upstream] IN pushdata RXPK - ', MYpacket.MType.Description, ' from: ', MYpacket.Buffers.MACPayload.FHDR.DevAddr)

  let NwkSKey = null
  let AppSKey = null

  let MYdec = null

  if (MYpacket.Buffers.MACPayload.FHDR.DevAddr.toString('hex') === 'be7a0000') {
    NwkSKey = Buffer.from('000102030405060708090A0B0C0D0E0F', 'hex')
    AppSKey = Buffer.from('000102030405060708090A0B0C0D0E0F', 'hex')

    MYdec = MYpacket.decryptWithKeys(AppSKey, NwkSKey)

    __('MY Time: ' + MYdec.readUInt32LE(0).toString() + ' Battery: ' + MYdec.readUInt8(4).toString() + ' Temperature: ' + MYdec.readUInt8(5).toString() + ' Lat: ' + MYdec.readUInt32LE(6).toString() + ' - Long: ' + MYdec.readUInt32LE(10).toString())
  } else if (MYpacket.Buffers.MACPayload.FHDR.DevAddr.toString('hex') === '03ff0001') {
    NwkSKey = Buffer.from('2B7E151628AED2A6ABF7158809CF4F3C', 'hex')
    AppSKey = Buffer.from('2B7E151628AED2A6ABF7158809CF4F3C', 'hex')

    MYdec = MYpacket.decryptWithKeys(AppSKey, NwkSKey)
    __('MYdec: ', MYdec.toString('utf8'), ' - ', MYdec.length)
  } else {
    __('New device: ', MYpacket.Buffers.MACPayload.FHDR.DevAddr.toString('hex'))
  }
}
