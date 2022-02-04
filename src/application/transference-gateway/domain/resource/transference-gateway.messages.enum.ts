export enum TransferenceGatewayMessagesEnum {
  ADD_ACCOUNT = 'payment-gateway:account_created',
  ADD_ACCOUNT_ERROR = 'payment-gateway:account_created_error',
  MAKE_TRANSFER = 'payment-gateway:make_transfer',
  MAKE_TRANSFER_ERROR = 'payment-gateway:make_transfer_error',
  LIST_ACCOUNT = 'payment-gateway:list_created',
  LIST_TRANSFERENCE = 'payment-gateway:list_transference',
  GET_TRANSFERENCE = 'payment-gateway:get_transference',
  GET_TRANSFERENCE_ERROR = 'payment-gateway:get_transference_error',
  DUPLICATE_ACCOUNT_ALIAS = 'payment-gateway:duplicated_account_alias',
  ACCOUNT_FROM_NOT_FOUND = 'payment-gateway:account_from_not_found',
  ACCOUNT_TO_NOT_FOUND = 'payment-gateway:account_from_to_found',
  TRANSFERENCE_NOT_FOUND = 'payment-gateway:transference_from_to_found'
}
