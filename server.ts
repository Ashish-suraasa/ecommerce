import http, { IncomingMessage, ServerResponse } from "http";
import "dotenv/config";

import UserRoutes from "./routes/userRoutes";
import ProductRoutes from "./routes/productRoutes";
import CartRoutes from "./routes/cartRoutes";
import OrderRoutes from "./routes/orderRoutes";

const requestListener = function (
  req: IncomingMessage,
  res: ServerResponse
): void {
  res.setHeader("Content-Type", "application/json");
  const url = req.url!.split("/");

  try {
    if (url[1] === " ") {
      res.write("Server is running");
    } else if (url[1] === "user") {
      UserRoutes(req, res);
    } else if (url[1] === "product") {
      ProductRoutes(req, res);
    } else if (url[1] === "order") {
      OrderRoutes(req, res);
    } else if (url[1] === "cart") {
      CartRoutes(req, res);
    } else {
      res.writeHead(404);
      res.write("Invaid Url");
      res.end();
    }
  } catch (error) {
    console.log("fsdfd");
  }
};

const server = http.createServer(requestListener);
server.listen(3000);
