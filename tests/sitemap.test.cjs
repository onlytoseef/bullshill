// Real TS modules, controlled CMS/cache boundaries, no production DB writes.
(async () => {
  const { test } = await import('node:test');
  const assert = await import('node:assert/strict');
  const fs = await import('node:fs');
  const vm = await import('node:vm');
  const ts = await import('typescript');
  function load(file, dependencies = {}, logs = []) {
    const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    const loaded = { exports: {} };
    vm.runInNewContext(source, { module: loaded, exports: loaded.exports,
      require: name => { if (!(name in dependencies)) throw new Error(`Unexpected import ${name}`); return dependencies[name]; },
      console: Object.fromEntries(['info', 'warn', 'error'].map(level => [level, value => logs.push({ level, ...JSON.parse(value) })])),
    }, { filename: file });
    return loaded.exports;
  }
  const canonical = load('lib/site.ts');
  const post = (id, status = 'published') => ({ id, slug: `post-${id}`, updatedAt: '2026-11-24T00:00:00.000Z', _status: status });
  function reader(documents, { failBatch, unavailable, mutate } = {}) {
    const calls = [], logs = [];
    const cms = { find: async query => {
      calls.push(query); if (calls.length === failBatch) throw new Error('Synthetic DB failure');
      assert.equal(query.draft, false); assert.equal(query.overrideAccess, false); assert.equal(query.sort, 'id'); assert.equal(query.page, 1);
      assert.equal(query.where.and[0]._status.equals, 'published');
      const cursor = query.where.and[1]?.id.greater_than || 0;
      const remaining = documents.filter(d => d._status === 'published' && d.id > cursor).sort((a, b) => a.id - b.id);
      const docs = remaining.slice(0, query.limit); if (mutate) mutate(documents, calls.length);
      return { docs, hasNextPage: remaining.length > query.limit };
    } };
    const loaded = load('lib/cms/posts.ts', { 'next/cache': { unstable_cache: fn => fn }, './client': { getCms: async () => unavailable ? null : cms }, './media': {}, './text': {} }, logs);
    return { read: loaded.getPublishedPostEntries, calls, logs };
  }
  const content = { servicesPage: { items: Array.from({ length: 7 }, (_, i) => ({ slug: `service-${i}` })) }, caseStudiesPage: { items: Array.from({ length: 7 }, (_, i) => ({ slug: `case-${i}` })) } };
  const sitemap = (read, logs = []) => {
    let cacheOptions;
    const loaded = load('lib/sitemap.ts', {
      'next/cache': { unstable_cache: (fn, keys, options) => { cacheOptions = options; return fn; } },
      '@/lib/cms/posts': { getPublishedPostEntries: read }, '@/lib/content': content, '@/lib/site': canonical,
    }, logs);
    return { ...loaded, default: loaded.getCachedSitemap, cacheOptions };
  };
  await test('route waits for a real connection before using the data cache', async () => {
    const events = [];
    const route = load('app/sitemap.ts', {
      'next/server': { connection: async () => { events.push('connection'); await Promise.resolve(); events.push('connected'); } },
      '@/lib/sitemap': { getCachedSitemap: () => { assert.equal(events.at(-1), 'connected'); events.push('cache'); return []; } },
    });
    assert.equal(events.length, 0); await route.default(); assert.equal(events.join(','), 'connection,connected,cache');
  });
  await test('451 published posts traverse three batches; drafts excluded', async () => {
    const r = reader([...Array.from({ length: 451 }, (_, i) => post(i + 1)), post(452, 'draft')]);
    const entries = await r.read(); assert.equal(entries.length, 451); assert.equal(r.calls.length, 3);
    assert.equal(r.calls[1].where.and[1].id.greater_than, 200); assert.equal(r.calls[2].where.and[1].id.greater_than, 400);
    assert.equal(new Set(entries.map(p => p.slug)).size, 451);
  });
  await test('deleting an earlier row does not cause offset skips', async () => {
    const r = reader(Array.from({ length: 401 }, (_, i) => post(i + 1)), { mutate: (data, batch) => { if (batch === 1) data.shift(); } });
    const entries = await r.read(); assert.equal(entries.length, 401); assert.equal(entries.at(-1).slug, 'post-401');
  });
  await test('initialization and first/later query failures reject, never return partial results', async () => {
    await assert.rejects(reader([], { unavailable: true }).read, /initialization failed/);
    for (const failBatch of [1, 2]) {
      const r = reader(Array.from({ length: 250 }, (_, i) => post(i + 1)), { failBatch });
      await assert.rejects(r.read, /published-post query failed/); assert.ok(r.logs.some(l => l.event === 'sitemap.query_failed' && l.batch === failBatch));
    }
  });
  await test('successful zero published posts legitimately yields 22 URLs', async () => {
    const r = reader([post(1, 'draft')]), logs = []; assert.equal((await sitemap(r.read, logs).default()).length, 22);
    assert.equal(logs[0].blogCount, 0); assert.equal(logs[0].totalUrlCount, 22);
  });
  await test('eight blogs yield30 URLs, real lastmod, structured counts/timestamp and300s data cache', async () => {
    const r = reader(Array.from({ length: 8 }, (_, i) => post(i + 1))), logs = [], handler = sitemap(r.read, logs);
    assert.equal(handler.cacheOptions.revalidate, 300); assert.equal(handler.cacheOptions.tags[0], 'sitemap');
    const entries = await handler.default(); assert.equal(entries.length, 30);
    assert.equal(entries.at(-1).lastModified.toISOString(), '2026-11-24T00:00:00.000Z');
    assert.equal(logs[0].event, 'sitemap.generated'); assert.equal(logs[0].blogCount, 8); assert.equal(logs[0].totalUrlCount, 30);
    assert.ok(!Number.isNaN(Date.parse(logs[0].timestamp)));
  });
  await test('failed generation propagates; never logs successful22-URL generation', async () => {
    const logs = [], r = reader([], { failBatch: 1 }); await assert.rejects(sitemap(r.read, logs).default, /query failed/);
    assert.ok(logs.some(l => l.event === 'sitemap.generation_failed' && l.totalUrlCount === null)); assert.ok(!logs.some(l => l.event === 'sitemap.generated'));
  });
  await test('publish/update/unpublish/draft-save/slug rename invalidate after response', () => {
    for (const [before, after] of [['draft', 'published'], ['published', 'published'], ['published', 'draft'], ['draft', 'draft']]) {
      const paths = [], tags = [], callbacks = [], logs = [];
      const hooks = load('lib/payload/revalidate.ts', { 'next/cache': { revalidatePath: p => paths.push(p), revalidateTag: (t, profile) => tags.push([t, profile]) }, 'next/server': { after: cb => callbacks.push(cb) } }, logs);
      const doc = { slug: 'new-slug', _status: after }, previousDoc = { slug: 'old-slug', _status: before };
      assert.equal(hooks.revalidateBlogPost({ doc, previousDoc }), doc); assert.equal(paths.length, 0); assert.equal(callbacks.length, 1);
      callbacks[0](); assert.equal(paths.join(','), '/,/blog,/blog/new-slug,/blog/old-slug');
      assert.equal(tags[0][0], 'blog-posts'); assert.equal(tags[0][1].expire, 0); assert.equal(logs[0].event, 'sitemap.invalidated');
      assert.equal(tags[1][0], 'sitemap'); assert.equal(tags[1][1], 'max');
    }
  });
  await test('delete clears sitemap and deleted article after response', () => {
    const paths = [], callbacks = [];
    const hooks = load('lib/payload/revalidate.ts', { 'next/cache': { revalidatePath: p => paths.push(p), revalidateTag: () => {} }, 'next/server': { after: cb => callbacks.push(cb) } });
    hooks.revalidateBlogPostDelete({ doc: { slug: 'removed' } }); assert.equal(paths.length, 0); callbacks[0](); assert.equal(paths.join(','), '/,/blog,/blog/removed');
  });
  await test('robots declares canonical sitemap', () => { assert.equal(load('app/robots.ts', { '@/lib/site': canonical }).default().sitemap, 'https://bullshill.com/sitemap.xml'); });
})().catch(error => { console.error(error); process.exitCode = 1; });
