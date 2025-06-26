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
    const userId = '11111111-1111-1111-1111-111111111111'; // static UUID for sample user
    await queryRunner.query(
      `
      INSERT INTO users (id, email, username, hashed_password, created_at, updated_at)
      VALUES ($1, 'test@test.com', 'testuser', $2, NOW(), NOW())
    `,
      [userId, hashedPassword],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
