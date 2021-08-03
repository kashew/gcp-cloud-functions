provider "google" {
  project = var.project
  region  = var.region
}

module "my_function" {
  source                = "./modules/function"
  project               = var.project
  function_name         = "my-function"
  function_entry_point  = "app"
  cf_env                = var.cf_env
  service_account_email = var.service_account_email
}

module "callcriteria_scheduler" {
  source                = "./modules/scheduler"
  project               = var.project
  uri                   = var.uri
  service_account_email = var.service_account_email
}
