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
		const API_KEY=env.API_KEY;
		const urlObj = new URL(request.url);
		const city = urlObj.searchParams.get("city");
    const cache = caches.default;
		const cacheKey = new Request(`https://weather-cache/${city}`, request);
		let response = await cache.match(cacheKey);
		if (response) return response;
		const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`;
    const res = await fetch(url);
    const result = await res.json();

    response = new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=180", // 3 min
      },
    });

    ctx.waitUntil(cache.put(cacheKey, response.clone()));

    return response;
  },
} satisfies ExportedHandler<Env>;
