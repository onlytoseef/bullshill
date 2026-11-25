/* Read-only HTTP/1.1 response-progress probe. No credentials/configuration are read.
   External: node scripts/trace-delivery.cjs --label external --target https://bullshill.com --paths /,/_next/static/chunks/2_1mc84f1ajcg.js
   Application container: same command with --label application --target http://bullshill.com --connect 127.0.0.1:3000
   VPS local Traefik: same command with --label traefik --target https://bullshill.com --connect 127.0.0.1:443
   --connect changes only the socket destination; Host and TLS SNI remain the target domain.
   Use actual container/proxy ports. Traefik localhost means the VPS host, not the application container.
   Outputs public response bodies, sanitized headers, per-arrival byte counts, decoded HTML markers and a timing summary.
   Data events are client stream deliveries, NOT TCP packets or Next.js server flush boundaries.
*/
(async () => {
  const http = await import('node:http');
  const https = await import('node:https');
  const fs = await import('node:fs');
  const path = await import('node:path');
  const zlib = await import('node:zlib');
  const crypto = await import('node:crypto');
  const { performance, monitorEventLoopDelay } = await import('node:perf_hooks');
  const options = {};
  for (let i = 2; i < process.argv.length; i += 2) {
    if (!process.argv[i].startsWith('--') || process.argv[i + 1] === undefined) throw new Error('Use --option value pairs.');
    options[process.argv[i].slice(2)] = process.argv[i + 1];
  }
  const target = new URL(options.target || 'https://bullshill.com');
  if (!['http:', 'https:'].includes(target.protocol) || target.username || target.password) throw new Error('Use an HTTP(S) URL without credentials.');
  const label = options.label || 'external';
  if (!/^[a-z0-9-]+$/i.test(label)) throw new Error('Use a simple alphanumeric label.');
  const output = path.resolve(options.out || '.next-build-check/streaming-investigation', label);
  const runs = Number(options.runs || 1), timeout = Number(options.timeout || 150000);
  if (!Number.isInteger(runs) || runs < 1 || runs > 5 || !Number.isFinite(timeout) || timeout < 1000 || timeout > 180000) throw new Error('Runs1–5, timeout1000–180000ms.');
  const encoding = options.encoding || 'gzip';
  if (!['gzip', 'identity'].includes(encoding)) throw new Error('Encoding must be gzip or identity.');
  const paths = (options.paths || '/,/_next/static/chunks/2_1mc84f1ajcg.js').split(',');
  if (paths.some(p => p !== '/' && !p.startsWith('/_next/static/'))) throw new Error('Only homepage and public static paths are supported.');
  const destination = options.connect ? new URL(`${target.protocol}//${options.connect}`) : target;
  fs.mkdirSync(output, { recursive: true });
  const allowedHeaders = new Set(['date','server','content-type','content-length','content-encoding','transfer-encoding','cache-control','etag','last-modified','age','via','vary','server-timing','x-cache','x-cache-status','cf-cache-status','x-nextjs-cache','x-powered-by','x-accel-buffering','accept-ch','critical-ch','alt-svc']);
  const results = [];
  async function probe(resource, run, index) {
    return new Promise(resolve => {
      const start = performance.now(), startedAt = new Date().toISOString(), chunks = [], rawChunks = [], decodedChunks = [], markers = [], transport = [], transportChunks = [];
      const loopDelay = monitorEventLoopDelay({ resolution: 20 }); loopDelay.enable();
      let transportBytes = 0;
      const timings = {}, filename = `${run}-${index}-${encoding}`;
      let wire = 0, decoded = 0, response, decoder, status = 0, protocol, headers = {}, remote, finished = false, deadline, pulse, request;
      let accumulated = '', lastRawAt = null, longestGap = 0;
      const elapsed = () => Math.round((performance.now() - start) * 1000) / 1000;
      const persist = result => {
        fs.writeFileSync(path.join(output, filename + '.json'), JSON.stringify(result, null, 2));
        fs.writeFileSync(path.join(output, filename + '.raw'), Buffer.concat(rawChunks));
        fs.writeFileSync(path.join(output, filename + '.decoded'), Buffer.concat(decodedChunks));
      };
      const finish = error => {
        if (finished) return;
        finished = true; clearTimeout(deadline); clearInterval(pulse);
        loopDelay.disable();
        const total = elapsed();
        const framing = [];
        if (String(headers['transfer-encoding']).includes('chunked')) {
          const message = Buffer.concat(transportChunks), headerEnd = message.indexOf('\r\n\r\n');
          const arrival = offset => transport.find(e => e.cumulative >= offset)?.atMs;
          let position = headerEnd + 4;
          if (headerEnd >= 0) while (position < message.length) {
            const lineEnd = message.indexOf('\r\n', position); if (lineEnd < 0) break;
            const sizeText = message.subarray(position, lineEnd).toString('ascii').split(';')[0];
            if (!/^[0-9a-f]+$/i.test(sizeText)) break;
            const size = parseInt(sizeText, 16), dataEnd = lineEnd + 2 + size;
            if (dataEnd + 2 > message.length) break;
            framing.push({ size, headerArrivedMs: arrival(lineEnd + 2), dataCompleteMs: arrival(dataEnd), trailingCrlfArrivedMs: arrival(dataEnd + 2) });
            if (!size) break; position = dataEnd + 2;
          }
        }
        const result = { label, run, url: new URL(resource, target).href, socketDestination: { hostname: destination.hostname, port: destination.port || (target.protocol === 'https:' ? 443 : 80) }, startedAt, complete: !error, error, status, protocol, remote, encodingRequested: encoding, headers,
          timingsMs: { ...timings, total, downloadIncludingIdle: status ? total - timings.headers : null, longestObservedRawGap: longestGap, idleAfterLastRaw: lastRawAt === null ? null : total - lastRawAt }, wireBodyBytes: wire, decodedBytes: decoded,
          sha256: !error ? crypto.createHash('sha256').update(Buffer.concat(decodedChunks)).digest('hex') : null, chunks, markers, transportArrivals: transport, httpTransferChunks: framing,
          clientEventLoopDelayMs: { max: loopDelay.max / 1e6, p99: loopDelay.percentile(99) / 1e6 },
          interpretation: 'Arrival events are client-side stream observations. They cannot alone distinguish application flush timing from proxy/network delay. Missing phases are unavailable, not zero.' };
        persist(result); resolve(result);
      };
      const consume = data => {
        decoded += data.length; if (decoded > 8 * 1024 * 1024) { finish('Decoded response exceeds8MiB limit.'); request.destroy(); return; }
        decodedChunks.push(data); chunks.push({ kind: 'decoded', atMs: elapsed(), bytes: data.length, cumulative: decoded });
        if (resource === '/') {
          accumulated = Buffer.concat(decodedChunks).toString('utf8');
          for (const [name, expression] of [['doctype',/<!doctype/i],['body',/<body\b/i],['headEnd',/<\/head>/i],['h1',/<h1\b/i],['essentialReady',/data-essential-ready/],['bootstrap',/bullshill:essential-ready/],['bodyEnd',/<\/body>/i],['htmlEnd',/<\/html>/i],['pendingSuspense',/<!--\$\?-->/],['streamSegment',/id="S:/],['streamCompleteInstruction',/\$RC\(/]]) {
            if (!markers.some(m => m.name === name)) { const match = expression.exec(accumulated); if (match) markers.push({ name, decodedCharacterOffset: match.index, atMs: elapsed() }); }
          }
        }
      };
      const headersSent = { Host: target.host, 'Accept-Encoding': encoding, 'Cache-Control': 'no-cache', Pragma: 'no-cache', 'User-Agent': 'BullShill-read-only-stream-diagnostic' };
      request = (target.protocol === 'https:' ? https : http).request({ hostname: destination.hostname, port: destination.port || (target.protocol === 'https:' ? 443 : 80), servername: target.hostname, method: 'GET', path: resource, headers: headersSent, agent: false }, res => {
        response = res; status = res.statusCode; protocol = res.httpVersion; remote = { address: res.socket.remoteAddress, port: res.socket.remotePort };
        headers = Object.fromEntries(Object.entries(res.headers).filter(([name]) => allowedHeaders.has(name))); timings.headers = elapsed();
        console.log(JSON.stringify({ event: 'headers', label, run, resource, atMs: timings.headers, status, headers }));
        const format = res.headers['content-encoding'];
        decoder = format === 'gzip' ? zlib.createGunzip() : format === 'br' ? zlib.createBrotliDecompress() : null;
        res.on('data', data => {
          const at = elapsed(); if (timings.firstRawBody === undefined) timings.firstRawBody = at;
          longestGap = Math.max(longestGap, at - (lastRawAt ?? timings.headers)); lastRawAt = at; wire += data.length;
          if (wire > 8 * 1024 * 1024) { finish('Wire response exceeds8MiB limit.'); request.destroy(); return; }
          rawChunks.push(data); chunks.push({ kind: 'raw', atMs: at, bytes: data.length, cumulative: wire }); if (!decoder) consume(data);
        });
        res.on('end', () => { timings.rawEnd = elapsed(); if (!decoder) finish(); });
        res.on('aborted', () => finish('Response aborted before completion.')); res.on('error', e => finish(e.message));
        if (decoder) { decoder.on('data', consume); decoder.on('end', () => { timings.decodedEnd = elapsed(); finish(); }); decoder.on('error', e => finish(e.message)); res.pipe(decoder); }
      });
      request.on('socket', socket => {
        socket.on('data', data => { transportBytes += data.length; if (transportBytes <= 9 * 1024 * 1024) transportChunks.push(data); transport.push({ atMs: elapsed(), bytes: data.length, cumulative: transportBytes }); });
        socket.on('lookup', () => { timings.dnsEnd = elapsed(); }); socket.on('connect', () => { timings.tcpConnected = elapsed(); }); socket.on('secureConnect', () => { timings.tlsConnected = elapsed(); });
      });
      request.on('finish', () => { timings.requestSent = elapsed(); }); request.on('error', e => finish(e.message));
      deadline = setTimeout(() => { finish('Deadline exceeded; stored body is partial.'); response?.destroy(); decoder?.destroy(); request.destroy(); }, timeout);
      pulse = setInterval(() => { console.log(JSON.stringify({ event: 'progress', label, run, resource, atMs: elapsed(), wireBodyBytes: wire, decodedBytes: decoded, idleSinceLastRawMs: lastRawAt === null ? null : elapsed() - lastRawAt })); }, 5000);
      request.end();
    });
  }
  for (let run = 1; run <= runs; run++) for (let index = 0; index < paths.length; index++) {
    const result = await probe(paths[index], run, index); results.push(result);
    fs.writeFileSync(path.join(output, 'summary.json'), JSON.stringify(results, null, 2));
    console.log(JSON.stringify({ event: 'complete', ...result, chunks: undefined, markers: result.markers }));
  }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
