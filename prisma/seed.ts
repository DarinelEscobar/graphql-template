import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Juan Pérez',
      email: 'sample@user',
      password: '123', //Hash me
      rol: 'USER',
    },
  })

  const admin = await prisma.user.create({
    data: {
      name: 'María Cocina',
      email: 'sample@admin',
      password: '1234', //Hash me
      rol: 'ADMIN',
    },
  })

  await prisma.product.createMany({
    data: [
      { name: 'Taco Supremo', userId: user.id },
      { name: 'Burrito Deluxe', userId: user.id },
      { name: 'Paella Gourmet', userId: admin.id },
      { name: 'Sopa Azteca', userId: admin.id },
    ],
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
