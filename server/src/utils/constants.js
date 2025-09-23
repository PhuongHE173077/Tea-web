import { env } from "~/configs/environment"


export const WHITELIST_DOMAINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://www.trasuoibu.com'
]

export const DEFAULT_PAGE = 1

export const DEFAULT_ITEMS_PER_PAGE = 12

export const WEBSITE_DOMAIN = (env.BUILD_MODE === 'production') ? env.WEBSITE_DOMAIN_PRODUCTION : env.WEBSITE_DOMAIN_DEVELOPMENT

