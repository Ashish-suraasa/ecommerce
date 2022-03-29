import { IncomingMessage, ServerResponse } from "http";
import {
  createProduct,
  getProduct,
  getAllProduct,
} from "../controllers/productController";
import errResponse from "../helpers/errorResponse";
import router from "../helpers/routeHelper";
import { globalProductType } from "../tpyes/productTypes";

const ProductRoutes = (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url!.split("/");

  switch (url[2]) {
    case "create":
      router(createProduct, req, res);
      break;
    case "getproduct":
      router(getProduct, req, res);
      break;
    case "getallproduct":
      router(getAllProduct, req, res);
      break;
    default:
      res.writeHead(404);
      res.write("Invalid Url");
      res.end();
      break;
  }
};

export default ProductRoutes;
