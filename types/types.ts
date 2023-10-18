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

interface Address {
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  billing_address: string;
  billing_city: string;
  billing_state: string;
  billing_zip: string;
}

export interface Customer extends Address {
  customer_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  notes: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
}

export interface Meta {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

export interface ApiCutomersResponse {
  message: string;
  data: Customer[];
  meta: Meta;
  status: string;
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

export interface MonthlyRevenue {
  months: string[];
  revenues: number[];
}

export interface OrderStatusDistribution {
  date: string[];
  statuses: OrderStatus[];
  counts: number[];
}

export interface AggregateStatsData {
  revenue: number;
  orderCount: number;
  customerCount: number;
  monthlyRevenue: MonthlyRevenue;
  orderStatusDistribution: OrderStatusDistribution;
}

export interface ApiAggregateStatsResponse {
  status: string;
  data: AggregateStatsData;
  message: string;
}

export interface ApiOrderResponse {
  status: string;
  data: Partial<Order>;
  message: string;
}

export interface ApiCustomersResponse {
  status: string;
  data: Partial<Customer>;
  message: string;
}

export interface ApiOrdersForCustomerResponse {
  status: string;
  data: {
    orders: Order[];
    customer: Customer;
  };
  meta: Meta;
  message: string;
}
