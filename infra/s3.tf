# create a random name for the bucket
resource "random_pet" "project_bucket_name" {
  prefix    = local.name_prefix
  length    = 1
  separator = "-"
}

# create an s3 bucket for the project
resource "aws_s3_bucket" "project_bucket" {
  bucket = random_pet.project_bucket_name.id
}
