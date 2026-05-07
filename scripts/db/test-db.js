const { Client } = require("pg");

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "postgres",
  database: "nextunicorn",
});

client
  .connect()
  .then(() => {
    console.log("✓ Connected to PostgreSQL");
    return client.query("SELECT NOW()");
  })
  .then((res) => {
    console.log("✓ Query successful:", res.rows[0]);
    process.exit(0);
  })
  .catch((err) => {
    console.error("✗ Connection failed:", err.message);
    process.exit(1);
  });
