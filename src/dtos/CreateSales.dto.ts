export interface CreateSalesDto {
  date: string;
  customer_id: number;
  items: {
    product_id: number;
    quantity: number;
  }[];
}
