import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET as string;

const generateToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "1d",
  });
};

export default generateToken;
