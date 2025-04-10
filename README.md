<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

#  GraphQL con NestJS, Prisma y MySQL

Este proyecto muestra cómo crear una API GraphQL con NestJS y Prisma, conectada a una base de datos MySQL. Además, se incluye configuración con Docker para la base de datos y un ejemplo de `seed` de datos.

---

## Requisitos Previos

- [Node.js](https://nodejs.org/en/) (versión recomendada LTS, 16+)
- [Nest CLI](https://docs.nestjs.com/cli/overview) (opcional para scaffolding rápido)
- [Docker y Docker Compose](https://docs.docker.com/compose/) (para la base de datos MySQL)
- [MySQL Workbench](https://www.mysql.com/products/workbench/) u otra herramienta (opcional, para administrar la DB gráficamente)

---

## Estructura de Carpetas (Ejemplo)

```
graphql-template
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

## Variables de Entorno

En la raíz del proyecto, debes tener un archivo `.env` con la URL de conexión a tu base de datos. Por ejemplo:

```bash
DATABASE_URL="mysql://root:@localhost:3306/name-db"
```

---

## Configuración de Base de Datos con Docker

En este proyecto se usa Docker para crear una instancia de MySQL localmente:

**docker-compose.yml**
```yaml
version: '3.8'
services:
  db:
    image: mysql:8.0
    container_name: name_mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: name-db
      MYSQL_USER: root
      MYSQL_PASSWORD: ""
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

Para iniciar la base de datos:

```bash
docker-compose up -d
```

Para detener y eliminar los contenedores:

```bash
docker-compose down
```

---

## Configuración de Prisma

### 1. Definir el Esquema en prisma/schema.prisma

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

### 2. Migrar la Base de Datos

```bash
npx prisma migrate dev --name init
```

### 3. Generar el Cliente Prisma

```bash
npx prisma generate
```

### 4. Insertar Datos Iniciales (Seed)

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

Ejecutar seed:

```bash
npx ts-node prisma/seed.ts
```

---

## Project Setup

```bash
npm install
```

---

## Compile and Run

```bash
# development
npm run start

# watch mode
npm run start:dev

# production
npm run start:prod
```

La aplicación se levantará en `http://localhost:3000`.

---

## GraphQL Playground

Navega a `http://localhost:3000/graphql`.

### Ejemplo de Query

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

### Consultar un usuario específico

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

## Notas Finales
Asegúrate de personalizar la configuración de DATABASE_URL y credenciales en .env según tu entorno.

Para entornos de producción, se recomienda no exponer contraseñas o credenciales directamente en el repositorio; utiliza secretos o servicios de gestión de configuraciones.

Si deseas contenerizar también la aplicación NestJS, puedes crear un Dockerfile adicional y ampliar tu docker-compose.yml para manejar ambos servicios (API y DB) de forma unificada.