locals {
  timestamp = formatdate("YYMMDDhhmmss", timestamp())
  root_dir  = abspath("../")
}

# Compress source code
data "archive_file" "source" {
  type        = "zip"
  source_dir  = local.root_dir
  excludes    = [".env"]
  output_path = "/tmp/function-${local.timestamp}.zip"
}

# Create bucket that will host the source code
resource "google_storage_bucket" "bucket" {
  name = "${var.project}-function"
}

# Add source code zip to bucket
resource "google_storage_bucket_object" "zip" {
  # Append file MD5 to force bucket to be recreated
  name   = "source.zip#${data.archive_file.source.output_md5}"
  bucket = google_storage_bucket.bucket.name
  source = data.archive_file.source.output_path
}

# Enable Cloud Functions API
resource "google_project_service" "cf" {
  project = var.project
  service = "cloudfunctions.googleapis.com"

  disable_dependent_services = true
  disable_on_destroy         = false
}

# Enable Cloud Build API
resource "google_project_service" "cb" {
  project = var.project
  service = "cloudbuild.googleapis.com"

  disable_dependent_services = true
  disable_on_destroy         = false
}

# Create Cloud Function
resource "google_cloudfunctions_function" "function" {
  name    = var.function_name
  runtime = "nodejs14" # Switch to a different runtime if needed

  available_memory_mb   = 128
  source_archive_bucket = google_storage_bucket.bucket.name
  source_archive_object = google_storage_bucket_object.zip.name
  trigger_http          = true
  entry_point           = var.function_entry_point
  service_account_email = var.service_account_email

  environment_variables = {
    MSSQL_HOST             = var.cf_env.mssql_host
    MSSQL_PORT             = var.cf_env.mssql_port
    MSSQL_USERNAME         = var.cf_env.mssql_username
    MSSQL_PASSWORD         = var.cf_env.mssql_password
    MSSQL_DATABASE         = var.cf_env.mssql_database
    MIN_REVIEW_DATE        = var.cf_env.min_review_date
    CALL_CRITERIA_BASE_URL = var.cf_env.call_criteria_base_url
    CALL_CRITERIA_APP_NAME = var.cf_env.call_criteria_app_name
    CALL_CRITERIA_API_KEY  = var.cf_env.call_criteria_api_key
  }

  vpc_connector                 = "projects/nth-mantra-320912/locations/us-central1/connectors/default"
  vpc_connector_egress_settings = "ALL_TRAFFIC"
}

# Create IAM entry so all users can invoke the function
resource "google_cloudfunctions_function_iam_member" "invoker" {
  project        = google_cloudfunctions_function.function.project
  region         = google_cloudfunctions_function.function.region
  cloud_function = google_cloudfunctions_function.function.name

  role   = "roles/cloudfunctions.invoker"
  member = "serviceAccount:${var.service_account_email}"
}
