// Redirect users based on country
export default async (request, context) => {
  const country = context.geo.country?.toUpperCase() || 'US'
  
  // Redirect South Sudan visitors to a localized page
  if (country === 'SS') {
    return Response.redirect('https://hnm-ministry.netlify.app/ss', 302)
  }

  // Redirect mobile users
  const userAgent = request.headers.get('user-agent') || ''
  if (/mobile/i.test(userAgent)) {
    return Response.redirect('https://hnm-ministry.netlify.app/mobile', 302)
  }

  // No redirect for others
  return new Response(null, { status: 200 })
}
