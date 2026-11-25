# BiasharaBase Page Studio

The Cloudflare production build uses the cloudflare-page-studio branch. The build command checks and applies page-studio-worker.patch before compiling the app.

The Worker uses the Page Studio D1 database for paid licenses. Configure SELAR_WEBHOOK_SECRET and STUDIO_TOKEN_SECRET as runtime secrets in Cloudflare.
