# Moving to a custom address

Target: `https://repaso.babylonace.dev/`, a subdomain of `babylonace.dev` (registered at GoDaddy), pointing at the same GitHub Pages site. The site stays on GitHub Pages: only the address changes. `babylonace.github.io/repaso/` redirects to the new address by itself once GitHub Pages has the custom domain.

Why a subdomain and not the bare `babylonace.dev`: the root stays free for a personal site or portfolio, and a subdomain only needs one CNAME record. `.dev` domains are HTTPS-only (HSTS preloaded), which GitHub Pages provides for free.

Earlier plan (free `repaso.is-a.dev` through a pull request) is dropped: the domain is owned now, so there is nothing to ask anyone for.

## Before the request

The site already builds its canonical URLs, sitemap, share image and robots.txt from `SITE_URL` (a repository variable read by `deploy.yml`), so switching is a setting, not a commit.

## Steps

Do these in order. The order matters: sign-in breaks if the domain is live before Firebase trusts it.

1. **GoDaddy > My Products > babylonace.dev > DNS > Add record**: type `CNAME`, name `repaso`, value `babylonace.github.io`, TTL 1 hour. Do not use the `@` record and do not touch the existing ones. GoDaddy parks new domains with a forwarding or "coming soon" page: if there is a forwarding rule for the domain, remove it so it does not override the CNAME.
2. **Firebase Authentication > Settings > Authorized domains**: add `repaso.babylonace.dev`. Keep `babylonace.github.io` until step 9.
3. **Google Cloud Console > APIs & Services > Credentials**: on the browser API key, add `https://repaso.babylonace.dev/*` to the allowed HTTP referrers (keep the old one for now).
4. **GitHub OAuth App** (currently named "superadmin", rename it to Repaso): set the Homepage URL to `https://repaso.babylonace.dev/`. The callback URL stays on `repaso-35cd7.firebaseapp.com`.
5. **GitHub Pages**: repo Settings > Pages > Custom domain `repaso.babylonace.dev`. Or `gh api -X PUT repos/babylonace/repaso/pages -f cname=repaso.babylonace.dev`. GitHub checks the DNS first (`dig repaso.babylonace.dev +short` should answer `babylonace.github.io`). Wait for the certificate, then tick Enforce HTTPS (can take up to an hour).
6. **Repository variable** `SITE_URL` = `https://repaso.babylonace.dev/` (Settings > Secrets and variables > Actions > Variables). Re-run `Test and deploy`.
7. **Check live, with the browser console open**: the home page, a question page, `sitemap.xml`, `robots.txt`, a real Google sign-in and a real GitHub sign-in (see [firebase-setup.md](firebase-setup.md)). No CSP violation should appear: the CSP only names the Firebase auth domain, not the site address.
8. **Search Console**: add `https://repaso.babylonace.dev/` as a new property (the verification file already in `public/` works for it) and submit `sitemap.xml`. Keep the old property for a few weeks to watch the redirect.
9. After about a month with no sign-in problems: remove `babylonace.github.io` from the Firebase authorized domains and the API key referrers.
10. Update the address in README.md, README.es.md, `docs/firebase-setup.md` and the "Domain" line in `docs/research.md`, then commit.

## Side effects to know

- Progress kept only in the browser (not signed in) belongs to the address it was saved on. Visitors who used the github.io address start empty on the new one unless they export and import their progress, or sign in. The site is new, so this is small.
- The offline copy (service worker) is per address too, so it is downloaded again on the first visit.
- Do not enable GoDaddy's domain forwarding or "Website Builder" on the root while the subdomain is in use; they do not affect the CNAME but can confuse the checks above.
