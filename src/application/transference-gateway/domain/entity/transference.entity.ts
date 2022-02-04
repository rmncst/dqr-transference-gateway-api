import { AccountEntity } from './account.entity';

export interface TransferenceEntity {
  id: number;
  transferenceFrom: AccountEntity;
  transferenceTo: AccountEntity;
  amount: number;
  expectedOn: Date;
  createdAt: Date;
  paymentOrderError: boolean;
}
