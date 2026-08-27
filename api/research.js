// Vercel serverless API. Kept dependency-free so this endpoint deploys with npm install.
const crypto = require('node:crypto');
const clean = text => String(text || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
async function fetchJson(url) {
  const response = await fetch(url, { headers: { 'User-Agent': 'VeritasMVP/0.1 (evidence research app)' } });
  if (!response.ok) throw new Error(`A source returned ${response.status}`);
  return response.json();
}
async function getSources(question) {
  const [wiki, crossref] = await Promise.allSettled([
    fetchJson(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(question)}&format=json&origin=*`),
    fetchJson(`https://api.crossref.org/works?rows=3&query.bibliographic=${encodeURIComponent(question)}`)
  ]);
  const sources = [];
  if (wiki.status === 'fulfilled') for (const item of (wiki.value.query?.search || []).slice(0, 2)) sources.push({ kind: 'Wikipedia overview', title: clean(item.title), excerpt: clean(item.snippet), url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replaceAll(' ', '_'))}` });
  if (crossref.status === 'fulfilled') for (const item of (crossref.value.message?.items || []).filter(x => x.title?.[0] && x.URL).slice(0, 2)) sources.push({ kind: 'Scholarly record · Crossref', title: clean(item.title[0]), excerpt: clean([item['container-title']?.[0], item.published?.['date-parts']?.[0]?.[0]].filter(Boolean).join(' · ')) || 'Bibliographic record available through Crossref.', url: item.URL });
  return sources;
}
module.exports = async (request, response) => {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Use POST for research requests.' });
  try {
    const question = request.body?.question?.trim();
    if (!question || question.length > 300) throw new Error('Enter a research question between 1 and 300 characters.');
    const sources = await getSources(question);
    const hash = crypto.createHash('sha256').update(JSON.stringify({ question, sources: sources.map(source => source.url) })).digest('hex');
    response.status(200).json({ question, summary: sources.length ? `Veritas found ${sources.length} public starting points. These are leads rather than a final verdict: open the original records, compare methods and dates, and look for corroboration.` : 'No sources were returned. Try a more specific question or check your connection.', sources, verificationId: `sha256:${hash}`, anchorStatus: 'Anchor-ready: this hash can be recorded by the included GenLayer contract after deployment.' });
  } catch (error) { response.status(400).json({ error: error.message }); }
};
