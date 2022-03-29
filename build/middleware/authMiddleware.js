"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const JWT_SECRET = "dsadas";
const protect = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const user = yield db_1.default.query({
                text: "SELECT id,email,first_name,last_name,address,profile_img,create_at,is_admin FROM users WHERE id = $1",
                values: [decoded.id],
            });
            return user.rows[0];
        }
        catch (error) {
            console.error(error);
            res.writeHead(401);
            throw new Error("Not authorized, token failed");
        }
    }
    if (!token) {
        res.writeHead(401);
        throw new Error("Not authorized, no token");
    }
});
exports.protect = protect;
const admin = (req, res) => {
    if (req.user && req.user.is_admin) {
    }
    else {
        res.writeHead(401);
        throw new Error("Not authorized as an admin");
    }
};
exports.admin = admin;
