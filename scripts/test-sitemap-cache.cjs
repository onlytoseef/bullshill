/* Isolated real Next.js production cache test. Synthetic CMS only; never deploys.
   node scripts/test-sitemap-cache.cjs
   Fixture uses the actual sitemap, query and hook source with a2s test-only TTL.
*/
(async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const http = await import('node:http');
  const { spawn } = await import('node:child_process');
  const assert = await import('node:assert/strict');
  const root = process.cwd(), dir = path.resolve('.next-build-check/sitemap-cache-fixture');
  fs.mkdirSync(dir, { recursive: true });
  const write = (name, value) => { const file = path.join(dir, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, value); };
  const copy = name => write(name, fs.readFileSync(path.join(root, name)));
  const posts = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, slug: `post-${i + 1}`, _status: i < 8 ? 'published' : 'draft', updatedAt: '2026-11-24T00:00:00.000Z' }));
  const state = { available: true, fail: false, queries: 0, failures: 0 };
  const cms = http.createServer(async (req, res) => {
    let text = ''; for await (const chunk of req) text += chunk;
    const data = text ? JSON.parse(text) : {};
    res.setHeader('Content-Type', 'application/json');
    if (req.url === '/state') return res.end(JSON.stringify({ available: state.available }));
    if (req.url === '/commit') {
      await new Promise(resolve => setTimeout(resolve, data.holdMs || 0));
      const index = posts.findIndex(p => p.id === data.doc.id);
      if (data.operation === 'delete') posts.splice(index, 1);
      else if (index < 0) posts.push(data.doc); else posts[index] = data.doc;
      return res.end('{}');
    }
    state.queries++;
    if (state.fail) { state.failures++; res.statusCode = 503; return res.end('{"error":"synthetic query failure"}'); }
    const cursor = data.where.and[1]?.id.greater_than || 0;
    const rows = posts.filter(p => p._status === 'published' && p.id > cursor).sort((a, b) => a.id - b.id);
    res.end(JSON.stringify({ docs: rows.slice(0, data.limit), hasNextPage: rows.length > data.limit }));
  });
  await new Promise(resolve => cms.listen(0, '127.0.0.1', resolve));
  const endpoint = `http://127.0.0.1:${cms.address().port}`;
  const client = `import http from 'node:http';
export async function request(route:string, body?:unknown):Promise<any>{return new Promise((resolve,reject)=>{const req=http.request(${JSON.stringify(endpoint)}+route,{method:body?'POST':'GET',headers:{'Content-Type':'application/json'}},res=>{let text='';res.on('data',c=>text+=c);res.on('end',()=>res.statusCode===200?resolve(JSON.parse(text)):reject(new Error('Synthetic CMS503')))});req.on('error',reject);req.end(body?JSON.stringify(body):undefined)})}
export async function getCms(){const state=await request('/state');return state.available?{find:(query:unknown)=>request('/find',query)}:null}
`;
  write('lib/cms/client.ts', client);
  copy('lib/cms/posts.ts'); copy('lib/cms/types.ts'); copy('lib/payload/revalidate.ts'); copy('lib/site.ts');
  write('lib/cms/media.ts', 'export const mediaUrl = (value:string) => value;');
  write('lib/cms/text.ts', 'export const countWords = (_:unknown) => 1; export const lexicalHeadings = (_:unknown) => []; export const lexicalToPlainText = (_:unknown) => "";');
  write('lib/content.ts', 'export const servicesPage={items:Array.from({length:7},(_,i)=>({slug:`service-${i}`}))};export const caseStudiesPage={items:Array.from({length:7},(_,i)=>({slug:`case-${i}`}))};');
  const sitemapSource = fs.readFileSync('app/sitemap.ts', 'utf8').replace('export const revalidate = 300;', 'export const revalidate = 2;');
  write('app/sitemap.ts', sitemapSource); write('app/cold/[id]/sitemap.ts', sitemapSource);
  write('app/layout.tsx', 'export default function Layout({children}:{children:React.ReactNode}){return <html><body>{children}</body></html>}');
  write('app/api/mutate/route.ts', `import { revalidateBlogPost,revalidateBlogPostDelete } from '../../../lib/payload/revalidate';import {request} from '../../../lib/cms/client';
export async function POST(req:Request){const data=await req.json();if(data.operation==='delete')revalidateBlogPostDelete({doc:data.doc} as never);else revalidateBlogPost({doc:data.doc,previousDoc:data.previousDoc||{}} as never);await request('/commit',data);return Response.json({ok:true})}`);
  write('package.json', '{"private":true}');
  write('tsconfig.json', JSON.stringify({ compilerOptions: { target: 'ES2017', lib: ['dom','esnext'], jsx: 'preserve', module: 'esnext', moduleResolution: 'bundler', esModuleInterop: true, skipLibCheck: true, paths: { '@/*': ['./*'] } } }));
  write('next.config.mjs', `export default {turbopack:{root:${JSON.stringify(root)}},typescript:{ignoreBuildErrors:true}}`);
  const next = path.join(root, 'node_modules/next/dist/bin/next');
  const logFile = path.join(dir, 'test-server.log'); fs.writeFileSync(logFile, '');
  function launch(args) {
    const child = spawn(process.execPath, [next, ...args], { cwd: root, windowsHide: true, env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } });
    for (const stream of [child.stdout, child.stderr]) stream.on('data', bytes => fs.appendFileSync(logFile, bytes));
    return child;
  }
  let server;
  try {
    console.log('Building isolated fixture from actual sitemap/query/hooks...');
    const build = launch(['build', dir]);
    const code = await new Promise((resolve, reject) => { build.on('error', reject); build.on('exit', resolve); });
    if (code !== 0) throw new Error(`Fixture build failed. See ${logFile}`);
    const locator = http.createServer(); await new Promise(resolve => locator.listen(0, '127.0.0.1', resolve)); const port = locator.address().port; await new Promise(resolve => locator.close(resolve));
    server = launch(['start', dir, '--hostname', '127.0.0.1', '--port', String(port)]);
    const base = `http://127.0.0.1:${port}`, records = [];
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    for (let i = 0; i < 100; i++) { try { await fetch(base); break; } catch { await sleep(100); } }
    async function read(label, route = '/sitemap.xml') {
      const res = await fetch(base + route), body = await res.text();
      const item = { label, status: res.status, cache: res.headers.get('x-nextjs-cache'), count: (body.match(/<url>/g) || []).length, urls: [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]), lastModified: [...body.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(m => m[1]) };
      records.push(item); fs.writeFileSync(path.join(dir, 'results.json'), JSON.stringify(records, null, 2));
      if (res.status === 200) assert.notEqual(item.count, 22, 'Database failure must never produce cached static-only XML');
      return item;
    }
    async function untilCount(label, count, slug, lastModified) {
      for (let i = 0; i < 60; i++) { const item = await read(label); if (item.status === 200 && item.count === count && (!slug || item.urls.includes('https://bullshill.com/blog/' + slug)) && (!lastModified || item.lastModified.includes(lastModified))) return item; await sleep(200); }
      throw new Error(`Expected ${label}: ${count}`);
    }
    const mutate = data => fetch(base + '/api/mutate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(async r => { assert.equal(r.status, 200, await r.text()); });
    assert.equal((await read('baseline')).count, 30);
    state.fail = true; const failures = state.failures; await sleep(2300);
    assert.equal((await read('TTL query failure serves stale')).count, 30);
    for (let i = 0; i < 60 && state.failures === failures; i++) { await sleep(100); await read('awaiting actual failed regeneration'); }
    assert.ok(state.failures > failures, 'Must observe a real failed DB query, not just a cache HIT');
    await sleep(300); assert.equal((await read('retained after failed regeneration')).count, 30);
    assert.equal((await read('no prior successful cache', '/cold/uncached/sitemap.xml')).status, 500);
    state.fail = false;
    const draft = posts.find(p => p.id === 9), published = { ...draft, _status: 'published' };
    const pending = mutate({ operation: 'update', previousDoc: draft, doc: published, holdMs: 500 });
    assert.equal((await read('before synthetic commit')).count, 30); await pending;
    await untilCount('publish', 31, 'post-9');
    const renamed = { ...published, slug: 'renamed', updatedAt: '2026-11-25T00:00:00.000Z' };
    await mutate({ operation: 'update', previousDoc: published, doc: renamed });
    assert.ok(!(await untilCount('rename', 31, 'renamed')).urls.includes('https://bullshill.com/blog/post-9'));
    const updated = { ...renamed, updatedAt: '2026-11-26T00:00:00.000Z' };
    await mutate({ operation: 'update', previousDoc: renamed, doc: updated }); await untilCount('update', 31, 'renamed', '2026-11-26T00:00:00.000Z');
    await mutate({ operation: 'update', previousDoc: updated, doc: { ...updated, _status: 'draft' } }); await untilCount('unpublish', 30);
    await mutate({ operation: 'update', previousDoc: draft, doc: published }); await untilCount('republish', 31, 'post-9');
    await mutate({ operation: 'delete', doc: published }); await untilCount('delete', 30);
    state.fail = true;
    await mutate({ operation: 'update', previousDoc: posts[0], doc: { ...posts[0], updatedAt: '2026-11-27T00:00:00.000Z' } });
    await sleep(200); await read('hard invalidation failure first'); await sleep(200); await read('hard invalidation failure second');
    state.fail = false; state.available = false;
    assert.equal((await read('CMS initialization failure with no prior cache', '/cold/init-failure/sitemap.xml')).status, 500);
    state.available = true;
    assert.ok(records.every(r => !r.urls.some(u => u.endsWith('/post-10'))));
    const log = fs.readFileSync(logFile, 'utf8');
    assert.ok(log.includes('sitemap.generation_failed')); assert.ok(log.includes('sitemap.invalidated'));
    fs.writeFileSync(path.join(dir, 'passed.json'), JSON.stringify({ passed: true, timestamp: new Date().toISOString(), records: records.length, testOnlyRevalidateSeconds: 2, productionRevalidateSeconds: 300 }, null, 2));
    console.log('PASS: production ISR retains last success on TTL failure; no-cache failure is500; mutations, lastmod and draft exclusion verified.');
    console.log(JSON.stringify(records.map(({ label, status, cache, count }) => ({ label, status, cache, count })), null, 2));
  } finally { server?.kill(); await new Promise(resolve => cms.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
