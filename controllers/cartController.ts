import { protect } from "../middleware/authMiddleware";
import { v4 as uuidv4 } from "uuid";
import reqDataHelper from "../helpers/reqDataHelper";
import generateResponse from "../helpers/generateResponse";
import { globalCartType } from "../tpyes/cartTypes";
import { globalUserType } from "../tpyes/userTypes";
import { IncomingMessage, ServerResponse } from "http";
import { pool } from "../config/db";

// @desc    Add items to cart
// @route   POST /api/cart/addcartitem
// @access  Private
const addCartItem = async (req: IncomingMessage, res: ServerResponse) => {
  const { product, quantity }: globalCartType = await reqDataHelper(req);
  const user = await protect(req, res);
  const id: string = uuidv4();
  const cart_item = await pool.query<globalCartType>({
    text: "SELECT * FROM cart_items WHERE product = $1 AND customer = $2",
    values: [product, user!.id],
  });

  if (cart_item.rows) {
    await pool.query<globalCartType>({
      text: "UPDATE cart_items SET quantity = $1 WHERE product = $2 AND customer = $3",
      values: [quantity, product, user.id],
    });
  } else if (!cart_item) {
    await pool.query<globalCartType>({
      text: "INSERT INTO cart_items (id,customer,product,quantity,is_bought) VALUES($1,$2,$3,$4,$5)",
      values: [id, user.id, product, quantity, false],
    });
  }
  const result = await pool.query<globalCartType>({
    text: "SELECT * FROM cart_items where id = $1",
    values: [id],
  });

  if (result) {
    return generateResponse(201, result.rows[0]);
  } else {
    throw new Error("Unable to add cart items");
  }
};

// @desc    Get Cart Item
// @route   POST /api/cart/getcartitem
// @access  Private
const getCartItem = async (req: IncomingMessage, res: ServerResponse) => {
  const { itemsPerPage, page } = await reqDataHelper(req);
  const user: globalUserType = await protect(req, res);

  const count = await pool.query({
    text: `SELECT * FROM cart_items WHERE customer = $1 AND is_bought = $2`,
    values: [user.id, false],
  });
  const pages: number = Math.ceil(count.rows[0] / itemsPerPage);

  const result = await pool.query<globalCartType>({
    text: `SELECT * FROM cart_items WHERE customer = $1 AND is_bought = $2 LIMIT $3 OFFSET $4`,
    values: [user.id, false, itemsPerPage, (page - 1) * itemsPerPage],
  });

  if (result) {
    return generateResponse(200, result.rows, { pages: pages });
  } else {
    throw new Error("No item in cart");
  }
};

// @desc    Update Cart Item
// @route   POST /api/cart/updatecart
// @access  Private
// const updateCartItem = async (req: IncomingMessage, res: ServerResponse) => {
//   const cart_item_id: string = req.url!.split("/")[3];
//   const user: globalUserType = await protect(req, res);
//   const cart_item = await pool.query<globalCartType>({
//     text: `UPDATE cart_items SET is_bought=true WHERE user = '$1`,
//     values: [user.id],
//   });
//   const result: any = await pool.query<globalCartType>({
//     text: `SELECT * FROM cart_items WHERE id = '$1`,
//     values: [cart_item_id],
//   });

//   if (cart_item && result) {
//     return generateResponse(200, result.rows);
//   } else {
//     throw new Error("Unable to Update Cart Items");
//   }
// };

// @desc    Delete Cart Item
// @route   POST /api/cart/deleteCart
// @access  Private
const deleteCartItem = async (req: IncomingMessage, res: ServerResponse) => {
  const cart_item_id: string = req.url!.split("/")[3];
  const user: globalUserType = await protect(req, res);
  const cart_item = await pool.query<globalCartType>({
    text: `DELETE cart_items WHERE id = $1 AND user = $2`,
    values: [cart_item_id, user.id],
  });

  if (cart_item) {
    return generateResponse(200, { message: "Cart Item removed" });
  } else {
    throw new Error("Unable to remove cart item");
  }
};

export { addCartItem, getCartItem, deleteCartItem };
