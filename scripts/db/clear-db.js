const { Client } = require('pg');

async function clearDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    console.log('Deleting votes...');
    const votesResult = await client.query('DELETE FROM "Vote"');
    console.log(`Deleted ${votesResult.rowCount} votes`);

    console.log('Deleting translations...');
    const translationsResult = await client.query('DELETE FROM "IdeaTranslation"');
    console.log(`Deleted ${translationsResult.rowCount} translations`);

    console.log('Deleting ideas...');
    const ideasResult = await client.query('DELETE FROM "Idea"');
    console.log(`Deleted ${ideasResult.rowCount} ideas`);

    console.log('Database cleared successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

clearDatabase();
