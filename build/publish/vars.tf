#
# Variables for publishing appbricks.io to AWS S3 and CloudFront
#

variable "aws_cli_path" {
  type = string
}

variable "domain" {
  type = string
}

variable "publish_path" {
  type = string
}
