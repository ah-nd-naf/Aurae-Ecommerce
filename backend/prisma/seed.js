const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Cleaning database...');
  // Deleting in this order prevents foreign key constraint errors
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  console.log('Seeding categories...');
  const categoryNames = ['Shirts', 'T-shirts', 'Pants', 'Undergarments', 'Belts', 'Shoes'];
  const categoryMap = {};

  for (const name of categoryNames) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categoryMap[name] = cat.id;
  }

  const products = [
  {
    name: "Essential Heavyweight Tee",
    description: "A perfect boxy fit made from 100% organic heavyweight cotton. Designed for a lifetime of wear.",
    basePrice: 35.00,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1000",
    category: "T-shirts"
  },
  {
    name: "Classic Sage Button-Up",
    description: "Premium linen shirt in our signature Aurae sage for a timeless, breathable silhouette.",
    basePrice: 55.00,
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=1000",
    category: "Shirts"
  },
  {
    name: "Tailored Stone Chinos",
    description: "Italian cotton chinos featuring a refined tapered leg and signature hardware.",
    basePrice: 85.00,
    imageUrl: "https://images.unsplash.com/photo-1584865288642-42078afe6942?auto=format&fit=crop&q=80&w=1000",
    category: "Pants"
  },
  {
    name: "Supima Cotton Boxers",
    description: "The foundation of the modern wardrobe. Ultra-soft Supima cotton with a seamless finish.",
    basePrice: 25.00,
    imageUrl: "https://images.unsplash.com/photo-1690527434383-cbc859595d7b?auto=format&fit=crop&q=80&w=1000",
    category: "Undergarments"
  },
  {
    name: "Classic Leather Belt",
    description: "Full-grain vegetable-tanned leather with a minimalist brushed nickel buckle.",
    basePrice: 65.00,
    imageUrl: "https://images.unsplash.com/photo-1664286074240-d7059e004dff?auto=format&fit=crop&q=80&w=1000",
    category: "Belts"
  },
  {
    name: "Minimalist Leather Trainers",
    description: "Handcrafted white leather trainers with a natural gum sole and waxed cotton laces.",
    basePrice: 125.00,
    imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=1000",
    category: "Shoes"
  }
];

  console.log('Seeding products and variants...');
  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        basePrice: p.basePrice,
        imageUrl: p.imageUrl,
        categoryId: categoryMap[p.category],
        variants: {
          create: [
            { size: "S", color: "Neutral", stock: 10 },
            { size: "M", color: "Neutral", stock: 20 },
            { size: "L", color: "Neutral", stock: 15 }
          ]
        }
      }
    });
  }

  console.log('Seeding complete! 6 products and categories added.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });