import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { MakeTransferenceUseCaseArgs } from '../../domain/use-case/make-transference/make-transference.use-case.args';
import { ListTransferenceUseCase } from '../../domain/use-case/list-transference/list-transference.use-case';
import { MakeTransferenceUseCase } from '../../domain/use-case/make-transference/make-transference.use-case';
import { GetTransferenceUseCase } from '../../domain/use-case/get-transference/get-transference.use-case';

@Controller('api/transference')
export class TransferenceController {
  constructor(
    private readonly makeTransference: MakeTransferenceUseCase,
    private readonly listTransference: ListTransferenceUseCase,
    private readonly getTransference: GetTransferenceUseCase,
  ) {}

  @Post()
  async makeTransferenceAction(@Body() args: MakeTransferenceUseCaseArgs) {
    await this.makeTransference.validate(args);
    return this.makeTransference.handle(args);
  }

  @Get()
  async listTransfers() {
    return this.listTransference.handle({});
  }

  @Get(':id')
  async getTransferenceAction(@Param('id') transferenceId: number) {
    this.getTransference.validate({ transferenceId });
    return this.getTransference.handle({ transferenceId });
  }
}
