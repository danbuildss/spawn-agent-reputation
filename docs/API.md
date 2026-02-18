# Spawn API Documentation

## Base URL
```
https://agentspawn.xyz/api
```

## Rate Limits
- **30 requests per minute** per IP
- Rate limit headers included in response
- 429 error when exceeded

---

## Endpoints

### GET /api/reputation

Get the trust score for any AI agent on Base.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `address` | string | Yes | Contract address (0x...) |

**Example Request:**
```bash
curl "https://agentspawn.xyz/api/reputation?address=0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b"
```

**Response (Indexed Agent):**
```json
{
  "address": "0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
  "name": "Virtuals Protocol",
  "token": "$VIRTUAL",
  "score": 99,
  "grade": "A",
  "breakdown": {
    "contractAge": { "score": 20, "max": 20, "detail": "180+ days" },
    "liquidity": { "score": 25, "max": 25, "detail": "$2.5M" },
    "holders": { "score": 15, "max": 15, "detail": "~10K+" },
    "lpLocked": { "score": 18, "max": 20, "detail": "Stable liquidity" },
    "volume": { "score": 10, "max": 10, "detail": "$500K" },
    "creatorHistory": { "score": 10, "max": 10, "detail": "@virtuals_io" }
  },
  "flags": [],
  "recommendation": "✅ High trust. Safe to interact with.",
  "source": "database",
  "timestamp": "2026-02-18T21:00:00.000Z"
}
```

**Response (Live Lookup):**
```json
{
  "address": "0x...",
  "name": "Unknown Token",
  "token": "$XYZ",
  "score": 45,
  "grade": "D",
  "breakdown": {
    "contractAge": { "score": 5, "max": 20, "detail": "14 days" },
    "liquidity": { "score": 10, "max": 25, "detail": "$50K" },
    "holders": { "score": 4, "max": 15, "detail": "~200" },
    "lpLocked": { "score": 6, "max": 20, "detail": "Low stability" },
    "volume": { "score": 5, "max": 10, "detail": "$10K" },
    "creatorHistory": { "score": 3, "max": 10, "detail": "Not indexed" }
  },
  "flags": [
    "⚠️ Less than 30 days old",
    "⚠️ Low holder count",
    "ℹ️ Not indexed on Spawn - submit for verification"
  ],
  "recommendation": "⚠️ Low trust. Exercise caution.",
  "source": "live",
  "timestamp": "2026-02-18T21:00:00.000Z"
}
```

**Response (Not Found):**
```json
{
  "address": "0x...",
  "score": 0,
  "grade": "F",
  "breakdown": null,
  "flags": [
    "❌ Token not found on DexScreener",
    "❌ No liquidity pool on Base",
    "ℹ️ Submit to Spawn for manual review"
  ],
  "recommendation": "🚨 Cannot verify. Token may not exist or has no liquidity on Base.",
  "source": "none",
  "timestamp": "2026-02-18T21:00:00.000Z"
}
```

---

### GET /api/agents

Get list of all indexed agents.

**Example Request:**
```bash
curl "https://agentspawn.xyz/api/agents"
```

**Response:**
```json
{
  "agents": [
    {
      "id": "0x...",
      "name": "Virtuals Protocol",
      "token": "$VIRTUAL",
      "score": 99,
      "vouched": 139.6,
      "category": "Infrastructure",
      "status": "verified",
      "contract": "0x...",
      "twitter": "virtuals_io",
      "imageUrl": "https://unavatar.io/x/virtuals_io"
    }
  ],
  "totalAgents": 100,
  "verifiedCount": 50,
  "totalVouched": 1650.5
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Invalid address format |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## Integration Examples

### JavaScript/TypeScript
```typescript
async function getAgentScore(address: string) {
  const res = await fetch(
    `https://agentspawn.xyz/api/reputation?address=${address}`
  );
  const data = await res.json();
  
  if (data.score >= 70) {
    console.log(`✅ ${data.name} is trusted (${data.score}/100)`);
  } else {
    console.log(`⚠️ ${data.name} has low trust (${data.score}/100)`);
  }
  
  return data;
}
```

### Python
```python
import requests

def get_agent_score(address: str):
    response = requests.get(
        f"https://agentspawn.xyz/api/reputation?address={address}"
    )
    data = response.json()
    
    print(f"Score: {data['score']}/100 ({data['grade']})")
    print(f"Recommendation: {data['recommendation']}")
    
    return data
```

### cURL
```bash
# Check a single agent
curl "https://agentspawn.xyz/api/reputation?address=0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b"

# Get all agents
curl "https://agentspawn.xyz/api/agents"
```

---

## Webhooks (Coming Soon)

Subscribe to score changes:
```json
{
  "event": "score_changed",
  "address": "0x...",
  "old_score": 75,
  "new_score": 68,
  "timestamp": "2026-02-18T21:00:00.000Z"
}
```

---

## Support

- **Questions**: [@danbuildss](https://twitter.com/danbuildss)
- **Bugs**: Submit via GitHub
- **Enterprise**: DM for custom integrations
