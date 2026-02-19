# Spawn Verifier (EigenCloud)

Verifiable AI Agent Reputation Scoring running on EigenCloud TEE.

## What This Does

Runs Spawn's scoring logic inside a Trusted Execution Environment (TEE) with cryptographic attestations. Every score returned includes a signature proving the computation was done correctly.

## API

```
GET /health
GET /reputation?address=0x...
```

### Response

```json
{
  "address": "0x...",
  "score": 91,
  "grade": "A",
  "breakdown": { ... },
  "attestation": {
    "message": "SpawnReputation|0x...|91|A|2026-02-19T20:28:55Z",
    "signature": "0x...",
    "signer": "0x...",
    "verifiable": true
  }
}
```

## Local Development

```bash
cd eigen-verifier
npm install
echo 'MNEMONIC="test test test test test test test test test test test junk"' > .env
npm run dev
```

## Deploy to EigenCloud

Requires EigenCloud subscription.

```bash
ecloud compute app deploy \
  --name "spawn-verifier" \
  --verifiable \
  --repo "https://github.com/danbuildss/spawn-agent-reputation" \
  --commit "<commit-sha>" \
  --build-context "eigen-verifier"
```

## Tech Stack

- TypeScript + Fastify
- viem for cryptographic signing
- DexScreener API for on-chain data
- EigenCloud TEE for verifiable execution
