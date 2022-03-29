type updateOrderType = { is_delivered: string; is_paid: string };

type globalOrderType = updateOrderType & {
  id: string;
  address: string;
  created_at: Date;
  total_amount: number;
  customer: string;
};
export { updateOrderType, globalOrderType };
