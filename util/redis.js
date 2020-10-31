const redis = require("redis")

const client = redis.createClient({
    port: process.env.REDIS_CLIENT_PORT,
    host: process.env.REDIS_CLIENT_HOST
})

client.on("connect", () => {
    console.log("client connected to redis")
})

client.on("ready", () => {
    console.log("client connected to redis and ready to use")
})

client.on("error", (err) => {
    throw err;
})

client.on("end", () => {
    console.log("client  disconnected from redis")
})

process.on("SIGINT", () => {
    client.quit()
})

module.exports = client;