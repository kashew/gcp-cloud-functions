resource "google_cloud_scheduler_job" "job" {
  name             = "call-criteria-job"
  description      = "call criteria scorecard data http job"
  schedule         = "0 2 * * *"
  time_zone        = "America/New_York"
  attempt_deadline = "320s"

  retry_config {
    retry_count = 1
  }

  http_target {
    http_method = "GET"
    uri         = var.uri

    oidc_token {
      service_account_email = var.service_account_email
    }
  }
}
