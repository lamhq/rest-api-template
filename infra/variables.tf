variable "aws_region" {
  description = "AWS region where resources will be created"
  type        = string
  default     = "us-central-1"
}

variable "project" {
  type        = string
  description = "Project name"
}
