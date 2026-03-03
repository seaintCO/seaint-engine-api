export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  const { searchQuery, location, maxResults } = req.body || {};

  const APIFY_TOKEN = process.env.APIFY_TOKEN;
  const APIFY_ACTOR_ID = process.env.APIFY_ACTOR_ID;

  if (!APIFY_TOKEN || !APIFY_ACTOR_ID) {
    return res.status(500).json({ error: "Missing APIFY_TOKEN or APIFY_ACTOR_ID" });
  }

  // compass/crawler-google-places input
  const input = {
    searchStringsArray: [String(searchQuery || "concrete contractor")],
    locationQuery: String(location || "Nashville, TN"),
    maxCrawledPlacesPerSearch: Number(maxResults || 50),
  };

  const url = `https://api.apify.com/v2/acts/${encodeURIComponent(APIFY_ACTOR_ID)}/runs?token=${encodeURIComponent(APIFY_TOKEN)}`;

  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await r.json();
  if (!r.ok) return res.status(500).json({ error: data?.error?.message || "Failed to start run", raw: data });

  return res.status(200).json({ runId: data?.data?.id, status: data?.data?.status });
}
