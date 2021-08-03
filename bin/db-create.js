require('dotenv').config()

const sql = require('mssql')

const createDatabase = async () => {
  const dbName = 'ma365db'
  const schemaName = 'doc'

  await sql.connect({
    server: process.env.MSSQL_HOST,
    port: parseInt(process.env.MSSQL_PORT),
    user: process.env.MSSQL_USERNAME,
    password: process.env.MSSQL_PASSWORD,
    options: {
      trustServerCertificate: true
    }
  })

  const queryCreateDb = `
    IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = '${dbName}')
    CREATE DATABASE [${dbName}]
  `

  const queryCreateSchema = `
    USE [${dbName}]
    IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'${schemaName}')
    EXEC('CREATE SCHEMA [${schemaName}]')
  `

  await sql.query(queryCreateDb)
  console.log(`Created Database: ${dbName}`)

  await sql.query(queryCreateSchema)
  console.log(`Created Schema: ${schemaName}`)

  return sql.close()
}

(async () => {
  try {
    await createDatabase()
  } catch (e) {
    console.error(e)
  }
})()