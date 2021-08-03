variable "project" {
  default = "nth-mantra-320912"
}
variable "region" {
  default = "us-central1" # Choose a region
}
variable "uri" {
  default = ""
}
variable "service_account_email" {
  default = ""
}
variable "cf_env" {
  type = object({
    mssql_host             = string
    mssql_port             = string
    mssql_username         = string
    mssql_password         = string
    mssql_database         = string
    min_review_date        = string
    call_criteria_base_url = string
    call_criteria_app_name = string
    call_criteria_api_key  = string
  })
  sensitive = true
}
