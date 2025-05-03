import type { AnalyticsConfig } from 'stalkbit-types'

const config: AnalyticsConfig = {
  trackingId: 'G-XXXXXXXXXX', // Replace with your GA4 ID
  enabled: process.env.NODE_ENV === 'production',
  trackPageViews: true,
  trackUserEngagement: true,
  events: {
    donationComplete: 'donation_success',
    livestreamView: 'livestream_engagement',
    userLogin: 'user_authentication'
  },
  debug: process.env.NODE_ENV !== 'production'
}

export default config
