const RedisPubSub = require('node-redis-pubsub')
const Redis = require('redis')
const folder = process.env.SNAP_DATA ? process.env.SNAP_DATA + '/settings/' : '../../settings/'
const settings = require(folder + process.env.NODE_ENV + '.json')

const config = {
  host: process.env.REDIS_CLOUD || settings.redis,
}
const emitter = new Redis.createClient(config)
const receiver = new Redis.createClient(config)

exports.pubsub = new RedisPubSub({
  emitter,
  receiver,
})
