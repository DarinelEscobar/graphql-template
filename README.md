<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

# GraphQL API Template with NestJS, Prisma, and MySQL

This project is a boilerplate to build a GraphQL API using NestJS and Prisma, connected to a MySQL database. It includes a Docker setup for the database and an example `seed` script for initial data population.

---


## 🔥 Features (Updated)

- ✅ JWT Authentication (Access + Refresh Tokens)
- ✅ Role-Based Access Control using `@Roles` decorator and `RolesGuard`
- ✅ Create Account and Login mutations with secure password hashing (bcrypt)
- ✅ Refresh Token Mutation
- ✅ Public GraphQL Queries: `users`, `user(id)`
- ✅ Protected Queries:
  - `products`: Requires `CHEF` role
  - `productsByUser`: Requires `USER` or `CHEF` role
- ✅ Global Rate Limiting via Throttler (custom `GqlThrottlerGuard`)


## Prerequisites

- [Node.js](https://nodejs.org/en/) (recommended LTS version, 16+)
- [Nest CLI](https://docs.nestjs.com/cli/overview) (optional, for quick scaffolding)
- [Docker and Docker Compose](https://docs.docker.com/compose/) (for the MySQL database)
- [MySQL Workbench](https://www.mysql.com/products/workbench/) or any other DB GUI tool (optional)

---

## Folder Structure (Example)

```
graphql-api-template
├── docker-compose.yml
├── .env
├── package.json
├── prisma
│   ├── schema.prisma
│   └── seed.ts
├── src
│   ├── app.module.ts
│   ├── main.ts
│   └── user
│       ├── user.module.ts
│       ├── user.resolver.ts
│       ├── user.service.ts
│       └── user.type.ts
├── tsconfig.json
└── ...
```

---

## Environment Variables

In the root directory, create a `.env` file with your database connection URL, for example:

```bash
DATABASE_URL="mysql://root:@localhost:3306/graphql-db"
```

---




## Prisma Setup

### 1. Define the schema in prisma/schema.prisma

```prisma 

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  rol       String   @default("USER")  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  products  Product[]
}

model Product {
  id        Int      @id @default(autoincrement())
  name      String
  userId    Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id])
}



```

### 2. Run Database Migration

```bash
npx prisma migrate dev --name init
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Seed Initial Data

**prisma/seed.ts**
```ts
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

```

Run the seed:

```bash
npx ts-node prisma/seed.ts
```

---

## Project Setup

```bash
npm install
```

---

## Run the Project

```bash
# development
npm run start

# watch mode
npm run start:dev

# production
npm run start:prod
```

The app will be running at `http://localhost:3000`.

---
## GraphQL Playground

Go to `http://localhost:3000/graphql`.

---

## Example Auth Mutations

### 🚀 Create Account

```graphql
mutation {
  createAccount(data: { name: "Juan", email: "juan@example.com", password: "1234" }) {
    accessToken
    userId
    rol
    refreshToken
  }
}
```

### 🔐 Login

```graphql
mutation {
  login(data: { email: "juan@example.com", password: "1234" }) {
    accessToken
    userId
    rol
    refreshToken
  }
}
```

### 🔄 Refresh Token

```graphql
mutation {
  refreshToken(refreshToken: "yourRefreshTokenHere") {
    accessToken
    userId
    rol
    refreshToken
  }
}
```

## Role-based GraphQL Query Protection

| Query              | Roles Required | Description                         |
|-------------------|----------------|-------------------------------------|
| `users`           | ❌ Public      | Get all users                       |
| `user(id)`        | ❌ Public      | Get user by ID                      |
| `products`        | ✅ CHEF only   | Get all products                    |
| `productsByUser`  | ✅ USER, CHEF  | Get products by user ID             |

> ⚠️ `products` and `productsByUser` require an `Authorization` header with a valid token. Don’t even try without it:
```json
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

---

## Run Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

---

## Deployment

```bash
npm install -g @nestjs/mau
mau deploy
```

---

## Final Notes

Make sure to customize the `.env` configuration and never commit sensitive credentials. For production, use secret management tools and containerize the API if needed alongside the DB.
