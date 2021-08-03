const axios = require('axios')

const callCriteriaApi = axios.create({
  baseURL: process.env.CALL_CRITERIA_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  params: {
    appname: process.env.CALL_CRITERIA_APP_NAME,
    apikey: process.env.CALL_CRITERIA_API_KEY
  }
})

const getAllRecords = (callDate, useReview) => {
  const endpoint = '/GetAllRecords'

  return callCriteriaApi.post(endpoint, {
    call_date: getDateString(callDate),
    use_review: useReview.toString()
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

const getDateString = (date) => {
  let month = (date.getMonth() + 1).toString()
  if (month.length === 1)
    month = '0' + month

  let day = date.getDate().toString()
  if (day.length === 1)
    day = '0' + day

  const year = date.getFullYear().toString()

  return `${month}/${day}/${year}`
}

module.exports = {
  getAllRecords
}