const fastify = require('fastify')
const app = fastify({ logger: true })

require('dotenv').config()

app.register(require('fastify-postgres'), {
  connectionString: process.env.DATABASE_URL
})

app.get('/', async (req, res) => {
  app.pg.connect(function (err, client, release) {
    if (err) return res.send(err)

    client.query(
      'SELECT * FROM agent_feed_items LIMIT 10;', [],
      function onResult(err, result) {
        release()
        res.send(err || result)
      }
    )
  })
})

exports.app = async (req, res) => {
  try {
    await app.ready()
    app.server.emit('request', req, res)
  } catch (e) {
    console.log(e)
  }
}