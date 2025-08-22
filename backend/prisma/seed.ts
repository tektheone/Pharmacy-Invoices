const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean up existing data
  await prisma.validationResult.deleteMany();
  await prisma.validation.deleteMany();
  await prisma.referenceDrugCache.deleteMany();

  console.log('🧹 Cleaned up existing data');

  // Seed some sample reference drug data
  const sampleDrugs = [
    {
      drugName: 'Aspirin',
      strength: '100mg',
      formulation: 'tablet',
      unitPrice: 0.15,
      payer: 'medicaid',
      sourceApi: 'mockapi',
    },
    {
      drugName: 'Ibuprofen',
      strength: '200mg',
      formulation: 'tablet',
      unitPrice: 0.25,
      payer: 'medicare',
      sourceApi: 'mockapi',
    },
    {
      drugName: 'Acetaminophen',
      strength: '500mg',
      formulation: 'tablet',
      unitPrice: 0.20,
      payer: 'medicaid',
      sourceApi: 'mockapi',
    },
  ];

  for (const drug of sampleDrugs) {
    await prisma.referenceDrugCache.create({
      data: drug,
    });
  }

  console.log('💊 Seeded sample reference drug data');

  console.log('✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


