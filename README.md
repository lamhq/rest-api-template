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


## Infrastructure Setup

Create a `infra/backend.tfvars` file that contains configuration for Terraform S3 backend:
```hcl filename="infra/backend.tfvars"
region               = "<enter>"
workspace_key_prefix = "rat"
bucket               = "<enter>"
key                  = "terraform.tfstate"
dynamodb_table       = ""
```

Create a `infra/params.tfvars` file that contain required input parameters (see [`variables.tf`](./variables.tf)):
```hcl filename="params.tfvars"
region          = "<enter>"
project         = "rat"
artifact_bucket = "<enter>"
```

Prepare AWS credentials in the terminal.

Init the project:
```shell
cd infra
terraform init -backend-config=backend.tfvars -reconfigure
terraform workspace new dev
terraform workspace select dev
```


## Deploy

```shell
terraform apply -var-file="params.tfvars" --auto-approve
```


## Clean up

```sh
terraform destroy -var-file="params.tfvars" --auto-approve
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