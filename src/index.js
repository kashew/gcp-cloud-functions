require('dotenv').config()

const app = require('fastify')()
const SyncService = require('./services/sync.service')
const logger = require('./services/logger.service').createLogger()
const callCriteriaApi = require('./services/callcriteria.service')


app.register(require('fastify-mssql'), {
  server: process.env.MSSQL_HOST,
  port: parseInt(process.env.MSSQL_PORT),
  user: process.env.MSSQL_USERNAME,
  password: process.env.MSSQL_PASSWORD,
  database: process.env.MSSQL_DATABASE,
  options: {
    trustServerCertificate: true
  }
})

app.get('/', async (req, res) => {
  const syncService = new SyncService(callCriteriaApi, app.mssql.pool, logger)

  syncService.sync().catch(e => {
    logger.error(e)
  })

  return true
})

exports.app = async (req, res) => {
  try {
    await app.ready()
    app.server.emit('request', req, res)
  } catch (e) {
    logger.error(e)
  }
}