# RESTful API Template

## Description

A starter code for a RESTful API application, built with Amazon API Gateway and AWS Lambda.


## Project setup

```bash
pnpm install
```

## Compile and run the project

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Run tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```



## Build your application

```bash
npm run build
```


## Deploy

Here're required steps to deploy the application from scratch:

1. Set up the local environment
2. Create the infrastructure by executing the deploy command manually
3. Create an user in Amazon Cognito user pool
4. Set up Github Environment secrets
5. Deploy the application automatically on code push

### Set up local environment

Create a `infra/backend.tfvars` file that contains configuration for Terraform S3 backend:
```hcl filename="infra/backend.tfvars"
region               = "<AWS region>"
workspace_key_prefix = "<project name>"
bucket               = "<s3 bucket for storing Terraform state>"
key                  = "terraform.tfstate"
dynamodb_table       = "<DynamoDB table name to perform state locking>"
```

Create a `infra/input.tfvars` file that contain required input variables:
```hcl filename="params.tfvars"
aws_region           = "<AWS region>"
project              = "<project name>"
github_repo_id       = "github-username/repo-name"
dynamodb_table       = "<DynamoDB table name to perform state locking>"
google_client_id     = ""
google_client_secret = ""
api_env_vars = {
  WEB_URL = ""
  DB_URI  = ""
}
```

Prepare AWS credentials in the terminal.

### Create the infrastructure

Init Terraform working directory:
```shell
cd infra
terraform init -backend-config=backend.tfvars -reconfigure
terraform workspace new dev
terraform workspace select dev
```

Build the source code:
```shell
npm install
npm run build

```
Deploy:
```shell
terraform apply -var-file="input.tfvars" --auto-approve
```

### Set up Github Environment secrets

1. Create a new environment `dev`
2. Add an environment secret `TS_BACKEND_CONFIG` with content from `infra/backend.tfvars`
3. Add an environment secret `TF_INPUT_VARS` with content from `infra/input.tfvars`


### Deploy the application automatically 

An Github Action workflow will run every time code is pushed to the `main` branch. See `.github/workflows/main.yml`.


## Clean up

```sh
terraform destroy -var-file="input.tfvars" --auto-approve
terraform workspace select default
terraform workspace delete dev
```


## Test

Calling API:
```shell
curl https://thfabm1j3j.execute-api.eu-central-1.amazonaws.com/v1/users
```

Benchmark:
```shell
curl -o /dev/null -s -w "\
Time to resolve domain: %{time_namelookup}\n\
Time to establish connection: %{time_connect}\n\
Time to first byte: %{time_starttransfer}\n\
Total time: %{time_total}\n" https://rsn6742yyk.execute-api.eu-central-1.amazonaws.com/v1/diary/activities
```


## Source code structure

TBC