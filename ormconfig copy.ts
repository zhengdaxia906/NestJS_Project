import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Logs } from './src/logs/entities/logs.entity';
import { User } from './src/user/entities/user.entity';
import { Profile } from './src/user/entities/profile.entity';
import { Roles } from './src/roles/entities/roles.entity';
import { UserFactor1720190062147 } from './src/migrations/1720190062147-userFactor';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { ConfigEnum } from './src/enum/config.enum';
function getENVConfig(env?: string): Record<string, any> {
  if (env === 'default') {
    return dotenv.parse(fs.readFileSync(`.env`));
  } else {
    return dotenv.parse(
      fs.readFileSync(`./.env.${process.env.NODE_ENV ? env : 'development'}`),
    );
  }
}
// console.log(getENVConfig());

console.log(1111111111111111, Logs);

const getConnectionOptions = () => {
  const defaultConfig = getENVConfig('default');
  const currentConfig = getENVConfig();
  const config = { ...defaultConfig, ...currentConfig };
  // const entitiesDir =
  //   process.env.NODE_ENV === 'test'
  //     ? [__dirname + '/**/**/*.entity.ts']
  //     : [__dirname + '/**/**/*.entity{.js,.ts}'];

  return {
    type: config[ConfigEnum.DB_TYPE],
    host: config[ConfigEnum.DB_HOST],
    port: config[ConfigEnum.DB_PORT],
    username: config[ConfigEnum.DB_USERNAME],
    password: config[ConfigEnum.DB_PASSWORD],
    database: config[ConfigEnum.DB_DATABASE],
    entities: [Logs, User, Roles, Profile],
    // entities: entitiesDir,
    synchronize: true,
    // migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
    migrations: [UserFactor1720190062147],
    cli: {
      migrationsDir: 'src/migrations',
    },
  } as TypeOrmModuleOptions;
};
export const connectionOptions = getConnectionOptions();
// console.log(connectionOptions);

export default new DataSource({
  ...connectionOptions,
  // migrations: ['src/migrations/**'],
  subscribers: [],
} as DataSourceOptions);
