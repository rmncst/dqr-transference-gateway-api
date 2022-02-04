import { TransferenceRepository } from '../../domain/repository/transference.repository';
import { AccountEntity } from '../../domain/entity/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeTransferenceEntity } from '../entity/type.transference.entity';
import { Repository } from 'typeorm';
import { TransferenceEntity } from '../../domain/entity/transference.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeTransferenceRepository implements TransferenceRepository {
  constructor(
    @InjectRepository(TypeTransferenceEntity)
    private readonly transferenceRepo: Repository<TransferenceEntity>,
  ) {}

  createTransference(args: {
    transferenceFrom: AccountEntity;
    transferenceTo: AccountEntity;
    accountTo: AccountEntity;
    amount: number;
    expectedOn: Date;
  }): Promise<TransferenceEntity> {
    return this.transferenceRepo.save(args);
  }

  listTransfers(): Promise<TransferenceEntity[]> {
    return this.transferenceRepo.find({
      relations: ['transferenceFrom', 'transferenceTo'],
    });
  }

  findById(id: number): Promise<TransferenceEntity> {
    return this.transferenceRepo.findOne(id);
  }

  saveTransference(
    transference: TransferenceEntity,
  ): Promise<TransferenceEntity> {
    return this.transferenceRepo.save(transference);
  }
}
