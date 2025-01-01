# role for all lambda functions
resource "aws_iam_role" "lambda_role" {
  name = "${local.name_prefix}-lambda-role"
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

# role's policy `AWSLambdaBasicExecutionRole`
resource "aws_iam_role_policy_attachment" "lambda_basic_exec_policy" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# deployment package for Lambda function
data "archive_file" "code_archive" {
  type        = "zip"
  source_dir  = "${local.build_dir}"
  excludes    = ["code.zip"]
  output_path = "${local.build_dir}/code.zip"
}

# s3 object that contain function code
resource "aws_s3_object" "code_object" {
  bucket      = var.artifact_bucket
  key         = "${local.s3_prefix}/code.zip"
  source      = data.archive_file.code_archive.output_path
  source_hash = filemd5(data.archive_file.code_archive.output_path)
}

# lambda function
resource "aws_lambda_function" "lambda_function" {
  function_name    = "${local.name_prefix}-lambda"
  handler          = "lambda.handler"
  role             = aws_iam_role.lambda_role.arn
  s3_bucket        = var.artifact_bucket
  s3_key           = aws_s3_object.code_object.key
  source_code_hash = aws_s3_object.code_object.source_hash
  runtime          = "nodejs22.x"
  timeout          = 10
  memory_size      = 256
  architectures    = ["arm64"]
  environment {
    variables = merge(var.env_vars, {
      NO_COLOR = "true"
      NODE_OPTIONS = "--enable-source-maps"
    })
  }
}

# lambda function's log group
resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name = "/aws/lambda/${aws_lambda_function.lambda_function.function_name}"
}
