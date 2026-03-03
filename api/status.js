export default async function handler(req, res) {
  const runId = req.query.runId;
  const APIFY_TOKEN = process.env.APIFY_TOKEN;

  if (!runId) return res.status(400).json({ error: "Missing runId" });
  if (!APIFY_TOKEN) return res.status(500).json({ error: "Missing APIFY_TOKEN" });

  const url = `https://api.apify.com/v2/actor-runs/${encodeURIComponent(runId)}?token=${encodeURIComponent(APIFY_TOKEN)}`;

  const r = await fetch(url, { cache: "no-store" });
  const data = await r.json();
  if (!r.ok) return res.status(500).json({ error: data?.error?.message || "Status error", raw: data });

  return res.status(200).json({
    status: data?.data?.status,
    defaultDatasetId: data?.data?.defaultDatasetId,
  });
}
