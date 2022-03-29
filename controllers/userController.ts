import { pool } from "../config/db";
import generateToken from "../helpers/generateToken";
import reqDataHelper from "../helpers/reqDataHelper";
import bcrypt from "bcrypt";
import generateResponse from "../helpers/generateResponse";
import { v4 as uuidv4 } from "uuid";
import { protect } from "../middleware/authMiddleware";
import {
  globalUserType,
  userLoginType,
  userRegisterType,
} from "../tpyes/userTypes";
import { IncomingMessage, ServerResponse } from "http";
import validator from "validator";

// @desc    Allow User to login
// @route   POST /api/user/login
// @access  Public
const login = async (req: IncomingMessage, res: ServerResponse) => {
  const { email, password }: userLoginType = await reqDataHelper(req);
  if (validator.isEmail(email) && password) {
    const result = await pool.query<globalUserType>({
      text: "SELECT id,email,first_name,last_name,address,profile_img,is_admin,password FROM users WHERE email = $1",
      values: [email.toLowerCase()],
    });

    //Password Matching
    const match = await bcrypt.compare(password, result.rows[0].password);

    if (!match) {
      throw new Error("Invalid Passowrd");
    }
    return generateResponse(200, result.rows[0], {
      token: generateToken(result.rows[0].id),
    });
  } else {
    throw new Error("Invalid Email and Password");
  }
};

// @desc    Allow user to register
// @route   POST /api/user/register
// @access  Public
const register = async (req: IncomingMessage, res: ServerResponse) => {
  const {
    first_name,
    last_name,
    password,
    email,
    address,
    profile_img,
  }: userRegisterType = await reqDataHelper(req);

  if (
    first_name &&
    last_name &&
    password &&
    validator.isEmail(email) &&
    address &&
    address &&
    profile_img
  ) {
    //Password Salting
    const salt = await bcrypt.genSalt(10);
    const updatedPassword = await bcrypt.hash(password, salt);

    //id generation
    const id = uuidv4();

    const result = await pool.query<globalUserType>({
      text: "insert into users (id,email,first_name,last_name,password,create_at,address,is_admin,profile_img) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      values: [
        id,
        email.toLowerCase(),
        first_name,
        last_name,
        updatedPassword,
        new Date().toDateString(),
        address,
        false,
        profile_img,
      ],
    });
    if (result) {
      const data = await pool.query<globalUserType>({
        text: "SELECT id,email,first_name,last_name,address,profile_img,create_at,is_admin from users where email = $1",
        values: [email],
      });
      return generateResponse(200, data.rows[0], {
        token: generateToken(data.rows[0].id),
      });
    }
  } else {
    throw new Error("Invalid Data");
  }
};

// @desc    Get User Profile
// @route   /api/user/profile
// @access  Private
const profile = async (req: IncomingMessage, res: ServerResponse) => {
  const user = await protect(req, res);
  if (user) {
    return generateResponse(200, user);
  } else {
    throw new Error("User not Found");
  }
};

export { login, register, profile };
