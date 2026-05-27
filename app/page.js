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
  Crown,
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
  Mail,
  MessageSquare,
  Network,
  Radar,
  ScanLine,
  Send,
  ShieldAlert,
  ShieldCheck,
  Skull,
  SlidersHorizontal,
  Terminal,
  TrendingUp,
  UserRound,
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
  ["Trust", "#trust"],
  ["Feedback", "#feedback"],
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

const defaultTrustTotals = [
  { label: "Confirmed Safe", percent: 0, count: 0, weight: 0, tone: "safe" },
  { label: "Suspicious", percent: 0, count: 0, weight: 0, tone: "warning" },
  { label: "Confirmed Malicious", percent: 0, count: 0, weight: 0, tone: "danger" },
  { label: "False Positive", percent: 0, count: 0, weight: 0, tone: "info" },
  { label: "Needs Manual Review", percent: 0, count: 0, weight: 0, tone: "review" },
];

const trustVoteOptions = defaultTrustTotals.map((item) => item.label);

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

function displayIdentity(address, profile) {
  return profile?.displayName || shortAddress(address) || "Connect wallet";
}

function normalizeClientAddress(address) {
  const value = String(address || "").trim();
  return /^0x[a-fA-F0-9]{40}$/.test(value) ? value.toLowerCase() : "";
}

function WalletIdentityPanel({
  walletAddress,
  walletProfile,
  walletError,
  walletMessage,
  displayNameDraft,
  isWalletBusy,
  onConnect,
  onDisconnect,
  onNameChange,
  onSaveName,
}) {
  const connected = Boolean(walletAddress);
  return (
    <Panel id="trust" className="uhd-panel p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <UserRound size={18} className="text-[#00e7ff]" />
          Wallet Identity
        </h2>
        {walletProfile?.auditorBadge ? (
          <span className="rounded border border-[#ffb347]/35 bg-[#ffb347]/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#ffe3ba]">
            Auditor
          </span>
        ) : null}
      </div>

      <div className="rounded-lg border border-white/10 bg-black/35 p-3">
        <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Connected account</div>
        <div className="mt-1 break-all font-mono text-sm text-slate-200">
          {connected ? displayIdentity(walletAddress, walletProfile) : "No wallet connected"}
        </div>
        {connected ? <div className="mt-1 break-all font-mono text-[11px] text-slate-500">{walletAddress}</div> : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={connected ? onDisconnect : onConnect}
            disabled={isWalletBusy}
            className="rounded-md border border-[#00e7ff]/30 bg-[#00e7ff]/10 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#9af7ff] transition hover:border-[#ff4dce]/45 hover:bg-[#ff4dce]/10 disabled:opacity-50"
            type="button"
          >
            {isWalletBusy ? "Syncing" : connected ? "Disconnect" : "Connect Wallet"}
          </button>
          <span className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-slate-400">
            PulseChain community login
          </span>
        </div>
      </div>

      {connected ? (
        <div className="mt-3 grid gap-2">
          <Field label="Unique display name">
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
              <input
                value={displayNameDraft}
                onChange={(event) => onNameChange(event.target.value)}
                placeholder="PulseShield name"
                className="rounded-md border border-white/10 bg-black/35 px-3 py-3 text-sm normal-case tracking-normal outline-none focus:border-[#00e7ff]"
              />
              <button
                onClick={onSaveName}
                disabled={isWalletBusy}
                className="rounded-md border border-[#ff4dce]/30 bg-[#ff4dce]/10 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#ffc2f6] transition hover:border-[#00e7ff]/45 disabled:opacity-50"
                type="button"
              >
                Save name
              </button>
            </div>
          </Field>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-md border border-white/10 bg-white/[0.025] p-2">
              <div className="font-black text-white">{walletProfile?.credibilityWeight || 1}x</div>
              <div className="mt-1 text-slate-500">Weight</div>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.025] p-2">
              <div className="font-black text-white">{walletProfile?.accurateReports || 0}</div>
              <div className="mt-1 text-slate-500">Reports</div>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.025] p-2">
              <div className="font-black text-white">{walletProfile?.status || "active"}</div>
              <div className="mt-1 text-slate-500">Status</div>
            </div>
          </div>
        </div>
      ) : null}

      {walletError ? <div className="mt-3 rounded-md border border-[#ffb347]/30 bg-[#ffb347]/10 p-3 text-sm text-[#ffe3ba]">{walletError}</div> : null}
      {walletMessage ? <div className="mt-3 rounded-md border border-[#63ff9d]/30 bg-[#63ff9d]/10 p-3 text-sm text-[#b8ffd0]">{walletMessage}</div> : null}
    </Panel>
  );
}

function CommunityTrustPanel({
  trustSnapshot,
  trustTarget,
  selectedTrustVote,
  voteNote,
  walletAddress,
  communityMessage,
  communityError,
  adminOpen,
  adminKey,
  adminAddress,
  adminReports,
  adminAuditor,
  adminSuspicious,
  onVoteChange,
  onNoteChange,
  onCastVote,
  onAdminOpen,
  onAdminKeyChange,
  onAdminAddressChange,
  onAdminReportsChange,
  onAdminAuditorChange,
  onAdminSuspiciousChange,
  onAdminSubmit,
}) {
  const totals = trustSnapshot?.aggregate?.totals?.length ? trustSnapshot.aggregate.totals : defaultTrustTotals;
  const leader = trustSnapshot?.aggregate?.leader;
  const userVote = trustSnapshot?.userVote?.vote;

  return (
    <Panel className="uhd-panel p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Vote size={18} className="text-[#63ff9d]" />
            Community Trust Voting
          </h2>
          <p className="mt-1 text-xs text-slate-500">Weighted PulseChain wallet reputation for the active target.</p>
        </div>
        <span className="rounded border border-white/10 bg-black/35 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-slate-400">
          {trustSnapshot?.aggregate?.voteCount || 0} votes
        </span>
      </div>

      <div className="rounded-lg border border-white/10 bg-black/35 p-3">
        <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Active target</div>
        <div className="mt-1 truncate font-mono text-xs text-slate-300" title={trustTarget}>{trustTarget || "Scan target pending"}</div>
        <div className="mt-2 text-sm font-black text-white">
          {leader ? `${leader.label} leads at ${leader.percent}%` : "No community signal yet"}
        </div>
      </div>

      <div className="mt-3 grid gap-2">
        {totals.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex justify-between gap-2 text-xs text-slate-300">
              <span className="min-w-0 truncate">{item.label}</span>
              <span>{item.percent || 0}% / {item.weight || 0} weight</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div
                className={`h-2 rounded-full ${item.tone === "danger" ? "bg-[#ff4dce]" : item.tone === "warning" ? "bg-[#ffb347]" : item.tone === "safe" ? "bg-[#63ff9d]" : "bg-[#00e7ff]"}`}
                style={{ width: `${item.percent || 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3">
        <Field label={userVote ? `Your vote: ${userVote}` : "Cast vote"}>
          <select
            value={selectedTrustVote}
            onChange={(event) => onVoteChange(event.target.value)}
            className="rounded-md border border-white/10 bg-black/35 px-3 py-3 text-sm normal-case tracking-normal text-slate-100 outline-none focus:border-[#63ff9d]"
          >
            {trustVoteOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </Field>
        <Field label="Evidence note optional">
          <textarea
            value={voteNote}
            onChange={(event) => onNoteChange(event.target.value)}
            rows={3}
            placeholder="Add a reason, source, or correction."
            className="resize-none rounded-md border border-white/10 bg-black/35 px-3 py-3 text-sm normal-case tracking-normal outline-none focus:border-[#63ff9d]"
          />
        </Field>
        <button
          onClick={onCastVote}
          disabled={!walletAddress}
          className="rounded-md border border-[#63ff9d]/30 bg-[#63ff9d]/10 px-3 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#b8ffd0] transition hover:border-[#00e7ff]/45 disabled:cursor-not-allowed disabled:opacity-45"
          type="button"
        >
          Submit weighted vote
        </button>
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-400">
        Credibility: new users 1x, active wallet 1.5x, auditor badge 3x, accurate report history up to 5x,
        sybil or suspicious accounts 0.25x.
      </p>

      {communityMessage ? <div className="mt-3 rounded-md border border-[#63ff9d]/30 bg-[#63ff9d]/10 p-3 text-sm text-[#b8ffd0]">{communityMessage}</div> : null}
      {communityError ? <div className="mt-3 rounded-md border border-[#ffb347]/30 bg-[#ffb347]/10 p-3 text-sm text-[#ffe3ba]">{communityError}</div> : null}

      <button
        onClick={onAdminOpen}
        className="mt-4 flex w-full items-center justify-between rounded-md border border-white/10 bg-white/[0.025] px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400 transition hover:border-[#ff4dce]/35 hover:text-[#ffc2f6]"
        type="button"
      >
        <span className="flex items-center gap-2"><Crown size={14} /> Admin trust controls</span>
        <ChevronDown size={15} className={`transition-transform ${adminOpen ? "rotate-180" : ""}`} />
      </button>

      {adminOpen ? (
        <div className="mt-3 grid gap-3 rounded-lg border border-[#ff4dce]/20 bg-[#ff4dce]/5 p-3">
          <Field label="Admin key">
            <input
              type="password"
              value={adminKey}
              onChange={(event) => onAdminKeyChange(event.target.value)}
              placeholder="Private server admin key"
              className="rounded-md border border-white/10 bg-black/35 px-3 py-3 text-sm normal-case tracking-normal outline-none focus:border-[#ff4dce]"
            />
          </Field>
          <Field label="Wallet to update">
            <input
              value={adminAddress}
              onChange={(event) => onAdminAddressChange(event.target.value)}
              placeholder="0x..."
              className="rounded-md border border-white/10 bg-black/35 px-3 py-3 text-sm normal-case tracking-normal outline-none focus:border-[#ff4dce]"
            />
          </Field>
          <div className="grid gap-2 sm:grid-cols-3">
            <Field label="Accurate reports">
              <input
                type="number"
                min="0"
                max="25"
                value={adminReports}
                onChange={(event) => onAdminReportsChange(event.target.value)}
                className="rounded-md border border-white/10 bg-black/35 px-3 py-3 text-sm normal-case tracking-normal outline-none focus:border-[#ff4dce]"
              />
            </Field>
            <label className="flex items-center gap-2 rounded-md border border-white/10 bg-black/35 px-3 py-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-300">
              <input type="checkbox" checked={adminAuditor} onChange={(event) => onAdminAuditorChange(event.target.checked)} />
              Auditor
            </label>
            <label className="flex items-center gap-2 rounded-md border border-white/10 bg-black/35 px-3 py-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-300">
              <input type="checkbox" checked={adminSuspicious} onChange={(event) => onAdminSuspiciousChange(event.target.checked)} />
              Suspicious
            </label>
          </div>
          <button
            onClick={onAdminSubmit}
            className="rounded-md border border-[#ff4dce]/30 bg-[#ff4dce]/10 px-3 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#ffc2f6] transition hover:border-[#00e7ff]/45"
            type="button"
          >
            Update trust profile
          </button>
        </div>
      ) : null}
    </Panel>
  );
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
  const [isFeedbackSending, setIsFeedbackSending] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletProfile, setWalletProfile] = useState(null);
  const [walletError, setWalletError] = useState("");
  const [walletMessage, setWalletMessage] = useState("");
  const [isWalletBusy, setIsWalletBusy] = useState(false);
  const [displayNameDraft, setDisplayNameDraft] = useState("");
  const [trustSnapshot, setTrustSnapshot] = useState(null);
  const [selectedTrustVote, setSelectedTrustVote] = useState("Needs Manual Review");
  const [voteNote, setVoteNote] = useState("");
  const [communityMessage, setCommunityMessage] = useState("");
  const [communityError, setCommunityError] = useState("");
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [adminAddress, setAdminAddress] = useState("");
  const [adminReports, setAdminReports] = useState("0");
  const [adminAuditor, setAdminAuditor] = useState(false);
  const [adminSuspicious, setAdminSuspicious] = useState(false);
  const [form, setForm] = useState({
    address: sampleAddress,
    owner: "",
    proxy: "",
    docs: "",
    source: "",
  });
  const [feedbackForm, setFeedbackForm] = useState({
    category: "Feature idea",
    email: "",
    message: "",
    website: "",
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
  const trustTarget = scanReport?.meta?.address || form.address;
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

  async function fetchTrustSnapshot(target = trustTarget, address = walletAddress) {
    if (!target) return;
    const params = new URLSearchParams({ target });
    if (address) params.set("address", address);
    const response = await fetch(`/api/community?${params.toString()}`);
    const payload = await response.json();
    if (payload.ok) {
      setTrustSnapshot(payload);
      if (payload.profile) {
        setWalletProfile(payload.profile);
        setDisplayNameDraft(payload.profile.displayName || "");
      }
    }
  }

  async function saveWalletProfile(address, displayName, walletActivity = "new") {
    const response = await fetch("/api/community/profile", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ address, displayName, walletActivity }),
    });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.error || "Profile update failed.");
    setWalletProfile(payload.profile);
    setDisplayNameDraft(payload.profile?.displayName || "");
    return payload.profile;
  }

  async function estimateWalletActivity(address) {
    try {
      const count = await window.ethereum.request({ method: "eth_getTransactionCount", params: [address, "latest"] });
      return Number.parseInt(count, 16) > 0 ? "active" : "new";
    } catch {
      return "new";
    }
  }

  async function connectWallet() {
    setIsWalletBusy(true);
    setWalletError("");
    setWalletMessage("");
    try {
      if (!window.ethereum) throw new Error("No browser wallet detected. Install a Web3 wallet, then reconnect.");
      try {
        await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x171" }] });
      } catch (switchError) {
        if (switchError?.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: "0x171",
              chainName: "PulseChain",
              nativeCurrency: { name: "Pulse", symbol: "PLS", decimals: 18 },
              rpcUrls: ["https://rpc.pulsechain.com"],
              blockExplorerUrls: ["https://scan.pulsechain.com"],
            }],
          });
        }
      }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = normalizeClientAddress(accounts?.[0]);
      if (!address) throw new Error("Wallet did not return a valid address.");
      const walletActivity = await estimateWalletActivity(address);
      localStorage.setItem("pulseshield.wallet", address);
      setWalletAddress(address);
      setAdminAddress(address);
      await saveWalletProfile(address, undefined, walletActivity);
      await fetchTrustSnapshot(trustTarget, address);
      setWalletMessage("Wallet connected to PulseShield trust identity.");
    } catch (error) {
      setWalletError(error.message);
    } finally {
      setIsWalletBusy(false);
    }
  }

  function disconnectWallet() {
    localStorage.removeItem("pulseshield.wallet");
    setWalletAddress("");
    setWalletProfile(null);
    setDisplayNameDraft("");
    setWalletMessage("Wallet disconnected from this browser session.");
  }

  async function saveDisplayName() {
    if (!walletAddress) {
      setWalletError("Connect a wallet before saving a display name.");
      return;
    }
    setIsWalletBusy(true);
    setWalletError("");
    setWalletMessage("");
    try {
      await saveWalletProfile(walletAddress, displayNameDraft, walletProfile?.walletActivity || "new");
      await fetchTrustSnapshot(trustTarget, walletAddress);
      setWalletMessage("Display name reserved.");
    } catch (error) {
      setWalletError(error.message);
    } finally {
      setIsWalletBusy(false);
    }
  }

  async function castTrustVote() {
    setCommunityError("");
    setCommunityMessage("");
    if (!walletAddress) {
      setCommunityError("Connect a wallet before voting.");
      return;
    }
    try {
      const response = await fetch("/api/community/vote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          address: walletAddress,
          target: trustTarget,
          vote: selectedTrustVote,
          note: voteNote,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Vote failed.");
      setTrustSnapshot((current) => ({ ...(current || {}), ok: true, aggregate: payload.aggregate, profile: payload.profile, userVote: payload.userVote }));
      setWalletProfile(payload.profile);
      setVoteNote("");
      setCommunityMessage("Community trust vote recorded.");
    } catch (error) {
      setCommunityError(error.message);
    }
  }

  async function submitAdminUpdate() {
    setCommunityError("");
    setCommunityMessage("");
    try {
      const response = await fetch("/api/community/admin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          adminKey,
          address: adminAddress,
          auditorBadge: adminAuditor,
          accurateReports: adminReports,
          suspicious: adminSuspicious,
          status: adminSuspicious ? "suspicious" : "active",
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Admin update failed.");
      if (payload.profile?.address === walletAddress) setWalletProfile(payload.profile);
      await fetchTrustSnapshot(trustTarget, walletAddress);
      setCommunityMessage("Admin trust profile updated.");
    } catch (error) {
      setCommunityError(error.message);
    }
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

  async function submitFeedback(event) {
    event.preventDefault();
    setIsFeedbackSending(true);
    setFeedbackStatus(null);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...feedbackForm,
          path: typeof window !== "undefined" ? window.location.href : "pulseshield.io",
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "Feedback could not be sent.");
      setFeedbackStatus({ type: "success", message: payload.message || "Feedback sent to PulseShield." });
      setFeedbackForm((current) => ({ ...current, message: "", website: "" }));
    } catch (error) {
      setFeedbackStatus({ type: "error", message: error.message });
    } finally {
      setIsFeedbackSending(false);
    }
  }

  useEffect(() => {
    setMounted(true);
    const savedWallet = normalizeClientAddress(localStorage.getItem("pulseshield.wallet"));
    if (savedWallet) {
      setWalletAddress(savedWallet);
      setAdminAddress(savedWallet);
    }
  }, []);

  useEffect(() => {
    fetchTrustSnapshot(trustTarget, walletAddress).catch(() => null);
  }, [trustTarget, walletAddress]);

  useEffect(() => {
    if (!window.ethereum?.on) return undefined;
    function onAccountsChanged(accounts) {
      const address = normalizeClientAddress(accounts?.[0]);
      if (address) {
        localStorage.setItem("pulseshield.wallet", address);
        setWalletAddress(address);
        setAdminAddress(address);
        saveWalletProfile(address, undefined, "active").catch(() => null);
      } else {
        disconnectWallet();
      }
    }
    window.ethereum.on("accountsChanged", onAccountsChanged);
    return () => window.ethereum?.removeListener?.("accountsChanged", onAccountsChanged);
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

            <WalletIdentityPanel
              walletAddress={walletAddress}
              walletProfile={walletProfile}
              walletError={walletError}
              walletMessage={walletMessage}
              displayNameDraft={displayNameDraft}
              isWalletBusy={isWalletBusy}
              onConnect={connectWallet}
              onDisconnect={disconnectWallet}
              onNameChange={setDisplayNameDraft}
              onSaveName={saveDisplayName}
            />

            <CommunityTrustPanel
              trustSnapshot={trustSnapshot}
              trustTarget={trustTarget}
              selectedTrustVote={selectedTrustVote}
              voteNote={voteNote}
              walletAddress={walletAddress}
              communityMessage={communityMessage}
              communityError={communityError}
              adminOpen={adminOpen}
              adminKey={adminKey}
              adminAddress={adminAddress}
              adminReports={adminReports}
              adminAuditor={adminAuditor}
              adminSuspicious={adminSuspicious}
              onVoteChange={setSelectedTrustVote}
              onNoteChange={setVoteNote}
              onCastVote={castTrustVote}
              onAdminOpen={() => setAdminOpen(!adminOpen)}
              onAdminKeyChange={setAdminKey}
              onAdminAddressChange={setAdminAddress}
              onAdminReportsChange={setAdminReports}
              onAdminAuditorChange={setAdminAuditor}
              onAdminSuspiciousChange={setAdminSuspicious}
              onAdminSubmit={submitAdminUpdate}
            />
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

        <Panel id="feedback" className="uhd-panel mt-4 overflow-hidden p-4">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(320px,1fr)]">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-md border border-[#00e7ff]/30 bg-[#00e7ff]/10 text-[#9af7ff] shadow-[0_0_24px_rgba(0,231,255,.18)]">
                  <MessageSquare size={20} />
                </span>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#ff6bff]">PulseShield Signal Line</div>
                  <h2 className="text-2xl font-black text-white">Feedback & Feature Requests</h2>
                </div>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-slate-300">
                Send scan feedback, bug reports, and product ideas directly to the PulseShield inbox. Include a contract address
                or page context when it helps reproduce the issue.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {["Feature ideas", "Scan corrections", "UI issues"].map((item, index) => (
                  <div key={item} className="rounded-md border border-white/10 bg-black/30 p-3">
                    {index === 0 ? <Zap size={16} className="mb-2 text-[#ffb347]" /> : index === 1 ? <ScanLine size={16} className="mb-2 text-[#00e7ff]" /> : <Eye size={16} className="mb-2 text-[#ff4dce]" />}
                    <div className="text-sm font-bold text-white">{item}</div>
                    <div className="mt-1 text-xs text-slate-500">Routes to contact@pulseshield.io</div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={submitFeedback} className="grid min-w-0 gap-3 rounded-lg border border-[#00e7ff]/18 bg-black/30 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.055)]">
              <input
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                value={feedbackForm.website}
                onChange={(event) => setFeedbackForm({ ...feedbackForm, website: event.target.value })}
                aria-hidden="true"
              />
              <div className="grid gap-3 sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
                <Field label="Category">
                  <select
                    value={feedbackForm.category}
                    onChange={(event) => setFeedbackForm({ ...feedbackForm, category: event.target.value })}
                    className="rounded-md border border-white/10 bg-black/35 px-3 py-3 text-sm normal-case tracking-normal text-slate-100 outline-none focus:border-[#00e7ff]"
                  >
                    <option>Feature idea</option>
                    <option>Bug report</option>
                    <option>Scan result feedback</option>
                    <option>UI feedback</option>
                    <option>Partnership</option>
                    <option>Other</option>
                  </select>
                </Field>
                <Field label="Reply email optional">
                  <input
                    type="email"
                    value={feedbackForm.email}
                    onChange={(event) => setFeedbackForm({ ...feedbackForm, email: event.target.value })}
                    placeholder="you@example.com"
                    className="rounded-md border border-white/10 bg-black/35 px-3 py-3 text-sm normal-case tracking-normal outline-none focus:border-[#00e7ff]"
                  />
                </Field>
              </div>
              <Field label="Message">
                <textarea
                  required
                  minLength={12}
                  rows={5}
                  value={feedbackForm.message}
                  onChange={(event) => setFeedbackForm({ ...feedbackForm, message: event.target.value })}
                  placeholder="Tell us what should be improved, corrected, or built next."
                  className="resize-none rounded-md border border-white/10 bg-black/35 px-3 py-3 text-sm normal-case tracking-normal outline-none focus:border-[#ff4dce]"
                />
              </Field>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <a href="mailto:contact@pulseshield.io" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400 transition hover:text-[#9af7ff]">
                  <Mail size={14} /> contact@pulseshield.io
                </a>
                <button
                  type="submit"
                  disabled={isFeedbackSending}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-[#00e7ff]/35 bg-[#00e7ff]/12 px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-[#9af7ff] shadow-[0_12px_28px_rgba(0,231,255,.12),inset_0_1px_0_rgba(255,255,255,.12)] transition hover:border-[#ff4dce]/45 hover:bg-[#ff4dce]/12 hover:text-[#ffc2f6] active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  <Send size={16} /> {isFeedbackSending ? "Sending" : "Send feedback"}
                </button>
              </div>
              {feedbackStatus ? (
                <div className={`rounded-md border p-3 text-sm ${feedbackStatus.type === "success" ? "border-[#63ff9d]/30 bg-[#63ff9d]/10 text-[#b8ffd0]" : "border-[#ffb347]/30 bg-[#ffb347]/10 text-[#ffe3ba]"}`}>
                  {feedbackStatus.message}
                </div>
              ) : null}
            </form>
          </div>
        </Panel>

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
