import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';

export function factoryConnection(entities: any[]) {
  return TypeOrmModule.forRoot({
    type: 'sqlite',
    entities: entities,
    synchronize: true,
    database: path.resolve(process.cwd(), 'db', 'db.sqlite'),
  });
}
