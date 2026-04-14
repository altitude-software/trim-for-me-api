<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running Locally with Docker

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+
- Copy `.env.example` to `.env` and fill in your values

### Start the database

```bash
docker compose up -d
```

This starts two PostgreSQL containers:
- `trim-for-me-db` on `DB_PORT` — development database
- `trim-for-me-db-test` on `DB_TEST_PORT` — test database (used only for integration tests)

Verify they are running:
```bash
docker compose ps
```

### Run migrations

```bash
npm run migration:run
```

> Migrations only apply to the development database. The test database manages its schema automatically via `synchronize: true` during test runs.

### Start the API

```bash
npm run start:dev
```

---

## Migrations

Migrations live in `src/shared/infrastructure/database/migrations/` and are the only way the schema is created or modified in development and production (`synchronize: false`).

### Daily workflow

```bash
# 1. Start the database
docker compose up -d

# 2. After modifying a TypeORM entity, generate a new migration
npm run migration:generate src/shared/infrastructure/database/migrations/DescriptiveName

# 3. Apply pending migrations
npm run migration:run

# Undo the last migration if something went wrong
npm run migration:revert
```

### Available scripts

| Script | Description |
|---|---|
| `migration:generate` | Compares entities against DB and generates the diff as a `.ts` file |
| `migration:run` | Executes all pending migrations |
| `migration:revert` | Undoes the last executed migration |

---

## API Documentation

This project uses **Swagger / OpenAPI** to document all available endpoints.

### Accessing the docs

Start the server and open the following URL in your browser:

```
http://localhost:3000/api/docs
```

### Available tags

| Tag | Description |
|-----|-------------|
| `auth` | Authentication — login and JWT token retrieval |
| `users` | User registration and management |
| `job-offers` | Job offer creation and management |

### Authenticating in Swagger UI

Most endpoints require a JWT token. To authenticate:

1. Call `POST /auth/login` with your credentials
2. Copy the token from the response
3. Click the **Authorize** button (🔒) at the top right of the Swagger UI
4. Paste the token and click **Authorize**

All subsequent requests from Swagger UI will include the token automatically.

---

## Run tests

```bash
# Unit tests
$ npm run test

# Unit tests in watch mode
$ npm run test:watch

# Integration tests (requires Docker running)
$ npm run test:integration

# Integration tests in watch mode
$ npm run test:integration:watch

# Test coverage
$ npm run test:cov

# e2e tests
$ npm run test:e2e
```

### Test strategy

| Type | Scope | Database |
|---|---|---|
| Unit | Use cases, domain logic | None (mocks) |
| Integration | TypeORM repositories | `trim_for_me_test` via Docker |
| e2e | Full application | TBD |

> Integration tests require both Docker containers to be running (`docker compose up -d`). The test database schema is managed automatically — no migrations needed.

---

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Discord channel](https://discord.gg/G7Qnnhy)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).