const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkReservation() {
  const idea = await prisma.idea.findUnique({ where: { id: 30 } });
  console.log('\n📊 Idea #30 status:');
  console.log('Title:', idea.title);
  console.log('Reserved:', idea.isReserved);
  console.log('Reserved By:', idea.reservedBy || 'N/A');
  console.log('Reserved At:', idea.reservedAt || 'N/A');
  
  if (!idea.isReserved) {
    console.log('\n⚠️  Le webhook Stripe n\'a pas été déclenché.');
    console.log('En mode local, le webhook ne fonctionne pas automatiquement.');
    console.log('\nPour tester en local, vous devez :');
    console.log('1. Installer Stripe CLI: https://stripe.com/docs/stripe-cli');
    console.log('2. Lancer: stripe listen --forward-to localhost:3000/api/webhooks/stripe');
    console.log('3. Refaire un paiement test');
    console.log('\nOu marquer manuellement l\'idée comme réservée pour tester l\'UI.');
  }
  
  await prisma.$disconnect();
}

checkReservation();
