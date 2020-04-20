const  RedisPubSub = require('node-redis-pubsub')
const Redis = require('redis')

const { REDIS_HOST = 'localhost', REDIS_PORT = 6379 } = process.env
const config = {
  host: REDIS_HOST,
  port: REDIS_PORT,
}
const emitter = new Redis.createClient(config)
const receiver = new Redis.createClient(config)

exports.pubsub = new RedisPubSub({
  emitter,
  receiver,
})
