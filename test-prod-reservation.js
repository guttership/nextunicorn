const https = require('https');

// Simuler une réservation en production en appelant directement l'endpoint de test
const data = JSON.stringify({
  ideaId: 30,
  email: "test@nextunicorn.app"
});

const options = {
  hostname: 'nextunicorn.app',
  port: 443,
  path: '/api/test-webhook',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('🔒 Réservation de l\'idée #30 en PRODUCTION...\n');

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', responseData);
    
    if (res.statusCode === 200) {
      console.log('\n✅ Idée réservée avec succès !');
      console.log('📋 Rechargez https://nextunicorn.app/leaderboard');
      console.log('    L\'idée #30 devrait avoir disparu.');
    } else {
      console.log('\n❌ Erreur lors de la réservation');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Erreur:', error);
});

req.write(data);
req.end();
