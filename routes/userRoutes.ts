import { IncomingMessage, ServerResponse } from "http";
import { login, register, profile } from "../controllers/userController";
import errResponse from "../helpers/errorResponse";
import router from "../helpers/routeHelper";
import { globalUserType } from "../tpyes/userTypes";

const UserRoutes = (req: IncomingMessage, res: ServerResponse): void => {
  const url = req.url!.split("/");

  switch (url[2]) {
    case "login":
      router(login, req, res);
      break;
    case "register":
      router(register, req, res);
      break;
    case "profile":
      router(profile, req, res);
      break;
    default:
      res.writeHead(404);
      res.write("Invalid Url");
      res.end();
      break;
  }
};

export default UserRoutes;
