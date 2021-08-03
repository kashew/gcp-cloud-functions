# Sample Terraform Cloud Functions
Sample application for learning how to create/deploy GCP Cloud Functions using Terraform

This learning exercise is based on the following blog post written by Ruan Martinelli:

* [Deploying to Cloud Functions with Terraform](https://ruanmartinelli.com/posts/terraform-cloud-functions-nodejs-api)

## Setup

```bash
# Install NPM Packages
npm i

# Create .env from .env.sample
cp .env.sample .env

# Startup MSSQL Database
docker-compose up -d

# Create Database
npm run db:create

# Generate Tables/Procedures
npm run db:migrate
```

## Environment Variables
If you generate a `.env` file based on the `.env.sample`, you will have the necessary setup to connect to the Docker MSSQL database; however, you will need to supply the correct credentials around calling the Call Criteria API.

## Local Development
Local development can be done by either using the [Functions Framework for Node.js](https://github.com/GoogleCloudPlatform/functions-framework-nodejs) or by running a Docker image that can be generated using [Pack](https://buildpacks.io/docs/tools/pack/)

```bash
# Using Functions Framework
npm run dev-ff

# Using Pack/Docker
npm run dev-docker
```

## Run on GCP
If you want to run the function on GCP, you can use cURL with the following URL:
```bash
curl https://us-central1-nth-mantra-320912.cloudfunctions.net/my-function
```