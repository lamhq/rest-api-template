# environment variables for the api app
variable "api_env_vars" {
  description = "Environment variables for the application"
  type = object({
    WEB_URL      = string
    DB_URI       = string
  })
}

# role for the api app
resource "aws_iam_role" "api_role" {
  name = "${local.name_prefix}-api-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
  tags = local.role_tags
}

# api permission policy
resource "aws_iam_policy" "api_policy" {
  name = "${local.name_prefix}-api-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # logging
      {
        "Effect" : "Allow",
        "Action" : [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        "Resource" : "${aws_cloudwatch_log_group.api_log_grp.arn}"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "api_pol_attm" {
  role       = aws_iam_role.api_role.name
  policy_arn = aws_iam_policy.api_policy.arn
}

# deployment package for the api
data "archive_file" "api_archive" {
  type        = "zip"
  source_dir  = "${local.build_dir}/api"
  excludes    = ["code.zip"]
  output_path = "${local.build_dir}/api.zip"
}

# s3 object that contain function code
resource "aws_s3_object" "api_obj" {
  bucket      = var.artifact_bucket
  key         = "${local.s3_prefix}/api.zip"
  source      = data.archive_file.api_archive.output_path
  source_hash = filemd5(data.archive_file.api_archive.output_path)
}

# lambda function that host the api
resource "aws_lambda_function" "api_handler" {
  function_name    = "${local.name_prefix}-api"
  handler          = "lambda.handler"
  role             = aws_iam_role.api_role.arn
  s3_bucket        = var.artifact_bucket
  s3_key           = aws_s3_object.api_obj.key
  source_code_hash = aws_s3_object.api_obj.source_hash
  runtime          = "nodejs22.x"
  timeout          = 10
  memory_size      = 256
  architectures    = ["arm64"]
  environment {
    variables = merge(var.api_env_vars, {
      NO_COLOR = "true"
      NODE_OPTIONS = "--enable-source-maps"
    })
  }
}

# lambda function's log group
resource "aws_cloudwatch_log_group" "api_log_grp" {
  name = "/aws/lambda/${aws_lambda_function.api_handler.function_name}"
}
