import { IncomingMessage, ServerResponse } from "http";
import errResponse from "./errorResponse";

const router = (
  controllers: any,
  req: IncomingMessage,
  res: ServerResponse
) => {
  controllers(req, res)
    .then((message: any) => {
      res.write(JSON.stringify(message), "utf-8");
      res.end();
    })
    .catch((err: any) => {
      res.write(JSON.stringify(errResponse(err)));
      res.end();
    });
};

export default router;
