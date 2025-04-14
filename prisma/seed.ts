import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const salt = await bcrypt.genSalt(10)

  const user = await prisma.user.create({
    data: {
      name: 'Juan Pérez',
      email: 's@user.com',
      password: await bcrypt.hash('12', salt),
      rol: 'USER',
    },
  })

  const chef = await prisma.user.create({
    data: {
      name: 'María Cocina',
      email: 's@chef.com',
      password: await bcrypt.hash('12', salt),
      rol: 'CHEF',
    },
  })

  await prisma.product.createMany({
    data: [
      { name: 'Taco Supremo', userId: user.id },
      { name: 'Burrito Deluxe', userId: user.id },
      { name: 'Paella Gourmet', userId: chef.id },
      { name: 'Sopa Azteca', userId: chef.id },
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
