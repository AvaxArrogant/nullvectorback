import net from "node:net";
import tls from "node:tls";

function readResponse(socket) {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("SMTP response timed out."));
    }, 12000);

    function cleanup() {
      clearTimeout(timer);
      socket.off("data", onData);
      socket.off("error", onError);
    }

    function onError(error) {
      cleanup();
      reject(error);
    }

    function onData(chunk) {
      buffer += chunk.toString("utf8");
      const lines = buffer.split(/\r?\n/).filter(Boolean);
      const last = lines[lines.length - 1] || "";
      if (/^\d{3}\s/.test(last)) {
        cleanup();
        resolve(buffer);
      }
    }

    socket.on("data", onData);
    socket.on("error", onError);
  });
}

async function command(socket, line, expected = /^[23]/) {
  socket.write(`${line}\r\n`);
  const response = await readResponse(socket);
  if (!expected.test(response)) {
    throw new Error(`SMTP command failed: ${line.split(" ")[0]} / ${response.trim()}`);
  }
  return response;
}

function dotStuff(value) {
  return String(value || "").replace(/\r?\n/g, "\r\n").replace(/^\./gm, "..");
}

function header(value) {
  return String(value || "").replace(/[\r\n]/g, " ").trim();
}

export async function sendSmtpMail({ to, from, replyTo, subject, text }) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE !== "false";

  if (!host || !user || !pass || !from || !to) {
    throw new Error("SMTP is not configured.");
  }

  const socket = secure
    ? tls.connect({ host, port, servername: host })
    : net.connect({ host, port });

  await new Promise((resolve, reject) => {
    socket.once("secureConnect", resolve);
    socket.once("connect", () => {
      if (!secure) resolve();
    });
    socket.once("error", reject);
  });

  try {
    await readResponse(socket);
    await command(socket, `EHLO ${process.env.SMTP_HELO || "pulseshield.io"}`);
    await command(socket, "AUTH LOGIN", /^334/);
    await command(socket, Buffer.from(user).toString("base64"), /^334/);
    await command(socket, Buffer.from(pass).toString("base64"), /^235/);
    await command(socket, `MAIL FROM:<${from}>`);
    await command(socket, `RCPT TO:<${to}>`);
    await command(socket, "DATA", /^354/);

    const message = [
      `From: PulseShield Feedback <${header(from)}>`,
      `To: ${header(to)}`,
      replyTo ? `Reply-To: ${header(replyTo)}` : "",
      `Subject: ${header(subject)}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=utf-8",
      "",
      dotStuff(text),
      ".",
    ].filter(Boolean).join("\r\n");

    socket.write(`${message}\r\n`);
    const dataResponse = await readResponse(socket);
    if (!/^[23]/.test(dataResponse)) throw new Error(`SMTP DATA failed: ${dataResponse.trim()}`);
    await command(socket, "QUIT").catch(() => null);
  } finally {
    socket.end();
  }
}
