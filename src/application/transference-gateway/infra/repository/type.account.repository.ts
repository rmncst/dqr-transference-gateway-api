import { AccountRepository } from '../../domain/repository/account.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeAccountEntity } from '../entity/type.account.entity';
import { AccountEntity } from '../../domain/entity/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeAccountRepository implements AccountRepository {
  constructor(
    @InjectRepository(TypeAccountEntity)
    private readonly accountRepo: Repository<AccountEntity>,
  ) {}

  addAccount(args: { alias: string; owner: string }): Promise<AccountEntity> {
    return this.accountRepo.save(args);
  }

  findByOwnerAndAlias(
    owner: string,
    alias: string,
  ): Promise<AccountEntity | null> {
    return this.accountRepo.findOne({
      where: { alias, owner },
    });
  }

  findById(id: number): Promise<AccountEntity | null> {
    return this.accountRepo.findOne({
      where: { id },
    });
  }

  listAccounts(): Promise<AccountEntity[]> {
    return this.accountRepo.find();
  }
}
