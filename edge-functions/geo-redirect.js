// edge-functions/geo-redirect.js
export default async (request, context) => {
  try {
    const url = new URL(request.url);
    
    // Skip API routes and internal paths
    if (url.pathname.startsWith('/api/') || 
        url.pathname.startsWith('/_next/') ||
        url.pathname.startsWith('/.netlify/')) {
      return context.next();
    }

    // Get visitor location
    const country = context.geo?.country?.toUpperCase() || 'US';
    const isMobile = context.headers.get('user-agent')?.match(/mobile|android|iphone|ipad/i);

    // South Sudan redirect
    if (country === 'SS') {
      return Response.redirect('https://hnm-ministry.netlify.app/ss', 302);
    }

    // Mobile redirect
    if (isMobile && !url.pathname.startsWith('/mobile')) {
      return Response.redirect('https://hnm-ministry.netlify.app/mobile', 302);
    }

    // Continue normal processing
    return context.next();

  } catch (error) {
    // Fallback if anything fails
    console.error('Edge function error:', error);
    return context.next();
  }
}
