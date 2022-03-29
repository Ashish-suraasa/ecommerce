import { pool } from "../config/db";
import reqDataHelper from "../helpers/reqDataHelper";
import generateResponse from "../helpers/generateResponse";
import { v4 as uuidv4 } from "uuid";
import { protect } from "../middleware/authMiddleware";
import { globalProductType } from "../tpyes/productTypes";
import { globalUserType } from "../tpyes/userTypes";
import { IncomingMessage, ServerResponse } from "http";

const createProduct = async (req: IncomingMessage, res: ServerResponse) => {
  const user = await protect(req, res);
  const { product_img, stock, price, product_name }: globalProductType =
    await reqDataHelper(req);

  if (product_img && stock && price && product_name && user!.is_admin) {
    const id = uuidv4();

    await pool.query<globalProductType>({
      text: "INSERT INTO products (id, created_by, product_img, stock, created_at, last_updated, price, product_name)VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      values: [
        id,
        user!.id,
        product_img,
        stock,
        new Date().toDateString(),
        new Date().toDateString(),
        price,
        product_name,
      ],
    });

    const result = await pool.query<globalProductType>({
      text: "SELECT * FROM products where id = $1",
      values: [id],
    });

    return generateResponse(201, result.rows[0]);
  } else {
    throw new Error("Unable to create product");
  }
};

const getProduct = async (req: IncomingMessage, res: ServerResponse) => {
  const id: string = req.url!.split("/")[3];

  if (id) {
    const result = await pool.query<globalProductType>({
      text: "SELECT * FROM products where id = $1",
      values: [id],
    });
    return generateResponse(200, result.rows[0]);
  } else {
    throw new Error("Product not found");
  }
};

const getAllProduct = async (req: IncomingMessage, res: ServerResponse) => {
  const { itemsPerPage, page } = await reqDataHelper(req);

  const count = await pool.query("SELECT COUNT(*) FROM products");
  const pages: number = Math.ceil(count.rows[0] / itemsPerPage);

  const result = await pool.query<globalProductType>({
    text: "SELECT * FROM PRODUCTS LIMIT $2 OFFSET $3",
    values: [itemsPerPage, (page - 1) * itemsPerPage],
  });
  if (result) {
    return generateResponse(200, result.rows, { pages: pages });
  } else {
    throw new Error("Products not found");
  }
};

export { createProduct, getProduct, getAllProduct };
