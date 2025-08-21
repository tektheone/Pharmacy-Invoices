const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Ensure a default settings row exists
  const existing = await prisma.setting.findFirst();
  if (!existing) {
    await prisma.setting.create({
      data: {
        theme: 'system',
        unitPriceThreshold: 10,
        cacheDurationHours: 24,
        fileSizeLimitBytes: 104857600,
        defaultExportFormat: 'pdf',
      },
    });
    console.log('Seeded default settings');
  } else {
    console.log('Settings already exist, skipping seed');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


