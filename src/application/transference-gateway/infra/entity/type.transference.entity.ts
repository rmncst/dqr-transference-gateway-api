import { EntitySchema } from 'typeorm';
import { TransferenceEntity } from '../../domain/entity/transference.entity';

export const TypeTransferenceEntity = new EntitySchema<TransferenceEntity>({
  name: 'transference',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    amount: {
      type: Number,
      nullable: false,
      precision: 2,
      scale: 10,
    },
    expectedOn: {
      type: Date,
      nullable: false,
    },
    createdAt: {
      type: Date,
      createDate: true,
      nullable: false,
    },
    paymentOrderError: {
      type: Boolean,
      default: false,
    },
  },
  relations: {
    transferenceTo: {
      type: 'many-to-one',
      target: 'account',
    },
    transferenceFrom: {
      type: 'many-to-one',
      target: 'account',
    },
  },
});
