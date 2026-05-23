const CHAIN_TO_DEXSCREENER = {
  PulseChain: "pulsechain",
};

function isAddress(value) {
  return /^0x[a-fA-F0-9]{40}$/.test(value || "");
}

async function withTimeout(promise, ms, label) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]);
}

function numberValue(value) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function pairScore(pair) {
  return (
    numberValue(pair?.liquidity?.usd) * 0.45 +
    numberValue(pair?.volume?.h24) * 0.35 +
    (numberValue(pair?.txns?.h24?.buys) + numberValue(pair?.txns?.h24?.sells)) * 12
  );
}

function makeChart(pair) {
  const price = numberValue(pair?.priceUsd);
  const changes = pair?.priceChange || {};
  const points = [
    ["24h", numberValue(changes.h24)],
    ["6h", numberValue(changes.h6)],
    ["1h", numberValue(changes.h1)],
    ["5m", numberValue(changes.m5)],
    ["Now", 0],
  ];

  return points.map(([window, change]) => ({
    window,
    price: price && window !== "Now" ? price / (1 + change / 100) : price,
    change,
    volume:
      window === "24h" ? numberValue(pair?.volume?.h24) :
      window === "6h" ? numberValue(pair?.volume?.h6) :
      window === "1h" ? numberValue(pair?.volume?.h1) :
      window === "5m" ? numberValue(pair?.volume?.m5) :
      numberValue(pair?.volume?.h24),
  }));
}

function analyze(pair, pairs) {
  const buys = numberValue(pair?.txns?.h24?.buys);
  const sells = numberValue(pair?.txns?.h24?.sells);
  const totalTxns = buys + sells;
  const buyRatio = totalTxns ? buys / totalTxns : 0;
  const liquidity = numberValue(pair?.liquidity?.usd);
  const volume = numberValue(pair?.volume?.h24);
  const priceChange = numberValue(pair?.priceChange?.h24);
  const turnover = liquidity ? volume / liquidity : 0;
  const activePairs = pairs.filter((item) => numberValue(item?.volume?.h24) > 0 || numberValue(item?.txns?.h24?.buys) + numberValue(item?.txns?.h24?.sells) > 0);

  const notes = [];
  if (!activePairs.length) notes.push("No active DexScreener trading pair was found for this token on PulseChain.");
  if (liquidity > 0 && liquidity < 25000) notes.push("Liquidity is thin; price impact and manipulation risk are elevated.");
  if (turnover > 5) notes.push("24h volume is high relative to liquidity, suggesting volatile rotation or possible wash activity.");
  if (Math.abs(priceChange) > 25) notes.push("24h price movement is extreme and should be treated as high-volatility context.");
  if (totalTxns > 0 && (buyRatio > 0.72 || buyRatio < 0.28)) notes.push("Buy/sell flow is imbalanced; review whether trading is organic or constrained.");
  if (pairs.length > 1) notes.push(`${pairs.length} DexScreener pair(s) were found; the dashboard ranks by liquidity, volume, and trade count.`);
  if (!notes.length) notes.push("Market activity appears measurable with no single dominant liquidity warning from available DexScreener data.");

  return {
    activePairs: activePairs.length,
    totalPairs: pairs.length,
    buys,
    sells,
    buyRatio,
    turnover,
    liquidity,
    volume,
    priceChange,
    notes,
  };
}

export async function getDexMarket(input) {
  const address = String(input.address || "").trim();
  const chain = "PulseChain";
  const chainId = CHAIN_TO_DEXSCREENER[chain];

  if (!isAddress(address)) {
    return { ok: false, status: 400, error: "Enter a valid token address for market lookup." };
  }

  try {
    const response = await withTimeout(fetch(`https://api.dexscreener.com/token-pairs/v1/${chainId}/${address}`, {
      headers: { accept: "application/json" },
      next: { revalidate: 20 },
    }), 9000, "DexScreener token-pairs lookup");
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const raw = await response.json();
    const pairs = Array.isArray(raw) ? raw : [];
    const rankedPairs = pairs
      .filter((pair) => pair?.chainId === chainId || !pair?.chainId)
      .sort((a, b) => pairScore(b) - pairScore(a));
    const primary = rankedPairs[0] || null;

    return {
      ok: true,
      source: "DexScreener",
      chainId,
      generatedAt: new Date().toISOString(),
      hasTrading: Boolean(primary && (numberValue(primary?.volume?.h24) > 0 || numberValue(primary?.txns?.h24?.buys) + numberValue(primary?.txns?.h24?.sells) > 0)),
      primaryPair: primary,
      pairs: rankedPairs.slice(0, 8),
      chart: primary ? makeChart(primary) : [],
      analysis: primary ? analyze(primary, rankedPairs) : analyze(null, rankedPairs),
      disclaimer: "Market data is sourced from DexScreener and may lag, omit pairs, or include noisy activity. Treat it as market context, not a trading recommendation.",
    };
  } catch (error) {
    return {
      ok: false,
      status: 502,
      error: "DexScreener market lookup failed.",
      detail: error.message,
      chainId,
    };
  }
}
