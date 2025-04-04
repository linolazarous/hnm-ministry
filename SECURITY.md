# Security Policy for Heavenly Nature Ministry

## Supported Versions

The following versions of HNM Ministry are currently supported with security updates:

| Version | Supported          | Node.js | React  | Vite   | Support Ends   |
| ------- | ------------------ | ------- | ------ | ------ | -------------- |
| 2.x     | :white_check_mark: | 18.x    | 18.x   | 5.x    | TBD            |
| 1.x     | :white_check_mark: | 16.x    | 17.x   | 4.x    | 2024-06-30     |
| < 1.0   | :x:                | -       | -      | -      | Unsupported    |

## Vulnerability Reporting

### How to Report a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

To report a security issue, please email our security team at:
[security@hnm.org](mailto:security@hnm.org) with the subject line:  
"[HNM Security] Vulnerability Report - [Brief Description]"

Include the following details in your report:
- Project version affected
- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Any suggested mitigation

### Our Commitment

- **Response Time**: We will acknowledge receipt of your report within 48 hours
- **Assessment**: Preliminary assessment within 5 business days
- **Updates**: Weekly status updates until resolution
- **Disclosure**: Coordinated disclosure following patch release

### Vulnerability Handling Process

1. **Confirmation**: Our team will verify the vulnerability
2. **CVE Assignment**: For critical issues, we will request a CVE ID
3. **Fix Development**: Patch development timeline based on severity:
   - Critical: 72 hours
   - High: 14 days
   - Medium: 30 days
   - Low: Next scheduled release

4. **Patch Release**: Security fixes are backported to all supported versions
5. **Public Disclosure**: After patches are available, we will:
   - Publish a security advisory on GitHub
   - Notify all registered administrators
   - Update our ministry security bulletin

## Security Updates

- **Patch Releases**: Distributed every first Tuesday of the month
- **Emergency Patches**: For critical vulnerabilities, released as needed
- **Update Channels**: 
  - GitHub Releases
  - Ministry Admin Dashboard notifications
  - Security mailing list (subscribe at security@hnm.org)

## Security Considerations for Integrations

Special guidance for our key integrations:

### Stripe Payments
- Always use the latest `@stripe/stripe-js` (currently v3.3+)
- Never expose secret keys in client-side code
- Implement webhook signature verification

### Facebook Integration
- Use app secret proof for API calls
- Validate signed requests
- Regularly review Facebook app permissions

### YouTube Embedding
- Restrict to https://www.youtube-nocookie.com when possible
- Implement privacy-enhanced mode
- Monitor for deprecated API usage

## Security Best Practices for Deployments

1. **Environment Variables**:
   - Never commit secrets to version control
   - Rotate keys quarterly
   - Use Netlify's built-in secret management

2. **Dependencies**:
   ```bash
   npm audit --production
   npx snyk test
