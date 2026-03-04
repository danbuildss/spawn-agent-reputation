#!/usr/bin/env bash
# Spawn Agent Score Checker
# Usage: ./check.sh <contract_address> [api_key]

ADDRESS="${1}"
API_KEY="${2:-$SPAWN_API_KEY}"

if [ -z "$ADDRESS" ]; then
  echo "Usage: $0 <contract_address> [api_key]"
  exit 1
fi

if [ -z "$API_KEY" ]; then
  echo "Error: No API key. Set SPAWN_API_KEY or pass as second argument."
  echo "Get your free key at: https://agentspawn.xyz/app"
  exit 1
fi

RESULT=$(curl -s "https://agentspawn.xyz/api/reputation?address=${ADDRESS}" \
  -H "X-API-Key: ${API_KEY}")

echo "$RESULT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
if d.get('error'):
    print('Error:', d['error'])
    sys.exit(1)
print(f\"Agent: {d.get('name','Unknown')} ({d.get('token','')})\" )
print(f\"Score: {d.get('score',0)}/100 — Grade {d.get('grade','?')}\")
print(f\"Source: {'EigenLayer TEE (attested)' if d.get('source')=='tee' else 'On-chain'}\")
print(f\"Verified: {'Yes' if d.get('verified') else 'No'}\")
flags = d.get('flags',[])
if flags:
    print()
    print('Flags:')
    for f in flags: print(f'  - {f}')
print()
print('Recommendation:', d.get('recommendation','N/A'))
print()
print(f\"Full report: https://agentspawn.xyz/agent/{d.get('address', '')}\")
"
