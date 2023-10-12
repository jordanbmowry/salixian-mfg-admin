export enum OrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in progress',
  COMPLETE = 'complete',
  CANCELED = 'canceled',
}

export enum PaymentStatus {
  NOT_PAID = 'not paid',
  PARTIALLY_PAID = 'partially paid',
  FULLY_PAID = 'fully paid',
}

export interface Customer {
  customer_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  billing_address: string | null;
  billing_city: string | null;
  billing_state: string | null;
  billing_zip: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Order {
  customer_id: string;
  order_id: string;
  order_date: string;
  order_description: string;
  customer_cost: string;
  input_expenses: string | null;
  taxes_fees: string | null;
  shipping_cost: string | null;
  total_write_off: string | null;
  profit: string | null;
  notes: string | null;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
}

export interface ConfimationModalState {
  confirm: (x: any) => any;
  dangerMode: boolean;
  heading: string;
  message: string;
  confirmButtonText: string;
}
