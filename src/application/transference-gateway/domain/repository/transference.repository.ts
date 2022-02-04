import { AccountEntity } from '../entity/account.entity';
import { TransferenceEntity } from '../entity/transference.entity';

export interface TransferenceRepository {
  createTransference(args: {
    transferenceFrom: AccountEntity;
    transferenceTo: AccountEntity;
    amount: number;
    expectedOn: Date;
  }): Promise<TransferenceEntity>;
  saveTransference(
    transference: TransferenceEntity,
  ): Promise<TransferenceEntity>;
  listTransfers(): Promise<TransferenceEntity[]>;
  findById(id: number): Promise<TransferenceEntity>;
}
