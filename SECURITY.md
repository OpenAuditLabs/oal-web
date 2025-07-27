# Security Policy for OpenAuditLabs/Web

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 1.x     | :white_check_mark: |
| < 1.x   | :x:                |

## Reporting a Vulnerability

Thank you for helping keep OpenAuditLabs/Web secure. If you discover a security vulnerability, please handle responsibly by following the steps below:

### How to Report

- **Do NOT create a public issue** to avoid disclosure to the general public.
- Please report vulnerabilities **privately** by emailing the security team at:  
  **security@openauditlabs.org**

Include the following information in your report:

- Description of the vulnerability and its impact.
- Step-by-step instructions to reproduce the issue.
- Any relevant proof-of-concept code or screenshots.
- Your contact information for follow-up (email or other).

We commit to acknowledging your report within 48 hours and providing regular updates throughout the resolution process.

---

## Security Scope

The following are considered in-scope for security reports on this repository:

- **Application vulnerabilities**, including but not limited to:
  - Cross-Site Scripting (XSS)
  - Cross-Site Request Forgery (CSRF)
  - Server-Side Request Forgery (SSRF)
  - Authentication and Authorization flaws
  - Data leakage or improper data exposure
  - Injection vulnerabilities (SQL, NoSQL, etc.)
- **Dependency vulnerabilities**, including insecure or outdated third-party packages.
- **Configuration issues**, such as misconfigured CORS, CSP, or HTTP headers.

### Out-of-Scope

- Vulnerabilities in third-party dependencies should be reported upstream to their maintainers.
- General web security issues unrelated to OpenAuditLabs/Web’s codebase.
- Social engineering, phishing, or physical attacks.

---

## Next.js & Web Application Security Measures

OpenAuditLabs/Web follows best practices for web and Next.js application security, including:

- **Content Security Policy (CSP):** Strict CSP headers to prevent XSS.
- **Secure HTTP Headers:** HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy.
- **Authentication & Authorization:** Strong session management and role-based access control.
- **Data Protection:** Sensitive information is never logged; data in transit is encrypted with HTTPS.
- **Dependency Management:** Automated dependency audits via pnpm and CI pipelines.
- **Error Handling:** Safe error messages that don’t leak sensitive info.
- **Secure Coding Practices:** Use of TypeScript for type safety and minimized runtime errors.

---

## Response Process

Upon receiving a valid report:

1. We will acknowledge receipt within 48 hours.
2. Assign a security lead to verify and triage the issue.
3. Provide an estimated timeline for remediation.
4. Communicate updates regularly until resolution.
5. Coordinate with the reporter on the disclosure timeline (responsible disclosure).
6. Release patches or updates as needed.
7. Publicly acknowledge the reporter (optional, based on consent).

---

## Safe Harbor

OpenAuditLabs encourages responsible security research and will not take legal action against researchers acting in good faith according to this policy.

---

## Additional Resources

- Next.js Security Documentation: [https://nextjs.org/docs/advanced-features/security](https://nextjs.org/docs/advanced-features/security)
- OWASP Top 10 Web Application Security Risks: [https://owasp.org/www-project-top-ten/](https://owasp.org/www-project-top-ten/)
- How to Secure Your Node.js App: [https://expressjs.com/en/advanced/best-practice-security.html](https://expressjs.com/en/advanced/best-practice-security.html)

---

Thank you for helping us improve the security of OpenAuditLabs/Web.  
**OpenAuditLabs Security Team**  
security@openauditlabs.org
