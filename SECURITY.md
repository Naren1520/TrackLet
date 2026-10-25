# Security Policy

## Supported Versions

TrackLet actively receives security updates and patches for the following versions:

| Version | Supported |
| ------- | --------- |
| 0.1.x   | Yes       |
| < 0.1   | No        |

---

## Reporting a Vulnerability

We take the security of TrackLet and our users' data seriously. If you discover a potential security vulnerability, please report it responsibly so we can resolve it before public disclosure.

### How to Report
- Do NOT open a public issue on GitHub for sensitive vulnerabilities.
- Please create a Private Vulnerability Report via GitHub Security Advisories at:
  https://github.com/Naren1520/TrackLet/security/advisories/new
- Alternatively, contact the maintainer directly through your GitHub account profile.

### What to Include in Your Report
To help us triage and resolve the issue quickly, please include:
1. Description of the vulnerability and its potential impact.
2. Steps to reproduce the vulnerability (proof of concept script, screenshots, or HTTP request payload).
3. Any relevant details about your environment, browser, or Node.js runtime.

### Response Timeline
- We will acknowledge receipt of your report within 48 hours.
- We will provide regular updates on our progress toward resolving the vulnerability.
- Once a fix is verified, a patched version will be released, and credit will be given to the reporter (unless you request anonymity).

---

## Security Best Practices for Self-Hosting

When self-hosting TrackLet (on Netlify, Vercel, or custom servers), please observe the following security rules:
- Never commit `.env.local`: Ensure your MongoDB connection string and password hashes are never pushed to public Git repositories. The repository is pre-configured with a strict `.gitignore` to prevent accidental leaks.
- Generate Strong Secrets: Set `SESSION_SECRET` to a cryptographically secure random string with at least 32 characters.
- Secure Database Access: Use MongoDB Atlas IP Access Lists / Network Access rules to restrict database access only to authorized IPs or cloud hosting providers.
- HTTPS Only: Always run TrackLet behind HTTPS in production to protect session cookies and authentication payloads.
