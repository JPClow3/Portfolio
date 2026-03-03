# Content Security Policy (CSP) Implementation

## Overview
This portfolio implements a comprehensive Content Security Policy (CSP) to protect against XSS and other security vulnerabilities.

## CSP Configuration

### Headers Applied
The following security headers are configured in `serve.json` and applied to all resources:

- **Content-Security-Policy**: Restricts resource loading to approved sources
- **X-Content-Type-Options**: Prevents MIME-type sniffing
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-XSS-Protection**: Enables browser-based XSS protection
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Disables unnecessary browser APIs

## CSP Directives

### Allow-listed Origins
- Gravatar APIs (gravatar.com, secure.gravatar.com)
- Google Fonts (fonts.googleapis.com, fonts.gstatic.com)
- Web3Forms API (api.web3forms.com)

### Restrictive Policies
- `frame-ancestors 'none'` - Prevents embedding in iframes
- `form-action 'self'` - Only allows form submissions to self
- `base-uri 'self'` - Restricts base URL

## Implementation

### Local Development
To test CSP headers locally:
```bash
npm run build
npm start
```

The `serve.json` file configures the `serve` package to apply headers when serving the `dist/` directory.

### Production Deployment (Railway)
When deployed on Railway:
```bash
npm run build  # Build static site
npm start      # Serve with CSP headers via serve.json
```

The CSP headers are automatically applied by the `serve` package reading `serve.json`.

## Customization

To modify CSP for different environments, edit the `Content-Security-Policy` value in `serve.json`:

### Example: Adding New Allowed Domain
```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://secure.gravatar.com https://your-domain.com; ..."
}
```

## Security Notes

- `unsafe-inline` and `unsafe-eval` are allowed for script-src to support current implementation (Astro/Svelte inline scripts)
- For production, consider reducing these permissive policies if possible
- The CSP headers prevent XSS attacks, clickjacking, and other injection attacks

## Testing

Test CSP with browser DevTools:
1. Build the site: `npm run build`
2. Start the server: `npm start`
3. Open DevTools Console → check for CSP violations
4. Network tab → Response headers should show CSP headers
