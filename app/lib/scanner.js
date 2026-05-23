const ZERO_32 = `0x${"0".repeat(64)}`;

const CHAIN_CONFIG = {
  PulseChain: {
    chainId: 369,
    rpcUrls: [
      process.env.PULSECHAIN_RPC_URL,
      "https://rpc.pulsechain.com",
      "https://pulsechain-rpc.publicnode.com",
    ].filter(Boolean),
    explorerApi: process.env.PULSECHAIN_EXPLORER_API || "https://scan.pulsechain.com/api",
    explorer: "https://scan.pulsechain.com",
    native: "PLS",
  },
  Ethereum: {
    chainId: 1,
    rpcUrls: [process.env.ETHEREUM_RPC_URL, "https://ethereum-rpc.publicnode.com"].filter(Boolean),
    explorerApi: process.env.ETHERSCAN_API_URL || "https://api.etherscan.io/api",
    explorer: "https://etherscan.io",
    native: "ETH",
  },
  Base: {
    chainId: 8453,
    rpcUrls: [process.env.BASE_RPC_URL, "https://base-rpc.publicnode.com"].filter(Boolean),
    explorerApi: "https://api.basescan.org/api",
    explorer: "https://basescan.org",
    native: "ETH",
  },
};

const ERC1967 = {
  implementation: "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc",
  admin: "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103",
  beacon: "0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50",
};

const SELECTORS = {
  "owner()": "8da5cb5b",
  "getOwner()": "893d20e8",
  "renounceOwnership()": "715018a6",
  "transferOwnership(address)": "f2fde38b",
  "approve(address,uint256)": "095ea7b3",
  "transfer(address,uint256)": "a9059cbb",
  "transferFrom(address,address,uint256)": "23b872dd",
  "balanceOf(address)": "70a08231",
  "totalSupply()": "18160ddd",
  "decimals()": "313ce567",
  "name()": "06fdde03",
  "symbol()": "95d89b41",
  "allowance(address,address)": "dd62ed3e",
  "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)": "d505accf",
  "mint(address,uint256)": "40c10f19",
  "burn(uint256)": "42966c68",
  "pause()": "8456cb59",
  "unpause()": "3f4ba83a",
  "upgradeTo(address)": "3659cfe6",
  "upgradeToAndCall(address,bytes)": "4f1ef286",
  "implementation()": "5c60da1b",
  "admin()": "f851a440",
  "supportsInterface(bytes4)": "01ffc9a7",
  "ownerOf(uint256)": "6352211e",
  "tokenURI(uint256)": "c87b56dd",
  "safeTransferFrom(address,address,uint256)": "42842e0e",
  "safeTransferFrom(address,address,uint256,bytes)": "b88d4fde",
  "getReserves()": "0902f1ac",
  "swap(uint256,uint256,address,bytes)": "022c0d9f",
  "deposit()": "d0e30db0",
  "withdraw(uint256)": "2e1a7d4d",
  "claim()": "4e71d92d",
};

const SOURCE_PATTERNS = {
  ownerOnly: /\bonlyOwner\b|\bDEFAULT_ADMIN_ROLE\b|\bAccessControl\b|\bOwnable\b/gi,
  blacklist: /blacklist|blocklist|isBlacklisted|bots?|tradingEnabled|canSell|cooldown|antiBot|limitsInEffect/gi,
  fees: /\b(set|update|change).{0,24}(fee|tax)|taxFee|buyFee|sellFee|marketingFee|liquidityFee|maxTx|maxWallet/gi,
  mint: /\bmint\s*\(|_mint\s*\(|MINTER_ROLE|minting/gi,
  pause: /\bPausable\b|\bpause\s*\(|\bunpause\s*\(|whenNotPaused/gi,
  reentrancy: /\.call\s*\{|\.call\(|transfer\s*\(|send\s*\(|onERC721Received|onERC1155Received/gi,
  uncheckedCall: /low-level call|\.call\s*\(|delegatecall|staticcall/gi,
  oracle: /getAmountsOut|getReserves|latestRoundData|AggregatorV3Interface|TWAP|priceOracle|oracle/gi,
  randomness: /block\.timestamp|block\.prevrandao|block\.difficulty|blockhash|keccak256\s*\(.{0,80}block/gi,
  proxy: /delegatecall|upgradeTo|UUPS|TransparentUpgradeableProxy|ERC1967|ProxyAdmin|initializer/gi,
  permit: /\bpermit\s*\(|DOMAIN_SEPARATOR|nonces\s*\(|ecrecover|ECDSA|signature/gi,
  governance: /Governor|TimelockController|quorum|proposal|vote|delegate/gi,
  reward: /rewardPerToken|accReward|rewardDebt|stakingBalance|withdraw|harvest|claim/gi,
};

const WEAKNESS_MAP = {
  "Ownership & privilege scanner": "SC01 / SWC-105",
  "Proxy / upgradeability scanner": "SC10 / EIP-1967",
  "ERC20 / ERC721 behavior scanner": "SWC taxonomy",
  "Honeypot and transfer-restriction scanner": "SC05 / SC01",
  "Fee / tax mutation scanner": "SC02 / SC05",
  "Mint / burn authority scanner": "SC01 / SWC-105",
  "Oracle dependency scanner": "SC03",
  "Flash-loan attack surface scanner": "SC04",
  "Reentrancy scanner": "SC08 / SWC-107",
  "External-call scanner": "SC06 / SWC-104",
  "Storage collision / proxy slot scanner": "SC10",
  "Signature / permit abuse scanner": "SWC-117 / CWE-347",
};

function isAddress(value) {
  return /^0x[a-fA-F0-9]{40}$/.test(value || "");
}

function short(value) {
  if (!value || value === ZERO_32) return "none";
  return `${value.slice(0, 10)}...${value.slice(-8)}`;
}

function addressFromStorage(value) {
  if (!value || value === ZERO_32 || value.length !== 66) return null;
  const candidate = `0x${value.slice(-40)}`;
  return isAddress(candidate) && candidate.toLowerCase() !== "0x0000000000000000000000000000000000000000"
    ? candidate
    : null;
}

function addressFromCall(value) {
  return addressFromStorage(value);
}

function uintFromCall(value) {
  if (!value || value === "0x") return null;
  try {
    return BigInt(value).toString();
  } catch {
    return null;
  }
}

function decodeString(value) {
  if (!value || value === "0x") return "";
  try {
    const clean = value.slice(2);
    if (clean.length <= 64) return "";
    const offset = Number.parseInt(clean.slice(0, 64), 16);
    const lengthStart = offset * 2;
    const length = Number.parseInt(clean.slice(lengthStart, lengthStart + 64), 16);
    const data = clean.slice(lengthStart + 64, lengthStart + 64 + length * 2);
    return Buffer.from(data, "hex").toString("utf8").replace(/\u0000/g, "");
  } catch {
    return "";
  }
}

async function optionalCall(chain, address, selector) {
  return optionalRpc(chain, "eth_call", [{ to: address, data: `0x${selector}` }, "latest"]);
}

async function withTimeout(promise, ms, label) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]);
}

async function rpc(chain, method, params) {
  const config = CHAIN_CONFIG[chain] || CHAIN_CONFIG.PulseChain;
  const errors = [];

  for (const rpcUrl of config.rpcUrls) {
    try {
      const response = await withTimeout(fetch(rpcUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method, params }),
      }), 9000, `${method} on ${rpcUrl}`);
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const payload = await response.json();
      if (payload.error) throw new Error(payload.error.message || "RPC error");
      return { result: payload.result, rpcUrl };
    } catch (error) {
      errors.push(`${rpcUrl}: ${error.message}`);
    }
  }

  throw new Error(errors.join(" | "));
}

async function optionalRpc(chain, method, params, fallback = null) {
  try {
    return await rpc(chain, method, params);
  } catch (error) {
    return { result: fallback, rpcUrl: null, error: error.message };
  }
}

async function fetchSource(chain, address) {
  const config = CHAIN_CONFIG[chain] || CHAIN_CONFIG.PulseChain;
  const params = new URLSearchParams({
    module: "contract",
    action: "getsourcecode",
    address,
  });
  if (process.env.ETHERSCAN_API_KEY && chain === "Ethereum") params.set("apikey", process.env.ETHERSCAN_API_KEY);

  try {
    const response = await withTimeout(fetch(`${config.explorerApi}?${params}`), 9000, "source lookup");
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const payload = await response.json();
    const first = Array.isArray(payload.result) ? payload.result[0] : null;
    return {
      source: first?.SourceCode || "",
      contractName: first?.ContractName || "",
      compiler: first?.CompilerVersion || "",
      abi: first?.ABI || "",
      verified: Boolean(first?.SourceCode),
      error: null,
    };
  } catch (error) {
    return { source: "", contractName: "", compiler: "", abi: "", verified: false, error: error.message };
  }
}

function countMatches(text, pattern) {
  if (!text) return 0;
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
}

function hasSelector(bytecode, selector) {
  return bytecode?.toLowerCase().includes(selector.toLowerCase());
}

function selectorList(bytecode) {
  return Object.entries(SELECTORS)
    .filter(([, selector]) => hasSelector(bytecode, selector))
    .map(([signature]) => signature);
}

function buildFinding({ title, severity, confidence, exploitability, impact, evidence, falsePositive, fix, module }) {
  return {
    title,
    severity,
    confidence,
    exploitability,
    impact,
    evidence,
    falsePositive,
    fix,
    module,
    taxonomy: WEAKNESS_MAP[module] || "OWASP SCS / SWC",
  };
}

function detectProjectType({ source, meta }) {
  const text = `${source || ""} ${meta.source.contractName || ""}`.toLowerCase();
  const selectors = new Set(meta.selectors || []);
  const evidence = [];

  function hasAny(words) {
    return words.some((word) => text.includes(word.toLowerCase()));
  }

  const hasTokenMetadata = Boolean(meta.token.symbol || meta.token.name || meta.token.totalSupply || meta.token.decimals !== null);
  const hasErc20Selectors = ["transfer(address,uint256)", "approve(address,uint256)", "allowance(address,address)", "totalSupply()", "decimals()"]
    .some((item) => selectors.has(item));
  const hasNftSelectors = ["supportsInterface(bytes4)", "ownerOf(uint256)", "tokenURI(uint256)", "safeTransferFrom(address,address,uint256)", "safeTransferFrom(address,address,uint256,bytes)"]
    .some((item) => selectors.has(item));

  if (hasNftSelectors || hasAny(["erc721", "erc1155", "nft", "tokenuri", "metadata", "reveal"])) {
    if (hasNftSelectors) evidence.push("NFT interface selectors detected");
    if (hasAny(["erc721", "erc1155", "nft"])) evidence.push("NFT source naming detected");
    return { detected: "NFT", confidence: hasNftSelectors ? "Likely" : "Possible", evidence };
  }

  if (hasAny(["bridge", "crosschain", "cross-chain", "layerzero", "wormhole", "omnichain", "messagebridge"])) {
    return { detected: "Bridge", confidence: "Possible", evidence: ["Bridge/cross-chain source terminology detected"] };
  }

  if (hasAny(["borrow", "repay", "liquidate", "collateral", "interestRate", "comptroller", "debt"])) {
    return { detected: "Lending", confidence: "Possible", evidence: ["Lending/accounting source terminology detected"] };
  }

  if (hasAny(["staking", "stake(", "unstake", "rewardperToken", "rewardDebt", "harvest", "claimRewards"])) {
    return { detected: "Staking", confidence: "Possible", evidence: ["Staking/reward source terminology detected"] };
  }

  if (selectors.has("getReserves()") || selectors.has("swap(uint256,uint256,address,bytes)") || hasAny(["amm", "router", "pair", "swap", "getreserves", "liquidity"])) {
    if (selectors.has("getReserves()")) evidence.push("AMM pair reserve selector detected");
    if (selectors.has("swap(uint256,uint256,address,bytes)")) evidence.push("AMM swap selector detected");
    if (!evidence.length) evidence.push("AMM/liquidity source terminology detected");
    return { detected: "AMM", confidence: selectors.has("getReserves()") ? "Likely" : "Possible", evidence };
  }

  if (hasAny(["vault", "share", "asset()", "deposit", "withdraw", "strategy", "yield"])) {
    return { detected: "Vault", confidence: "Possible", evidence: ["Vault/strategy source terminology detected"] };
  }

  if (hasTokenMetadata || hasErc20Selectors) {
    if (hasTokenMetadata) evidence.push("ERC20-style metadata resolved");
    if (hasErc20Selectors) evidence.push("ERC20 transfer/approval selectors detected");
    return { detected: "Token", confidence: hasTokenMetadata && hasErc20Selectors ? "Likely" : "Possible", evidence };
  }

  if (hasAny(["game", "quest", "loot", "battle", "player"])) {
    return { detected: "GameFi", confidence: "Speculative", evidence: ["GameFi source terminology detected"] };
  }

  return { detected: "Unknown", confidence: "Speculative", evidence: ["No high-confidence project-type signature detected"] };
}

function sourceFindings(source, bytecode, meta) {
  const findings = [];
  const selectors = selectorList(bytecode);
  const hasSource = Boolean(source?.trim());

  const ownerSignals = hasSource ? countMatches(source, SOURCE_PATTERNS.ownerOnly) : 0;
  if (ownerSignals || selectors.some((item) => item.includes("owner") || item.includes("Ownership"))) {
    findings.push(buildFinding({
      title: "Privileged ownership or admin control detected",
      severity: "High",
      confidence: hasSource ? "Likely" : "Possible",
      exploitability: "Conditional",
      impact: "Privilege abuse / Fund loss",
      evidence: hasSource
        ? `${ownerSignals} source ownership/admin signal(s); selectors: ${selectors.filter((item) => item.includes("owner") || item.includes("Ownership")).join(", ") || "none"}`
        : `bytecode selectors: ${selectors.filter((item) => item.includes("owner") || item.includes("Ownership")).join(", ")}`,
      falsePositive: "Privileged roles can be acceptable when controlled by multisig, timelock, transparent policy, and active monitoring.",
      fix: "Move privileged roles to timelocked multisig, cap dangerous parameters, emit events, and document emergency procedures.",
      module: "Ownership & privilege scanner",
    }));
  }

  if (meta.owner) {
    findings.push(buildFinding({
      title: "Live owner role resolves on-chain",
      severity: "Medium",
      confidence: "Confirmed",
      exploitability: "Governance-dependent",
      impact: "Privilege abuse / Configuration risk",
      evidence: `owner/getOwner resolved to ${meta.owner}`,
      falsePositive: "An owner role can be acceptable when it is a multisig, timelock, or intentionally temporary launch controller.",
      fix: "Verify the owner address, publish its control policy, move to multisig/timelock, and remove unused privileged actions.",
      module: "Ownership & privilege scanner",
    }));
  }

  const proxySelectorSignals = selectors.filter((item) => item.includes("upgrade") || item.includes("admin") || item.includes("implementation"));
  if (meta.proxy.implementation || meta.proxy.admin || proxySelectorSignals.length || countMatches(source, SOURCE_PATTERNS.proxy)) {
    findings.push(buildFinding({
      title: "Upgradeable proxy or delegatecall surface detected",
      severity: meta.proxy.admin ? "High" : "Medium",
      confidence: meta.proxy.implementation || meta.proxy.admin ? "Confirmed" : "Likely",
      exploitability: "Upgrade-dependent",
      impact: "Fund loss / Logic replacement / Reputation risk",
      evidence: `implementation=${meta.proxy.implementation || "none"}; admin=${meta.proxy.admin || "none"}; selectors=${proxySelectorSignals.join(", ") || "none"}`,
      falsePositive: "Upgradeable systems are common when upgrades are timelocked, audited, announced, and controlled by robust governance.",
      fix: "Use multisig plus timelock for upgrades, publish implementation diffs, protect initializers, and monitor ERC-1967 slots.",
      module: "Proxy / upgradeability scanner",
    }));
  }

  if (countMatches(source, SOURCE_PATTERNS.blacklist)) {
    findings.push(buildFinding({
      title: "Transfer restriction, blacklist, or anti-sell controls observed",
      severity: "High",
      confidence: "Likely",
      exploitability: "Immediate",
      impact: "Frozen funds / Honeypot risk",
      evidence: `${countMatches(source, SOURCE_PATTERNS.blacklist)} blacklist/trading/cooldown source signal(s)`,
      falsePositive: "Anti-bot launch controls can be legitimate when temporary, capped, and removed after launch.",
      fix: "Make restrictions transparent, bounded, timelocked, and removable; emit events for every wallet-level restriction.",
      module: "Honeypot and transfer-restriction scanner",
    }));
  }

  if (countMatches(source, SOURCE_PATTERNS.fees)) {
    findings.push(buildFinding({
      title: "Mutable fee, tax, or wallet-limit controls detected",
      severity: "High",
      confidence: "Likely",
      exploitability: "Immediate",
      impact: "Fund loss / Trading lock / Accounting corruption",
      evidence: `${countMatches(source, SOURCE_PATTERNS.fees)} fee/tax/limit source signal(s)`,
      falsePositive: "Launch taxes and wallet limits may be acceptable if permanently capped and transparently governed.",
      fix: "Hard-cap fees and limits, add a timelock, emit detailed events, and remove arbitrary owner mutation paths.",
      module: "Fee / tax mutation scanner",
    }));
  }

  if (countMatches(source, SOURCE_PATTERNS.mint) || hasSelector(bytecode, SELECTORS["mint(address,uint256)"])) {
    findings.push(buildFinding({
      title: "Mint authority or supply expansion path detected",
      severity: "High",
      confidence: hasSource ? "Likely" : "Possible",
      exploitability: "Conditional",
      impact: "Fund loss / Dilution / Liquidity drain",
      evidence: `${countMatches(source, SOURCE_PATTERNS.mint)} mint source signal(s); mint selector=${hasSelector(bytecode, SELECTORS["mint(address,uint256)"])}`,
      falsePositive: "Minting may be legitimate for bridged assets, rewards, or capped issuance schedules.",
      fix: "Enforce caps, timelock minting, use role separation, and document total supply policy.",
      module: "Mint / burn authority scanner",
    }));
  }

  if (countMatches(source, SOURCE_PATTERNS.oracle)) {
    findings.push(buildFinding({
      title: "Oracle or AMM spot-price dependency requires manipulation review",
      severity: "Medium",
      confidence: "Possible",
      exploitability: "Economic-only",
      impact: "Price manipulation / Accounting corruption",
      evidence: `${countMatches(source, SOURCE_PATTERNS.oracle)} oracle/reserve source signal(s)`,
      falsePositive: "Deep liquidity, TWAP windows, and circuit breakers can materially reduce practical exploitability.",
      fix: "Use TWAP/medianized oracle feeds, stale-price checks, deviation bounds, and flash-loan-resistant accounting.",
      module: "Oracle dependency scanner",
    }));
  }

  if (countMatches(source, SOURCE_PATTERNS.reentrancy)) {
    findings.push(buildFinding({
      title: "External value or token callbacks require reentrancy review",
      severity: /nonReentrant/.test(source) ? "Medium" : "High",
      confidence: "Likely",
      exploitability: "Conditional",
      impact: "Fund loss / Accounting corruption",
      evidence: `${countMatches(source, SOURCE_PATTERNS.reentrancy)} external-call/callback signal(s); nonReentrant=${/nonReentrant/.test(source)}`,
      falsePositive: "This may be safe when checks-effects-interactions and reentrancy guards cover all shared-state paths.",
      fix: "Update state before external calls, add reentrancy guards, and test cross-function reentry paths.",
      module: "Reentrancy scanner",
    }));
  }

  if (countMatches(source, SOURCE_PATTERNS.uncheckedCall)) {
    findings.push(buildFinding({
      title: "Low-level external calls detected",
      severity: "Medium",
      confidence: "Likely",
      exploitability: "Conditional",
      impact: "Unchecked failure / Fund loss / Unexpected control flow",
      evidence: `${countMatches(source, SOURCE_PATTERNS.uncheckedCall)} low-level call signal(s)`,
      falsePositive: "Low-level calls can be safe when return values are checked and targets are constrained.",
      fix: "Check return values, bubble revert reasons, restrict targets, and avoid arbitrary delegatecall.",
      module: "External-call scanner",
    }));
  }

  if (countMatches(source, SOURCE_PATTERNS.randomness)) {
    findings.push(buildFinding({
      title: "Predictable randomness source detected",
      severity: "Medium",
      confidence: "Likely",
      exploitability: "Economic-only",
      impact: "Game manipulation / Fund loss / Reputation risk",
      evidence: `${countMatches(source, SOURCE_PATTERNS.randomness)} block-data randomness signal(s)`,
      falsePositive: "Block data can be acceptable for non-economic cosmetic randomness.",
      fix: "Use commit-reveal, VRF, or delayed randomness for economic outcomes.",
      module: "Known exploit-pattern matcher",
    }));
  }

  if (countMatches(source, SOURCE_PATTERNS.permit) || hasSelector(bytecode, SELECTORS["permit(address,address,uint256,uint256,uint8,bytes32,bytes32)"])) {
    findings.push(buildFinding({
      title: "Signature / permit surface detected",
      severity: "Medium",
      confidence: hasSource ? "Likely" : "Possible",
      exploitability: "Conditional",
      impact: "Allowance theft / Replay abuse",
      evidence: `${countMatches(source, SOURCE_PATTERNS.permit)} signature source signal(s); permit selector=${hasSelector(bytecode, SELECTORS["permit(address,address,uint256,uint256,uint8,bytes32,bytes32)"])}`,
      falsePositive: "Permit is common when domain separators, nonces, and chain IDs are correctly enforced.",
      fix: "Verify EIP-712 domain separation, nonce consumption, deadline checks, and replay protection across forks.",
      module: "Signature / permit abuse scanner",
    }));
  }

  if (countMatches(source, SOURCE_PATTERNS.reward)) {
    findings.push(buildFinding({
      title: "Reward or staking accounting path detected",
      severity: "Medium",
      confidence: "Possible",
      exploitability: "Conditional",
      impact: "Accounting corruption / Frozen funds",
      evidence: `${countMatches(source, SOURCE_PATTERNS.reward)} staking/reward source signal(s)`,
      falsePositive: "Reward systems can be safe with invariant tests, precision controls, and emergency withdrawal paths.",
      fix: "Add invariant tests for deposits, withdrawals, reward debt, precision rounding, and zero-liquidity epochs.",
      module: "Reward accounting scanner",
    }));
  }

  if (!findings.length) {
    findings.push(buildFinding({
      title: "No high-signal exploit pattern detected in available evidence",
      severity: "Informational",
      confidence: "Possible",
      exploitability: "Conditional",
      impact: "Incomplete context risk",
      evidence: hasSource ? "Source and bytecode scanned with deterministic heuristics." : "Bytecode scanned; verified source was unavailable.",
      falsePositive: "Absence of a heuristic match is not proof of safety and does not replace manual review.",
      fix: "Run full manual audit, property tests, fork simulations, and economic review before deploying funds.",
      module: "Known exploit-pattern matcher",
    }));
  }

  return findings;
}

function riskLabelsFromFindings(findings, meta) {
  const labels = {
    "Honeypot risk": "low",
    "Owner privilege risk": "low",
    "Proxy upgrade risk": "low",
    "Tax / fee manipulation risk": "low",
    "Mint / burn abuse risk": "low",
    "Oracle attack risk": "low",
    "Reentrancy risk": "low",
    "Liquidity drain risk": "low",
    "Governance capture risk": "low",
    "Hidden blacklist risk": "low",
    "Pausable / frozen funds risk": "low",
  };

  for (const finding of findings) {
    const text = `${finding.title} ${finding.module}`.toLowerCase();
    const rank = finding.severity === "Critical" ? "critical" : finding.severity === "High" ? "high" : finding.severity === "Medium" ? "medium" : "low";
    const apply = (label) => {
      if (["critical", "high", "medium"].indexOf(rank) > ["critical", "high", "medium", "low"].indexOf(labels[label])) labels[label] = rank;
    };
    if (text.includes("honeypot") || text.includes("transfer-restriction") || text.includes("blacklist")) apply("Honeypot risk");
    if (text.includes("owner") || text.includes("privilege") || text.includes("admin")) apply("Owner privilege risk");
    if (text.includes("proxy") || text.includes("upgrade")) apply("Proxy upgrade risk");
    if (text.includes("fee") || text.includes("tax")) apply("Tax / fee manipulation risk");
    if (text.includes("mint") || text.includes("burn")) apply("Mint / burn abuse risk");
    if (text.includes("oracle") || text.includes("price")) apply("Oracle attack risk");
    if (text.includes("reentrancy")) apply("Reentrancy risk");
    if (text.includes("liquidity")) apply("Liquidity drain risk");
    if (text.includes("governance")) apply("Governance capture risk");
    if (text.includes("blacklist") || text.includes("restriction")) apply("Hidden blacklist risk");
    if (text.includes("pause") || text.includes("frozen")) apply("Pausable / frozen funds risk");
  }

  if (meta.proxy.admin) labels["Proxy upgrade risk"] = "high";
  return Object.entries(labels);
}

function scoreFindings(findings, sourceInfo, meta) {
  const penalties = { Critical: 34, High: 19, Medium: 9, Low: 3, Informational: 0 };
  const penalty = findings.reduce((sum, finding) => sum + (penalties[finding.severity] || 0), 0);
  const contextPenalty = [
    sourceInfo.verified ? 0 : 8,
    meta.bytecodeSize > 24000 ? 4 : 0,
    meta.proxy.admin ? 8 : 0,
    meta.rpcError ? 12 : 0,
  ].reduce((sum, value) => sum + value, 0);
  return Math.max(0, Math.min(100, 100 - penalty - contextPenalty));
}

function verdictFromScore(score) {
  if (score >= 90) return { verdict: "Review", threatLevel: "Green", interpretation: "No critical issue detected in the available evidence." };
  if (score >= 75) return { verdict: "Warning", threatLevel: "Yellow", interpretation: "Mostly clean with minor observable risk." };
  if (score >= 60) return { verdict: "Warning", threatLevel: "Orange", interpretation: "Caution: meaningful risk requires manual review." };
  if (score >= 40) return { verdict: "Fail", threatLevel: "Red", interpretation: "Dangerous design or admin risk detected." };
  if (score >= 20) return { verdict: "Fail", threatLevel: "Red", interpretation: "High likelihood of abuse or exploitable design." };
  return { verdict: "Critical", threatLevel: "Black", interpretation: "Critical risk concentration or likely dangerous contract behavior." };
}

export async function scanContract(input) {
  const address = String(input.address || "").trim();
  const chain = "PulseChain";
  const optionalSource = String(input.source || "").trim();

  if (!isAddress(address)) {
    return {
      ok: false,
      error: "Enter a valid 0x contract address.",
      status: 400,
    };
  }

  const [codeResult, blockResult, implSlot, adminSlot, beaconSlot, sourceInfo] = await Promise.all([
    optionalRpc(chain, "eth_getCode", [address, "latest"], "0x"),
    optionalRpc(chain, "eth_blockNumber", []),
    optionalRpc(chain, "eth_getStorageAt", [address, ERC1967.implementation, "latest"], ZERO_32),
    optionalRpc(chain, "eth_getStorageAt", [address, ERC1967.admin, "latest"], ZERO_32),
    optionalRpc(chain, "eth_getStorageAt", [address, ERC1967.beacon, "latest"], ZERO_32),
    fetchSource(chain, address),
  ]);

  const [ownerCall, getOwnerCall, nameCall, symbolCall, decimalsCall, totalSupplyCall] = await Promise.all([
    optionalCall(chain, address, SELECTORS["owner()"]),
    optionalCall(chain, address, SELECTORS["getOwner()"]),
    optionalCall(chain, address, SELECTORS["name()"]),
    optionalCall(chain, address, SELECTORS["symbol()"]),
    optionalCall(chain, address, SELECTORS["decimals()"]),
    optionalCall(chain, address, SELECTORS["totalSupply()"]),
  ]);

  const bytecode = codeResult.result || "0x";
  const source = optionalSource && optionalSource !== "optional Solidity source pasted here"
    ? optionalSource
    : sourceInfo.source;
  const meta = {
    address,
    chain,
    rpcUrl: codeResult.rpcUrl,
    rpcError: codeResult.error || null,
    blockNumber: blockResult.result ? Number.parseInt(blockResult.result, 16) : null,
    bytecodeSize: Math.max(0, (bytecode.length - 2) / 2),
    bytecodeHashNote: "Bytecode similarity requires an indexed corpus; this build records selectors and size for corpus comparison.",
    proxy: {
      implementation: addressFromStorage(implSlot.result),
      admin: addressFromStorage(adminSlot.result),
      beacon: addressFromStorage(beaconSlot.result),
      raw: {
        implementation: implSlot.result,
        admin: adminSlot.result,
        beacon: beaconSlot.result,
      },
    },
    selectors: selectorList(bytecode),
    owner: addressFromCall(ownerCall.result) || addressFromCall(getOwnerCall.result),
    token: {
      name: decodeString(nameCall.result),
      symbol: decodeString(symbolCall.result),
      decimals: decimalsCall.result ? Number.parseInt(decimalsCall.result, 16) : null,
      totalSupply: uintFromCall(totalSupplyCall.result),
    },
    source: {
      verified: sourceInfo.verified,
      contractName: sourceInfo.contractName,
      compiler: sourceInfo.compiler,
      lookupError: sourceInfo.error,
      providedByUser: Boolean(optionalSource && optionalSource !== "optional Solidity source pasted here"),
    },
  };
  meta.projectType = detectProjectType({ source, meta });

  if (!meta.rpcError && (!bytecode || bytecode === "0x")) {
    return {
      ok: false,
      error: "No deployed contract bytecode was found at this address on PulseChain.",
      status: 404,
      meta,
    };
  }

  const findings = sourceFindings(source, bytecode, meta);
  const score = scoreFindings(findings, meta.source, meta);
  const verdict = verdictFromScore(score);
  const riskLabels = riskLabelsFromFindings(findings, meta);

  return {
    ok: true,
    generatedAt: new Date().toISOString(),
    auditScore: score,
    ...verdict,
    riskLabels,
    findings,
    meta,
    terminal: [
      "engine.boot: PulseShield online",
      `chain.profile: ${chain} / native gas ${(CHAIN_CONFIG[chain] || CHAIN_CONFIG.PulseChain).native}`,
      `project.type: ${meta.projectType.detected} / confidence=${meta.projectType.confidence}`,
      `rpc.fetch: ${codeResult.rpcUrl || "unavailable"}`,
      `bytecode.size: ${meta.bytecodeSize} bytes`,
      `token.meta: ${meta.token.symbol || "unknown"} / decimals=${meta.token.decimals ?? "unknown"}`,
      `owner.role: ${meta.owner || "not resolved"}`,
      `proxy.slots: impl=${short(meta.proxy.implementation)} admin=${short(meta.proxy.admin)} beacon=${short(meta.proxy.beacon)}`,
      `source.lookup: ${meta.source.verified ? "verified source loaded" : meta.source.lookupError || "no verified source"}`,
      "verdict.rule: never guarantee safety",
    ],
    disclaimer: "Automated analysis cannot guarantee safety. Findings may include false positives or incomplete context. Some risky permissions are legitimate during launch, migration, or emergency-protection periods. Always combine automated scans with manual review before deploying funds.",
  };
}
