#
# Backend state for website template
#

terraform {
  backend "s3" {
    key = "website/appbricks-io"
    bucket = "appbricks-tfstate-useast1"
  }
}