require('dotenv').config()

const sql = require('mssql')

const initMigration = async () => {
  const dbName = 'ma365db'
  const schemaName = 'doc'
  const tableName = 'callCriteriaResponses'
  const procName = 'insert_call_criteria_response'

  const pool = await sql.connect({
    server: process.env.MSSQL_HOST,
    port: parseInt(process.env.MSSQL_PORT),
    user: process.env.MSSQL_USERNAME,
    password: process.env.MSSQL_PASSWORD,
    options: {
      trustServerCertificate: true
    }
  })

  const queryCreateTable = `
    USE [${dbName}]
    CREATE TABLE ${schemaName}.${tableName} (
      row_id bigint identity(1,1) not null
      ,insertedDateTime datetimeoffset(7) default (getutcdate()) not null
      ,topic varchar(64) not null
      ,document nvarchar(max) not null
      ,transformed nvarchar(max) null
      ,validated  AS (isjson(document))
      ,constraint pk_doc_callcriteriaresponses_row_id primary key clustered (row_id)
    )
  `

  const queryCreateProc = `
    CREATE OR ALTER PROC dbo.${procName}(@document nvarchar(max))
    AS
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
      INSERT INTO ${schemaName}.${tableName} (topic, document)
      VALUES ('call-criteria-responses', @document);
    
    COMMIT TRANSACTION;
    SET NOCOUNT OFF;
  `

  const queryAddLookupkey = `
    ALTER TABLE ${schemaName}.${tableName}
    ADD lookupkey AS (CONVERT(varchar(36), JSON_VALUE(document, '$."SESSION_ID"')))
  `

  const queryAddReviewDate = `
    ALTER TABLE ${schemaName}.${tableName}
    ADD reviewDate AS (convert(DATETIME, json_value(document,'$."review_date"')))
  `

  const tx = pool.transaction()

  try {
    await tx.begin()
    const request = tx.request()

    await request.query(queryCreateTable)
    console.log(`Created Table: ${schemaName}.${tableName}`)

    await request.query(queryCreateProc)
    console.log(`Created Procedure: dbo.${procName}`)

    await request.query(queryAddLookupkey)
    console.log(`Added lookupkey to ${schemaName}.${tableName}`)

    await request.query(queryAddReviewDate)
    console.log(`Added reviewDate to ${schemaName}.${tableName}`)

    await tx.commit()
  } catch (e) {
    tx.rollback()
    console.error(e)
  }

  return sql.close()
}

(async () => {
  try {
    await initMigration()
  } catch (e) {
    console.error(e)
  }
})()
