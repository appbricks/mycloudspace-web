#
# Install Lambda function "standard-redirects-for-cloudfront" which 
# rewrites url requests for <some_path>/ to <some_path>/index.html
#
# https://github.com/digital-sailors/standard-redirects-for-cloudfront
#

locals {
  url_rewrite_fn_source = "${path.module}/../redirect-fn/standard-redirects-for-cloudfront.zip"
}

resource "aws_iam_role" "url-rewrite" {
  name = "appbricks.io-url-rewrite-fn"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": [
          "lambda.amazonaws.com",
          "edgelambda.amazonaws.com"
        ]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_lambda_function" "url-rewrite" {
  function_name = "appbricks-io_url-rewrite-fn"

  filename         = "${local.url_rewrite_fn_source}"
  source_code_hash = "${filebase64sha256(local.url_rewrite_fn_source)}"
  handler          = "index.handler"
  runtime          = "nodejs12.x"

  role    = "${aws_iam_role.url-rewrite.arn}"
  publish = true
}
