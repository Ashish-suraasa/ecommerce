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
exports.updateCartItem = exports.getCartItem = exports.addCartItem = void 0;
const db_1 = __importDefault(require("../config/db"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const uuid_1 = require("uuid");
const reqDataHelper_1 = __importDefault(require("../helpers/reqDataHelper"));
const generateResponse_1 = __importDefault(require("../helpers/generateResponse"));
// @desc    Add items to cart
// @route   POST /api/cart/addcartitem
// @access  Private
const addCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { product_id, quantity } = yield (0, reqDataHelper_1.default)(req);
    const user = yield (0, authMiddleware_1.protect)(req, res);
    const id = (0, uuid_1.v4)();
    if (user) {
        yield db_1.default.query({
            text: "INSERT INTO cart_items (id,customer,product,quantity,is_bought) VALUES($1,$2,$3,$4,$5)",
            values: [id, user.id, product_id, quantity, false],
        });
        const result = yield db_1.default.query({
            text: "SELECT * FROM cart_items where id = $1",
            values: [id],
        });
        return (0, generateResponse_1.default)(201, result.rows[0]);
    }
    else {
        throw new Error("Unable to add cart items");
    }
});
exports.addCartItem = addCartItem;
// @desc    Get Cart Item
// @route   POST /api/cart/getcartitem
// @access  Private
const getCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, authMiddleware_1.protect)(req, res);
    const text = `SELECT * FROM cart_items WHERE customer = '${user.id}' AND is_bought = 'false'`;
    const result = yield db_1.default.query({
        text: `SELECT * FROM cart_items WHERE customer = $1 AND is_bought = $2`,
        values: [user.id, false],
    });
    if (result) {
        return (0, generateResponse_1.default)(200, result.rows);
    }
    else {
        throw new Error("No item in cart");
    }
});
exports.getCartItem = getCartItem;
// @desc    Update Cart Item
// @route   POST /api/cart/updatecart
// @access  Private
const updateCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cart_item_id = req.url.split("/")[3];
    const user = yield (0, authMiddleware_1.protect)(req, res);
    const cart_item = yield db_1.default.query({
        text: `UPDATE cart_items SET is_bought=true WHERE user = '$1`,
        values: [user.id],
    });
    const result = yield db_1.default.query({
        text: `SELECT * FROM cart_items WHERE id = '$1`,
        values: [cart_item_id],
    });
    if (cart_item && result) {
        return (0, generateResponse_1.default)(200, result.rows);
    }
    else {
        throw new Error("Unable to Update Cart Items");
    }
});
exports.updateCartItem = updateCartItem;
