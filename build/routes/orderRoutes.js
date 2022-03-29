"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orderController_1 = require("../controllers/orderController");
const errorResponse_1 = __importDefault(require("../helpers/errorResponse"));
const OrderRoutes = (req, res) => {
    const url = req.url.split("/");
    switch (url[2]) {
        case "createorder":
            (0, orderController_1.createOrder)(req, res)
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
        case "getallorder":
            (0, orderController_1.getAllOrder)(req, res)
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
        case "updateorder":
            (0, orderController_1.updateOrder)(req, res)
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
exports.default = OrderRoutes;
