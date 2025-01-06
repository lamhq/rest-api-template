# api gateway
resource "aws_api_gateway_rest_api" "nb_api" {
  name = "${local.name_prefix}-nb-api"
  endpoint_configuration {
    types = ["EDGE"]
  }
}

# deployment
resource "aws_api_gateway_deployment" "nb_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.nb_api.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.nb_proxy_res.id,
      aws_api_gateway_method.nb_proxy_method.id,
      aws_api_gateway_integration.nb_lambda_int.id,
      aws_api_gateway_authorizer.nb_authorizer.id,
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

# stage v1
resource "aws_api_gateway_stage" "nb_api_v1_stage" {
  deployment_id = aws_api_gateway_deployment.nb_api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.nb_api.id
  stage_name    = "v1"
}

# API resource
resource "aws_api_gateway_resource" "nb_proxy_res" {
  rest_api_id = aws_api_gateway_rest_api.nb_api.id
  parent_id   = aws_api_gateway_rest_api.nb_api.root_resource_id
  path_part   = "{proxy+}"
}

# API method
resource "aws_api_gateway_method" "nb_proxy_method" {
  rest_api_id   = aws_api_gateway_rest_api.nb_api.id
  resource_id   = aws_api_gateway_resource.nb_proxy_res.id
  http_method   = "ANY"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.nb_authorizer.id
}

# method integration
resource "aws_api_gateway_integration" "nb_lambda_int" {
  rest_api_id             = aws_api_gateway_rest_api.nb_api.id
  resource_id             = aws_api_gateway_resource.nb_proxy_res.id
  http_method             = aws_api_gateway_method.nb_proxy_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.api_handler.invoke_arn
}

# API authorizer
resource "aws_api_gateway_authorizer" "nb_authorizer" {
  name            = "${local.name_prefix}-nb-authorizer"
  type            = "COGNITO_USER_POOLS"
  rest_api_id     = aws_api_gateway_rest_api.nb_api.id
  provider_arns   = [aws_cognito_user_pool.user_pool.arn]
  identity_source = "method.request.header.Authorization"
}

output "api_url" {
  value = aws_api_gateway_stage.nb_api_v1_stage.invoke_url
}
