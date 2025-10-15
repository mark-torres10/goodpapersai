# Security Documentation

## Content Security Policy (CSP)

### Current Configuration

Goodpapers uses a Content Security Policy to protect against XSS and other code injection attacks. The policy is configured in `next.config.ts`.

### CSP Directives Explained

```typescript
"default-src 'self'" 
// Default: Only load resources from same origin

"script-src 'self' 'unsafe-eval' https://cdnjs.cloudflare.com https://*.convex.site https://*.convex.cloud"
// Scripts: From same origin + PDF.js worker + Convex
// ⚠️ unsafe-eval: Required for PDF.js worker initialization (see below)

"style-src 'self' 'unsafe-inline'"
// Styles: Same origin + inline styles
// unsafe-inline: Required for Tailwind CSS and component styles

"worker-src 'self' blob:"
// Workers: Same origin + blob URLs (required for PDF.js)

"img-src 'self' https://lh3.googleusercontent.com data: blob:"
// Images: Same origin + Google profile pics + data URIs + blob

"connect-src 'self' https://*.convex.site wss://*.convex.site https://*.convex.cloud wss://*.convex.cloud"
// Network: Same origin + Convex backend (HTTP + WebSocket)
```

### Security Trade-offs

#### ⚠️ unsafe-eval in script-src

**Why We Use It**:
- PDF.js worker requires `eval()` for dynamic PDF parsing
- This is a well-known limitation of the PDF.js library
- Used by Mozilla, GitHub, GitLab, and millions of sites

**Risk Assessment**:
- **Threat**: Potential XSS via eval injection
- **Mitigation**: 
  - PDFs only loaded from our Convex Storage (controlled source)
  - PDFs sourced from ArXiv (trusted academic repository)
  - No user-uploaded arbitrary content in MVP
  - Single-user application reduces attack surface
- **Impact**: Low for current use case
- **Likelihood**: Very low with controlled PDF sources

**Industry Standard**:
- Many production apps use unsafe-eval for PDF.js
- Mozilla (creators of PDF.js) accept this trade-off
- Alternative solutions are significantly more complex

**Future Improvements** (Post-MVP):
1. Host PDF.js worker locally instead of CDN
2. Investigate Subresource Integrity (SRI) hashes
3. Research CSP-compatible PDF alternatives
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
4. 🟡 CSP includes unsafe-eval (for PDF.js)
5. 🟡 PDF URLs currently public (PDFs are public academic papers)

### Post-MVP Improvements (V2)

1. **Stricter CSP**: Remove unsafe-eval if possible
2. **PDF Access Control**: Add authentication to PDF serving
3. **Rate Limiting**: Prevent abuse of ArXiv fetching
4. **SRI Hashes**: For external scripts
5. **Security Headers**: Additional hardening

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

