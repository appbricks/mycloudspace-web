#
# S3 bucket for website content
# 
resource "aws_s3_bucket" "appbricks-io" {
  bucket = "${var.domain}"
  acl    = "public-read"
}

resource "aws_s3_bucket_policy" "appbricks-io" {
  bucket = "${aws_s3_bucket.appbricks-io.id}"
  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${var.domain}/*"
    }
  ]
}
POLICY
}

#
# Retrieve list of files to publish
#
data "external" "publish" {
  program = [ 
    "/bin/bash", "-c",
    <<SCRIPT
echo -n "{ \"files\": \""
for f in $(find ${var.publish_path} -not -path '*/\.*' -type f -print); do
  [[ -z $next ]] || echo -n ","
  echo -n "$f"
  next=y
done
echo "\"}"
SCRIPT
  ]
}

locals {
  publish_path_prefix_len = "${length(var.publish_path) + 1}"
  publish_file_list   = "${split(",", data.external.publish.result.files)}"

  publish_file_list_ext  = [ for file in local.publish_file_list 
    : reverse(split(".", basename(file)))[0] ]
  publish_file_list_mime = [ for ext in local.publish_file_list_ext 
    : (ext == "gif" || ext == "png" || ext == "jpg" || ext == "jpeg" 
      ? format("image/%s", ext) 
      : format("text/%s", ext) ) ]
}

#
# Upload website content to s3 bucket
#
resource "aws_s3_bucket_object" "content" {
  count  = "${length(local.publish_file_list)}"
  bucket = "${aws_s3_bucket.appbricks-io.bucket}"

  key = "${substr(
    local.publish_file_list[count.index], 
    local.publish_path_prefix_len, 
    length(local.publish_file_list[count.index]) - local.publish_path_prefix_len)}"

  source       = "${local.publish_file_list[count.index]}"
  content_type = "${local.publish_file_list_mime[count.index]}"
  etag         = "${filemd5(local.publish_file_list[count.index])}"

  depends_on = ["aws_s3_bucket.appbricks-io"]
}
