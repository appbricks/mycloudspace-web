#
# Variables for publishing appbricks.io to AWS S3 and CloudFront
#

variable "aws_cli_path" {
  default = "aws"
}

variable "env" {
  type = string
}

variable "domain" {
  type = string
}

variable "publish_path" {
  type = string
}

locals {
  env_domain = (length(var.env) == 0
    ? var.domain 
    : join(".", tolist([var.env, var.domain])))
}
