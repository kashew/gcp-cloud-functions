# Sample Terraform Cloud Functions
Sample application for learning how to create/deploy GCP Cloud Functions using Terraform

This learning exercise is based on the following blog post written by Ruan Martinelli:

* [Deploying to Cloud Functions with Terraform](https://ruanmartinelli.com/posts/terraform-cloud-functions-nodejs-api)

## Setup

```
npm i
```

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