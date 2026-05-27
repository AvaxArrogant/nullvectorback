# PulseShield.io VPS Deployment

This runbook is for a Hostinger Ubuntu 24.04 VPS. It runs PulseShield as a Docker service on `127.0.0.1:3000`, then exposes it through Nginx with HTTPS at `https://pulseshield.io`.

## 1. First login

Replace the IP with your VPS IP.

```bash
ssh root@YOUR_SERVER_IP
```

Update the server:

```bash
apt update && apt upgrade -y
apt install -y ca-certificates curl git ufw nginx certbot python3-certbot-nginx
```

## 2. Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
ufw status
```

## 3. Install Docker

```bash
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" > /etc/apt/sources.list.d/docker.list
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker
```

## 4. Create app user

```bash
adduser --disabled-password --gecos "" pulseshield
usermod -aG docker pulseshield
mkdir -p /srv/pulseshield
chown -R pulseshield:pulseshield /srv/pulseshield
```

Log in as the app user:

```bash
su - pulseshield
```

## 5. Pull the app

```bash
cd /srv/pulseshield
git clone https://github.com/AvaxArrogant/nullvectorback.git app
cd app
```

Create production environment file:

```bash
cp .env.production.example .env.production
nano .env.production
```

Minimum values:

```bash
PULSECHAIN_RPC_URL=https://rpc.pulsechain.com
PULSECHAIN_EXPLORER_API=https://scan.pulsechain.com/api
PULSESHIELD_DATA_DIR=/data/pulseshield
PULSESHIELD_ADMIN_KEY=GENERATE_A_LONG_PRIVATE_ADMIN_KEY
```

Feedback email relay:

```bash
FEEDBACK_TO_EMAIL=contact@pulseshield.io
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contact@pulseshield.io
SMTP_PASS=YOUR_MAILBOX_PASSWORD
SMTP_FROM=contact@pulseshield.io
```

Create the `contact@pulseshield.io` mailbox in Hostinger first, then place the mailbox password only in `.env.production` on the VPS.

## 6. Start the app

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f --tail=80
```

Check it locally from the VPS:

```bash
curl http://127.0.0.1:3000/api/health
```

## 7. Domain and Nginx

Point `pulseshield.io` to the VPS IP with an `A` record first.

Return to root:

```bash
exit
```

Install the Nginx config:

```bash
cp /srv/pulseshield/app/deploy/nginx-pulseshield.conf /etc/nginx/sites-available/pulseshield
ln -sf /etc/nginx/sites-available/pulseshield /etc/nginx/sites-enabled/pulseshield
nginx -t
systemctl reload nginx
```

Add HTTPS:

```bash
certbot --nginx -d pulseshield.io
```

## 8. Update after pushing new code

```bash
su - pulseshield
cd /srv/pulseshield/app
git pull
docker compose up -d --build --remove-orphans
docker compose ps
```

If the earlier install used the old `/srv/nullvector` path, update there instead:

```bash
su - nullvector
cd /srv/nullvector/app
git pull
docker compose up -d --build --remove-orphans
docker compose ps
```

## 9. Useful operations

Logs:

```bash
cd /srv/pulseshield/app
docker compose logs -f --tail=120
```

Restart:

```bash
cd /srv/pulseshield/app
docker compose restart
```

Health:

```bash
curl https://pulseshield.io/api/health
```

## 10. Future backend expansion

The current production service includes the live Next.js backend routes:

- `/api/scan`
- `/api/market`
- `/api/community`
- `/api/community/profile`
- `/api/community/vote`
- `/api/community/admin`
- `/api/feedback`
- `/api/health`

The Docker compose file mounts a persistent `pulseshield-data` volume at `/data/pulseshield` so community profiles, display names, trust votes, and admin reputation metadata survive app rebuilds.

The VPS has enough RAM to add worker containers later for Slither, Mythril, Semgrep, queue processing, Supabase sync, report caching, or a private RPC/indexing layer.
