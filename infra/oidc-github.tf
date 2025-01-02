resource "aws_iam_openid_connect_provider" "github" {
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]

  thumbprint_list = [
    # https://github.blog/changelog/2023-06-27-github-actions-update-on-oidc-integration-with-aws/
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "1c58a3a8518e8759bf075b76b750d4f2df264fcd"
  ]
}

variable "github_repo_id" {
  description = "GitHub repository identifier"
  type        = string
  default     = "github-username/repository-name"
}

# role for CI server (in this case, Github Action)
resource "aws_iam_role" "cicd_role" {
  name = "${local.name_prefix}-cicd-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Federated = aws_iam_openid_connect_provider.github.arn
        },
        Action = "sts:AssumeRoleWithWebIdentity",
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com",
          },
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:${var.github_repo_id}:*"
          }
        }
      },
      {
        Effect = "Allow",
        Principal = {
          AWS = "*"
        },
        Action = "sts:AssumeRole"
      }	      
    ]
  })
}

# permissions of CI server
resource "aws_iam_policy" "cicd_role_policy" {
  description = "Permissions of CICD server"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        "Effect" : "Allow",
        "Action" : ["iam:CreateRole", "iam:AttachRolePolicy", "iam:PassRole"],
        "Resource" : "*"
      },
      {
        "Effect" : "Allow",
        "Action" : ["s3:ListObjectsV2", "s3:GetObject", "s3:DeleteObject", "s3:PutObject"],
        "Resource" : "arn:aws:s3:::${var.artifact_bucket}/${local.s3_prefix}/*"
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        "Resource" : "*"
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "lambda:CreateFunction",
          "lambda:DeleteFunction",
          "lambda:UpdateFunctionCode",
          "lambda:GetFunction",
          "lambda:InvokeFunction",
          "lambda:AddPermission",
          "lambda:RemovePermission",
          "lambda:UpdateFunctionConfiguration",
          "lambda:PublishVersion",
          "lambda:CreateAlias",
          "lambda:UpdateAlias"
        ],
        "Resource" : "*"
      },
      {
        "Effect": "Allow",
        "Action": [
          "apigateway:*",
        ],
        "Resource": "arn:aws:apigateway:*::/restapis/${aws_api_gateway_rest_api.rest_api.id}"
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "cicd_role_policy_attachment" {
  role       = aws_iam_role.cicd_role.name
  policy_arn = aws_iam_policy.cicd_role_policy.arn
}

output "cicd_role_arn" {
  value = aws_iam_role.cicd_role.arn
}
