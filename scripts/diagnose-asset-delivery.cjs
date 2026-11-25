/* Read-only VPS comparison. No authentication or environment secrets are read.
   node scripts/diagnose-asset-delivery.cjs http://127.0.0.1:3000 https://bullshill.com /_next/static/chunks/2_1mc84f1ajcg.js
   Change the origin port and asset path to match the running deployment.
   Run in the application container; results are JSON lines, five fresh connections per endpoint.
*/
(async () => {
  const http = await import('node:http');
  const https = await import('node:https');
  const { performance } = await import('node:perf_hooks');
  const { createHash } = await import('node:crypto');
  const { gunzipSync, brotliDecompressSync } = await import('node:zlib');
  const origin = new URL(process.argv[2] || 'http://127.0.0.1:3000');
  const publicURL = new URL(process.argv[3] || 'https://bullshill.com');
  const asset = process.argv[4] || '/_next/static/chunks/2_1mc84f1ajcg.js';
  if (!asset.startsWith('/_next/static/') || asset.includes('://')) throw new Error('Pass a /_next/static/ asset path.');
  async function probe(base, run, endpoint) {
    return new Promise(resolve => {
      const start = performance.now(), timings = {}, chunks = [];
      let bytes = 0, headers, status, protocol, finished = false, lastByte, response;
      const elapsed = () => Math.round((performance.now() - start) * 1000) / 1000;
      const done = error => {
        if (finished) return;
        finished = true;
        clearTimeout(deadline);
        let decodedBytes, sha256;
        if (!error) {
          try {
            let body = Buffer.concat(chunks);
            if (headers?.['content-encoding'] === 'gzip') body = gunzipSync(body);
            if (headers?.['content-encoding'] === 'br') body = brotliDecompressSync(body);
            decodedBytes = body.length; sha256 = createHash('sha256').update(body).digest('hex');
          } catch (failure) { error = String(failure); }
        }
        resolve({ endpoint, run, url: new URL(asset, base).href, measuredAt: new Date().toISOString(), complete: !error,
          error, status: status || 0, protocol, timingsMs: { ...timings, contentDownload: lastByte === undefined ? null : lastByte - timings.firstByte, total: elapsed() },
          receivedWireBodyBytes: bytes, decodedBytes, sha256,
          headers: Object.fromEntries(['cache-control', 'content-encoding', 'content-length', 'etag', 'server', 'age', 'via', 'x-cache', 'cf-cache-status'].filter(k => headers?.[k] !== undefined).map(k => [k, headers[k]])) });
      };
      const url = new URL(asset, base);
      const request = (url.protocol === 'https:' ? https : http).get(url,
        { agent: false, headers: { Host: publicURL.host, 'Accept-Encoding': 'gzip', 'User-Agent': 'BullShill-read-only-delivery-diagnostic' } }, res => {
          response = res; headers = res.headers; status = res.statusCode; protocol = res.httpVersion; timings.firstByte = elapsed();
          res.on('data', chunk => { bytes += chunk.length; lastByte = elapsed(); if (bytes <= 4 * 1024 * 1024) chunks.push(chunk); else request.destroy(new Error('Unexpected asset larger than 4 MiB.')); });
          res.on('end', () => done()); res.on('error', error => done(error.message)); res.on('aborted', () => done('Response aborted.'));
        });
      const deadline = setTimeout(() => { done('30-second deadline; received bytes are partial.'); response?.destroy(); request.destroy(); }, 30000);
      request.on('socket', socket => {
        socket.on('lookup', () => { timings.dnsEnd = elapsed(); });
        socket.on('connect', () => { timings.tcpConnected = elapsed(); });
        socket.on('secureConnect', () => { timings.tlsConnected = elapsed(); });
      });
      request.on('error', error => done(error.message));
    });
  }
  for (let run = 1; run <= 5; run++) {
    console.log(JSON.stringify(await probe(origin, run, 'origin-loopback')));
    console.log(JSON.stringify(await probe(publicURL, run, 'public-from-vps')));
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
