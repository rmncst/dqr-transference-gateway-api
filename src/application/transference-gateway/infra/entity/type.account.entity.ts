import { EntitySchema } from 'typeorm';
import { AccountEntity } from '../../domain/entity/account.entity';

export const TypeAccountEntity = new EntitySchema<AccountEntity>({
  name: 'account',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    alias: {
      type: String,
      nullable: false,
      length: 128,
    },
    owner: {
      type: String,
      nullable: false,
      length: 512,
    },
  },
});
