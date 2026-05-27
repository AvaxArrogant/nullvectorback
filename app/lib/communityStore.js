import fs from "node:fs/promises";
import path from "node:path";

const voteTypes = {
  "Confirmed Safe": { tone: "safe", order: 1 },
  Suspicious: { tone: "warning", order: 2 },
  "Confirmed Malicious": { tone: "danger", order: 3 },
  "False Positive": { tone: "info", order: 4 },
  "Needs Manual Review": { tone: "review", order: 5 },
};

const dataDir = process.env.PULSESHIELD_DATA_DIR || path.join(process.cwd(), ".data");
const dataFile = path.join(dataDir, "community-trust.json");
const rootAdminAddress = normalizeAddress(process.env.PULSESHIELD_ROOT_ADMIN || "0x85E6cC88F3055b589eb1d4030863be2CFcc0763E");

const defaultStore = {
  version: 1,
  profiles: {},
  displayNames: {},
  votes: {},
  approvals: {},
  auditLog: [],
  updatedAt: null,
};

let writeQueue = globalThis.__pulseShieldCommunityWriteQueue || Promise.resolve();
globalThis.__pulseShieldCommunityWriteQueue = writeQueue;

export function normalizeAddress(address) {
  const value = String(address || "").trim().toLowerCase();
  return /^0x[a-f0-9]{40}$/.test(value) ? value : "";
}

function clean(value, maxLength = 500) {
  return String(value || "").replace(/\0/g, "").trim().slice(0, maxLength);
}

function sanitizeDisplayName(name) {
  const value = clean(name, 28);
  if (!value) return "";
  if (!/^[a-zA-Z0-9_.-]{3,24}$/.test(value)) {
    throw new Error("Display name must be 3-24 characters using letters, numbers, dots, dashes, or underscores.");
  }
  if (/^0x[a-fA-F0-9]{6,}$/.test(value)) {
    throw new Error("Display name cannot look like a wallet address.");
  }
  return value;
}

function targetKey(target) {
  const address = normalizeAddress(target);
  return address || clean(target, 140).toLowerCase();
}

function now() {
  return new Date().toISOString();
}

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    return { ...defaultStore, ...JSON.parse(raw) };
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await writeStore(defaultStore);
    return { ...defaultStore };
  }
}

async function writeStore(store) {
  await fs.mkdir(dataDir, { recursive: true });
  const next = { ...store, updatedAt: now() };
  const tempFile = `${dataFile}.${Date.now()}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(next, null, 2));
  await fs.rename(tempFile, dataFile);
  return next;
}

async function mutateStore(mutator) {
  writeQueue = writeQueue.then(async () => {
    const store = await ensureStore();
    const result = await mutator(store);
    await writeStore(store);
    return result;
  });
  globalThis.__pulseShieldCommunityWriteQueue = writeQueue;
  return writeQueue;
}

export function voteOptions() {
  return Object.entries(voteTypes).map(([label, meta]) => ({ label, ...meta }));
}

export function publicProfile(profile) {
  if (!profile) return null;
  const address = normalizeAddress(profile.address);
  return {
    address,
    displayName: profile.displayName || "",
    status: address === rootAdminAddress ? "root" : profile.status || "active",
    role: address === rootAdminAddress ? "root" : profile.role || "user",
    auditorBadge: Boolean(profile.auditorBadge),
    accurateReports: Number(profile.accurateReports || 0),
    suspicious: Boolean(profile.suspicious),
    credibilityWeight: credibilityWeight(profile),
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

export function credibilityWeight(profile) {
  if (!profile) return 1;
  if (profile.suspicious || profile.status === "suspicious") return 0.25;

  let weight = 1;
  if (profile.walletActivity === "active") weight = Math.max(weight, 1.5);
  if (profile.auditorBadge) weight = Math.max(weight, 3);
  if (Number(profile.accurateReports || 0) > 0) {
    weight = Math.max(weight, Math.min(5, 1 + Number(profile.accurateReports || 0)));
  }
  return Number(weight.toFixed(2));
}

function aggregateVotes(store, target) {
  const key = targetKey(target);
  const targetVotes = Object.values(store.votes[key] || {});
  const totals = Object.fromEntries(Object.keys(voteTypes).map((label) => [label, { label, weight: 0, count: 0, tone: voteTypes[label].tone }]));

  for (const vote of targetVotes) {
    const profile = store.profiles[vote.address];
    const weight = credibilityWeight(profile);
    if (!totals[vote.vote]) continue;
    totals[vote.vote].weight += weight;
    totals[vote.vote].count += 1;
  }

  const totalWeight = Object.values(totals).reduce((sum, item) => sum + item.weight, 0);
  const ordered = Object.values(totals)
    .map((item) => ({
      ...item,
      weight: Number(item.weight.toFixed(2)),
      percent: totalWeight ? Math.round((item.weight / totalWeight) * 100) : 0,
    }))
    .sort((a, b) => voteTypes[a.label].order - voteTypes[b.label].order);

  const leader = ordered.reduce((best, item) => (item.weight > (best?.weight || 0) ? item : best), null);

  return {
    target: key,
    voteCount: targetVotes.length,
    totalWeight: Number(totalWeight.toFixed(2)),
    leader: leader?.weight ? leader : null,
    totals: ordered,
    recentVotes: targetVotes
      .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
      .slice(0, 8)
      .map((vote) => ({
        vote: vote.vote,
        note: vote.moderated?.hidden ? "" : vote.note,
        moderated: Boolean(vote.moderated?.hidden),
        address: vote.address,
        displayName: store.profiles[vote.address]?.displayName || "",
        weight: credibilityWeight(store.profiles[vote.address]),
        updatedAt: vote.updatedAt,
      })),
  };
}

export async function getCommunitySnapshot(target, address) {
  const store = await ensureStore();
  const normalized = normalizeAddress(address);
  const profile = store.profiles[normalized];
  const key = targetKey(target);
  return {
    ok: true,
    voteOptions: voteOptions(),
    aggregate: aggregateVotes(store, key),
    profile: publicProfile(profile),
    permissions: adminPermissions(store, normalized),
    approval: key ? store.approvals?.[key] || null : null,
    userVote: normalized ? store.votes[key]?.[normalized] || null : null,
  };
}

export async function upsertProfile({ address, displayName, walletActivity }) {
  const normalized = normalizeAddress(address);
  if (!normalized) throw new Error("Connect a valid wallet address first.");

  return mutateStore((store) => {
    const existing = store.profiles[normalized] || {
      address: normalized,
      createdAt: now(),
      status: "active",
      accurateReports: 0,
      auditorBadge: false,
      suspicious: false,
      walletActivity: "new",
    };

    if (displayName !== undefined) {
      const nextName = sanitizeDisplayName(displayName);
      const nextKey = nextName.toLowerCase();
      const currentKey = existing.displayName?.toLowerCase();
      if (nextName && store.displayNames[nextKey] && store.displayNames[nextKey] !== normalized) {
        throw new Error("That display name is already claimed.");
      }
      if (currentKey && store.displayNames[currentKey] === normalized) delete store.displayNames[currentKey];
      if (nextName) store.displayNames[nextKey] = normalized;
      existing.displayName = nextName;
    }

    if (walletActivity) existing.walletActivity = walletActivity;
    existing.updatedAt = now();
    store.profiles[normalized] = existing;
    return { ok: true, profile: publicProfile(existing) };
  });
}

function adminPermissions(store, actorAddress) {
  const normalized = normalizeAddress(actorAddress);
  const role = normalized === rootAdminAddress ? "root" : store.profiles[normalized]?.role || "user";
  return {
    role,
    canViewAdmin: ["root", "admin", "moderator"].includes(role),
    canModerate: ["root", "admin", "moderator"].includes(role),
    canManageUsers: ["root", "admin"].includes(role),
    canGrantAccess: ["root", "admin"].includes(role),
  };
}

function assertAdminAccess(store, actorAddress, adminKey, permission = "canViewAdmin") {
  if (process.env.PULSESHIELD_ADMIN_KEY && adminKey === process.env.PULSESHIELD_ADMIN_KEY) {
    return { role: "server-key", canViewAdmin: true, canModerate: true, canManageUsers: true, canGrantAccess: true };
  }
  const permissions = adminPermissions(store, actorAddress);
  if (!permissions[permission]) throw new Error("Admin dashboard access denied.");
  return permissions;
}

function flattenVotes(store) {
  return Object.entries(store.votes || {}).flatMap(([target, votesByAddress]) => (
    Object.values(votesByAddress || {}).map((vote) => ({
      target,
      address: vote.address,
      displayName: store.profiles[vote.address]?.displayName || "",
      vote: vote.vote,
      note: vote.note || "",
      moderated: Boolean(vote.moderated?.hidden),
      moderationReason: vote.moderated?.reason || "",
      updatedAt: vote.updatedAt,
    }))
  ));
}

function publicApproval(approval) {
  if (!approval) return null;
  return {
    target: approval.target,
    projectName: approval.projectName || "",
    sealId: approval.sealId || "",
    notes: approval.notes || "",
    approvedBy: approval.approvedBy || "",
    approvedAt: approval.approvedAt,
    updatedAt: approval.updatedAt,
    status: approval.status || "approved",
  };
}

export async function getAdminDashboard({ actorAddress, adminKey }) {
  const store = await ensureStore();
  const permissions = assertAdminAccess(store, actorAddress, adminKey);
  const profiles = Object.values(store.profiles || {}).map(publicProfile);
  const votes = flattenVotes(store).sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  const targets = Object.keys(store.votes || {});
  const approvals = Object.values(store.approvals || {}).map(publicApproval).sort((a, b) => String(b.updatedAt || b.approvedAt).localeCompare(String(a.updatedAt || a.approvedAt)));

  return {
    ok: true,
    permissions,
    stats: {
      users: profiles.length,
      targets: targets.length,
      votes: votes.length,
      notes: votes.filter((vote) => vote.note).length,
      hiddenNotes: votes.filter((vote) => vote.moderated).length,
      admins: profiles.filter((profile) => ["root", "admin"].includes(profile.role)).length,
      moderators: profiles.filter((profile) => profile.role === "moderator").length,
      suspicious: profiles.filter((profile) => profile.suspicious).length,
      approvedProjects: approvals.length,
    },
    users: profiles
      .sort((a, b) => String(b.updatedAt || b.createdAt).localeCompare(String(a.updatedAt || a.createdAt)))
      .slice(0, 120),
    votes: votes.slice(0, 160),
    approvals: approvals.slice(0, 160),
    auditLog: (store.auditLog || []).slice(-80).reverse(),
  };
}

export async function castCommunityVote({ address, target, vote, note }) {
  const normalized = normalizeAddress(address);
  const key = targetKey(target);
  if (!normalized) throw new Error("Connect a valid wallet address first.");
  if (!key) throw new Error("Scan or enter a contract before voting.");
  if (!voteTypes[vote]) throw new Error("Choose a supported trust vote.");

  return mutateStore((store) => {
    if (!store.profiles[normalized]) {
      store.profiles[normalized] = {
        address: normalized,
        createdAt: now(),
        updatedAt: now(),
        status: "active",
        walletActivity: "new",
        accurateReports: 0,
        auditorBadge: false,
        suspicious: false,
      };
    }

    store.votes[key] = store.votes[key] || {};
    store.votes[key][normalized] = {
      address: normalized,
      vote,
      note: clean(note, 320),
      updatedAt: now(),
    };

    return {
      ok: true,
      aggregate: aggregateVotes(store, key),
      profile: publicProfile(store.profiles[normalized]),
      userVote: store.votes[key][normalized],
    };
  });
}

export async function adminUpdate({
  actorAddress,
  adminKey,
  action = "profile.update",
  address,
  auditorBadge,
  accurateReports,
  suspicious,
  status,
  role,
  target,
  voteAddress,
  reason,
  projectName,
  sealId,
  notes,
}) {
  const normalized = normalizeAddress(address);

  return mutateStore((store) => {
    const permission = action === "vote.moderate" || action === "vote.restore" || action === "vote.delete" ? "canModerate" : "canManageUsers";
    const permissions = assertAdminAccess(store, actorAddress, adminKey, permission);

    if (action === "approval.upsert" || action === "approval.revoke") {
      const key = targetKey(target || address);
      if (!key) throw new Error("Enter a valid project or contract target.");
      store.approvals = store.approvals || {};
      if (action === "approval.revoke") {
        delete store.approvals[key];
      } else {
        const existing = store.approvals[key] || { target: key, approvedAt: now() };
        store.approvals[key] = {
          ...existing,
          target: key,
          projectName: clean(projectName, 80),
          sealId: clean(sealId, 80) || `PS-${key.slice(2, 8).toUpperCase()}`,
          notes: clean(notes, 280),
          status: "approved",
          approvedBy: normalizeAddress(actorAddress),
          updatedAt: now(),
        };
      }
      store.auditLog.push({ action, target: key, by: normalizeAddress(actorAddress), updatedAt: now() });
      store.auditLog = store.auditLog.slice(-200);
      return { ok: true, permissions, approval: publicApproval(store.approvals[key]) };
    }

    if (action === "vote.moderate" || action === "vote.restore" || action === "vote.delete") {
      const key = targetKey(target);
      const voter = normalizeAddress(voteAddress);
      if (!key || !voter || !store.votes[key]?.[voter]) throw new Error("Vote note was not found.");
      if (action === "vote.delete") {
        delete store.votes[key][voter];
      } else {
        store.votes[key][voter].moderated = action === "vote.moderate"
          ? { hidden: true, reason: clean(reason, 220), by: normalizeAddress(actorAddress), updatedAt: now() }
          : { hidden: false, reason: "", by: normalizeAddress(actorAddress), updatedAt: now() };
      }
      store.auditLog.push({ action, target: key, address: voter, by: normalizeAddress(actorAddress), updatedAt: now() });
      store.auditLog = store.auditLog.slice(-200);
      return { ok: true, permissions, dashboard: null };
    }

    if (!normalized) throw new Error("Enter a valid wallet address.");
    const profile = store.profiles[normalized] || {
      address: normalized,
      createdAt: now(),
      walletActivity: "new",
    };

    if (auditorBadge !== undefined) profile.auditorBadge = Boolean(auditorBadge);
    if (accurateReports !== undefined) profile.accurateReports = Math.max(0, Math.min(25, Number(accurateReports || 0)));
    if (suspicious !== undefined) profile.suspicious = Boolean(suspicious);
    if (status) profile.status = clean(status, 24);
    if (role !== undefined) {
      if (!["user", "moderator", "admin"].includes(role)) throw new Error("Unsupported role.");
      if (normalized === rootAdminAddress) throw new Error("Root admin role cannot be changed.");
      profile.role = role;
    }
    profile.updatedAt = now();
    store.profiles[normalized] = profile;
    store.auditLog.push({ action, address: normalized, role: profile.role || "user", by: normalizeAddress(actorAddress), updatedAt: now() });
    store.auditLog = store.auditLog.slice(-200);

    return { ok: true, permissions, profile: publicProfile(profile) };
  });
}
