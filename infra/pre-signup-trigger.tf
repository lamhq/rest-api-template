# deployment package for pre-sign up trigger function
data "archive_file" "functions_archive" {
  type        = "zip"
  source_dir  = "${local.build_dir}/functions"
  output_path = "${local.build_dir}/functions.zip"
}

# s3 object that contain function code
resource "aws_s3_object" "functions_obj" {
  bucket      = aws_s3_bucket.project_bucket.id
  key         = "functions.zip"
  source      = data.archive_file.functions_archive.output_path
  source_hash = filemd5(data.archive_file.functions_archive.output_path)
}

# lambda function's role
resource "aws_iam_role" "functions_role" {
  name = "${local.name_prefix}-functions-role"
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

# lambda function permission policy
resource "aws_iam_policy" "pre_signup_trigger_policy" {
  name = "${local.name_prefix}-pre-signup-trigger-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # user pool
      {
        Effect = "Allow"
        Action = [
          "cognito-idp:AdminGetUser",
          "cognito-idp:AdminLinkProviderForUser"
        ]
        Resource = "${aws_cognito_user_pool.user_pool.arn}"
      },
      # logging
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "${aws_cloudwatch_log_group.pre_signup_trigger_log_grp.arn}:*"
      }
    ]
  })
}

# lambda function role & policy
resource "aws_iam_role_policy_attachment" "pre_signup_trigger_pol_attm" {
  role       = aws_iam_role.functions_role.name
  policy_arn = aws_iam_policy.pre_signup_trigger_policy.arn
}

# lambda function
resource "aws_lambda_function" "pre_signup_trigger" {
  function_name    = "${local.name_prefix}-pre-signup-trigger"
  handler          = "pre-signup.handler"
  role             = aws_iam_role.functions_role.arn
  s3_bucket        = aws_s3_bucket.project_bucket.id
  s3_key           = aws_s3_object.functions_obj.key
  source_code_hash = aws_s3_object.functions_obj.source_hash
  runtime          = "nodejs22.x"
  timeout          = 10
  memory_size      = 256
  architectures    = ["arm64"]
  environment {
    variables = {
      NODE_OPTIONS = "--enable-source-maps"
    }
  }
}

# lambda function's log group
resource "aws_cloudwatch_log_group" "pre_signup_trigger_log_grp" {
  name = "/aws/lambda/${aws_lambda_function.pre_signup_trigger.function_name}"
}


# resource based policy that allow Amazon Cognito to invoke the trigger
resource "aws_lambda_permission" "api_cognito_permission" {
  statement_id  = "AllowACognitoInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.pre_signup_trigger.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.user_pool.arn
}
