export type FieldErrorValidation = {
  field: string;
  error: FieldErrorValidationErrorEnum;
};

export enum FieldErrorValidationErrorEnum {
  FIELD_REQUIRED = 'field_required',
  INVALID_DATE = 'invalid_date',
}
