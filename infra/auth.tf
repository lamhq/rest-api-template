variable "google_client_id" {
  type = string
}

variable "google_client_secret" {
  type = string
}

resource "aws_cognito_user_pool" "user_pool" {
  name = "${local.name_prefix}-user-pool"

  admin_create_user_config {
    # disable user self registration
    allow_admin_create_user_only = true
  }

  lambda_config {
    pre_sign_up = aws_lambda_function.pre_signup_trigger.arn
  }
}

resource "aws_cognito_identity_provider" "google_idp" {
  user_pool_id  = aws_cognito_user_pool.user_pool.id
  provider_name = "Google"
  provider_type = "Google"

  provider_details = {
    client_id                     = var.google_client_id
    client_secret                 = var.google_client_secret
    authorize_scopes              = "openid email profile"
    attributes_url                = "https://people.googleapis.com/v1/people/me?personFields="
    attributes_url_add_attributes = true
    authorize_url                 = "https://accounts.google.com/o/oauth2/v2/auth"
    oidc_issuer                   = "https://accounts.google.com"
    token_request_method          = "POST"
    token_url                     = "https://www.googleapis.com/oauth2/v4/token"
  }

  attribute_mapping = {
    email = "email"
    username = "sub"
  }
}

resource "aws_cognito_user_pool_client" "user_pool_client" {
  name                         = "${local.name_prefix}-user-pool-client"
  user_pool_id                 = aws_cognito_user_pool.user_pool.id
  supported_identity_providers = ["Google"]
  generate_secret              = true
  explicit_auth_flows = [
    "ALLOW_REFRESH_TOKEN_AUTH",
  ]

  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["implicit"]
  allowed_oauth_scopes                 = ["email", "openid", "profile"]
  callback_urls                        = ["https://google.com/callback"]
  logout_urls                          = ["https://google.com/logout"]

  depends_on = [aws_cognito_identity_provider.google_idp]
}

resource "aws_cognito_user_pool_domain" "user_pool_domain" {
  domain       = "nb"
  user_pool_id = aws_cognito_user_pool.user_pool.id
}

# deployment package for pre-sign up trigger function
data "archive_file" "functions_archive" {
  type        = "zip"
  source_dir  = "${local.build_dir}/functions"
  output_path = "${local.build_dir}/functions.zip"
}

# s3 object that contain function code
resource "aws_s3_object" "functions_obj" {
  bucket      = var.artifact_bucket
  key         = "${local.s3_prefix}/functions.zip"
  source      = data.archive_file.functions_archive.output_path
  source_hash = filemd5(data.archive_file.functions_archive.output_path)
}

# role for all lambda functions
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

# access to Cognito resources
resource "aws_iam_policy" "cognito_policy" {
  name        = "${local.name_prefix}-pre-signup-trigger-policy"
  description = "permissions of Cognito pre-signup trigger lambda function"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # user pool
      {
        "Effect" : "Allow",
        "Action" : [
          "cognito-idp:AdminGetUser",
          "cognito-idp:AdminLinkProviderForUser"
        ],
        "Resource" : "${aws_cognito_user_pool.user_pool.arn}"
      },
      # logging
      {
        "Effect" : "Allow",
        "Action" : [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        "Resource" : "${aws_cloudwatch_log_group.pre_signup_trigger_log_group.arn}"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "pre_signup_trigger_cognito_pol_att" {
  role       = aws_iam_role.functions_role.name
  policy_arn = aws_iam_policy.cognito_policy.arn
}

# lambda function
resource "aws_lambda_function" "pre_signup_trigger" {
  function_name    = "${local.name_prefix}-pre-signup-trigger"
  handler          = "pre-signup.handler"
  role             = aws_iam_role.functions_role.arn
  s3_bucket        = var.artifact_bucket
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
resource "aws_cloudwatch_log_group" "pre_signup_trigger_log_group" {
  name = "/aws/lambda/${aws_lambda_function.pre_signup_trigger.function_name}"
}
