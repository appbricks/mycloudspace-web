#
# Create Aliases for CloudFront domain
#

# The aliases are created only for production environments 
# that contain valid hosted zones and certificates.

data "aws_route53_zone" "appbricks-io" {
  name = var.domain
}

resource "aws_route53_record" "appbricks-io" {
    count = length(var.env) == 0 ? 1 : 0

    zone_id = data.aws_route53_zone.appbricks-io.zone_id
    name    = var.domain
    type    = "A"

    alias {
      name    = aws_cloudfront_distribution.appbricks-io.domain_name
      zone_id = aws_cloudfront_distribution.appbricks-io.hosted_zone_id

      evaluate_target_health = true
    }
}

resource "aws_route53_record" "www-appbricks-io" {
    count = length(var.env) == 0 ? 1 : 0

    zone_id = data.aws_route53_zone.appbricks-io.zone_id
    name    = "www.${var.domain}"
    type    = "A"

    alias {
      name    = aws_cloudfront_distribution.appbricks-io.domain_name
      zone_id = aws_cloudfront_distribution.appbricks-io.hosted_zone_id

      evaluate_target_health = true
    }
}
