export default async function handler(req, res) {
  const datasetId = req.query.datasetId;
  const limit = Number(req.query.limit || 50);
  const APIFY_TOKEN = process.env.APIFY_TOKEN;

  if (!datasetId) return res.status(400).json({ error: "Missing datasetId" });
  if (!APIFY_TOKEN) return res.status(500).json({ error: "Missing APIFY_TOKEN" });

  const url = `https://api.apify.com/v2/datasets/${encodeURIComponent(datasetId)}/items?clean=true&format=json&limit=${encodeURIComponent(
    String(limit)
  )}&token=${encodeURIComponent(APIFY_TOKEN)}`;

  const r = await fetch(url, { cache: "no-store" });
  const items = await r.json();
  if (!r.ok) return res.status(500).json({ error: "Results error", raw: items });

  return res.status(200).json({ items });
}
