const { PrismaClient } = require('../generated/prisma');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

// 1. Setup the connection pool using your NeonDB URL from .env
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Initialize the adapter
const adapter = new PrismaPg(pool);

// 3. Initialize the Prisma Client with the adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = [
    'Shirts', 
    'T-shirts', 
    'Pants', 
    'Undergarments', 
    'Belts', 
    'Shoes'
  ];

  console.log('Seeding categories...');

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('Categories seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the connection when done
    await prisma.$disconnect();
  });