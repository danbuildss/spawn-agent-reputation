# 🔒 Spawn Security Audit Report

**Date:** February 14, 2026  
**Auditor:** Danbigbrain (Internal)  
**Version:** MVP 1.0

---

## Executive Summary

| Category | Status | Risk Level |
|----------|--------|------------|
| Secrets Management | ✅ Good | Low |
| API Security | ⚠️ Needs Work | Medium |
| Database Security | ✅ Good | Low |
| Input Validation | ✅ Good | Low |
| Bot Security | ⚠️ Needs Work | Medium |
| Infrastructure | ✅ Good | Low |

**Overall Rating:** 🟡 **MEDIUM** - Safe for MVP, improvements needed before scale

---

## 1. Secrets Management

### ✅ What's Good
- `.env` files are in `.gitignore`
- Only `.env.example` files are tracked in git
- Secrets stored in Vercel environment variables
- No hardcoded API keys in source code

### ⚠️ Issues Found

**CRITICAL: Bot token in server memory**
- Location: `bot/.env`
- Risk: If server is compromised, bot can be hijacked
- Fix: Consider using secrets manager

**MEDIUM: GitHub token in git remote URL**
```
origin https://ghp_xxx@github.com/danbuildss/spawn-agent-reputation.git
```
- Risk: Token exposed in git config
- Fix: Use SSH keys or credential helper

### 🔧 Recommendations
1. Rotate the GitHub PAT and use SSH keys instead
2. Consider HashiCorp Vault or AWS Secrets Manager for production
3. Set up secret scanning in GitHub repo settings

---

## 2. API Security

### ✅ What's Good
- Input validation on contract addresses (regex check)
- Error handling doesn't leak internal details
- CORS handled by Next.js defaults

### ⚠️ Issues Found

**HIGH: No rate limiting on APIs**
- Affected: `/api/reputation`, `/api/submit`, `/api/agents`
- Risk: DDoS, abuse, cost overruns on DexScreener API
- Impact: Service unavailability, unexpected bills

**MEDIUM: No API authentication**
- Risk: Anyone can query unlimited reputation checks
- Risk: Spam submissions to database

**MEDIUM: No request size limits**
- Location: `/api/submit`
- Risk: Large payload attacks

### 🔧 Recommendations
```typescript
// Add to API routes:
// 1. Rate limiting (use Vercel KV or Upstash Redis)
import { Ratelimit } from "@upstash/ratelimit"
const ratelimit = new Ratelimit({
  limiter: Ratelimit.slidingWindow(10, "60 s"), // 10 req/min
})

// 2. Request size validation
if (JSON.stringify(body).length > 10000) {
  return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
}
```

---

## 3. Database Security (Supabase)

### ✅ What's Good
- Row Level Security (RLS) enabled
- Read policies are public (intentional for directory)
- Service role key only used server-side
- Anon key properly scoped

### ⚠️ Issues Found

**LOW: Overly permissive insert policy**
- Table: `submissions`
- Policy: Anyone can insert
- Risk: Spam submissions
- Mitigation: Add rate limiting at API level

**INFO: No delete policies**
- Tables have no delete policies
- This is actually good - prevents accidental deletion via API

### 🔧 Recommendations
1. Add rate limiting before insert operations
2. Consider adding CAPTCHA for submit form
3. Monitor for spam patterns

---

## 4. Input Validation

### ✅ What's Good
- Contract address validated with regex: `/^0x[a-fA-F0-9]{40}$/`
- SQL injection protected (Supabase parameterized queries)
- XSS protected (React auto-escapes)

### ⚠️ Issues Found

**LOW: Missing validation on optional fields**
- Location: `/api/submit`
- Fields: `name`, `submitterTwitter`
- Risk: Very long strings, special characters

### 🔧 Recommendations
```typescript
// Add field length limits
if (name && name.length > 100) {
  return NextResponse.json({ error: 'Name too long' }, { status: 400 })
}
if (submitterTwitter && !/^@?[a-zA-Z0-9_]{1,15}$/.test(submitterTwitter)) {
  return NextResponse.json({ error: 'Invalid Twitter handle' }, { status: 400 })
}
```

---

## 5. Bot Security

### ✅ What's Good
- Bot token stored in environment variable
- No sensitive data logged
- Error messages are generic

### ⚠️ Issues Found

**MEDIUM: No user rate limiting**
- Risk: User can spam `/check` commands
- Impact: API abuse, potential bans from DexScreener

**MEDIUM: Bot runs without process manager**
- Risk: Crashes without automatic restart
- Fix: Use PM2 or systemd

**LOW: No command permissions**
- All commands available to everyone
- Consider: Admin-only commands for future features

### 🔧 Recommendations
```javascript
// Add per-user rate limiting
const userLimits = new Map()
const LIMIT = 10 // requests per minute

bot.onText(/\/check/, (msg) => {
  const userId = msg.from.id
  const now = Date.now()
  const userHistory = userLimits.get(userId) || []
  const recent = userHistory.filter(t => now - t < 60000)
  
  if (recent.length >= LIMIT) {
    return bot.sendMessage(msg.chat.id, '⏳ Rate limited. Try again in a minute.')
  }
  
  userLimits.set(userId, [...recent, now])
  // ... proceed with check
})
```

---

## 6. Infrastructure Security

### ✅ What's Good
- Hosted on Vercel (managed security)
- HTTPS enforced
- No exposed ports
- Database in Supabase (managed)

### ⚠️ Issues Found

**LOW: Bot running on unmanaged server**
- Location: AWS instance
- Risk: No automatic security updates
- Fix: Enable unattended-upgrades or use managed service

**INFO: No monitoring/alerting**
- No way to detect attacks or outages
- Consider: Vercel Analytics, Sentry, or Datadog

---

## 7. Dependency Security

### Scan Results
```
npm audit: 1 high severity vulnerability
```

### 🔧 Recommendations
```bash
npm audit fix
# or if breaking changes:
npm audit fix --force
```

---

## 8. Data Privacy

### ✅ What's Good
- No PII collected (only Twitter handles, optional)
- No user accounts yet
- Contract addresses are public data

### Future Considerations
- If adding wallet connect: implement proper auth flow
- If storing user data: add privacy policy
- GDPR compliance if EU users

---

## Priority Action Items

### 🔴 Do Now (Before Launch)
1. Add rate limiting to APIs (Upstash Redis - free tier available)
2. Fix GitHub token in remote URL
3. Run `npm audit fix`

### 🟡 Do Soon (Week 1-2)
4. Add bot rate limiting
5. Set up PM2 for bot process management
6. Add input validation on optional fields

### 🟢 Do Later (Month 1)
7. Add API key authentication for high-volume users
8. Set up monitoring/alerting
9. Security headers (CSP, etc.)

---

## Security Checklist for Production

- [ ] Rate limiting implemented
- [ ] All secrets rotated
- [ ] npm audit clean
- [ ] Monitoring set up
- [ ] Backup strategy for database
- [ ] Incident response plan
- [ ] Security headers configured

---

## Conclusion

**Spawn is MVP-safe but needs hardening before scale.**

The main risks are:
1. **API abuse** - No rate limiting means someone could spam your APIs
2. **Bot abuse** - Users could overload the bot
3. **Minor secret exposure** - GitHub PAT in git config

None of these are critical for an MVP launch, but should be addressed before significant traction.

**Recommended:** Launch MVP, add rate limiting in week 1, full hardening before any significant growth.

---

*This audit covers application-level security. For a complete security posture, consider a professional penetration test before handling significant value.*
