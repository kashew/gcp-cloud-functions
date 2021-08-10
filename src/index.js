require('dotenv').config()

const app = require('fastify')()
const sql = require('mssql')
const sqlConfig = require('./config').sqlConfig
const SyncService = require('./services/sync.service')
const logger = require('./services/logger.service').createLogger()

app.get('/', async (req, res) => {
  const callCriteriaApi = require('./services/callcriteria.service')
  const pool = new sql.ConnectionPool(sqlConfig)

  const syncService = new SyncService(callCriteriaApi, pool, logger)

  try {
    await syncService.sync()
  } catch (e) {
    logger.error(e)
  }

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