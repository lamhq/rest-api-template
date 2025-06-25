import { ConfigFactory, ConfigObject } from '@nestjs/config';

export interface AppConfig extends ConfigObject {
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
}

export const configFactory: ConfigFactory<AppConfig> = () => {
  const config: AppConfig = {
    database: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
  };

  return config;
};

export default configFactory;
