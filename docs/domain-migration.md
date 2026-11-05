# Moving to a custom address

Target: `https://repaso.is-a.dev/`, a free subdomain from [is-a.dev](https://is-a.dev), pointing at the same GitHub Pages site. The site stays on GitHub Pages: only the address changes. `babylonace.github.io/repaso/` redirects to the new address by itself once GitHub Pages has the custom domain.

Why this one: free, no ads or tracking added, and the registration is a pull request, so there is no account to create. `repaso.pages.dev`, `repaso.netlify.app` and `repaso.js.org` were already taken when this was checked (2026-11-05), and `repaso.vercel.app` returned 404 (not verified as free).

Rules that matter: the project must be non-commercial and software-development related, and it must be live and complete when the request is sent. If it is ever monetised, the subdomain can be taken back. The fallback is to keep the github.io address (nothing in the app depends on the new one).

## Before the request

The site already builds its canonical URLs, sitemap, share image and robots.txt from `SITE_URL` (a repository variable read by `deploy.yml`), so switching is a setting, not a commit.

## After the pull request in is-a-dev/register is merged

Do these in order. The order matters: sign-in breaks if the domain is live before Firebase trusts it.

1. **Firebase Authentication > Settings > Authorized domains**: add `repaso.is-a.dev`. Keep `babylonace.github.io` until step 8.
2. **Google Cloud Console > APIs & Services > Credentials**: on the browser API key, add `https://repaso.is-a.dev/*` to the allowed HTTP referrers (keep the old one for now).
3. **GitHub OAuth App** (currently named "superadmin", rename it to Repaso): set the Homepage URL to `https://repaso.is-a.dev/`. The callback URL stays on `repaso-35cd7.firebaseapp.com`.
4. **GitHub Pages**: repo Settings > Pages > Custom domain `repaso.is-a.dev`. Or `gh api -X PUT repos/babylonace/repaso/pages -f cname=repaso.is-a.dev`. Wait for the certificate, then tick Enforce HTTPS (can take up to an hour).
5. **Repository variable** `SITE_URL` = `https://repaso.is-a.dev/` (Settings > Secrets and variables > Actions > Variables). Re-run `Test and deploy`.
6. **Check live, with the browser console open**: the home page, a question page, `sitemap.xml`, `robots.txt`, a real Google sign-in and a real GitHub sign-in (see [firebase-setup.md](firebase-setup.md)). No CSP violation should appear: the CSP only names the Firebase auth domain, not the site address.
7. **Search Console**: add `https://repaso.is-a.dev/` as a new property (the verification file already in `public/` works for it) and submit `sitemap.xml`. Keep the old property for a few weeks to watch the redirect.
8. After about a month with no sign-in problems: remove `babylonace.github.io` from the Firebase authorized domains and the API key referrers.
9. Update the address in README.md, README.es.md, `docs/firebase-setup.md` and the "Domain" line in `docs/research.md`, then commit.

## Side effects to know

- Progress kept only in the browser (not signed in) belongs to the address it was saved on. Visitors who used the github.io address start empty on the new one unless they export and import their progress, or sign in. The site is new, so this is small.
- The offline copy (service worker) is per address too, so it is downloaded again on the first visit.
