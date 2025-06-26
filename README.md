# REST API Template

Starter code for a NestJS RESTful API.

## Techstach

- NestJS v11
- Node.js v22
- TypeScript v5
- Postgres v13.3

## Highlights

1. **Simple & Easy to Modify**: The codebase closely follows the standard NestJS TypeScript starter, minimizing customizations. This makes it straightforward to understand, with no learning curve, and easy to extend for new features.
2. **Dockerfile & Docker Compose**: Easily run the application locally with one command.
3. **VS Code Setting**: Includes recommended VS Code settings, tasks, and extensions for a smooth developer experience.
4. **Prettier Configuration**: Enforces consistent code formatting across the project.
5. **Jest Configuration**: Configured for both unit and e2e testing.
6. **ESLint Configuration**: Ensures code quality and consistency with customizable linting rules.
7. **Automatic Code Linting**: Lints code automatically before each commit to prevent errors from entering the codebase.
8. **Automatic Commit Message Linting**: Enforces commit message standards to follow the conventional commit format.
9. **Sample CRUD code**: Provides example code for a typical Create, Read, Update, Delete (CRUD) API (see `todo` module).
10. **Sample Authentication code**: Includes sample authentication logic using email and password (see `auth` module).
11. **Automated API Documentation**: Swagger UI is automatically generated and available at `/docs`.
12. **Standardized Error Responses**: All errors follow a consistent, structured response format.
13. **Automated Request Validation**: Request payloads are validated automatically with clear error messages.
14. **TypeORM integration with Postgres**: Fully integrated with NestJS.
15. **TypeORM migrations with sample data**: Includes migration scripts for creating tables and adding sample data.
16. **Application Config**: Predefined app settings to use in NestJS application.
17. **Sample End-to-End Teste**: e2e tests run against a real Postgres database to ensure realistic integration coverage.
18. **Sample Unit Testing with Mocking**: short and simple unit tests with mocking.
19. **GitHub Actions CI Workflow**: Automated CI pipeline runs linting, unit tests, and e2e tests (with a real database service).

## Run the application

Requirements:

- [Docker](https://www.docker.com/get-started) (v28+ recommended)
- [Docker Compose](https://docs.docker.com/compose/) (v2.35+ recommended)

Start the Application by running:

```sh
docker compose up
```

- The API app will be available at [http://localhost:3000](http://localhost:3000)
- The API documentation (Swagger UI) will be available at [http://localhost:3000/docs](http://localhost:3000/docs)
- The database (Postgres) will run at port 5432, with some sample data

Test the Application:

1. Navigate to [http://localhost:3000/docs](http://localhost:3000/docs) to open the Swagger UI interface
2. Run the **Login API** in the **Auth** section with the default credentials (the access token will be automatically stored as an HTTP-only cookie)
3. Once authenticated, you can test the **Todos** section APIs which require authentication

## Project setup

Requirements:

- Node.js >=22.12.0
- pnpm >=10.0.0

### Install project's dependencies

```bash
pnpm install
```

### Set up environment variables

Copy the file `.env.example` to `.env` and update its content:

```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=testadmin
DB_PASSWORD=test12345
DB_DATABASE=testdb
JWT_SECRET=abcd
```

## Run migrations

Run all pending migrations:

```sh
npm run typeorm migration:run -- -d src/data-source.ts
```

To create a new migration code:

```sh
npm run typeorm migration:create src/migrations/create-user
```

Revert latest migration:

```sh
npm run typeorm migration:revert -- -d src/data-source.ts
```

## Run the project

```bash
# development
npm run dev

# production mode
npm run build
npm run start
```

## Run tests

```bash
# unit tests
npm run test

# e2e tests (require Postgres running)
npm run test:e2e

# test coverage
npm run test:cov
```
