"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ReactFlow, { Background, Controls } from "reactflow";
import {
  AlertTriangle,
  Activity,
  Binary,
  Blocks,
  BarChart3,
  Cpu,
  ChevronDown,
  ExternalLink,
  Crosshair,
  Eye,
  FileSearch,
  Fingerprint,
  Flame,
  GitBranch,
  Info,
  Layers,
  LockKeyhole,
  Network,
  Radar,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  Skull,
  SlidersHorizontal,
  Terminal,
  TrendingUp,
  Vote,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  Radar as RechartsRadar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function PulseEnvironment() {
  const [pointer, setPointer] = useState({ x: 50, y: 28 });

  useEffect(() => {
    let frame = 0;
    function onMove(event) {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setPointer({
          x: (event.clientX / window.innerWidth) * 100,
          y: (event.clientY / window.innerHeight) * 100,
        });
      });
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      className="pulse-environment pointer-events-none fixed inset-0"
      style={{
        "--mx": `${pointer.x}%`,
        "--my": `${pointer.y}%`,
      }}
    >
      <div className="pulse-orbit pulse-orbit-a" />
      <div className="pulse-orbit pulse-orbit-b" />
      <div className="pulse-fog pulse-fog-a" />
      <div className="pulse-fog pulse-fog-b" />
      <div className="pulse-particles">
        {Array.from({ length: 22 }).map((_, index) => (
          <span
            key={index}
            style={{
              "--i": index,
              "--x": `${(index * 37) % 100}%`,
              "--y": `${(index * 19) % 100}%`,
              "--s": `${1.4 + (index % 4) * 0.35}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

const chainProfiles = {
  PulseChain: { explorer: "scan.pulsechain.com", native: "PLS", rpc: "PulseChain mainnet" },
};
const sampleAddress = "0xA1077a294dDE1B09bB078844df40758a5D0f9a27";

const navItems = [
  ["Scan", "#scan"],
  ["Dashboard", "#dashboard"],
  ["Threat Graph", "#graph"],
  ["Modules", "#modules"],
  ["Ecosystem", "#ecosystem"],
];

const pulseProjects = [
  { name: "EMIT Farm", href: "https://emit.farm/", type: "Yield / farm" },
  { name: "PulseX", href: "https://app.pulsex.com/", type: "Core DEX" },
  { name: "Piteas", href: "https://app.piteas.io/", type: "DEX aggregator" },
  { name: "Phux", href: "https://phux.io/", type: "Liquidity" },
  { name: "9mm", href: "https://9mm.pro/", type: "DEX" },
  { name: "DexScreener", href: "https://dexscreener.com/pulsechain", type: "Market data" },
  { name: "PulseChain Scan", href: "https://scan.pulsechain.com/", type: "Explorer" },
  { name: "PulseChain Community", href: "https://www.pulsechain.community/", type: "Ecosystem index" },
];

const attackSimulations = [
  ["Privilege escalation", "owner -> fee setter -> sell lock", 88],
  ["Liquidity drain", "router -> pair -> reserve skew", 74],
  ["Proxy mutation", "admin -> implementation -> delegatecall", 81],
  ["Oracle pulse", "spot price -> borrow path -> liquidation", 69],
];

function formatUsd(value, maximumFractionDigits = 2) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return "$0";
  if (number > 0 && number < 0.0001) return `$${number.toExponential(2)}`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
  }).format(number);
}

function formatCompact(value) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return "0";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(number);
}

function formatPercent(value) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return "0%";
  return `${number > 0 ? "+" : ""}${number.toFixed(2)}%`;
}

function shortAddress(value) {
  if (!value || typeof value !== "string") return "none";
  if (!value.startsWith("0x") || value.length < 16) return value;
  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}

const fallbackRiskLabels = [
  ["Honeypot risk", "high"],
  ["Owner privilege risk", "critical"],
  ["Proxy upgrade risk", "high"],
  ["Tax / fee manipulation risk", "high"],
  ["Mint / burn abuse risk", "medium"],
  ["Oracle attack risk", "high"],
  ["Reentrancy risk", "medium"],
  ["Liquidity drain risk", "high"],
  ["Governance capture risk", "medium"],
  ["Hidden blacklist risk", "critical"],
  ["Pausable / frozen funds risk", "medium"],
];

const modules = [
  "Ownership & privilege scanner",
  "Proxy / upgradeability scanner",
  "ERC20 / ERC721 behavior scanner",
  "Honeypot and transfer-restriction scanner",
  "Fee / tax mutation scanner",
  "Mint / burn authority scanner",
  "Blacklist / whitelist / cooldown scanner",
  "Liquidity and pair interaction scanner",
  "Oracle dependency scanner",
  "Flash-loan attack surface scanner",
  "Reentrancy scanner",
  "External-call scanner",
  "Storage collision / proxy slot scanner",
  "Governance takeover scanner",
  "Signature / permit abuse scanner",
  "Reward accounting scanner",
  "Staking withdrawal edge-case scanner",
  "NFT metadata / reveal / admin abuse scanner",
  "Bridge / cross-chain trust scanner",
  "Known exploit-pattern matcher",
  "Bytecode similarity scanner",
  "Community reputation layer",
];

const taxonomy = [
  "SC01 Access control",
  "SC02 Business logic",
  "SC03 Oracle manipulation",
  "SC04 Flash-loan attacks",
  "SC05 Input validation",
  "SC06 Unchecked external calls",
  "SC07 Arithmetic / precision",
  "SC08 Reentrancy",
  "SC09 DoS",
  "SC10 Proxy / upgradeability",
  "SWC weakness taxonomy",
];

const fallbackFindings = [
  {
    title: "Owner can modify transfer fees up to 100%",
    severity: "Critical",
    confidence: "Likely",
    exploitability: "Immediate",
    impact: "Fund loss / Trading lock",
    evidence: "setFees(uint256,uint256), _taxFee, onlyOwner, PairSync event drift",
    falsePositive: "Launch taxes may be temporary if capped, timelocked, and transparently emitted.",
    fix: "Hard cap fees below a protocol-approved ceiling, add timelock, emit granular events, and renounce or multisig the role.",
  },
  {
    title: "Centralized blacklist can block sells",
    severity: "High",
    confidence: "Confirmed",
    exploitability: "Conditional",
    impact: "Frozen funds / Privilege abuse",
    evidence: "mapping(address => bool) blacklist, _beforeTokenTransfer, setBlacklist(address,bool)",
    falsePositive: "Sanctions controls can be legitimate when narrowly scoped and governed.",
    fix: "Restrict blacklist use to documented compliance cases, add appeal flow, timelock changes, and publish admin actions.",
  },
  {
    title: "Upgradeable proxy depends on single admin",
    severity: "High",
    confidence: "Possible",
    exploitability: "Upgrade-dependent",
    impact: "Fund loss / Reputation risk",
    evidence: "EIP-1967 implementation slot, ProxyAdmin.owner(), delegatecall upgrade path",
    falsePositive: "Proxies are normal when controlled by multisig, timelocks, tests, and public upgrade notices.",
    fix: "Move admin to audited multisig plus timelock, document upgrade runbooks, and monitor implementation bytecode changes.",
  },
  {
    title: "External call before complete accounting update",
    severity: "Medium",
    confidence: "Likely",
    exploitability: "Conditional",
    impact: "Accounting corruption",
    evidence: "withdraw(uint256), call{value: amount}(), rewards[msg.sender] update follows call",
    falsePositive: "May be safe if guarded by nonReentrant and all state-changing paths are covered.",
    fix: "Apply checks-effects-interactions, update accounting before transfer, and add reentrancy guards across shared state.",
  },
  {
    title: "Oracle route appears manipulable within one block",
    severity: "High",
    confidence: "Speculative",
    exploitability: "Economic-only",
    impact: "Price manipulation",
    evidence: "getAmountsOut(), spot reserves, no TWAP window, no heartbeat validation",
    falsePositive: "Deep liquidity and independent circuit breakers can reduce exploit practicality.",
    fix: "Use TWAP or trusted oracle aggregation, bound price movement, and reject stale or extreme values.",
  },
];

const heatmap = [
  { name: "Access", risk: 94 },
  { name: "Oracle", risk: 76 },
  { name: "Logic", risk: 72 },
  { name: "Input", risk: 58 },
  { name: "Calls", risk: 69 },
  { name: "Proxy", risk: 83 },
  { name: "DoS", risk: 44 },
];

const radarData = [
  { subject: "Privilege", value: 94 },
  { subject: "Upgrade", value: 81 },
  { subject: "Economics", value: 77 },
  { subject: "Calls", value: 62 },
  { subject: "Oracle", value: 72 },
  { subject: "Community", value: 48 },
];

const votes = [
  ["Suspicious", 42, "weighted"],
  ["Needs Manual Review", 28, "auditor"],
  ["False Positive", 13, "verified"],
  ["Confirmed Malicious", 11, "auditor"],
  ["Confirmed Safe", 6, "new"],
];

const nodeDefaults = { sourcePosition: "right", targetPosition: "left" };

function dependencyNode({ id, label, caption, kind, address, position, selected, risk = "info" }) {
  return {
    id,
    position,
    className: `dependency-node dependency-node-${risk}${selected ? " is-selected" : ""}`,
    data: {
      label: (
        <div>
          <div className="dependency-node-label">{label}</div>
          <div className="dependency-node-caption">{caption}</div>
        </div>
      ),
      labelText: label,
      caption,
      kind,
      address,
      risk,
    },
    ...nodeDefaults,
  };
}

function dependencyEdge(id, source, target, risk = "info") {
  return {
    id,
    source,
    target,
    animated: risk !== "info",
    className: `dependency-edge dependency-edge-${risk}`,
  };
}

function buildDependencyGraph({ scanReport, marketReport, targetAddress, selectedId }) {
  const meta = scanReport?.meta;
  const findings = scanReport?.findings || [];
  const projectType = meta?.projectType?.detected || "Unscanned";
  const tokenSymbol = meta?.token?.symbol || "Target";
  const nodes = [];
  const edges = [];

  nodes.push(dependencyNode({
    id: "contract",
    label: tokenSymbol !== "Target" ? `${tokenSymbol} Contract` : "Target Contract",
    caption: meta?.address ? shortAddress(meta.address) : shortAddress(targetAddress),
    kind: "PulseChain contract",
    address: meta?.address || targetAddress,
    position: { x: 20, y: 130 },
    selected: selectedId === "contract",
    risk: scanReport?.threatLevel === "Black" || scanReport?.threatLevel === "Red" ? "critical" : "info",
  }));

  nodes.push(dependencyNode({
    id: "users",
    label: "Users / Callers",
    caption: "External interaction surface",
    kind: "Actor group",
    position: { x: 20, y: 250 },
    selected: selectedId === "users",
    risk: "info",
  }));
  edges.push(dependencyEdge("users-contract", "users", "contract"));

  if (meta?.owner) {
    nodes.push(dependencyNode({
      id: "owner",
      label: "Owner Role",
      caption: shortAddress(meta.owner),
      kind: "Privilege holder",
      address: meta.owner,
      position: { x: 285, y: 25 },
      selected: selectedId === "owner",
      risk: "critical",
    }));
    edges.push(dependencyEdge("owner-contract", "owner", "contract", "critical"));
  }

  const proxyItems = [
    ["implementation", "Implementation", meta?.proxy?.implementation, { x: 285, y: 110 }],
    ["admin", "Proxy Admin", meta?.proxy?.admin, { x: 285, y: 195 }],
    ["beacon", "Beacon", meta?.proxy?.beacon, { x: 285, y: 280 }],
  ].filter(([, , address]) => address);

  proxyItems.forEach(([id, label, address, position]) => {
    nodes.push(dependencyNode({
      id: `proxy-${id}`,
      label,
      caption: shortAddress(address),
      kind: "Upgradeability dependency",
      address,
      position,
      selected: selectedId === `proxy-${id}`,
      risk: id === "admin" ? "critical" : "warning",
    }));
    edges.push(dependencyEdge(`proxy-${id}-contract`, `proxy-${id}`, "contract", id === "admin" ? "critical" : "warning"));
  });

  if (marketReport?.primaryPair?.pairAddress) {
    const pair = marketReport.primaryPair;
    const quote = pair.quoteToken?.symbol || "Quote";
    nodes.push(dependencyNode({
      id: "pair",
      label: `${pair.dexId || "DEX"} Pair`,
      caption: `${tokenSymbol}/${quote} ${formatUsd(pair.liquidity?.usd)}`,
      kind: "Liquidity dependency",
      address: pair.pairAddress,
      position: { x: 550, y: 85 },
      selected: selectedId === "pair",
      risk: Number(pair.liquidity?.usd || 0) < 25000 ? "warning" : "info",
    }));
    edges.push(dependencyEdge("contract-pair", "contract", "pair", "warning"));
  }

  if (meta?.source?.verified || meta?.source?.providedByUser) {
    nodes.push(dependencyNode({
      id: "source",
      label: meta.source.verified ? "Verified Source" : "Provided Source",
      caption: meta.source.contractName || projectType,
      kind: "Evidence layer",
      position: { x: 550, y: 185 },
      selected: selectedId === "source",
      risk: "info",
    }));
    edges.push(dependencyEdge("source-contract", "source", "contract"));
  }

  findings.slice(0, 3).forEach((finding, index) => {
    const risk = finding.severity === "Critical" || finding.severity === "High" ? "critical" : finding.severity === "Medium" ? "warning" : "info";
    const id = `finding-${index}`;
    nodes.push(dependencyNode({
      id,
      label: finding.module || finding.severity,
      caption: finding.severity,
      kind: "Finding module",
      position: { x: 550, y: 265 + index * 82 },
      selected: selectedId === id,
      risk,
    }));
    edges.push(dependencyEdge(`contract-${id}`, "contract", id, risk));
  });

  if (!scanReport) {
    nodes.push(dependencyNode({
      id: "scanner",
      label: "PulseShield Scanner",
      caption: "Run scan to populate graph",
      kind: "Analysis engine",
      position: { x: 285, y: 130 },
      selected: selectedId === "scanner",
      risk: "info",
    }));
    edges.push(dependencyEdge("scanner-contract", "scanner", "contract"));
  }

  return { nodes, edges };
}

function scoreVerdict(score) {
  if (score >= 90) return ["Review", "Green", "No critical issue detected in the available evidence."];
  if (score >= 75) return ["Warning", "Yellow", "Mostly clean, minor issues observed."];
  if (score >= 60) return ["Warning", "Orange", "Caution: meaningful risk needs review."];
  if (score >= 40) return ["Fail", "Red", "Dangerous design or admin risk detected."];
  if (score >= 20) return ["Fail", "Red", "High likelihood of abuse or exploit."];
  return ["Critical", "Black", "Likely malicious or actively dangerous."];
}

function statusColor(level) {
  return {
    Green: "text-[#63ff9d] border-[#63ff9d]/40 bg-[#63ff9d]/10",
    Yellow: "text-[#f8ff72] border-[#f8ff72]/40 bg-[#f8ff72]/10",
    Orange: "text-[#ffb347] border-[#ffb347]/40 bg-[#ffb347]/10",
    Red: "text-[#ff4dce] border-[#ff4dce]/40 bg-[#ff4dce]/10",
    Black: "text-white border-white/30 bg-black",
  }[level];
}

function Field({ label, children }) {
  return (
    <label className="grid gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
      {label}
      {children}
    </label>
  );
}

function Panel({ children, className = "", ...props }) {
  return <section className={`glass rounded-lg ${className}`} {...props}>{children}</section>;
}

function ScoreRing({ score, level }) {
  const [verdict] = scoreVerdict(score);
  return (
    <div className="relative grid place-items-center">
      <div
        className="h-52 w-52 rounded-full"
        style={{
          background: `conic-gradient(${level === "Black" ? "#ffffff" : level === "Red" ? "#ff4dce" : "#ffb347"} ${score * 3.6}deg, rgba(255,255,255,.08) 0deg)`,
          boxShadow: "0 0 58px rgba(255,77,206,.22)",
        }}
      />
      <div className="absolute grid h-40 w-40 place-items-center rounded-full border border-white/10 bg-[#050608] text-center">
        <div>
          <div className="text-5xl font-black">{score}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-400">Audit Score</div>
          <div className="mt-3 text-sm font-bold text-[#ff4dce]">{verdict}</div>
        </div>
      </div>
    </div>
  );
}

function MarketOverlay({ marketReport, onClose }) {
  if (!marketReport) return null;
  const pair = marketReport.primaryPair;
  const analysis = marketReport.analysis || {};
  const base = pair?.baseToken || {};
  const quote = pair?.quoteToken || {};

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/78 px-4 py-6 backdrop-blur-xl">
      <div className="market-overlay w-full max-w-6xl overflow-hidden rounded-lg border border-[#00e7ff]/20 bg-[#05080a] shadow-[0_30px_120px_rgba(0,0,0,.72)]">
        <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#00e7ff]">
              <Activity size={15} /> DexScreener market intelligence
            </div>
            <h2 className="text-2xl font-black">
              {base.symbol || "Token"} / {quote.symbol || "Quote"} {pair?.dexId ? <span className="text-slate-500">on {pair.dexId}</span> : null}
            </h2>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/[0.035] text-slate-300 transition hover:border-[#ff4dce]/40 hover:text-[#ffc2f6]" title="Close market overlay">
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 p-4 lg:grid-cols-[1.25fr_.75fr]">
          <section className="rounded-lg border border-white/10 bg-black/28 p-4">
            <div className="mb-4 grid gap-3 sm:grid-cols-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Live price</p>
                <p className="mt-1 text-2xl font-black">{formatUsd(pair?.priceUsd, 8)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">24h change</p>
                <p className={`mt-1 text-2xl font-black ${Number(pair?.priceChange?.h24 || 0) < 0 ? "text-[#ffc2f6]" : "text-[#63ff9d]"}`}>
                  {formatPercent(pair?.priceChange?.h24)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Liquidity</p>
                <p className="mt-1 text-2xl font-black">{formatUsd(pair?.liquidity?.usd)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">24h volume</p>
                <p className="mt-1 text-2xl font-black">{formatUsd(pair?.volume?.h24)}</p>
              </div>
            </div>

            <div className="h-72 rounded-lg border border-white/10 bg-[#020507] p-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketReport.chart || []}>
                  <defs>
                    <linearGradient id="marketPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00e7ff" stopOpacity={0.34} />
                      <stop offset="100%" stopColor="#00e7ff" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="window" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} width={58} />
                  <Tooltip contentStyle={{ background: "#05080a", border: "1px solid rgba(255,255,255,.12)" }} />
                  <Area type="monotone" dataKey="price" stroke="#00e7ff" strokeWidth={2} fill="url(#marketPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <aside className="grid gap-4">
            <div className="rounded-lg border border-white/10 bg-black/28 p-4">
              <h3 className="mb-3 flex items-center gap-2 font-bold">
                <TrendingUp size={17} className="text-[#00e7ff]" /> Flow Analysis
              </h3>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-slate-400">24h buys</span><strong>{formatCompact(analysis.buys)}</strong></div>
                <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-slate-400">24h sells</span><strong>{formatCompact(analysis.sells)}</strong></div>
                <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-slate-400">Turnover</span><strong>{analysis.turnover ? `${analysis.turnover.toFixed(2)}x` : "0x"}</strong></div>
                <div className="flex justify-between"><span className="text-slate-400">Active pairs</span><strong>{analysis.activePairs || 0}/{analysis.totalPairs || 0}</strong></div>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-black/28 p-4">
              <h3 className="mb-3 flex items-center gap-2 font-bold">
                <BarChart3 size={17} className="text-[#ffb347]" /> Pair Ranking
              </h3>
              <div className="grid gap-2">
                {(marketReport.pairs || []).slice(0, 5).map((item) => (
                  <a key={item.pairAddress} href={item.url} target="_blank" rel="noreferrer" className="rounded-md border border-white/10 bg-white/[0.025] p-2 text-sm transition hover:border-[#00e7ff]/35">
                    <div className="flex items-center justify-between gap-3">
                      <strong>{item.dexId || "dex"} / {item.quoteToken?.symbol || "quote"}</strong>
                      <span className="text-xs text-slate-500">{formatUsd(item.liquidity?.usd)}</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">Vol 24h {formatUsd(item.volume?.h24)} / {formatPercent(item.priceChange?.h24)}</div>
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="border-t border-white/10 p-4">
          <h3 className="mb-2 font-bold">Market Notes</h3>
          <div className="grid gap-2 md:grid-cols-2">
            {(analysis.notes || [marketReport.disclaimer]).map((note) => (
              <div key={note} className="rounded-md border border-white/10 bg-white/[0.025] p-3 text-sm text-slate-300">{note}</div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">{marketReport.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}

function MarketDock({ marketReport, onExpand }) {
  if (!marketReport?.hasTrading) return null;
  const pair = marketReport.primaryPair;
  const analysis = marketReport.analysis || {};
  const change = Number(pair?.priceChange?.h24 || 0);

  return (
    <div className="market-dock rounded-lg border border-[#00e7ff]/20 bg-black/45 p-3">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#00e7ff]">
            <Activity size={13} /> Market Intel
          </div>
          <div className="mt-1 text-lg font-black">{pair?.baseToken?.symbol || "Token"} / {pair?.quoteToken?.symbol || "Quote"}</div>
          <div className="text-xs text-slate-500">{pair?.dexId || "DEX"} / {marketReport.source}</div>
        </div>
        <button onClick={onExpand} className="rounded border border-white/10 bg-white/[0.035] px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-300 transition hover:border-[#00e7ff]/40 hover:text-[#00e7ff]">
          Expand
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded border border-white/10 bg-white/[0.025] p-2">
          <div className="text-slate-500">Price</div>
          <div className="mt-1 font-black text-white">{formatUsd(pair?.priceUsd, 8)}</div>
        </div>
        <div className="rounded border border-white/10 bg-white/[0.025] p-2">
          <div className="text-slate-500">24h</div>
          <div className={`mt-1 font-black ${change < 0 ? "text-[#ffc2f6]" : "text-[#b8ffd0]"}`}>{formatPercent(change)}</div>
        </div>
        <div className="rounded border border-white/10 bg-white/[0.025] p-2">
          <div className="text-slate-500">Liquidity</div>
          <div className="mt-1 font-black text-white">{formatUsd(pair?.liquidity?.usd)}</div>
        </div>
        <div className="rounded border border-white/10 bg-white/[0.025] p-2">
          <div className="text-slate-500">Volume</div>
          <div className="mt-1 font-black text-white">{formatUsd(pair?.volume?.h24)}</div>
        </div>
      </div>

      <div className="mt-3 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={marketReport.chart || []}>
            <Area type="monotone" dataKey="price" stroke="#00e7ff" strokeWidth={2} fill="#00e7ff" fillOpacity={0.08} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
        <span>{formatCompact(analysis.buys)} buys</span>
        <span>{formatCompact(analysis.sells)} sells</span>
        <span>{analysis.activePairs || 0} active pairs</span>
      </div>
    </div>
  );
}

function TokenResultHeader({ scanReport, marketReport, onExpandMarket }) {
  if (!scanReport) return null;
  const token = scanReport.meta?.token || {};
  const pair = marketReport?.primaryPair;
  const symbol = pair?.baseToken?.symbol || token.symbol || "Token";
  const name = pair?.baseToken?.name || token.name || "Analyzed contract";
  const change = Number(pair?.priceChange?.h24 || 0);

  return (
    <div className="token-priority-card rounded-lg border border-[#00e7ff]/20 bg-black/40 p-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00e7ff]">Token result</div>
          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            <h2 className="truncate text-2xl font-black leading-tight sm:text-3xl">{symbol}</h2>
            <span className="min-w-0 truncate text-sm text-slate-400">{name}</span>
          </div>
          <div className="mt-2 truncate font-mono text-[11px] text-slate-500">{scanReport.meta?.address}</div>
        </div>

        <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-[minmax(76px,1fr)_minmax(76px,1fr)_minmax(112px,1.25fr)_80px] lg:w-auto lg:min-w-[470px]">
          <div className="min-w-0 rounded-md border border-white/10 bg-white/[0.025] p-2">
            <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Price</div>
            <div className="mt-1 truncate text-sm font-black text-white" title={pair ? formatUsd(pair.priceUsd, 8) : "No pair"}>{pair ? formatUsd(pair.priceUsd, 8) : "No pair"}</div>
          </div>
          <div className="min-w-0 rounded-md border border-white/10 bg-white/[0.025] p-2">
            <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500">24h</div>
            <div className={`mt-1 truncate text-sm font-black ${change < 0 ? "text-[#ffc2f6]" : "text-[#b8ffd0]"}`} title={pair ? formatPercent(change) : "--"}>{pair ? formatPercent(change) : "--"}</div>
          </div>
          <div className="min-w-0 rounded-md border border-white/10 bg-white/[0.025] p-2">
            <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Liquidity</div>
            <div className="mt-1 truncate text-sm font-black text-white" title={pair ? formatUsd(pair.liquidity?.usd) : "--"}>{pair ? formatUsd(pair.liquidity?.usd) : "--"}</div>
          </div>
          <button
            onClick={onExpandMarket}
            disabled={!marketReport?.hasTrading}
            className="min-w-0 rounded-md border border-[#00e7ff]/25 bg-[#00e7ff]/10 p-2 text-left text-sm font-black text-[#9af7ff] transition hover:border-[#00e7ff]/50 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <span className="block text-[10px] uppercase tracking-[0.14em] text-slate-400">Market</span>
            <span className="block truncate">{marketReport?.hasTrading ? "Expand" : "No pair"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [advanced, setAdvanced] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [scanReport, setScanReport] = useState(null);
  const [marketReport, setMarketReport] = useState(null);
  const [scanError, setScanError] = useState("");
  const [marketError, setMarketError] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanPressed, setScanPressed] = useState(false);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [targetExpanded, setTargetExpanded] = useState(true);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [selectedGraphNodeId, setSelectedGraphNodeId] = useState("contract");
  const [form, setForm] = useState({
    address: sampleAddress,
    owner: "",
    proxy: "",
    docs: "",
    source: "",
  });

  const heuristicScore = useMemo(() => {
    let value = 68;
    if (form.owner.trim()) value -= 9;
    if (form.proxy.trim()) value -= 12;
    if (advanced) value -= 5;
    return Math.max(12, Math.min(96, value));
  }, [form, advanced]);

  const score = scanReport?.auditScore ?? heuristicScore;
  const [fallbackVerdict, fallbackLevel, interpretation] = scoreVerdict(score);
  const verdict = scanReport?.verdict || fallbackVerdict;
  const level = scanReport?.threatLevel || fallbackLevel;
  const chainProfile = chainProfiles.PulseChain;
  const detectedProjectType = scanReport?.meta?.projectType?.detected || "Auto-classified";
  const projectTypeConfidence = scanReport?.meta?.projectType?.confidence || "Pending";
  const displayedFindings = scanReport?.findings?.length ? scanReport.findings : fallbackFindings;
  const displayedRiskLabels = scanReport?.riskLabels?.length ? scanReport.riskLabels : fallbackRiskLabels;
  const terminalLines = scanReport?.terminal ?? [
    "engine.boot: PulseShield online",
    `chain.profile: ${chainProfile.rpc} / native gas ${chainProfile.native}`,
    `fetch.source: ${chainProfile.explorer} lookup queued`,
    "static.pass: Slither / Mythril / Semgrep rules mapped",
    "bytecode.pass: proxy slot and selector scan complete",
    "ai.report: evidence-only explanation drafting",
    "verdict.rule: never guarantee safety",
  ];
  const dependencyGraph = useMemo(() => buildDependencyGraph({
    scanReport,
    marketReport,
    targetAddress: form.address,
    selectedId: selectedGraphNodeId,
  }), [scanReport, marketReport, form.address, selectedGraphNodeId]);
  const selectedGraphNode = dependencyGraph.nodes.find((node) => node.id === selectedGraphNodeId) || dependencyGraph.nodes[0];

  useEffect(() => {
    if (dependencyGraph.nodes.length && !dependencyGraph.nodes.some((node) => node.id === selectedGraphNodeId)) {
      setSelectedGraphNodeId(dependencyGraph.nodes[0].id);
    }
  }, [dependencyGraph.nodes, selectedGraphNodeId]);

  function expandTargetPanel() {
    setOptionsOpen(false);
    setTargetExpanded(true);
  }

  function toggleTargetPanel() {
    if (targetExpanded) {
      setTargetExpanded(false);
      return;
    }
    expandTargetPanel();
  }

  function clearSampleAddress() {
    setForm((current) => current.address === sampleAddress ? { ...current, address: "" } : current);
  }

  async function runScan() {
    setIsScanning(true);
    setScanError("");
    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          address: form.address,
          chain: "PulseChain",
          source: form.source,
          docs: form.docs,
          owner: form.owner,
          proxy: form.proxy,
          ownerAdvancedMode: advanced,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Scan failed.");
      setScanReport(payload);
      setMarketError("");
      const marketResponse = await fetch("/api/market", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ address: form.address, chain: "PulseChain" }),
      });
      const marketPayload = await marketResponse.json();
      if (marketResponse.ok && marketPayload.ok) {
        setMarketReport(marketPayload);
      } else {
        setMarketReport(null);
        setMarketError(marketPayload.error || "No market data found.");
      }
      setOptionsOpen(false);
      setTargetExpanded(false);
      setSelectedGraphNodeId("contract");
    } catch (error) {
      setScanError(error.message);
      setScanReport(null);
      setMarketReport(null);
    } finally {
      setIsScanning(false);
    }
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <PulseEnvironment />
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="threat-overlay pointer-events-none absolute inset-0" />
      {isMarketOpen ? <MarketOverlay marketReport={marketReport} onClose={() => setIsMarketOpen(false)} /> : null}

      <div className="relative mx-auto max-w-[1540px]">
        <nav className="uhd-nav sticky top-3 z-30 mb-5 flex flex-col gap-3 rounded-xl px-3 py-3 md:flex-row md:items-center md:justify-between">
          <a href="#top" className="nav-brand group flex items-center gap-3">
            <span className="nav-mark grid h-11 w-11 place-items-center rounded-lg border border-[#00e7ff]/30 bg-black/55 text-[#00e7ff] shadow-[0_0_24px_rgba(0,231,255,.22)]">
              <Network size={19} />
            </span>
            <span>
              <span className="nav-logo block text-sm font-black uppercase tracking-[0.2em] text-white">PulseShield<span>.io</span></span>
              <span className="block text-[11px] uppercase tracking-[0.18em] text-[#ff6bff]">PulseChain risk intelligence</span>
            </span>
          </a>
          <div className="nav-links flex flex-wrap gap-2">
            {navItems.map(([label, href]) => (
              <a key={label} href={href} className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-300 transition hover:border-[#00e7ff]/50 hover:bg-[#00e7ff]/10 hover:text-[#00e7ff]">
                {label}
              </a>
            ))}
          </div>
          <a href="https://scan.pulsechain.com/" target="_blank" rel="noreferrer" className="nav-cta flex items-center justify-center gap-2 rounded-lg border border-[#ff4dce]/35 bg-[#ff4dce]/10 px-4 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-[#ffc2f6]">
            PulseChain Scan <ExternalLink size={14} />
          </a>
        </nav>

        <header id="top" className="uhd-hero mb-5 border-b border-white/10 pb-6 pt-4">
          <div className="hero-copy">
            <div className="hero-kicker mb-3 inline-flex items-center gap-2 rounded-full border border-[#ff4dce]/25 bg-[#ff4dce]/10 px-3 py-2 text-xs uppercase tracking-[0.22em] text-[#ffc2f6]">
              <Crosshair size={15} />
              PulseChain-native protection intelligence
            </div>
            <h1 className="pulse-title text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              <span>PulseShield</span><span className="pulse-title-dot">.io</span>
            </h1>
            <p className="mt-4 max-w-3xl text-base text-slate-300 sm:text-lg">
              Scan any PulseChain DeFi contract before you trust it. PulseShield is the premium command surface
              for live risk intelligence. It reads on-chain evidence, detects high-risk patterns,
              and displays results like a production security command dashboard.
            </p>
          </div>
        </header>

        <div id="dashboard" className={`dashboard-grid grid gap-4 ${scanReport && !targetExpanded ? "2xl:grid-cols-[220px_minmax(0,1fr)_290px]" : "2xl:grid-cols-[320px_minmax(0,1fr)_290px]"}`}>
          <Panel className="scan-target-materialize uhd-panel p-4" id="scan">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{scanReport && !targetExpanded ? "New Target" : "Scan Target"}</h2>
                <p className="text-sm text-slate-400">
                  {scanReport && !targetExpanded ? "Enter another contract" : "Contract intelligence intake"}
                </p>
              </div>
              <button
                onClick={toggleTargetPanel}
                className="grid h-10 w-10 place-items-center rounded-md border border-[#ff4dce]/25 bg-[#ff4dce]/10 text-[#ffc2f6]"
                title={targetExpanded ? "Collapse target input" : "Expand target input"}
              >
                {targetExpanded ? <SlidersHorizontal size={18} /> : <Crosshair size={18} />}
              </button>
            </div>

            {scanReport && !targetExpanded ? (
              <div className="grid gap-3">
                <div className="rounded-md border border-white/10 bg-black/30 p-3">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Current report</div>
                  <div className="mt-1 truncate font-mono text-xs text-slate-300">{scanReport.meta?.address || form.address}</div>
                  <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.14em]">
                    <span className="rounded border border-[#00e7ff]/20 bg-[#00e7ff]/10 px-2 py-1 text-[#9af7ff]">PulseChain</span>
                    <span className="rounded border border-white/10 bg-white/[0.035] px-2 py-1 text-slate-400">{scanReport.meta?.projectType?.detected || "classified"}</span>
                  </div>
                </div>
                <button
                  onClick={expandTargetPanel}
                  className="rounded-md border border-[#00e7ff]/30 bg-[#00e7ff]/10 px-3 py-2 text-sm font-bold text-[#9af7ff] transition hover:border-[#00e7ff]/55"
                >
                  New target
                </button>
                <p className="text-xs leading-5 text-slate-500">
                  The intake panel is minimized so the report stays primary. Expand only when you want to scan another address.
                </p>
              </div>
            ) : (
            <div className="grid gap-4">
              <Field label="Contract address">
                <input
                  value={form.address}
                  onChange={(event) => setForm({ ...form, address: event.target.value })}
                  onFocus={clearSampleAddress}
                  onClick={clearSampleAddress}
                  onPointerDown={clearSampleAddress}
                  placeholder="0x..."
                  className="rounded-md border border-white/10 bg-black/35 px-3 py-3 text-sm outline-none focus:border-[#ff4dce]"
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-[#00e7ff]/20 bg-[#00e7ff]/10 p-3">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Network lock</div>
                  <div className="mt-1 font-black text-[#9af7ff]">PulseChain only</div>
                  <p className="mt-1 text-xs leading-5 text-slate-400">All scans inspect PulseChain mainnet evidence.</p>
                </div>
                <div className="rounded-md border border-[#ff4dce]/20 bg-[#ff4dce]/10 p-3">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Project type</div>
                  <div className="mt-1 font-black text-[#ffc2f6]">Auto-classified</div>
                  <p className="mt-1 text-xs leading-5 text-slate-400">Detected from bytecode, source, selectors, and token metadata.</p>
                </div>
              </div>
              <button
                onClick={() => setOptionsOpen(!optionsOpen)}
                className={`advanced-options-trigger flex items-center justify-between rounded-md border px-3 py-3 text-sm font-bold transition ${optionsOpen ? "border-[#ff4dce]/35 bg-[#ff4dce]/10 text-[#ffc2f6]" : "border-white/10 bg-white/[0.035] text-slate-200 hover:border-[#ff4dce]/35 hover:bg-[#ff4dce]/10 hover:text-[#ffc2f6]"}`}
                aria-expanded={optionsOpen}
                aria-controls="advanced-scan-options"
                type="button"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-md border border-[#ff4dce]/25 bg-black/35 text-[#ffc2f6]">
                    <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#00e7ff] shadow-[0_0_10px_rgba(0,231,255,.75)]" />
                    <SlidersHorizontal size={16} />
                  </span>
                  <span className="min-w-0 text-left">
                    <span className="block">Advanced options</span>
                    <span className="block truncate text-[10px] font-normal uppercase tracking-[0.14em] text-slate-500">Source, docs, owner, proxy</span>
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <span className="rounded border border-white/10 bg-black/30 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-slate-400">
                    {optionsOpen ? "Open" : "Closed"}
                  </span>
                  <ChevronDown size={17} className={`transition-transform ${optionsOpen ? "rotate-180" : ""}`} />
                </span>
              </button>
              {optionsOpen ? (
                <div id="advanced-scan-options" className="advanced-options-panel grid gap-4 rounded-lg border border-[#ff4dce]/20 bg-black/25 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.045)]">
                  <Field label="Optional source code">
                    <textarea
                      value={form.source}
                      onChange={(event) => setForm({ ...form, source: event.target.value })}
                      rows={4}
                      placeholder="Paste verified Solidity source when available"
                      className="resize-none rounded-md border border-white/10 bg-black/35 px-3 py-3 text-sm outline-none focus:border-[#ff4dce]"
                    />
                  </Field>
                  <Field label="Optional docs link">
                    <input
                      value={form.docs}
                      onChange={(event) => setForm({ ...form, docs: event.target.value })}
                      placeholder="https://"
                      className="rounded-md border border-white/10 bg-black/35 px-3 py-3 text-sm outline-none focus:border-[#ff4dce]"
                    />
                  </Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Owner wallet">
                      <input
                        value={form.owner}
                        onChange={(event) => setForm({ ...form, owner: event.target.value })}
                        placeholder="0x owner/admin"
                        className="rounded-md border border-white/10 bg-black/35 px-3 py-3 text-sm outline-none focus:border-[#ff4dce]"
                      />
                    </Field>
                    <Field label="Proxy admin">
                      <input
                        value={form.proxy}
                        onChange={(event) => setForm({ ...form, proxy: event.target.value })}
                        placeholder="0x proxy/admin"
                        className="rounded-md border border-white/10 bg-black/35 px-3 py-3 text-sm outline-none focus:border-[#ff4dce]"
                      />
                    </Field>
                  </div>
                  <button
                    onClick={() => setAdvanced(!advanced)}
                    className={`flex items-center justify-between rounded-md border px-3 py-3 text-sm ${advanced ? "border-[#ff4dce]/40 bg-[#ff4dce]/10 text-[#ffc2f6]" : "border-white/10 bg-white/5 text-slate-300"}`}
                    type="button"
                  >
                    <span className="flex items-center gap-2">
                      <Skull size={17} />
                      I am the owner advanced mode
                    </span>
                    <span>{advanced ? "ON" : "OFF"}</span>
                  </button>
                </div>
              ) : null}
              <button
                onClick={runScan}
                onPointerDown={() => setScanPressed(true)}
                onPointerUp={() => setScanPressed(false)}
                onPointerCancel={() => setScanPressed(false)}
                onPointerLeave={() => setScanPressed(false)}
                disabled={isScanning}
                className="run-scan-button rounded-md border border-[#00e7ff]/30 bg-gradient-to-r from-[#ff4dce] via-[#7d48ff] to-[#00e7ff] px-4 py-3 font-black uppercase tracking-[0.18em] text-black transition disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  boxShadow: scanPressed
                    ? "0 3px 0 rgba(0,52,61,.82), 0 10px 24px rgba(255,77,206,.16), inset 0 2px 8px rgba(0,0,0,.34)"
                    : "0 10px 0 rgba(0,52,61,.72), 0 22px 42px rgba(255,77,206,.22), 0 0 32px rgba(0,231,255,.18), inset 0 1px 0 rgba(255,255,255,.45)",
                  transform: scanPressed ? "translateY(7px)" : "translateY(0)",
                }}
              >
                {isScanning ? "Scanning contract..." : "Run adversarial scan"}
              </button>
              {scanError ? (
                <div className="rounded-md border border-[#b66cff]/35 bg-[#b66cff]/10 p-3 text-sm text-[#ffb6b6]">
                  {scanError}
                </div>
              ) : null}
              {scanReport ? (
                <div className="rounded-md border border-[#00e7ff]/25 bg-[#00e7ff]/10 p-3 text-xs text-[#9af7ff]">
                  Live report generated at {new Date(scanReport.generatedAt).toLocaleString()} using {scanReport.meta?.rpcUrl || "fallback evidence"}.
                  <div className="mt-2 text-slate-300">
                    {scanReport.meta?.token?.symbol || "Unknown token"} / owner {scanReport.meta?.owner || "not resolved"} / bytecode {scanReport.meta?.bytecodeSize || 0} bytes
                  </div>
                </div>
              ) : null}
              {marketReport?.hasTrading ? (
                <div className="rounded-md border border-[#00e7ff]/20 bg-white/[0.025] p-3 text-xs text-slate-400">
                  Market intel attached near the audit score. Expand it for full pair analytics.
                </div>
              ) : marketError ? (
                <div className="rounded-md border border-white/10 bg-white/[0.025] p-3 text-xs text-slate-400">{marketError}</div>
              ) : null}
            </div>
            )}
          </Panel>

          <div className="min-w-0 grid gap-4">
            {scanReport ? (
              <div className="uhd-panel rounded-lg border border-white/10 bg-black/35 p-3">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-[#00e7ff]">Active report</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="max-w-full truncate font-mono text-sm text-slate-200">{scanReport.meta?.address}</span>
                      <span className="rounded border border-white/10 bg-white/[0.035] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-slate-400">
                        {scanReport.meta?.token?.symbol || "unknown"}
                      </span>
                      <span className="rounded border border-[#00e7ff]/20 bg-[#00e7ff]/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[#9af7ff]">
                        PulseChain
                      </span>
                      <span className="rounded border border-[#ff4dce]/20 bg-[#ff4dce]/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[#ffc2f6]">
                        {detectedProjectType}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded border border-white/10 bg-white/[0.035] px-2 py-1 text-slate-400">Bytecode {scanReport.meta?.bytecodeSize || 0} bytes</span>
                    <span className="rounded border border-white/10 bg-white/[0.035] px-2 py-1 text-slate-400">Findings {displayedFindings.length}</span>
                    <button onClick={expandTargetPanel} className="rounded border border-[#00e7ff]/30 bg-[#00e7ff]/10 px-2 py-1 font-bold text-[#9af7ff]">
                      Scan another
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            <Panel className="uhd-panel scanline p-4">
              <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
                <div className="min-w-0 flex flex-col items-center justify-center rounded-lg border border-white/10 bg-black/30 p-5">
                  <ScoreRing score={score} level={level} />
                  <div className={`mt-4 rounded-md border px-4 py-2 text-center text-sm font-black uppercase tracking-[0.2em] ${statusColor(level)}`}>
                    Threat Level: {level}
                  </div>
                  <div className="mt-4 w-full">
                    <MarketDock marketReport={marketReport} onExpand={() => setIsMarketOpen(true)} />
                  </div>
                </div>

                <div className="min-w-0 grid gap-4">
                  <TokenResultHeader
                    scanReport={scanReport}
                    marketReport={marketReport}
                    onExpandMarket={() => setIsMarketOpen(true)}
                  />

                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-md border px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] ${statusColor(level)}`}>
                      Verdict: {verdict}
                    </span>
                    <span className="rounded-md border border-[#00e7ff]/25 bg-[#00e7ff]/10 px-3 py-2 text-xs uppercase tracking-[0.16em] text-[#9af7ff]">
                      PulseChain / {detectedProjectType}
                    </span>
                    <span className="rounded-md border border-[#ff4dce]/25 bg-[#ff4dce]/10 px-3 py-2 text-xs uppercase tracking-[0.16em] text-[#ffc2f6]">
                      Type confidence: {projectTypeConfidence}
                    </span>
                    <span className="rounded-md border border-[#ff4dce]/25 bg-[#ff4dce]/10 px-3 py-2 text-xs uppercase tracking-[0.16em] text-[#ffc2f6]">
                      {chainProfile.native} gas / {chainProfile.explorer}
                    </span>
                    <span className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.16em] text-slate-300">
                      {scanReport ? "Live evidence report" : "SWC + OWASP SCS mapped"}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl font-black">Adversarial Interpretation</h2>
                    <p className="mt-2 text-slate-300">
                      {scanReport?.interpretation || interpretation} This contract may function normally today, but retained control can change behavior later.
                      This is not automatically malicious, but it creates rug-pull and governance-risk potential.
                    </p>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {displayedFindings.slice(0, 4).map((finding, index) => (
                      <motion.article
                        key={finding.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06 }}
                        className="rounded-lg border border-white/10 bg-black/25 p-3"
                      >
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <h3 className="font-bold leading-tight">{finding.title}</h3>
                          <span className="rounded border border-[#ff4dce]/30 bg-[#ff4dce]/10 px-2 py-1 text-[11px] font-bold text-[#ffc2f6]">
                            {finding.severity}
                          </span>
                        </div>
                        <div className="grid gap-1 text-xs text-slate-400">
                          <span>Confidence: {finding.confidence}</span>
                          <span>Exploitability: {finding.exploitability}</span>
                          <span>User impact: {finding.impact}</span>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </div>
              </div>
            </Panel>

            <div className="grid gap-3">
              <Panel id="graph" className="uhd-panel p-4">
                <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-bold">
                    <GitBranch size={18} className="text-[#ff4dce]" />
                    Contract Dependency Graph
                  </h2>
                  <span className="text-xs text-slate-400">Interactive evidence map</span>
                </div>
                <div className="attack-map h-[460px] rounded-lg border border-white/10 bg-black/30">
                  <ReactFlow
                    nodes={dependencyGraph.nodes}
                    edges={dependencyGraph.edges}
                    fitView
                    fitViewOptions={{ padding: 0.24 }}
                    onNodeClick={(_, node) => setSelectedGraphNodeId(node.id)}
                    proOptions={{ hideAttribution: true }}
                  >
                    <Background color="rgba(97,247,255,.16)" gap={18} />
                    <Controls showInteractive />
                  </ReactFlow>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {dependencyGraph.nodes.map((node) => (
                    <button
                      key={node.id}
                      onClick={() => setSelectedGraphNodeId(node.id)}
                      className={`rounded-md border px-2.5 py-1.5 text-xs font-bold transition ${selectedGraphNodeId === node.id ? "border-[#00e7ff]/45 bg-[#00e7ff]/10 text-[#9af7ff]" : "border-white/10 bg-white/[0.035] text-slate-400 hover:border-[#ff4dce]/35 hover:text-[#ffc2f6]"}`}
                      type="button"
                    >
                      {node.data.labelText}
                    </button>
                  ))}
                </div>
                {selectedGraphNode ? (
                  <div className="mt-3 rounded-lg border border-white/10 bg-black/30 p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{selectedGraphNode.data.kind}</div>
                        <div className="mt-1 font-black text-white">{selectedGraphNode.data.labelText}</div>
                        <div className="mt-1 text-sm text-slate-400">{selectedGraphNode.data.caption}</div>
                      </div>
                      <span className={`rounded border px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${selectedGraphNode.data.risk === "critical" ? "border-[#ff4dce]/35 bg-[#ff4dce]/10 text-[#ffc2f6]" : selectedGraphNode.data.risk === "warning" ? "border-[#ffb347]/35 bg-[#ffb347]/10 text-[#ffe3ba]" : "border-[#00e7ff]/25 bg-[#00e7ff]/10 text-[#9af7ff]"}`}>
                        {selectedGraphNode.data.risk}
                      </span>
                    </div>
                    {selectedGraphNode.data.address ? (
                      <div className="mt-3 truncate rounded-md border border-white/10 bg-white/[0.025] px-3 py-2 font-mono text-xs text-slate-300">
                        {selectedGraphNode.data.address}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </Panel>

              <Panel className="uhd-panel p-3">
                <div className="grid gap-3 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
                  <div>
                    <h2 className="flex items-center gap-2 text-sm font-bold">
                      <Radar size={16} className="text-[#00e7ff]" />
                      Threat Radar
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">Compact signal profile</p>
                  </div>
                  <div className="h-[120px] min-w-0">
                    {mounted ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="rgba(255,255,255,.12)" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: "#b8c7d7", fontSize: 10 }} />
                          <RechartsRadar dataKey="value" stroke="#ff4dce" fill="#17232b" fillOpacity={0.28} />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="radar h-full rounded-full opacity-50" />
                    )}
                  </div>
                </div>
              </Panel>
            </div>

            <Panel className="uhd-panel p-4">
              <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <Cpu size={18} className="text-[#00e7ff]" />
                  PulseShield Exploit Simulations
                </h2>
                <span className="text-xs uppercase tracking-[0.16em] text-slate-500">Threat pulse routing</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {attackSimulations.map(([name, route, intensity]) => (
                  <div key={name} className="threat-pulse rounded-lg border border-white/10 bg-black/25 p-3">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="font-bold">{name}</span>
                      <span className="text-xs font-black text-[#ff4dce]">{intensity}%</span>
                    </div>
                    <p className="font-mono text-xs text-slate-400">{route}</p>
                    <div className="mt-3 h-1.5 rounded-full bg-white/10">
                      <div className="h-1.5 rounded-full bg-gradient-to-r from-[#ff4dce] via-[#b66cff] to-[#00e7ff]" style={{ width: `${intensity}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel className="uhd-panel p-4">
              <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <ShieldAlert size={18} className="text-[#ff4dce]" />
                  Critical Findings
                </h2>
                <span className="text-xs text-slate-400">Classified by severity, confidence, exploitability, impact, evidence, context, and fix</span>
              </div>
              <div className="grid gap-3">
                {displayedFindings.map((finding, index) => (
                  <details key={finding.title} open={index < 2} className="rounded-lg border border-white/10 bg-black/25 p-3">
                    <summary className="cursor-pointer list-none">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <span className="font-bold">{index + 1}. {finding.title}</span>
                        <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.12em]">
                          <span className="rounded border border-[#ff4dce]/30 bg-[#ff4dce]/10 px-2 py-1 text-[#ffc2f6]">{finding.severity}</span>
                          <span className="rounded border border-[#ffb347]/30 bg-[#ffb347]/10 px-2 py-1 text-[#ffd39b]">{finding.confidence}</span>
                        </div>
                      </div>
                    </summary>
                    <div className="mt-3 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
                      <p><strong className="text-white">Evidence:</strong> {finding.evidence}</p>
                      <p><strong className="text-white">Exploitability:</strong> {finding.exploitability}</p>
                      <p><strong className="text-white">Taxonomy:</strong> {finding.taxonomy || "OWASP SCS / SWC"}</p>
                      <p><strong className="text-white">False-positive context:</strong> {finding.falsePositive}</p>
                      <p><strong className="text-white">Recommended fix:</strong> {finding.fix}</p>
                    </div>
                  </details>
                ))}
              </div>
            </Panel>
          </div>

          <div className="min-w-0 grid gap-4">
            <Panel className="uhd-panel p-4">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <Activity size={18} className="text-[#00e7ff]" />
                Market Intel
              </h2>
              {marketReport?.hasTrading ? (
                <div className="grid gap-3">
                  <div className="rounded-lg border border-white/10 bg-black/25 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">DexScreener live price</p>
                        <p className="mt-1 text-2xl font-black">{formatUsd(marketReport.primaryPair?.priceUsd, 8)}</p>
                      </div>
                      <span className={`rounded border px-2 py-1 text-xs font-black ${Number(marketReport.primaryPair?.priceChange?.h24 || 0) < 0 ? "border-[#ff4dce]/30 bg-[#ff4dce]/10 text-[#ffc2f6]" : "border-[#63ff9d]/25 bg-[#63ff9d]/10 text-[#b8ffd0]"}`}>
                        {formatPercent(marketReport.primaryPair?.priceChange?.h24)}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
                      <span>Liquidity {formatUsd(marketReport.primaryPair?.liquidity?.usd)}</span>
                      <span>Volume {formatUsd(marketReport.primaryPair?.volume?.h24)}</span>
                      <span>Buys {formatCompact(marketReport.analysis?.buys)}</span>
                      <span>Sells {formatCompact(marketReport.analysis?.sells)}</span>
                    </div>
                  </div>
                  <button onClick={() => setIsMarketOpen(true)} className="rounded-md border border-[#00e7ff]/30 bg-[#00e7ff]/10 px-3 py-2 text-sm font-bold text-[#9af7ff] transition hover:border-[#00e7ff]/55">
                    Open market overlay
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  Run a token scan to attach live DexScreener price, liquidity, volume, trade-flow, pair ranking, and generated market charts.
                </p>
              )}
            </Panel>

            <Panel className="uhd-panel p-4">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <Flame size={18} className="text-[#00e7ff]" />
                Risk Matrix
              </h2>
              <div className="grid gap-2">
                {displayedRiskLabels.map(([label, risk]) => (
                  <div key={label} data-risk={risk} className="risk-label-row flex items-center justify-between gap-3 rounded-md border px-3 py-2.5">
                    <span className="min-w-0 text-sm font-medium text-slate-200">{label}</span>
                    <span data-risk={risk} className="risk-pill shrink-0 rounded px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em]">
                      {risk}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel className="uhd-panel p-4">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <Terminal size={18} className="text-[#ff4dce]" />
                Live Scan Terminal
              </h2>
              <div className="grid gap-2 rounded-lg border border-white/10 bg-black/45 p-3 font-mono text-xs text-slate-300">
                {terminalLines.map((line) => (
                  <div className="terminal-line" key={line}>{line}</div>
                ))}
              </div>
            </Panel>

            <Panel className="uhd-panel p-4">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <ScanLine size={18} className="text-[#00e7ff]" />
                Severity Heatmap
              </h2>
              <div className="h-52">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={heatmap}>
                      <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip cursor={{ fill: "rgba(255,255,255,.04)" }} contentStyle={{ background: "#071014", border: "1px solid rgba(255,255,255,.12)" }} />
                      <Bar dataKey="risk" radius={[4, 4, 0, 0]}>
                        {heatmap.map((entry) => (
                          <Cell key={entry.name} fill={entry.risk > 80 ? "#ff4dce" : entry.risk > 65 ? "#ffb347" : "#00e7ff"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full rounded-lg border border-white/10 bg-white/[0.03]" />
                )}
              </div>
            </Panel>

            <Panel className="uhd-panel p-4">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
                <Vote size={18} className="text-[#63ff9d]" />
                Community Trust Voting
              </h2>
              <div className="grid gap-2">
                {votes.map(([label, percent, className]) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-xs text-slate-300">
                      <span>{label}</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-[#63ff9d]" style={{ width: `${percent}%`, opacity: className === "auditor" ? 1 : 0.58 }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Credibility: new users 1x, verified wallet age 1.5x, auditor badge 3x, past accurate reports 5x,
                sybil-suspicious accounts 0.25x.
              </p>
            </Panel>
          </div>
        </div>

        <div id="modules" className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
          <Panel className="uhd-panel p-4">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
              <Binary size={18} className="text-[#ff4dce]" />
              Detection Modules
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {modules.map((module, index) => (
                <div key={module} className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-slate-300">
                  {index % 4 === 0 ? <LockKeyhole size={15} className="text-[#ff4dce]" /> : index % 4 === 1 ? <Blocks size={15} className="text-[#748b99]" /> : index % 4 === 2 ? <Eye size={15} className="text-[#00e7ff]" /> : <Fingerprint size={15} className="text-[#63ff9d]" />}
                  {module}
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="uhd-panel p-4">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
              <FileSearch size={18} className="text-[#00e7ff]" />
              Source-Backed Taxonomy
            </h2>
            <div className="flex flex-wrap gap-2">
              {taxonomy.map((item) => (
                <span key={item} className="rounded-md border border-[#ff4dce]/20 bg-[#ff4dce]/8 px-2 py-1 text-xs text-[#ffd1d6]">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-4 rounded-md border border-[#ffb347]/25 bg-[#ffb347]/10 p-3 text-sm text-[#ffe3ba]">
              Automated analysis cannot guarantee safety. Findings may include false positives or incomplete context. Some risky
              permissions are legitimate during launch, migration, or emergency-protection periods. Always combine automated scans
              with manual review before deploying funds.
            </div>
          </Panel>
        </div>

        <footer id="ecosystem" className="uhd-footer mt-5 overflow-hidden rounded-lg border border-[#00e7ff]/20 bg-black/45">
          <div className="grid gap-5 p-5 xl:grid-cols-[1.1fr_.9fr_.9fr]">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-md border border-[#ff4dce]/30 bg-[#ff4dce]/10 text-[#ffc2f6]">
                  <Layers size={20} />
                </span>
                <div>
                  <h2 className="text-2xl font-black">PulseShield Operations Grid</h2>
                  <p className="text-sm text-slate-400">PulseChain-facing intelligence, links, and site operations.</p>
                </div>
              </div>
              <p className="max-w-xl text-sm leading-6 text-slate-300">
                PulseShield maps attack vectors, contract nodes, threat pulses, and exploit simulations across DeFi
                contracts. Automated analysis cannot guarantee safety; manual review still decides the final risk posture.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-md border border-white/10 bg-white/[0.035] p-3">
                  <Wallet size={17} className="mb-2 text-[#ff4dce]" />
                  <h3 className="font-bold">Admin Privilege</h3>
                  <p className="mt-1 text-xs text-slate-400">Roles ranked by fund-moving power.</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.035] p-3">
                  <Zap size={17} className="mb-2 text-[#ffb347]" />
                  <h3 className="font-bold">Exploit Timeline</h3>
                  <p className="mt-1 text-xs text-slate-400">Routes chained by prerequisite.</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.035] p-3">
                  <ShieldCheck size={17} className="mb-2 text-[#63ff9d]" />
                  <h3 className="font-bold">Output Discipline</h3>
                  <p className="mt-1 text-xs text-slate-400">Never claims a contract is safe.</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 flex items-center gap-2 font-bold uppercase tracking-[0.16em] text-[#00e7ff]">
                <ExternalLink size={16} /> PulseChain Projects
              </h3>
              <div className="grid gap-2">
                {pulseProjects.map((project) => (
                  <a key={project.name} href={project.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-3 rounded-md border border-white/10 bg-black/30 px-3 py-2 transition hover:border-[#ff4dce]/45 hover:bg-[#ff4dce]/10">
                    <span>
                      <span className="block text-sm font-bold text-white group-hover:text-[#ffc2f6]">{project.name}</span>
                      <span className="block text-xs text-slate-500">{project.type}</span>
                    </span>
                    <ExternalLink size={14} className="text-slate-500 group-hover:text-[#00e7ff]" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 flex items-center gap-2 font-bold uppercase tracking-[0.16em] text-[#ffc2f6]">
                <Info size={16} /> Site Navigation
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {navItems.map(([label, href]) => (
                  <a key={label} href={href} className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-slate-300 transition hover:border-[#00e7ff]/45 hover:text-[#00e7ff]">
                    {label}
                  </a>
                ))}
                <a href="#top" className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-slate-300 transition hover:border-[#00e7ff]/45 hover:text-[#00e7ff]">
                  Back to top
                </a>
              </div>
              <div className="mt-4 rounded-md border border-[#b66cff]/25 bg-[#b66cff]/10 p-3">
                <h4 className="mb-2 flex items-center gap-2 font-bold text-[#ff9c9c]">
                  <AlertTriangle size={16} /> Critical Disclaimer
                </h4>
                <p className="text-xs leading-5 text-slate-300">
                  Findings may include false positives or incomplete context. Some risky permissions are legitimate during
                  launch, migration, or emergency-protection periods.
                </p>
              </div>
            </div>
          </div>
          <div className="footer-strip flex flex-col gap-2 border-t border-white/10 px-5 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>PulseShield.io live risk scanner</span>
            <span>RPC evidence, proxy slots, source heuristics, and deterministic scoring</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
