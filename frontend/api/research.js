// Vercel serverless API; this lives in frontend/ because Vercel deploys that folder.
const crypto = require('node:crypto');
const clean = value => String(value || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
async function source(url) {
  const reply = await fetch(url, { headers: { 'User-Agent': 'VeritasMVP/0.1 (evidence research app)' } });
  if (!reply.ok) throw new Error(`Source returned ${reply.status}`);
  return reply.json();
}
module.exports = async (request, response) => {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Use POST for research requests.' });
  try {
    const question = request.body?.question?.trim();
    if (!question || question.length > 300) throw new Error('Enter a research question between 1 and 300 characters.');
    const [wiki, crossref] = await Promise.allSettled([
      source(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(question)}&format=json&origin=*`),
      source(`https://api.crossref.org/works?rows=3&query.bibliographic=${encodeURIComponent(question)}`)
    ]);
    const sources = [];
    if (wiki.status === 'fulfilled') for (const item of (wiki.value.query?.search || []).slice(0, 2)) sources.push({ kind: 'Wikipedia overview', title: clean(item.title), excerpt: clean(item.snippet), url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replaceAll(' ', '_'))}` });
    if (crossref.status === 'fulfilled') for (const item of (crossref.value.message?.items || []).filter(item => item.title?.[0] && item.URL).slice(0, 2)) sources.push({ kind: 'Scholarly record · Crossref', title: clean(item.title[0]), excerpt: clean([item['container-title']?.[0], item.published?.['date-parts']?.[0]?.[0]].filter(Boolean).join(' · ')) || 'Bibliographic record available through Crossref.', url: item.URL });
    const hash = crypto.createHash('sha256').update(JSON.stringify({ question, sources: sources.map(item => item.url) })).digest('hex');
    response.status(200).json({ question, summary: sources.length ? `Veritas found ${sources.length} public starting points. These are leads rather than a final verdict: open the original records, compare methods and dates, and look for corroboration.` : 'No sources were returned. Try a more specific question or check your connection.', sources, verificationId: `sha256:${hash}`, anchorStatus: 'Anchor-ready: this hash can be recorded by the included GenLayer contract after deployment.' });
  } catch (error) { response.status(400).json({ error: error.message }); }
};
