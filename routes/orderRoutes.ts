import {
  createOrder,
  getAllOrder,
  updateOrder,
} from "../controllers/orderController";
import errResponse from "../helpers/errorResponse";
import { IncomingMessage, ServerResponse } from "http";
import router from "../helpers/routeHelper";

const OrderRoutes = (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url!.split("/");

  switch (url[2]) {
    case "createorder":
      router(createOrder, req, res);
      break;
    case "getallorder":
      router(getAllOrder, req, res);
      break;
    case "updateorder":
      router(updateOrder, req, res);
      break;
    default:
      res.writeHead(404);
      res.write("Invalid Url");
      res.end();
      break;
  }
};

export default OrderRoutes;
