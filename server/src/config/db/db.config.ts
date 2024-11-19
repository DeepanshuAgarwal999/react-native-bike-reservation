import { registerAs } from '@nestjs/config';
import { join } from 'path';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export default registerAs(
  'dbConfg.dev',
  (): MysqlConnectionOptions => ({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'admin',
    database: 'bikereservation',
    entities: [join(__dirname, '../../**', '*.entity.{ts,js}')],
    synchronize: true,
  }),
);
