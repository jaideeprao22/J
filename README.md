# jaideeprao.com — Personal Website

Premium dark-glass website + integrated field logbook for Dr. Jaideep Rao M.

**What's inside:**

```
index.html         ← Home (hero + 4 arenas + 2 apps + stats + CTA)
about.html         ← About + credentials + education timeline + working style
apps.html          ← Deep dive on PAUSE and Decades with phone mockups
research.html      ← All publications, SRs, dissertation, conferences
teaching.html      ← Teaching domains + languages + field supervision
contact.html       ← Email + channels + collaboration priorities
logbook/           ← Full field logbook (separate sub-app, see logbook/README.md)
CNAME              ← Custom domain — jaideeprao.com
css/               ← Master stylesheet
js/                ← All interactions, animations, custom cursor, etc.
images/            ← Profile + speaking photos
```

---

## Deploy to jaideeprao.com on GitHub Pages

### Step 1 — Create the repo

1. Go to https://github.com/new
2. **Repository name:** `jaideeprao.github.io` (special name — gives you the apex `username.github.io` URL)
   - OR: any name you want (e.g. `website`) — you'll point your custom domain at it
3. **Public** (required for free Pages)
4. **Do NOT** add a README, .gitignore, or license — leave the repo empty
5. **Create repository**

### Step 2 — Upload everything

1. On the new repo's "quick setup" page, click **uploading an existing file**
2. Open the unzipped `jaideeprao_website/` folder on your computer
3. **Select all the contents** of that folder (not the folder itself — go INSIDE the folder, then Ctrl+A / Cmd+A)
4. Drag everything onto the GitHub upload page
5. Wait for all files to appear at the bottom of the page. Make sure you see:
   - `index.html`, `about.html`, `apps.html`, `research.html`, `teaching.html`, `contact.html`
   - `CNAME`
   - `css/` folder
   - `js/` folder
   - `images/` folder (with `profile.png` and `speaking.png`)
   - `logbook/` folder (with its own `index.html`, `admin.html`, `entry.html`, etc.)
6. Commit message: `initial website`
7. Click **Commit changes**

> ⚠ **If any folder didn't fully upload** (GitHub's web drag-drop occasionally drops nested folders silently), re-drag the same `jaideeprao_website/` contents — existing files won't duplicate, missing ones will fill in.

### Step 3 — Turn on GitHub Pages

1. In the repo, click **Settings**
2. Left sidebar → **Pages**
3. Source: **Deploy from a branch**
4. Branch: **main**, Folder: **/ (root)**
5. Click **Save**
6. Wait ~30 seconds. Refresh. You'll see a green box with a URL.

### Step 4 — Activate the contact form (anti-spam)

The contact page has a working contact form — but it needs a free Web3Forms API key to actually deliver messages to your inbox. Without this step, the form will show an error when someone tries to submit.

1. Open https://web3forms.com/ in a new tab.
2. Type the email address where you want to receive contact-form submissions (e.g. your Gmail).
3. Click **Create Access Key**. They email you a key that looks like:
   ```
   a1b2c3d4-e5f6-7890-abcd-ef1234567890
   ```
4. In your GitHub repo, open `js/contact.js`. Click the pencil icon.
5. Replace this line:
   ```
   const WEB3FORMS_API_KEY = 'PASTE_YOUR_WEB3FORMS_ACCESS_KEY_HERE';
   ```
   with your actual key, e.g.:
   ```
   const WEB3FORMS_API_KEY = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
   ```
6. Commit → main. GitHub Pages auto-redeploys.

**What this gives you:** Free tier is 250 messages/month — more than enough. Your email address never appears in your website's HTML, CSS, or JS, so spam scrapers can't see it. Web3Forms also runs each submission through their spam filter before forwarding it.

> Your real email lives only in Web3Forms' database (linked to your access key), never on the public website. If you ever start getting too much spam through the form itself, you can regenerate the access key at web3forms.com and replace it in `js/contact.js` — same 30-second process.

### Step 5 — (Optional but recommended) Get an alias address

If you want belt-and-braces protection, set up **Cloudflare Email Routing** for your domain. It's free, takes about 10 minutes, and gives you unlimited disposable aliases on `jaideeprao.com` that forward to your real Gmail.

- Sign up at https://cloudflare.com (free) → add `jaideeprao.com` → follow their DNS migration walkthrough (Cloudflare becomes your DNS host)
- Under **Email → Email Routing**, enable it and create an alias like `contact@jaideeprao.com` pointing to your Gmail
- Use *that* alias as the email you register with Web3Forms in Step 4 above
- If anything goes wrong, delete the alias and make a new one — your real Gmail stays clean forever

### Step 6 — Point jaideeprao.com at GitHub

You bought `jaideeprao.com` from a registrar (e.g. GoDaddy, Namecheap, Hostinger, etc.). Log in there and find the DNS settings for the domain. Then add these records:

**For the apex domain (jaideeprao.com):**

Add four **A records** pointing to GitHub Pages' servers:

| Type | Host | Value |
|------|------|-------|
| A | @ | `185.199.108.153` |
| A | @ | `185.199.109.153` |
| A | @ | `185.199.110.153` |
| A | @ | `185.199.111.153` |

**For the www subdomain (www.jaideeprao.com):**

| Type | Host | Value |
|------|------|-------|
| CNAME | www | `YOUR_GITHUB_USERNAME.github.io` |

(Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username.)

Save. **DNS takes 30 minutes to 24 hours to propagate** — usually under an hour.

### Step 7 — Confirm in GitHub

1. Back in the repo: **Settings → Pages**
2. Under **Custom domain**, type `jaideeprao.com` → **Save**
3. GitHub will verify the DNS records. Once verified, tick **Enforce HTTPS**.
4. Done. Open https://jaideeprao.com in a browser.

---

## After deployment — the logbook

The logbook lives at `https://jaideeprao.com/logbook/` and has its own quick setup (about 5 minutes once the website is live):

1. Open `logbook/js/config.js` on GitHub → edit → set `GITHUB_USER` and `GITHUB_REPO` to **the same repo you just made** (the website repo — the logbook lives inside it, so it uses the same repo for storage).
2. Open `https://jaideeprao.com/logbook/admin.html`
3. Follow the on-screen 6-step guide to create a GitHub Personal Access Token.
4. Sign in. Post your first field entry. It appears at `https://jaideeprao.com/logbook/` in 5 minutes.

Full logbook setup details are in `logbook/README.md`.

---

## Content notes

Every page is filled with **real content from your CV** — no placeholder text, no Lorem Ipsum, no under-construction sections. If you find anything that needs updating (a new paper accepted, a new conference, a new role, etc.) just tell me and I'll send the exact line to edit.

### Things you may want to update over time

- **Stats on the home page** — when paper 1 or paper 2 gets accepted, the "under peer review" stat needs to flip to "published"
- **Research page** — same; new papers added at the top
- **About page** — current role and dates in the education timeline
- **Contact page** — collaboration priorities can be reordered as your interests shift

---

## Browser compatibility

- Chrome / Edge / Firefox / Safari — all current versions ✅
- Mobile Safari (iOS) / Chrome (Android) — tested layouts ✅
- IE 11 — not supported (uses CSS variables, backdrop-filter, modern JS)

---

## Cost

- GitHub Pages: free, unlimited
- Custom domain renewal: whatever your registrar charges (typically ₹800–1500/year)
- Bandwidth: free, unlimited from GitHub Pages
- Logbook backend: also free (uses the same GitHub repo as the website)

**Total ongoing cost: just your domain renewal.**

---

## If something looks wrong after deployment

- **Fonts not loading**: First load can be slow on slow connections — fonts come from Google Fonts. Refresh.
- **Photos missing**: Confirm `images/profile.png` and `images/speaking.png` exist in the repo. Re-upload if missing.
- **Logbook section not working**: The logbook's `js/config.js` is the most common cause. Make sure both `GITHUB_USER` and `GITHUB_REPO` are filled in correctly with no quotes broken.
- **HTTPS warning on custom domain**: Wait. GitHub provisions the SSL certificate after the DNS is verified. Can take up to a few hours.

Anything else not working — tell me what page, what browser, what you're seeing, and I'll send the fix.
