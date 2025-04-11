<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

# GraphQL API Template with NestJS, Prisma, and MySQL

This project is a boilerplate to build a GraphQL API using NestJS and Prisma, connected to a MySQL database. It includes a Docker setup for the database and an example `seed` script for initial data population.

---

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

## Docker Database Setup

Docker is used to create a local MySQL instance:

**docker-compose.yml**
```yaml
version: '3.8'
services:
  db:
    image: mysql:8.0
    container_name: graphql_mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: graphql-db
      MYSQL_USER: root
      MYSQL_PASSWORD: ""
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

Start the database:

```bash
docker-compose up -d
```

Stop and remove the containers:

```bash
docker-compose down
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
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
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
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: 'Juan Pérez',
      email: 'juan@example.com',
    },
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

### Example Query

```graphql
query {
  users {
    id
    name
    email
    createdAt
    updatedAt
  }
}
```

### Get a Specific User

```graphql
query {
  user(id: 1) {
    id
    name
    email
    createdAt
    updatedAt
  }
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
