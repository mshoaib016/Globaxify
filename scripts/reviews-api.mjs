import { readFile, mkdir, writeFile, rename } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

export function createReviewsApi(root) {
  const filename = process.env.REVIEWS_DATA_FILE || path.join(root, '.data', 'reviews.json');
  let writes = Promise.resolve();
  const limits = new Map();
  async function readReviews() {
    try {
      const value = JSON.parse(await readFile(filename, 'utf8'));
      if (!Array.isArray(value)) throw new Error('Invalid review storage');
      return value;
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw error;
    }
  }
  function reply(res, code, value) {
    res.writeHead(code, {'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff'});
    res.end(JSON.stringify(value));
  }
  return async function reviewsApi(req, res) {
    try {
      if (req.method === 'GET') {
        await writes;
        reply(res, 200, {reviews: (await readReviews()).slice(0,100)});
        return;
      }
      if (req.method !== 'POST') { res.setHeader('Allow','GET, POST'); reply(res,405,{error:'Method not allowed.'}); return; }
      if (req.headers.origin && new URL(req.headers.origin).host !== req.headers.host) { reply(res,403,{error:'Please submit from this website.'}); return; }
      if (!req.headers['content-type']?.startsWith('application/json')) { reply(res,415,{error:'Expected a JSON review.'}); return; }
      let body = '';
      for await (const chunk of req) {
        body += chunk;
        if (Buffer.byteLength(body)>8192) { reply(res,413,{error:'Your review is too long.'}); return; }
      }
      let input;
      try { input=JSON.parse(body); } catch { reply(res,400,{error:'Invalid review.'}); return; }
      if (!input || typeof input !== 'object') { reply(res,400,{error:'Invalid review.'}); return; }
      if (input.website) { reply(res,400,{error:'Unable to submit this review.'}); return; }
      const clean = value => typeof value==='string' ? value.trim().replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'') : '';
      const name=clean(input.name), location=clean(input.location), title=clean(input.title), text=clean(input.body), rating=input.rating;
      if (name.length<2 || name.length>60 || location.length>80 || title.length<3 || title.length>90 || text.length<10 || text.length>1200 || !Number.isInteger(rating) || rating<1 || rating>5) {
        reply(res,422,{error:'Please check your name, rating, title and review length.'}); return;
      }
      const address=req.socket.remoteAddress || 'local';
      const now=Date.now();
      for (const [key,entry] of limits) if (entry.until<now) limits.delete(key);
      const limit=limits.get(address) || {count:0,until:now+600000};
      if (limit.count>=6) { reply(res,429,{error:'You have posted several reviews. Please try again later.'}); return; }
      const review={id:randomUUID(), name, location, title, body:text, rating, sample:false, createdAt:new Date().toISOString()};
      limits.set(address,{...limit,count:limit.count+1});
      const save=writes.then(async()=>{
        const reviews=await readReviews();
        await mkdir(path.dirname(filename),{recursive:true});
        const temporary=filename+'.tmp';
        await writeFile(temporary,JSON.stringify([review,...reviews],null,2),'utf8');
        await rename(temporary,filename);
      });
      writes=save.catch(()=>{});
      await save;
      reply(res,201,{review});
    } catch {
      if (!res.headersSent) reply(res,503,{error:'Reviews could not be saved right now. Please try again.'});
      else res.end();
    }
  };
}
