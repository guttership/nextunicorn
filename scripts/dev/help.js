#!/usr/bin/env node

const commands = {
  setup: {
    desc: "Configuration initiale du projet",
    steps: [
      "npm install",
      "Créer .env.local avec DATABASE_URL et GEMINI_API_KEY",
      "npx prisma migrate dev --name init",
      "npm run dev",
      "Visiter http://localhost:3000/api/seed",
    ],
  },
  build: {
    desc: "Construire le projet",
    cmd: "npm run build",
  },
  dev: {
    desc: "Lancer en développement",
    cmd: "npm run dev",
  },
  test: {
    desc: "Vérifier la compilation TypeScript",
    cmd: "npx tsc --noEmit",
  },
  seed: {
    desc: "Initialiser les idées du jour",
    cmd: "curl http://localhost:3000/api/seed",
  },
  db: {
    desc: "Vérifier la connexion DB",
    cmd: "npx prisma validate",
  },
  studio: {
    desc: "Ouvrir Prisma Studio",
    cmd: "npx prisma studio",
  },
};

if (process.argv[2] === "--help" || !process.argv[2]) {
  console.log("\nNextUnicorn - Aide");
  console.log("==================\n");
  Object.entries(commands).forEach(([key, value]) => {
    console.log(`  npm run ${key}`);
    if (value.desc) console.log(`    ${value.desc}`);
    if (value.cmd) console.log(`    $ ${value.cmd}`);
    console.log();
  });
  process.exit(0);
}

const cmd = commands[process.argv[2]];
if (!cmd) {
  console.error(`Commande inconnue: ${process.argv[2]}`);
  process.exit(1);
}

console.log(`${cmd.desc}...`);
if (cmd.steps) {
  cmd.steps.forEach((step) => console.log(`  - ${step}`));
} else if (cmd.cmd) {
  console.log(`  $ ${cmd.cmd}`);
}
