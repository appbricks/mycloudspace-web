#
# Publish S3 content to a secured CloudFront website
#

data "aws_acm_certificate" "appbricks-io" {
  domain = var.domain
  statuses = ["ISSUED"]
}

resource "aws_cloudfront_distribution" "appbricks-io" {
  price_class = "PriceClass_100"

  origin {
    domain_name = aws_s3_bucket.appbricks-io.bucket_domain_name
    origin_id   = local.env_domain
  }

  enabled         = true
  is_ipv6_enabled = true

  comment             = local.env_domain
  default_root_object = "index.html"

  aliases = [
    local.env_domain,
    "www.${local.env_domain}"
  ]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.env_domain

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    lambda_function_association {
      event_type   = "origin-request"
      lambda_arn   = aws_lambda_function.edge-fn.qualified_arn
      include_body = false
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl               = 0
    default_ttl           = 86400
    max_ttl               = 31536000
    smooth_streaming      = false
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  dynamic "viewer_certificate" {
    # production
    for_each = length(var.env) == 0 ? [1] : []
    content {
      acm_certificate_arn      = data.aws_acm_certificate.appbricks-io.arn
      ssl_support_method       = "sni-only"
      minimum_protocol_version = "TLSv1.1_2016"
    }
  }
  dynamic "viewer_certificate" {
    # non-production
    for_each = length(var.env) == 0 ? [] : [1]
    content {
      cloudfront_default_certificate = true
    }
  }

  depends_on = [aws_s3_bucket.appbricks-io]
}

resource "null_resource" "invalidate-appbricks-io" {

  provisioner "local-exec" {
    command = <<SCRIPT
AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY \
AWS_SECRET_ACCESS_KEY=$AWS_SECRET_KEY \
${var.aws_cli_path} cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.appbricks-io.id} --paths '/*'
SCRIPT
  }

  triggers = {
    content = "${md5(join(" ", aws_s3_bucket_object.content.*.etag))}"
  }

  depends_on = [aws_cloudfront_distribution.appbricks-io]
}
