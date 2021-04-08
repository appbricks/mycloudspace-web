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

scripts_dir=$(dirname $BASH_SOURCE)
home_dir=$(cd ${scripts_dir}/../.. && pwd)

function usage() {
  echo -e "\nUSAGE: configure.sh [options]\n"
  echo -e "  -e|--env [ENV]  the deployment environment"
  echo -e "  -d|--debug      enable trace output"
  echo -e "  -h|--help       show this help"
}

env=dev
while [[ $# -gt 0 ]]; do
  case "$1" in
    -e|--env)
      env=$2
      shift
      ;;
    -d|--debug)
      set -x
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo -e "\nERROR! Unknown option \"$1\"."
      usage
      exit 1
      ;;
  esac
  shift
done

env_name="mycs${env}"
aws_region=${AWS_DEFAULT_REGION:-us-east-1}

outputs=$(aws --region ${aws_region} \
  cloudformation describe-stacks \
  --stack-name ${env_name}-identity \
  | jq '.Stacks[0].Outputs[]' \
  | sed 's|\\n|\\\\n|g')

# Update Hosted UI for CLI client
userPoolId=$(echo "$outputs" | jq -r 'select(.OutputKey=="UserPoolId") | .OutputValue')
cliClientID=$(echo "$outputs" | jq -r 'select(.OutputKey=="UserPoolCLIClientId") | .OutputValue')

set +e
result=$(aws --region ${aws_region} \
  cognito-idp set-ui-customization \
  --user-pool-id "${userPoolId}" \
  --client-id "${cliClientID}" \
  --image-file "fileb://${home_dir}/site/images/appbricks-logo-name.png" \
  --css "$(cat ${home_dir}/build/cognito/ui-customization.css)")
if [[ $? -ne 0 ]]; then
  echo -e "ERROR! Unable to set hosted UI customization.\n${result}\n"
fi
set -e

# aws amplify config for mycloudspace web app
cognitoJSConfig=$(echo $outputs | jq -r 'select(.OutputKey=="CognitoJSConfig") | .OutputValue')
echo -e "$cognitoJSConfig" > ${home_dir}/src/aws-exports.ts
