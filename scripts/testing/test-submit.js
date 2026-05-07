const fetch = global.fetch || require('node-fetch');

async function postIdea(i) {
  const payload = {
    title: `Test Idea ${Date.now()} ${i}`,
    slogan: "Quick test slogan",
    description: "Long enough description to pass the min length check and test translation fallback.",
    audience: "indie-dev",
  };

  const res = await fetch('http://localhost:3000/api/ideas/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({ status: 'invalid json' }));
  return { status: res.status, body: json };
}

async function run() {
  console.log('Running 4 submissions to test rate limiting (max 3 per hour)...');
  for (let i = 1; i <= 4; i++) {
    const r = await postIdea(i);
    console.log(`Attempt ${i}: status=${r.status}`, r.body);
  }

  console.log('\nTesting missing fields (should return 400):');
  const res = await fetch('http://localhost:3000/api/ideas/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'No slogan', description: 'missing slogan' }),
  });
  console.log('Missing fields status=', res.status);
  console.log(await res.json().catch(() => ({})));
}

run().catch((e) => { console.error('Test run failed', e); process.exit(1); });
