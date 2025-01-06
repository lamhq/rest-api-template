output "project" {
  description = "Project name"
  value = var.project
}

output "environment" {
  description = "Runtime environment (e.g., dev, prod)"
  value = local.env
}

output "aws_region" {
  description = "AWS region where resources are created"
  value = var.aws_region
}