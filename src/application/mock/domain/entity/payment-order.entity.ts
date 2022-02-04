export interface PaymentOrderEntity {
  id: number;
  externalId: number;
  status: PaymentOrderEntityStatusEnum;
  expectedOn: Date;
  amount: number;
}

export enum PaymentOrderEntityStatusEnum {
  APPROVED = 'approved',
  CREATED = 'created',
  SCHEDULED = 'scheduled',
  REJECTED = 'rejected',
}
