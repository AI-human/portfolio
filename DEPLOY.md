# Deploying to Vercel — tahmidkashfi.dev

This is a **TanStack Start** app (Vite + Nitro, SSR on the edge). It deploys to Vercel with zero config — Nitro auto-detects Vercel and outputs the right serverless functions.

---

## 1. Export the project from Lovable

You have two options:

**A. GitHub (recommended)**

1. In Lovable, click **GitHub → Connect to GitHub** and push this project to a new repo (e.g. `tahmidkashfi/portfolio`).
2. Every commit from Lovable will auto-push there.

**B. Download ZIP**

- Lovable → **⋯ menu → Download code**, then push to your own GitHub repo manually.

---

## 2. Deploy on Vercel

1. Go to https://vercel.com/new
2. **Import** the GitHub repo.
3. Framework preset: leave as **Other** (Vercel auto-detects Vite/Nitro). Do not override the build command.
   - Build command: `bun run build` (or `npm run build`)
   - Output directory: leave blank — Nitro writes to `.output/` automatically
   - Install command: `bun install` (or `npm install`)
4. Click **Deploy**. First deploy takes ~1–2 min.
5. You'll get a URL like `portfolio-xxxx.vercel.app`. Confirm the site loads and videos play.

> Node version: Vercel defaults to Node 20 — that's fine. If it complains, set **Project Settings → General → Node.js Version = 20.x**.

---

## 3. Connect `tahmidkashfi.dev`

### In Vercel

1. Open the project → **Settings → Domains**.
2. Add `tahmidkashfi.dev` → Vercel will show DNS instructions.
3. Also add `www.tahmidkashfi.dev` and set the apex (`tahmidkashfi.dev`) as **Primary** (Vercel will auto-redirect www → apex, or reverse — your call).

### At your registrar (where you bought tahmidkashfi.dev)

Add these DNS records:

| Type  | Name | Value                  | TTL  |
| ----- | ---- | ---------------------- | ---- |
| A     | @    | `76.76.21.21`          | Auto |
| CNAME | www  | `cname.vercel-dns.com` | Auto |

- Remove any conflicting A / AAAA / CNAME records for `@` and `www`.
- If your registrar uses Cloudflare proxy, set the records to **DNS only** (grey cloud) until Vercel issues the SSL cert, then you can re-enable proxy if you want.

### Wait

- DNS propagation: usually 5–30 minutes, up to 24h worst case.
- Vercel auto-provisions a Let's Encrypt SSL cert once DNS resolves. You'll see a green ✓ next to the domain.

Check propagation: https://dnschecker.org/#A/tahmidkashfi.dev

---

## 4. Ongoing workflow

- **Edit here in Lovable** → commit auto-pushes to GitHub → Vercel auto-deploys within ~1 min.
- **Preview deploys**: every non-`main` branch/PR gets its own preview URL.
- **Production**: only `main` branch deploys to `tahmidkashfi.dev`.

---

## 5. Environment variables (if you add any later)

If you later add server functions that need secrets (e.g. Resend API key for a contact form):

1. Vercel → **Settings → Environment Variables** → add the key/value.
2. Redeploy.

Right now the portfolio is fully static + SSR with no secrets, so nothing to configure.

---

## Troubleshooting

- **Videos don't autoplay on iOS Safari**: already handled — the `<video>` tags have `muted playsInline autoPlay loop`.
- **Domain stuck on "Invalid Configuration"**: DNS hasn't propagated yet or an old record is conflicting. Recheck DNS records exactly match the table above.
- **Build fails on Vercel with `bun not found`**: switch install/build commands to `npm install` / `npm run build`.
- **404 on refresh of a deep link**: TanStack Start handles this natively on Vercel — no `vercel.json` rewrites needed. If it happens, the build likely failed silently; check the Vercel deploy logs.
