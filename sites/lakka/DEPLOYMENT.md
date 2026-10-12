# Deploy Lakka independently on Cloudflare Workers

This is a separate static Worker named `lakka-hp`. The repository's existing root Worker (`ranarium-hp`) must not be used for this deployment.

## Git source

- Repository: `kmiura9210/ranarium-hp`
- Lakka branch: `codex/lakka-website`
- Project root: `sites/lakka`
- Build: `python3 build.py`
- Deploy: `npx wrangler@4 deploy --config wrangler.jsonc`

In Cloudflare Workers Builds, select this branch and project root. The committed `dist` directory is ready to deploy, so the build command may be omitted if Python is unavailable. Rebuild and commit `dist` after future copy changes.

## Required connection

An authenticated Cloudflare account with permission to deploy Workers is required. Configure credentials through the environment's secure credential settings; do not commit them. The current execution environment has no Cloudflare identity or API credential configured.

## Domain

After the Worker successfully deploys, attach `lakka.rana-rium.com` under the new Worker's Settings → Domains & Routes → Custom Domain, in the account that owns the `rana-rium.com` zone. The deployment configuration deliberately contains no routes for the existing corporate website. Verify both `/ja/` and `/en/` after attaching the domain.

## Draft state

The user approved temporary booking links. Booking buttons show a coming-soon dialog. Search indexing is disabled for the draft. Real salon photos have been authorized but are not yet incorporated because image downloads were interrupted. Desktop/mobile browser verification remains outstanding due to sandbox restrictions.
