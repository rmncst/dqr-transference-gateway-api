import { AddAccountUseCase } from './add-account/add-account.use-case';
import { ListAccountUseCase } from './list-account/list-account.use-case';
import { MakeTransferenceUseCase } from './make-transference/make-transference.use-case';
import { ListTransferenceUseCase } from './list-transference/list-transference.use-case';
import { GetTransferenceUseCase } from "./get-transference/get-transference.use-case";

export default [
  AddAccountUseCase,
  ListAccountUseCase,
  MakeTransferenceUseCase,
  ListTransferenceUseCase,
  GetTransferenceUseCase
];
