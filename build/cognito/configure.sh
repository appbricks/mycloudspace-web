#!/bin/bash

set +e
which aws >/dev/null 2>&1
if [[ $? -ne 0 ]]; then
  echo -e "\nERROR! The AWS CLI is required to run the AWS Cognito configuration commands."
  exit 1
fi
which jq >/dev/null 2>&1
if [[ $? -ne 0 ]]; then
  echo -e "\nERROR! The JQ CLI is required for AWS API response processing."
  exit 1
fi

set -euo pipefail

ROOT_DIR=$(cd $(dirname ${BASH_SOURCE})/../.. && pwd)

ENV=${1:-dev}
ENV_NAME="mycs${ENV}"

AWS_REGION=${AWS_DEFAULT_REGION:-us-east-1}

aws --region ${AWS_REGION} \
  cloudformation deploy \
  --capabilities CAPABILITY_NAMED_IAM \
  --template-file ${ROOT_DIR}/build/cognito/cfn-template.yml \
  --stack-name ${ENV_NAME} \
  --parameter-overrides \
    prefix=${ENV_NAME} \
    serviceName="My Cloud Space"

outputs="$(aws --region ${AWS_REGION} cloudformation describe-stacks --stack-name ${ENV_NAME} | jq '.Stacks[0].Outputs[]')"

# Update Hosted UI for CLI client
userPoolId=$(echo $outputs | jq -r 'select(.OutputKey=="UserPoolId") | .OutputValue')
cliClientID=$(echo $outputs | jq -r 'select(.OutputKey=="UserPoolCLIClientId") | .OutputValue')

result=$(aws --region ${AWS_REGION} \
  cognito-idp set-ui-customization \
  --user-pool-id "${userPoolId}" \
  --client-id "${cliClientID}" \
  --image-file "fileb://${ROOT_DIR}/site/images/appbricks-logo-name.png" \
  --css "$(cat ${ROOT_DIR}/build/cognito/ui-customization.css)")

# aws amplify config for mycloudspace web app
cognitoJSConfig=$(echo $outputs | jq -r 'select(.OutputKey=="CognitoJSConfig") | .OutputValue')
echo -e "$cognitoJSConfig" > ${ROOT_DIR}/src/aws-exports.ts
