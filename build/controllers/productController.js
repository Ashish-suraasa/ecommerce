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
exports.getAllProduct = exports.getProduct = exports.createProduct = void 0;
const db_1 = __importDefault(require("../config/db"));
const reqDataHelper_1 = __importDefault(require("../helpers/reqDataHelper"));
const generateResponse_1 = __importDefault(require("../helpers/generateResponse"));
const uuid_1 = require("uuid");
const authMiddleware_1 = require("../middleware/authMiddleware");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, authMiddleware_1.protect)(req, res);
    const { product_img, stock, price, product_name } = yield (0, reqDataHelper_1.default)(req);
    if (product_img && stock && price && product_name && user.is_admin) {
        const id = (0, uuid_1.v4)();
        yield db_1.default.query({
            text: "INSERT INTO products (id, created_by, product_img, stock, created_at, last_updated, price, product_name)VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
            values: [
                id,
                user.id,
                product_img,
                stock,
                new Date().toDateString(),
                new Date().toDateString(),
                price,
                product_name,
            ],
        });
        const result = yield db_1.default.query({
            text: "SELECT * FROM products where id = $1",
            values: [id],
        });
        return (0, generateResponse_1.default)(201, result.rows[0]);
    }
    else {
        throw new Error("Unable to create product");
    }
});
exports.createProduct = createProduct;
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.url.split("/")[3];
    console.log(id);
    if (id) {
        const result = yield db_1.default.query({
            text: "SELECT * FROM products where id = $1",
            values: [id],
        });
        return (0, generateResponse_1.default)(200, result.rows[0]);
    }
    else {
        throw new Error("Product not found");
    }
});
exports.getProduct = getProduct;
const getAllProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield db_1.default.query("SELECT COUNT(*) FROM products");
    const pageSize = 10;
    const page = 1;
    const result = yield db_1.default.query({
        text: "SELECT * FROM PRODUCTS LIMIT $1 $2",
        values: [pageSize, pageSize + 10],
    });
    if (result) {
        return (0, generateResponse_1.default)(200, result.rows, { page: 1 });
    }
    else {
        throw new Error("Products not found");
    }
});
exports.getAllProduct = getAllProduct;
