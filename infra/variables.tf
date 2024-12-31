variable "region" {
  description = "AWS region where resources will be created"
  type        = string
  default     = "us-central-1"
}

variable "project" {
  type        = string
  description = "Project name"
}

variable "artifact_bucket" {
  description = "S3 bucket for storing project's artifacts (Terraform state, Lambda function code, Lambda layers)"
  type        = string
}

variable "env_vars" {
  description = "Environment variables for the application"
  type = object({
    WEB_URL      = string
    DB_URI       = string
  })
}
