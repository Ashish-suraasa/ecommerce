import { pool } from "../config/db";
import reqDataHelper from "../helpers/reqDataHelper";
import { protect } from "../middleware/authMiddleware";
import { v4 as uuidv4 } from "uuid";
import generateResponse from "../helpers/generateResponse";
import { globalOrderType, updateOrderType } from "../tpyes/orderTypes";
import { globalUserType } from "../tpyes/userTypes";
import { IncomingMessage, ServerResponse } from "http";
import { globalCartType } from "../tpyes/cartTypes";
import format from "pg-format";

// @desc    Create Order
// @route   POST /api/order/creteorder
// @access  Private
const createOrder = async (req: IncomingMessage, res: ServerResponse) => {
  const { cart_item_id } = await reqDataHelper(req);

  const user = await protect(req, res);
  const id: string = uuidv4();

  const cart_item = await pool.query<globalCartType>({
    text: "SELECT * FROM cart_items WHERE customer = $1 AND is_bought = false AND id IN ($2)",
    values: [user.id, cart_item_id],
  });
  console.log(cart_item);

  //Solved the payment bug
  let totalAmount: number = 0;
  
  for (let i = 0; i < cart_item.rows.length; i++) {
    const element = cart_item.rows[i];
    const amount = await pool.query({
      text: `SELECT * FROM products WHERE id = $1`,
      values: [element.product],
    });
    totalAmount += element.quantity * amount.rows[0].price;
  }

  (async () => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const createOrder = await client.query<globalCartType>({
        text: `INSERT INTO orders (id,address,created_at,total_amount,customer)
     VALUES($1,$2,$3,$4,$5)`,
        values: [
          id,
          user.address,
          new Date().toDateString(),
          totalAmount,
          user.id,
        ],
      });

      const updateCartItems = await pool.query<globalCartType>({
        text: `UPDATE cart_items SET is_bought = 'true' WHERE customer = $1  AND id IN ($2)`,
        values: [user.id, cart_item_id],
      });

      const arr: string[][] = [];
      cart_item.rows.map((e: any) => {
        const tempId: string = uuidv4();
        const tempArr = [tempId, id, e.id];
        arr.push(tempArr);
      });

      await pool.query(
        format(
          "INSERT INTO order_cart_item_mapping (id,order_id,cart_item) VALUES %L",
          arr
        )
      );

      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  })().catch((e) => {
    throw new Error(e);
  });

  const order = await pool.query<globalOrderType>({
    text: `SELECT * FROM orders WHERE id = $1`,
    values: [id],
  });

  if (order) {
    return generateResponse(200, order.rows);
  } else {
    throw new Error("Unable to create order");
  }
};

// @desc    Get All Order
// @route   POST /api/order/getallOrder
// @access  Private
const getAllOrder = async (req: IncomingMessage, res: ServerResponse) => {
  const { itemsPerPage, page } = await reqDataHelper(req);
  const user = await protect(req, res);

  const count = await pool.query({
    text: `SELECT COUNT(*) FROM orders WHERE customer = $1`,
    values: [user.id],
  });
  const pages: number = Math.ceil(count.rows[0] / itemsPerPage);

  const orderList = await pool.query<globalOrderType>({
    text: `SELECT * FROM orders WHERE customer = $1 LIMIT $2 OFFSET $3`,
    values: [user.id, itemsPerPage, (page - 1) * itemsPerPage],
  });
  if (orderList) {
    return generateResponse(200, orderList.rows, { pages: pages });
  } else {
    throw new Error("NO orders founf");
  }
};

// @desc    Update Order Item
// @route   POST /api/order/updateorder
// @access  Private
const updateOrder = async (req: IncomingMessage, res: ServerResponse) => {
  const orderid: string = req.url!.split("/")[3];
  const { is_delivered, is_paid }: updateOrderType = await reqDataHelper(req);
  const user = await protect(req, res);
  const updated_order = await pool.query<globalOrderType>({
    text: `UPDATE orders SET is_delivered=$1 and is_paid=$2 WHERE id = $3`,
    values: [is_delivered, is_paid, orderid],
  });
  const data = await pool.query<globalOrderType>({
    text: `SELECT * FROM orders WHERE id = $1`,
    values: [orderid],
  });
  if (updated_order && data) {
    return generateResponse(200, data.rows[0]);
  } else {
    throw new Error("Unable to update the order");
  }
};

export { createOrder, updateOrder, getAllOrder };
