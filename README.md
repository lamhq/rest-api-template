# REST API Template

Starter code for a NestJS RESTful API.

## Run the application

Requirements:

- [Docker](https://www.docker.com/get-started) (v28+ recommended)
- [Docker Compose](https://docs.docker.com/compose/) (v2.35+ recommended)

Start the application by running:

```sh
docker compose up
```

- The API app will be available at [http://localhost:3000](http://localhost:3000)
- The API documentation (Swagger UI) will be available at [http://localhost:3000/docs](http://localhost:3000/docs)
- The database (Postgres) will run at port 5432, with some sample data

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

## Compile and run the project

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

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
