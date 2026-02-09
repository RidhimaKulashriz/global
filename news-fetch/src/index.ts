/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const q = url.searchParams.get("q");
		if (!q) {
      return new Response(JSON.stringify({ error: "Missing q param" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
		const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_redirect=1&no_html=1`;
		const cache = caches.default;
		const cacheKey = new Request(ddgUrl, request);
		let response = await cache.match(cacheKey);
		if (!response) {
      const ddgRes = await fetch(ddgUrl, {
        headers: {
          "User-Agent": "CrisisLens/1.0 (hackathon demo)",
        },
      });
		const data = await ddgRes.json();
		response = new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300",
        },
      });

      ctx.waitUntil(cache.put(cacheKey, response.clone()));
    }
    return response;
  },
};
