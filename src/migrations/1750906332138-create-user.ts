import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1750906332138 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
        CREATE TABLE "users" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "username" VARCHAR(50) UNIQUE NOT NULL,
          "email" varchar(255) NOT NULL UNIQUE,
          "hashed_password" TEXT NOT NULL,
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP NOT NULL DEFAULT now()
        )
      `);

    // Insert sample user
    // Pre-computed bcrypt hash for password '12345' with salt rounds 10
    const hashedPassword =
      '$2b$10$hhZcITYX6wdw2l6sN.EyMejJNTOxqkJFyfXH7sI9dAuVtpUYqmhOy';
    await queryRunner.query(
      `
      INSERT INTO users (email, username, hashed_password, created_at, updated_at)
      VALUES ('test@test.com', 'testuser', $1, NOW(), NOW())
    `,
      [hashedPassword],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
