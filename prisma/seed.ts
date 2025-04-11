import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Juan Pérez',
      email: 'juan@example.com',
    },
  });

  await prisma.product.createMany({
    data: [
      { name: 'Taco Supremo', userId: user.id },
      { name: 'Burrito Deluxe', userId: user.id },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
