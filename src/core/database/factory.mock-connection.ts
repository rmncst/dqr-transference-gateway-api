import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';

export function factoryMockConnection(entities: any[]) {
  return TypeOrmModule.forRoot({
    name: 'mock-connection',
    type: 'sqlite',
    entities: entities,
    synchronize: true,
    database: path.resolve(process.cwd(), 'db', 'db-mock.sqlite'),
  });
}
