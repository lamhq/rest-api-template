data "aws_caller_identity" "current" {}

locals {
  env         = terraform.workspace == "default" ? "prod" : terraform.workspace
  name_prefix = "${var.project}-${local.env}"
  build_dir   = "${path.root}/../dist"
  aws_acc_id  = data.aws_caller_identity.current.account_id
  role_tags = {
    role = "zoiautomationrole"
  }
}
