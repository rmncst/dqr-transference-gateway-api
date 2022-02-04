import { Body, Controller, Get, Post } from '@nestjs/common';
import { ListAccountUseCase } from '../../domain/use-case/list-account/list-account.use-case';
import { AddAccountUseCase } from '../../domain/use-case/add-account/add-account.use-case';
import { AddAccountUseCaseArgs } from '../../domain/use-case/add-account/add-account.use-case.args';

@Controller('api/account')
export class AccountController {
  constructor(
    private readonly listAccount: ListAccountUseCase,
    private readonly addAccount: AddAccountUseCase,
  ) {}

  @Post()
  async createAction(@Body() args: AddAccountUseCaseArgs) {
    await this.addAccount.validate(args);
    return this.addAccount.handle(args);
  }

  @Get()
  async listAction() {
    return this.listAccount.handle({});
  }
}
