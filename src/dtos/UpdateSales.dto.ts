export interface UpdateSalesDto {
  date: string;
  customer_id: number;
  items: {
    sale_details_id: number;
    product_id: number;
    quantity: number;
  }[];
  new_items: {
    product_id: number;
    quantity: number;
  }[];
}
