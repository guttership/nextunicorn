const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function simulateReservation() {
  const ideaId = 30;
  const testEmail = 'test@example.com';
  
  console.log(`\n🔒 Simulation de réservation pour l'idée #${ideaId}...\n`);
  
  const updated = await prisma.idea.update({
    where: { id: ideaId },
    data: {
      isReserved: true,
      reservedAt: new Date(),
      reservedBy: testEmail,
      reservationPrice: 19.0,
    },
  });
  
  console.log('✅ Idée réservée avec succès !');
  console.log('Title:', updated.title);
  console.log('Reserved:', updated.isReserved);
  console.log('Reserved By:', updated.reservedBy);
  console.log('Reserved At:', updated.reservedAt);
  console.log('Price:', updated.reservationPrice + '€');
  
  console.log('\n📋 Vérifications à faire :');
  console.log('1. Allez sur http://localhost:3000/leaderboard');
  console.log('2. L\'idée #30 ne devrait PLUS apparaître dans le classement');
  console.log('3. Le total d\'idées devrait être réduit de 1');
  
  console.log('\n🔄 Pour annuler la réservation (remettre l\'idée en ligne) :');
  console.log('   node scripts/reservations/unreserve-idea.js');
  
  await prisma.$disconnect();
}

simulateReservation();
