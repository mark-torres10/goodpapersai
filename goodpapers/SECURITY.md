# Security Documentation

## Content Security Policy (CSP)

### Current Configuration

Goodpapers uses a Content Security Policy to protect against XSS and other code injection attacks. The policy is configured in `next.config.ts`.

### CSP Directives Explained

```typescript
"default-src 'self'" 
// Default: Only load resources from same origin

"script-src 'self' 'unsafe-inline' https://*.convex.site https://*.convex.cloud"
// Scripts: From same origin + Convex
// ⚠️ unsafe-inline: Required for Next.js dev mode (HMR, hydration)
// Production should use nonces or SRI hashes

"style-src 'self' 'unsafe-inline'"
// Styles: Same origin + inline styles
// unsafe-inline: Required for Tailwind CSS and component styles

"worker-src 'self' blob:"
// Workers: Same origin + blob URLs (required for PDF.js)
// PDF.js worker now self-hosted at /static/pdfjs/pdf.worker.min.mjs

"img-src 'self' https://lh3.googleusercontent.com data: blob:"
// Images: Same origin + Google profile pics + data URIs + blob

"connect-src 'self' https://*.convex.site wss://*.convex.site https://*.convex.cloud wss://*.convex.cloud"
// Network: Same origin + Convex backend (HTTP + WebSocket)
```

### Security Trade-offs

#### ⚠️ unsafe-inline in script-src

**Why We Use It**:
- Next.js requires inline scripts for:
  - Hot Module Replacement (HMR) in development
  - React hydration scripts
  - Runtime configuration
  - Fast Refresh functionality
- This is a known limitation of Next.js in development mode

**Risk Assessment**:
- **Threat**: Potential XSS via inline script injection
- **Mitigation**: 
  - Development-only requirement (production can use nonces/hashes)
  - All scripts from controlled sources (Next.js, Convex)
  - No user-generated content that could inject scripts
  - Single-user application reduces attack surface
- **Impact**: Low for current use case
- **Likelihood**: Very low with controlled script sources

**Industry Standard**:
- Most Next.js apps use unsafe-inline in development
- Production deployments should use CSP nonces
- Next.js 13+ supports CSP nonces via middleware

**Current Implementation**:
- ✅ PDF.js worker self-hosted (no CDN, no eval needed)
- ✅ Worker served from `/static/pdfjs/pdf.worker.min.mjs`
- ✅ All scripts from same origin or trusted Convex domains
- ✅ Storage IDs URL-encoded to prevent path injection

**Future Improvements** (Post-MVP):
1. Implement CSP nonces for production using Next.js middleware
2. Use Subresource Integrity (SRI) hashes for external scripts
3. Consider strict CSP with hashes for all inline scripts
4. Re-evaluate when adding multi-user features

#### unsafe-inline in style-src

**Why We Use It**:
- Tailwind CSS generates utility classes
- React component styles
- Next.js injected styles

**Risk**: Lower than script unsafe-inline (CSS can't execute code)

**Future**: Consider using nonces or hashes for stricter policy

---

## Authentication Security

**OAuth Provider**: Google OAuth 2.0
- Industry-standard authentication
- Managed by Convex Auth
- Tokens stored securely
- Session management handled by Convex

**Protected Routes**:
- All sensitive routes require authentication
- Unauthenticated users redirected to sign-in
- No data accessible without valid session

---

## Data Security

**User Data**:
- Stored in Convex database (encrypted at rest)
- Transmitted over HTTPS only
- Session tokens managed securely

**PDF Storage**:
- PDFs stored in Convex Storage
- Served via HTTP action with authentication check (future enhancement)
- Currently public URLs (acceptable for academic papers)

**API Keys**:
- Google OAuth credentials stored in Convex (not in code)
- Environment variables for deployment URLs only
- No secrets in client-side code

---

## Known Security Considerations

### Current MVP (Acceptable for Launch)

1. ✅ OAuth authentication working
2. ✅ HTTPS enforced
3. ✅ Protected routes implemented
4. ✅ PDF.js worker self-hosted (no unsafe-eval needed)
5. ✅ Storage IDs URL-encoded for security
6. 🟡 CSP includes unsafe-inline (required for Next.js dev mode)
7. 🟡 PDF URLs currently public (PDFs are public academic papers)

### Post-MVP Improvements (V2)

1. **Stricter CSP**: Implement CSP nonces for production
2. **PDF Access Control**: Add authentication to PDF serving
3. **Rate Limiting**: Prevent abuse of ArXiv fetching
4. **SRI Hashes**: For any external scripts (if added)
5. **Security Headers**: Additional hardening (HSTS, etc.)

---

## Security Best Practices Followed

✅ **HTTPS Only**: All traffic encrypted  
✅ **No Secrets in Code**: Environment variables for sensitive data  
✅ **OAuth Authentication**: Industry-standard auth flow  
✅ **Protected Routes**: Authentication required for all features  
✅ **Input Validation**: ArXiv IDs validated before API calls  
✅ **Error Handling**: No sensitive data exposed in errors  
✅ **CSP Headers**: Content Security Policy configured  
✅ **X-Frame-Options**: Clickjacking protection (DENY)  
✅ **X-Content-Type-Options**: MIME-sniffing protection (nosniff)  
✅ **Referrer-Policy**: Strict origin policy  

---

## Reporting Security Issues

If you discover a security vulnerability, please:
1. Do NOT create a public GitHub issue
2. Email: [your-security-email]
3. Include: Description, reproduction steps, impact assessment

---

## Security Audit History

- **2025-10-15**: Initial security review during PER-14
  - CodeRabbit suggestions reviewed
  - CSP trade-offs documented
  - Acceptable for single-user MVP
  - Improvements planned for V2

---

## References

- [OWASP CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [PDF.js CSP Compatibility](https://github.com/mozilla/pdf.js/wiki/Frequently-Asked-Questions#csp)
- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
- [Convex Security](https://docs.convex.dev/production/security)

