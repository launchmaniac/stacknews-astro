# Product of Launch Maniac llc, Las Vegas, Nevada - (725) 444-8200  support@launchmaniac.com

variable "zone_id" {
  description = "Cloudflare Zone ID for stacknews.org"
  type        = string
}

variable "hsts_max_age" {
  description = "HSTS max-age in seconds"
  type        = number
  default     = 31536000
}

variable "hsts_include_subdomains" {
  description = "IncludeSubDomains directive for HSTS"
  type        = bool
  default     = true
}

variable "hsts_preload" {
  description = "Preload directive for HSTS (enable only if you have submitted for preload)"
  type        = bool
  default     = false
}

variable "x_frame_options" {
  description = "X-Frame-Options policy"
  type        = string
  default     = "DENY"
}

variable "referrer_policy" {
  description = "Referrer-Policy header value"
  type        = string
  default     = "no-referrer"
}

variable "permissions_policy" {
  description = "Permissions-Policy header value"
  type        = string
  default     = "geolocation=(), microphone=(), camera=(), interest-cohort=()"
}

variable "enable_csp" {
  description = "Whether to set Content-Security-Policy via transform rules"
  type        = bool
  default     = false
}

variable "csp" {
  description = "Content-Security-Policy (only used when enable_csp=true)"
  type        = string
  default     = ""
}

# Environment-specific CSP controls
variable "environment" {
  description = "Environment: production | staging | development"
  type        = string
  default     = "production"
}

variable "csp_mode" {
  description = "CSP mode: enforce | report-only | disabled"
  type        = string
  default     = "enforce"
}

variable "csp_prod" {
  description = "Default CSP for production (strict)"
  type        = string
  default     = "default-src 'none'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data: blob:; font-src 'self' https: data:; connect-src 'self'; upgrade-insecure-requests;"
}

variable "csp_staging" {
  description = "Default CSP for staging (near-prod, report-sample)"
  type        = string
  default     = "default-src 'none'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data: blob:; font-src 'self' https: data:; connect-src 'self' https:; upgrade-insecure-requests; report-sample;"
}

variable "csp_dev" {
  description = "Default CSP for development (permissive for tooling)"
  type        = string
  default     = "default-src 'none'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data: blob:; font-src 'self' https: data:; connect-src 'self' https: ws: wss:;"
}
