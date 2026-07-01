const {JSDOM} = require('jsdom');

/* helper – convert “26860 Seco Canyon Rd Santa Clarita CA” → [lat,lon]  */
async function geocode(addr) {
  const url =
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(addr)}`;
  const res  = await fetch(url, {
    /* Nominatim requires a UA & email → change both for your project */
    headers: { 'User-Agent': 'urcna-scraper/1.0 (contact@example.com)' }
  });
  const data = await res.json();
  return data.length ? [ +data[0].lat, +data[0].lon ] : [];
}

/* helper – turns   {Address:'26860…', Classis:'SW US', …}
   that is encoded inside the loadDialog() call into a plain object        */
function parseLoadDialog(onclickStr = '') {
  //  strip loadDialog( … )  wrapper
  const inner = onclickStr.replace(/^.*loadDialog\s*\(/, '')
                          .replace(/\)\s*;?\s*$/, '')
                          .trim();
  if (!inner.startsWith('{')) return {};              // safety-belt

  //  CFML prints objects like  {Address:'…',Classis:'…'}
  //  make it valid JSON → wrap keys in quotes then swap ' for "
  const jsonTxt = inner
    .replace(/([{,]\s*)([A-Za-z0-9_]+)\s*:/g, '$1"$2":')   // quote keys
    .replace(/'/g, '"');                                   // quote strings

  try   { return JSON.parse(jsonTxt); }
  catch { return {}; }
}

async function scrapeChurches() {
  /* grab the HTML (use a CORS proxy if you run from another origin) */
  const html  = await fetch('https://www.urcna.org/find-a-church')
                        .then(r => r.text());

//   const doc   = new DOMParser().parseFromString(html, 'text/html');
  const doc = new JSDOM(html).window.document;
  const rows  = doc.querySelectorAll('#churches > div');   // every church box

  const result = [];

  for (const r of rows) {
    /* minimal skeleton that you asked for */
    const obj = {
      type     : 'church',
      name     : r.querySelector('.churchName')?.outerHTML.trim() || '',
      location : r.querySelector('strong')?.outerHTML.trim()      || ''
    };

    /* pull extra K/V pairs hiding in loadDialog() */
    const a         = r.querySelector('a[onclick*="loadDialog"]');
    const extras    = parseLoadDialog(a?.getAttribute('onclick'));
    Object.assign(obj, extras);         // merge into the same object

    /* add the GPS tuple (may be empty when geocoder can’t resolve) */
    if (extras.Address) obj.position = await geocode(extras.Address);

    result.push(obj);
  }
  return result;
}

scrapeChurches().then(console.log);
