"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productController_1 = require("../controllers/productController");
const errorResponse_1 = __importDefault(require("../helpers/errorResponse"));
const ProductRoutes = (req, res) => {
    const url = req.url.split("/");
    switch (url[2]) {
        case "create":
            (0, productController_1.createProduct)(req, res)
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
        case "getproduct":
            (0, productController_1.getProduct)(req, res)
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
        case "getallproduct":
            (0, productController_1.getAllProduct)(req, res)
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
exports.default = ProductRoutes;
