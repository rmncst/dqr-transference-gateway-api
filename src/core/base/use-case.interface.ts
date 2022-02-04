export interface UseCaseInterface<TArgs, TRes> {
  handle(args: TArgs): Promise<TRes>;
  validate(args: TArgs): any;
}
