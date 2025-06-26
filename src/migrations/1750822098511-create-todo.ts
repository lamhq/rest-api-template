import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTodo1750822098511 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum type for status
    await queryRunner.query(`
      CREATE TYPE "public"."todos_status_enum" AS ENUM('pending', 'in_progress', 'completed')
    `);

    // Create todos table
    await queryRunner.query(`
      CREATE TABLE "todos" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "title" character varying(255) NOT NULL,
        "description" text,
        "status" "public"."todos_status_enum" DEFAULT 'pending',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_todos" PRIMARY KEY ("id")
      )
    `);

    // Insert 15 sample todo items
    await queryRunner.query(`
      INSERT INTO "todos" ("title", "description", "status") VALUES
        ('Complete project documentation', 'Write comprehensive documentation for the REST API template project', 'completed'),
        ('Set up CI/CD pipeline', 'Configure GitHub Actions for automated testing and deployment', 'in_progress'),
        ('Add authentication middleware', 'Implement JWT-based authentication for API endpoints', 'pending'),
        ('Create user management system', 'Build user registration, login, and profile management', 'pending'),
        ('Implement rate limiting', 'Add rate limiting to prevent API abuse', 'pending'),
        ('Add input validation', 'Implement comprehensive input validation using class-validator', 'completed'),
        ('Set up database migrations', 'Configure TypeORM migrations for database schema management', 'completed'),
        ('Create API documentation', 'Generate OpenAPI/Swagger documentation for all endpoints', 'in_progress'),
        ('Add error handling middleware', 'Implement global error handling and logging', 'pending'),
        ('Optimize database queries', 'Review and optimize database query performance', 'pending'),
        ('Add unit tests', 'Write comprehensive unit tests for all services and controllers', 'in_progress'),
        ('Implement caching strategy', 'Add Redis caching for frequently accessed data', 'pending'),
        ('Set up monitoring and logging', 'Configure application monitoring and structured logging', 'pending'),
        ('Add health check endpoints', 'Create health check endpoints for load balancers', 'completed'),
        ('Review security best practices', 'Conduct security audit and implement best practices', 'pending')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the todos table
    await queryRunner.query(`DROP TABLE "todos"`);

    // Drop the enum type
    await queryRunner.query(`DROP TYPE "public"."todos_status_enum"`);
  }
}
