const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testReservation() {
  try {
    // Find a non-reserved idea
    const idea = await prisma.idea.findFirst({
      where: { isReserved: false },
      orderBy: { score: 'desc' }
    });

    if (!idea) {
      console.log('❌ No ideas found');
      return;
    }

    console.log('\n✅ Test idea found:');
    console.log('ID:', idea.id);
    console.log('Title:', idea.title);
    console.log('Reserved:', idea.isReserved);
    console.log('\n📝 To test reservation:');
    console.log(`1. Go to: http://localhost:3000/leaderboard`);
    console.log(`2. Click on idea #${idea.id}: "${idea.title}"`);
    console.log(`3. Enter email and click "RÉSERVER POUR 19€"`);
    console.log(`4. You'll be redirected to Stripe checkout (test mode)`);
    console.log(`5. Use test card: 4242 4242 4242 4242, any future date, any CVC`);
    
    console.log('\n🔍 Stripe config:');
    console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? '✅ Set' : '❌ Missing');
    console.log('STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? '✅ Set' : '❌ Missing');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testReservation();
