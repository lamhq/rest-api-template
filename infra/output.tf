output "region" {
  description = "AWS region where resources are created"
  value = var.region
}

output "project" {
  description = "Project name"
  value = var.project
}

output "environment" {
  description = "Runtime environment (e.g., dev, prod)"
  value = local.env
}

output "api_url" {
  value = aws_api_gateway_stage.rest_api_v1_stage.invoke_url
}
