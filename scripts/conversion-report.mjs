// Read aggregate conversion counts without exposing a reporting token to the site.
const account = process.env.CLOUDFLARE_ACCOUNT_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;
const days = Number(process.env.CONVERSION_DAYS ?? 30);
const dataset = process.env.CONVERSION_PREVIEW === 'true' ? 'portfolio_conversions_preview' : 'portfolio_conversions';
if (!account || !/^[a-f0-9]{32}$/.test(account) || !token) {
  throw new Error('Set CLOUDFLARE_ACCOUNT_ID and a CLOUDFLARE_API_TOKEN with Account Analytics Read permission.');
}
if (!Number.isInteger(days) || days < 1 || days > 90) throw new Error('CONVERSION_DAYS must be 1–90.');
const sql = `SELECT blob1 AS event, blob2 AS page, blob3 AS locale, blob4 AS project,
  blob5 AS service, blob6 AS engagement, blob7 AS placement, SUM(_sample_interval) AS events
  FROM ${dataset} WHERE timestamp > NOW() - INTERVAL '${days}' DAY
  GROUP BY event, page, locale, project, service, engagement, placement ORDER BY events DESC FORMAT JSON`;
const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/analytics_engine/sql`, {
  method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: sql,
});
if (!response.ok) throw new Error(`Analytics query failed (${response.status}). Check permissions and whether the dataset has received events.`);
const result = await response.json();
console.table(result.data ?? result);
