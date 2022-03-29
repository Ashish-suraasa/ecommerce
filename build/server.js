"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
require("dotenv/config");
dotenv_1.default.config();
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const requestListener = function (req, res) {
    res.setHeader("Content-Type", "application/json");
    const url = req.url.split("/");
    try {
        if (url[1] === "/") {
            res.write("Server is running");
        }
        else if (url[1] === "user") {
            (0, userRoutes_1.default)(req, res);
        }
        else if (url[1] === "product") {
            (0, productRoutes_1.default)(req, res);
        }
        else if (url[1] === "order") {
            (0, orderRoutes_1.default)(req, res);
        }
        else if (url[1] === "cart") {
            (0, cartRoutes_1.default)(req, res);
        }
        else {
            res.writeHead(400);
            res.write("Invalid");
        }
    }
    catch (error) {
        console.log("fsdfd");
    }
};
const server = http_1.default.createServer(requestListener);
server.listen(3000);
