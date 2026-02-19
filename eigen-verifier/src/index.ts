import dotenv from 'dotenv';
import Fastify from 'fastify';
import { hashMessage } from 'viem';
import { mnemonicToAccount } from 'viem/accounts';

dotenv.config();

const DEXSCREENER_API = 'https://api.dexscreener.com';

interface ScoreBreakdown {
  contractAge: { score: number; max: number; detail: string };
  liquidity: { score: number; max: number; detail: string };
  holders: { score: number; max: number; detail: string };
  lpLocked: { score: number; max: number; detail: string };
  volume: { score: number; max: number; detail: string };
  creatorHistory: { score: number; max: number; detail: string };
}

interface ReputationScore {
  address: string;
  name?: string;
  token?: string;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  breakdown: ScoreBreakdown | null;
  flags: string[];
  recommendation: string;
  timestamp: string;
}

// Fetch token data from DexScreener
async function getDexScreenerData(address: string): Promise<any | null> {
  try {
    const res = await fetch(`${DEXSCREENER_API}/latest/dex/tokens/${address}`);
    if (!res.ok) return null;
    const data = await res.json() as { pairs?: any[] };
    const basePairs = data.pairs?.filter((p: any) => p.chainId === 'base') || [];
    if (basePairs.length === 0) return null;
    return basePairs.sort((a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0];
  } catch {
    return null;
  }
}

// Calculate reputation score from on-chain data
function calculateReputation(pair: any, contractAddress: string): ReputationScore {
  const breakdown: ScoreBreakdown = {
    contractAge: { score: 0, max: 20, detail: 'Unknown' },
    liquidity: { score: 0, max: 25, detail: '$0' },
    holders: { score: 0, max: 15, detail: '0' },
    lpLocked: { score: 0, max: 20, detail: 'Unknown' },
    volume: { score: 0, max: 10, detail: '$0' },
    creatorHistory: { score: 3, max: 10, detail: 'Not indexed' },
  };
  const flags: string[] = [];

  // Contract Age (0-20 points)
  if (pair?.pairCreatedAt) {
    const ageMs = Date.now() - pair.pairCreatedAt;
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    if (ageDays >= 180) {
      breakdown.contractAge = { score: 20, max: 20, detail: `${Math.floor(ageDays)} days` };
    } else if (ageDays >= 90) {
      breakdown.contractAge = { score: 15, max: 20, detail: `${Math.floor(ageDays)} days` };
    } else if (ageDays >= 30) {
      breakdown.contractAge = { score: 10, max: 20, detail: `${Math.floor(ageDays)} days` };
    } else if (ageDays >= 7) {
      breakdown.contractAge = { score: 5, max: 20, detail: `${Math.floor(ageDays)} days` };
      flags.push('⚠️ Less than 30 days old');
    } else {
      breakdown.contractAge = { score: 2, max: 20, detail: `${Math.floor(ageDays)} days` };
      flags.push('🚨 Very new contract (<7 days)');
    }
  }

  // Liquidity (0-25 points)
  const liquidity = pair?.liquidity?.usd || 0;
  if (liquidity >= 1000000) {
    breakdown.liquidity = { score: 25, max: 25, detail: `$${(liquidity / 1000000).toFixed(2)}M` };
  } else if (liquidity >= 500000) {
    breakdown.liquidity = { score: 20, max: 25, detail: `$${(liquidity / 1000).toFixed(0)}K` };
  } else if (liquidity >= 100000) {
    breakdown.liquidity = { score: 15, max: 25, detail: `$${(liquidity / 1000).toFixed(0)}K` };
  } else if (liquidity >= 50000) {
    breakdown.liquidity = { score: 10, max: 25, detail: `$${(liquidity / 1000).toFixed(0)}K` };
  } else if (liquidity >= 10000) {
    breakdown.liquidity = { score: 5, max: 25, detail: `$${(liquidity / 1000).toFixed(0)}K` };
  } else {
    breakdown.liquidity = { score: 0, max: 25, detail: `$${liquidity.toFixed(0)}` };
    flags.push('🚨 Very low liquidity (<$10K)');
  }

  // Holders estimate (0-15 points)
  const txns24h = (pair?.txns?.h24?.buys || 0) + (pair?.txns?.h24?.sells || 0);
  const estimatedHolders = Math.max(txns24h * 5, 50);
  if (estimatedHolders >= 5000) {
    breakdown.holders = { score: 15, max: 15, detail: `~${(estimatedHolders / 1000).toFixed(1)}K+` };
  } else if (estimatedHolders >= 1000) {
    breakdown.holders = { score: 12, max: 15, detail: `~${(estimatedHolders / 1000).toFixed(1)}K` };
  } else if (estimatedHolders >= 500) {
    breakdown.holders = { score: 8, max: 15, detail: `~${estimatedHolders}` };
  } else if (estimatedHolders >= 100) {
    breakdown.holders = { score: 4, max: 15, detail: `~${estimatedHolders}` };
  } else {
    breakdown.holders = { score: 1, max: 15, detail: `<100` };
    flags.push('⚠️ Low holder count');
  }

  // LP stability (0-20 points)
  const priceChange24h = Math.abs(pair?.priceChange?.h24 || 0);
  if (liquidity >= 500000 && priceChange24h < 20) {
    breakdown.lpLocked = { score: 18, max: 20, detail: 'Stable liquidity' };
  } else if (liquidity >= 100000 && priceChange24h < 50) {
    breakdown.lpLocked = { score: 12, max: 20, detail: 'Moderate stability' };
  } else if (liquidity >= 10000) {
    breakdown.lpLocked = { score: 6, max: 20, detail: 'Low stability' };
  } else {
    breakdown.lpLocked = { score: 2, max: 20, detail: 'Unstable' };
    flags.push('⚠️ Price volatility concern');
  }

  // Volume (0-10 points)
  const volume24h = pair?.volume?.h24 || 0;
  if (volume24h >= 500000) {
    breakdown.volume = { score: 10, max: 10, detail: `$${(volume24h / 1000000).toFixed(2)}M` };
  } else if (volume24h >= 100000) {
    breakdown.volume = { score: 8, max: 10, detail: `$${(volume24h / 1000).toFixed(0)}K` };
  } else if (volume24h >= 10000) {
    breakdown.volume = { score: 5, max: 10, detail: `$${(volume24h / 1000).toFixed(0)}K` };
  } else {
    breakdown.volume = { score: 2, max: 10, detail: `$${volume24h.toFixed(0)}` };
  }

  // Calculate total score
  const totalScore = Object.values(breakdown).reduce((sum, b) => sum + b.score, 0);
  
  const grade = totalScore >= 85 ? 'A' : totalScore >= 70 ? 'B' : totalScore >= 55 ? 'C' : totalScore >= 40 ? 'D' : 'F';

  const recommendation = totalScore >= 85 
    ? '✅ High trust. Safe to interact with.'
    : totalScore >= 70 
      ? '✅ Good reputation. Proceed with normal caution.'
      : totalScore >= 55
        ? '⚠️ Moderate trust. Do additional research.'
        : totalScore >= 40
          ? '⚠️ Low trust. Exercise caution.'
          : '🚨 Very low trust. High risk.';

  return {
    address: pair?.baseToken?.address || contractAddress,
    name: pair?.baseToken?.name,
    token: pair?.baseToken?.symbol ? `$${pair.baseToken.symbol}` : undefined,
    score: totalScore,
    grade,
    breakdown,
    flags,
    recommendation,
    timestamp: new Date().toISOString(),
  };
}

async function main() {
  const mnemonic = process.env.MNEMONIC;

  if (!mnemonic) {
    console.error('MNEMONIC environment variable is not set');
    process.exit(1);
  }

  // Derive the application's signing account from the provided mnemonic
  let account;
  try {
    account = mnemonicToAccount(mnemonic);
  } catch (error) {
    console.error('Error deriving signing account:', error);
    process.exit(1);
  }

  const server = Fastify({ logger: true });

  // Health check
  server.get('/health', async () => {
    return { status: 'ok', signer: account.address };
  });

  // Verifiable reputation score endpoint
  server.get('/reputation', async (request) => {
    const { address } = request.query as { address?: string };

    if (!address) {
      return {
        error: 'Missing address parameter',
        usage: '/reputation?address=0x...',
      };
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return {
        error: 'Invalid address format. Must be a valid Ethereum address (0x...)',
      };
    }

    // Fetch on-chain data
    const pair = await getDexScreenerData(address);
    
    if (!pair) {
      const notFoundResult = {
        address,
        score: 0,
        grade: 'F' as const,
        breakdown: null,
        flags: [
          '❌ Token not found on DexScreener',
          '❌ No liquidity pool on Base',
        ],
        recommendation: '🚨 Cannot verify. Token may not exist or has no liquidity on Base.',
        timestamp: new Date().toISOString(),
      };

      // Create attestation message
      const message = `SpawnReputation|${address}|${notFoundResult.score}|${notFoundResult.timestamp}`;
      const messageHash = hashMessage(message);
      const signature = await account.signMessage({ message });

      return {
        ...notFoundResult,
        attestation: {
          message,
          messageHash,
          signature,
          signer: account.address,
          verifiable: true,
        },
      };
    }

    // Calculate reputation
    const reputation = calculateReputation(pair, address);

    // Create attestation message for the score
    const message = `SpawnReputation|${reputation.address}|${reputation.score}|${reputation.grade}|${reputation.timestamp}`;
    const messageHash = hashMessage(message);
    const signature = await account.signMessage({ message });

    return {
      ...reputation,
      attestation: {
        message,
        messageHash,
        signature,
        signer: account.address,
        verifiable: true,
      },
    };
  });

  const port = Number(process.env.PORT ?? 8080);
  try {
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`🛡️ Spawn Verifier running on port ${port}`);
    console.log(`📍 Signer address: ${account.address}`);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error starting server:', error);
  process.exit(1);
});
