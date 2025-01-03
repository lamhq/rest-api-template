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

variable "dynamodb_table" {
  description = "DynamoDB table name to perform state locking"
  type        = string
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
  name        = "${local.name_prefix}-terraform-permissions"
  description = "Permissions of CICD server"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # manage terraform's stuff
      {
        "Effect" : "Allow",
        "Action" : ["s3:ListBucket"],
        "Resource" : "arn:aws:s3:::${var.artifact_bucket}"
      },
      {
        "Effect" : "Allow",
        "Action" : ["s3:*"],
        "Resource" : [
          "arn:aws:s3:::${var.artifact_bucket}/terraform.tfstate",
          "arn:aws:s3:::${var.artifact_bucket}/${local.s3_prefix}/*"
        ]
      },
      {
        "Effect" : "Allow",
        "Action" : ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:DeleteItem"],
        "Resource" : "arn:aws:dynamodb:*:*:table/${var.dynamodb_table}"
      },

      # manage application code
      {
        "Effect" : "Allow",
        "Resource" : ["arn:aws:apigateway:${var.region}::/restapis/*"],
        "Action" : ["apigateway:*"]
      },
      {
        "Effect" : "Allow",
        "Resource" : ["arn:aws:lambda:${var.region}:*:function:${local.name_prefix}-*"],
        "Action" : ["lambda:*"]
      },

      # manage log groups of project
      {
        "Effect" : "Allow",
        "Action" : ["logs:DescribeLogGroups"],
        "Resource" : "*"
      },
      {
        "Effect" : "Allow",
        "Action" : ["logs:*"],
        "Resource" : "arn:aws:logs:${var.region}:*:log-group:/aws/lambda/${local.name_prefix}-*"
      },

      # manage roles & policies of project
      {
        "Effect" : "Allow",
        "Action" : [
          "iam:*"
        ],
        "Resource" : [
          "arn:aws:iam::*:role/${local.name_prefix}-*",
          "arn:aws:iam::*:policy/${local.name_prefix}-*"
        ]
      },

      # manage identity providers of project
      {
        "Effect" : "Allow",
        "Action" : [
          "iam:*"
        ],
        "Resource" : "arn:aws:iam::*:oidc-provider/token.actions.githubusercontent.com"
      }
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
