import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { mkdtemp, unlink, rmdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createReviewsApi } from './reviews-api.mjs';

test('customer reviews validate, persist and remain consistent across concurrent submissions', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'globaxify-review-test-'));
  const filename = path.join(directory, 'reviews.json');
  const previous = process.env.REVIEWS_DATA_FILE;
  process.env.REVIEWS_DATA_FILE = filename;
  const handler = createReviewsApi(directory);
  if (previous === undefined) delete process.env.REVIEWS_DATA_FILE;
  else process.env.REVIEWS_DATA_FILE = previous;
  const server = http.createServer(handler);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const input = {name:'Test customer', location:'Test company', rating:4, title:'A useful experience', body:'Clear communication throughout the project.'};
  const post = (value, extra = {}) => fetch(base, {method:'POST', headers:{'Content-Type':'application/json', ...extra}, body:JSON.stringify(value)});
  try {
    assert.deepEqual(await (await fetch(base)).json(), {reviews:[]});
    assert.equal((await post({...input, rating:6})).status,422);
    assert.equal((await post({...input, rating:[5]})).status,422);
    assert.equal((await post({...input, body:'short'})).status,422);
    assert.equal((await post({...input, website:'spam'})).status,400);
    assert.equal((await post(input, {Origin:'https://unrelated.example'})).status,403);
    const first = await post(input);
    assert.equal(first.status,201);
    const saved = (await first.json()).review;
    assert.equal(saved.name,input.name);
    assert.equal(saved.rating,4);
    assert.equal(saved.sample,false);
    assert.ok(saved.id && saved.createdAt);
    const concurrent = await Promise.all([post({...input,name:'Second customer'}),post({...input,name:'Third customer'})]);
    assert.ok(concurrent.every(response=>response.status===201));
    const list = (await (await fetch(base)).json()).reviews;
    assert.equal(list.length,3);
    assert.equal(new Set(list.map(review=>review.id)).size,3);
    // A new API instance uses the persisted file, independent of process memory.
    process.env.REVIEWS_DATA_FILE=filename;
    const reloaded=createReviewsApi(directory);
    if(previous===undefined)delete process.env.REVIEWS_DATA_FILE;else process.env.REVIEWS_DATA_FILE=previous;
    let diskResponse;
    await reloaded({method:'GET'}, {writeHead(){},end(body){diskResponse=JSON.parse(body);}});
    assert.equal(diskResponse.reviews.length,3);
    assert.ok(diskResponse.reviews.some(review=>review.id===saved.id));
    for(let index=0;index<3;index++)assert.equal((await post(input)).status,201);
    assert.equal((await post(input)).status,429);
    assert.equal((await fetch(base,{method:'DELETE'})).status,405);
    assert.equal((await fetch(base,{method:'POST',headers:{'Content-Type':'application/json'},body:'{bad'})).status,400);
  } finally {
    await new Promise(resolve=>server.close(resolve));
    await unlink(filename).catch(error=>{if(error.code!=='ENOENT')throw error;});
    await rmdir(directory);
  }
});
