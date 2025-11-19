const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function unreserveIdea() {
  const ideaId = 30;
  
  console.log(`\n🔓 Annulation de la réservation de l'idée #${ideaId}...\n`);
  
  const updated = await prisma.idea.update({
    where: { id: ideaId },
    data: {
      isReserved: false,
      reservedAt: null,
      reservedBy: null,
      reservationPrice: null,
    },
  });
  
  console.log('✅ Réservation annulée !');
  console.log('Title:', updated.title);
  console.log('Reserved:', updated.isReserved);
  
  console.log('\n📋 L\'idée est de nouveau disponible sur le site.');
  
  await prisma.$disconnect();
}

unreserveIdea();
