// geo-redirect.js - Enhanced with caching
export default async (request, context) => {
  const url = new URL(request.url)
  
  // Skip redirects for certain paths
  if (url.pathname.startsWith('/api/') || 
      url.pathname.startsWith('/_next/')) {
    return new Response(null, { status: 200 })
  }

  // Get country from context
  const country = context.geo?.country?.toUpperCase() || 'US'
  const region = context.geo?.subdivision?.code || ''
  
  // South Sudan redirect
  if (country === 'SS') {
    return Response.redirect('https://hnm-ministry.netlify.app/ss', 302)
  }

  // Mobile redirect (with user agent check)
  const userAgent = request.headers.get('user-agent') || ''
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent)
  
  if (isMobile && !url.pathname.startsWith('/mobile')) {
    return Response.redirect('https://hnm-ministry.netlify.app/mobile', 302)
  }

  // Cache control headers
  const response = await context.next()
  response.headers.set('Cache-Control', 'public, max-age=3600')
  response.headers.set('CDN-Cache-Control', 'public, max-age=3600')
  
  return response
}
