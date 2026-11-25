/* Run after deploying: node scripts/verify-live-performance.cjs <lighthouse-cli> [staging-or-production-url] */
(async () => {
const fs = await import('node:fs');
const path = await import('node:path');
const { spawnSync } = await import('node:child_process');

const url = new URL(process.argv[3] || 'https://bullshill.com/').href;
const output = path.resolve('.next-build-check', `verification-${new URL(url).hostname}`);
fs.mkdirSync(output, { recursive: true });

// Refuse to label tests "after deployment" while the old loader is still live.
const response = spawnSync(process.platform === 'win32' ? 'curl.exe' : 'curl',
  ['--compressed', '--fail', '--max-time', '60', '--silent', '--show-error', url],
  { encoding: 'utf8', windowsHide: true, maxBuffer: 4 * 1024 * 1024 });
if (response.status !== 0) throw new Error(response.stderr || 'Cannot fetch live homepage.');
if (!response.stdout.includes('bullshill:essential-ready') || !response.stdout.includes('data-essential-ready')) {
  console.error('BLOCKED: the hydration-independent loader is not deployed. No post-deployment scores were recorded.');
  process.exitCode = 2;
} else {
  const cli = process.argv[2];
  if (!cli || !fs.existsSync(cli)) throw new Error('Pass the installed Lighthouse CLI index.js path.');
  const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
  const spread = values => {
    const center = median(values);
    return { median: center, min: Math.min(...values), max: Math.max(...values),
      standardDeviation: Math.sqrt(values.reduce((sum, value) => sum + (value - values.reduce((a, b) => a + b, 0) / values.length) ** 2, 0) / values.length) };
  };
  const summary = { url, measuredAt: new Date().toISOString(), cache: 'fresh browser and cleared storage for every Lighthouse run', suppliedBaseline: { mobile: 74, desktop: 98 }, runs: [], medians: {}, distributions: {} };
  for (const device of ['mobile', 'desktop']) {
    for (let run = 1; run <= 5; run++) {
      const file = path.join(output, `${device}-${run}.json`);
      const args = [cli, url, '--output=json', `--output-path=${file}`,
        '--only-categories=performance,accessibility,best-practices,seo',
        '--chrome-flags=--headless=new --no-sandbox', '--quiet', '--save-assets'];
      if (device === 'desktop') args.push('--preset=desktop');
      // Each CLI invocation starts a fresh browser and Lighthouse clears storage.
      const result = spawnSync(process.execPath, args, { windowsHide: true, stdio: 'inherit' });
      if (result.status !== 0) throw new Error(`Lighthouse failed: ${device} run ${run}.`);
      const report = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (report.runtimeError || report.categories.performance.score === null) {
        throw new Error(`Incomplete audit: ${device} run ${run}. No median will be claimed.`);
      }
      const record = { device, run, lighthouseVersion: report.lighthouseVersion,
        settings: report.configSettings, benchmarkIndex: report.environment.benchmarkIndex,
        performance: report.categories.performance.score * 100,
        accessibility: report.categories.accessibility.score * 100,
        bestPractices: report.categories['best-practices'].score * 100,
        seo: report.categories.seo.score * 100,
        fcpMs: report.audits['first-contentful-paint'].numericValue,
        lcpMs: report.audits['largest-contentful-paint'].numericValue,
        tbtMs: report.audits['total-blocking-time'].numericValue,
        cls: report.audits['cumulative-layout-shift'].numericValue,
        observedLcpMs: report.audits.metrics.details.items[0].observedLargestContentfulPaint,
        failedFrameworkRequests: (report.audits['network-requests'].details?.items || [])
          .filter(item => item.url.includes('/_next/static/') && (!item.finished || item.statusCode >= 400 || !item.statusCode))
          .map(item => ({ url: item.url, status: item.statusCode, finished: item.finished })),
        slowFrameworkRequests: (report.audits['network-requests'].details?.items || [])
          .filter(item => item.url.includes('/_next/static/') && item.url.includes('.js') && item.networkEndTime - item.networkRequestTime > 5000)
          .map(item => ({ url: item.url, durationMs: item.networkEndTime - item.networkRequestTime })) };
      summary.runs.push(record);
      fs.writeFileSync(path.join(output, 'summary.json'), JSON.stringify(summary, null, 2));
      console.log(JSON.stringify(record));
    }
    const runs = summary.runs.filter(r => r.device === device);
    summary.medians[device] = Object.fromEntries(
      ['performance', 'accessibility', 'bestPractices', 'seo', 'fcpMs', 'lcpMs', 'tbtMs', 'cls']
        .map(key => [key, median(runs.map(r => r[key]))]));
    summary.medians[device].performanceChange = summary.medians[device].performance - summary.suppliedBaseline[device];
    summary.distributions[device] = Object.fromEntries(['performance', 'lcpMs', 'tbtMs', 'cls'].map(key => [key, spread(runs.map(r => r[key]))]));
  }
  summary.lighthouseTargetsPassed = summary.medians.mobile.performance >= 90 && summary.medians.mobile.lcpMs <= 2500 && summary.medians.desktop.performance >= 95;
  summary.frameworkStallsObserved = summary.runs.some(run => run.slowFrameworkRequests.length > 0);
  summary.frameworkFailuresObserved = summary.runs.some(run => run.failedFrameworkRequests.length > 0);
  summary.releaseApproved = false; // Lighthouse cannot verify staging parity, native interactions or rollback availability.
  fs.writeFileSync(path.join(output, 'summary.json'), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary.medians, null, 2));
  if (!summary.lighthouseTargetsPassed || summary.frameworkStallsObserved || summary.frameworkFailuresObserved) process.exitCode = 3;
}
})().catch(error => { console.error(error.message); process.exitCode = 1; });
