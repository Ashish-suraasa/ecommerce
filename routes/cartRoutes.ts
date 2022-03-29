import {
  addCartItem,
  deleteCartItem,
  getCartItem,
} from "../controllers/cartController";
import errResponse from "../helpers/errorResponse";
import { IncomingMessage, ServerResponse } from "http";
import router from "../helpers/routeHelper";

const CartRoutes = (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url!.split("/");

  switch (url[2]) {
    case "addcartitem":
      router(addCartItem, req, res);
      break;
    case "getcartitem":
      router(getCartItem, req, res);
      break;
    case "deletecartitem":
      router(deleteCartItem, req, res);
    default:
      res.writeHead(404);
      res.write("Invalid Url");
      res.end();
      break;
  }
};

export default CartRoutes;
