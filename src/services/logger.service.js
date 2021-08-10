const { LoggingBunyan } = require('@google-cloud/logging-bunyan')
const loggingBunyan = new LoggingBunyan({
  projectId: 'nth-mantra-320912',
  serviceContext: {
    service: 'my-function',
    version: '0.0.1'
  }
})

function createLogger() {
  const bunyan = require('bunyan')

  return bunyan.createLogger({
    name: 'call-criteria-sync',
    serializers: bunyan.stdSerializers,
    streams: [
      // Log to the console at 'info' and above
      { stream: process.stdout, level: 'info' },
      // And log to Cloud Logging, logging at 'info' and above
      loggingBunyan.stream('info')
    ]
  })
}

module.exports = {
  createLogger
}