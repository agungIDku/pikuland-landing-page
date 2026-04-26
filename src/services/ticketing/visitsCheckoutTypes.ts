export type VisitsData = {
  selling_price: string;
  product_name?: string;
  description?: string;
  article?: string;
  /** Checkout SKU; prefer this over `article` when present. */
  sku?: string;
  category_desc?: string;
  tax_rate?: string;
  current_stock?: number;
  unit?: string;
  image_url?: string | null;
};

export type VisitsApiResponse = {
  result: boolean;
  code: number;
  message: string;
  data: VisitsData;
};

export type CheckoutData = {
  midtrans_token?: string;
  /** Beberapa respons memakai nama ini menggantikan `midtrans_token`. */
  snap_token?: string;
  token?: string;
  redirect_url?: string;
  order_id?: string;
};

export type CheckoutApiResponse = {
  result: boolean;
  code: number;
  message: string;
  data: CheckoutData;
};
