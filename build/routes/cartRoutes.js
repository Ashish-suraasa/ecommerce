"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cartController_1 = require("../controllers/cartController");
const errorResponse_1 = __importDefault(require("../helpers/errorResponse"));
const CartRoutes = (req, res) => {
    const url = req.url.split("/");
    switch (url[2]) {
        case "addcartitem":
            (0, cartController_1.addCartItem)(req, res)
                .then((message) => {
                res.writeHead(message.status);
                res.write(JSON.stringify(message), "utf-8");
                res.end();
            })
                .catch((err) => {
                res.write(JSON.stringify((0, errorResponse_1.default)(err)));
                res.end();
            });
            break;
        case "getcartitem":
            (0, cartController_1.getCartItem)(req, res)
                .then((message) => {
                res.writeHead(message.status);
                res.write(JSON.stringify(message), "utf-8");
                res.end();
            })
                .catch((err) => {
                res.write(JSON.stringify((0, errorResponse_1.default)(err)));
                res.end();
            });
            break;
        case "updatecartitem":
            (0, cartController_1.updateCartItem)(req, res)
                .then((message) => {
                res.writeHead(message.status);
                res.write(JSON.stringify(message), "utf-8");
                res.end();
            })
                .catch((err) => {
                res.write(JSON.stringify((0, errorResponse_1.default)(err)));
                res.end();
            });
            break;
    }
};
exports.default = CartRoutes;
