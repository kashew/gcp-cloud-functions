module.exports = class SyncService {
  constructor(api, dbPool, logger) {
    this.api = api
    this.dbPool = dbPool
    this.logger = logger
  }

  async sync() {
    const currentDate = this.#getCurrentUtcDate()
    await this.dbPool.connect()

    let reviewDate = await this.#fetchReviewDate()

    while (reviewDate < currentDate) {
      const result = await this.api.getAllRecords(reviewDate, true)
      const tx = this.dbPool.transaction()

      try {
        await tx.begin()
        const request = tx.request()

        for (const record of result.data) {
          const query = `EXEC dbo.insert_call_criteria_response @document = '${JSON.stringify(record).replace(/\'/g, "''")}';`

          await request.query(query)
        }

        await tx.commit()
      } catch (err) {
        this.logger.error(err)
        await tx.rollback()
        return err
      }

      this.logger.info(`Synced Records for Review Date: ${reviewDate.toDateString()}`)
      reviewDate = this.#addDays(reviewDate, 1)
    }

    return true
  }

  async #fetchReviewDate() {
    const query = `
      SELECT TOP(1) reviewDate
      FROM doc.callCriteriaResponses WITH (nolock)
      ORDER BY reviewDate DESC
    `

    const response = await this.dbPool.query(query)
    const rowsAffected = response.rowsAffected[0]

    const reviewDate = (rowsAffected === 1)
      ? new Date(response.recordset[0].reviewDate)
      : null

    return (reviewDate === null)
      ? this.#getMinReviewDate()
      : this.#addDays(reviewDate, 1)
  }

  #addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  #getMinReviewDate() {
    const dateParts = process.env.MIN_REVIEW_DATE.split('-')
    const year = parseInt(dateParts[0])
    const month = parseInt(dateParts[1]) - 1
    const date = parseInt(dateParts[2])

    return new Date(year, month, date)
  }

  #getCurrentUtcDate() {
    const currentDate = new Date()
    const currentUtcYear = currentDate.getUTCFullYear()
    const currentUtcMonth = currentDate.getUTCMonth()
    const currentUtcDate = currentDate.getUTCDate()

    return new Date(Date.UTC(currentUtcYear, currentUtcMonth, currentUtcDate))
  }
}