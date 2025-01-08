import { ConfigFactory, ConfigObject } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  DatabaseConfig,
  configFactory as dbConfigFactory,
} from '../../database/config';

export interface AppConfig extends ConfigObject {
  typeorm: TypeOrmModuleOptions & DatabaseConfig;
}

export const configFactory: ConfigFactory<AppConfig> = () => {
  // remove `entities` from database config due to error when running compiled code
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { entities, ...dbConfig } = dbConfigFactory();
  return {
    typeorm: {
      ...dbConfig,
      autoLoadEntities: true, // any entity registered through `forFeature()` will be automatically added to TypeORM entity list
    },
  };
};

export default configFactory;
