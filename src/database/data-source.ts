import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { configFactory } from './config';

export const AppDataSource = new DataSource(configFactory());
