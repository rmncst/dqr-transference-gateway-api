export enum MockMessagesEnum {
  CREATE_ORDER = `mock:order_created`,
  CREATE_ORDER_ERROR = 'mock:order_created_error',
  GET_ORDER = `mock:get_order`,
  GET_ORDER_ERROR = 'mock:get_order_error',
  ORDER_NOT_FOUND = 'mock:order_not_found',
  DUPLICATED_EXTERNAL_ID = 'mock:duplicated_external_id',
}
