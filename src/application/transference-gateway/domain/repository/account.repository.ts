import { AccountEntity } from '../entity/account.entity';

export interface AccountRepository {
  addAccount(args: { alias: string; owner: string }): Promise<AccountEntity>;
  listAccounts(): Promise<AccountEntity[]>;
  findById(id: number): Promise<AccountEntity | null>;
  findByOwnerAndAlias(
    owner: string,
    alias: string,
  ): Promise<AccountEntity | null>;
}
