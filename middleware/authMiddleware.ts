import { IncomingMessage, ServerResponse } from "http";
import jwt from "jsonwebtoken";
import { pool } from "../config/db";
import { globalUserType } from "../tpyes/userTypes";
const JWT_SECRET = process.env.JWT_SECRET!;

interface tokenType {
  id: string;
}

const protect = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<globalUserType> => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, JWT_SECRET) as tokenType;

      //TODO: handle the empty user case
      const user = await pool.query({
        text: "SELECT id,email,first_name,last_name,address,profile_img,create_at,is_admin FROM users WHERE id = $1",
        values: [decoded.id],
      });

      return user.rows[0];
    } catch (error) {
      res.writeHead(401);
      throw new Error("Not authorized, token failed");
    }
  }

  res.writeHead(401);
  throw new Error("Not authorized, no token");
};

export { protect };
