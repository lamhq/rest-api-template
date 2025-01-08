import 'dotenv/config';
import 'reflect-metadata';
import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

export type DatabaseConfig = DataSourceOptions & SeederOptions;

export const configFactory = (): DatabaseConfig => ({
  type: 'mongodb',
  url: process.env.DB_URI ?? '',
  entities: ['src/api/diary/**/*.entity{.ts,.js}'],

  // db migration config
  migrations: ['src/database/migration/*.ts'],
  migrationsTableName: 'migrations',

  // db seeding config
  seeds: ['src/api/diary/seeds/**/*.ts'],
  factories: ['src/api/diary/factories/**/*.ts'],
  seedTracking: false, // ensure that a seeder is only executed once
});
