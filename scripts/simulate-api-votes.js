const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

if (process.argv.length < 3) {
  console.error('Usage: node simulate-api-votes.js <ideaId> [count]');
  process.exit(1);
}
const ideaId = parseInt(process.argv[2], 10);
const count = parseInt(process.argv[3] || '60', 10);

async function run() {
  for (let i = 0; i < count; i++) {
    const voterId = uuidv4();
    // Choose a random opponent id; in this test choose any id != ideaId
    const opponent = ideaId === 1 ? 2 : 1; // quick pick
    const resp = await fetch('http://localhost:3000/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winnerId: ideaId, loserId: opponent, voterId }),
    });
    const data = await resp.json();
    if (!resp.ok) console.error('Vote error', i, data);
  }
  console.log('done');
}

run();
