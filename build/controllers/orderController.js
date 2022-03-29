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
exports.getAllOrder = exports.updateOrder = exports.createOrder = void 0;
const db_1 = __importDefault(require("../config/db"));
const reqDataHelper_1 = __importDefault(require("../helpers/reqDataHelper"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const uuid_1 = require("uuid");
const generateResponse_1 = __importDefault(require("../helpers/generateResponse"));
// @desc    Create Order
// @route   POST /api/order/creteorder
// @access  Private
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, authMiddleware_1.protect)(req, res);
    const id = (0, uuid_1.v4)();
    const cart_item = yield db_1.default.query({
        text: `SELECT * FROM cart_items WHERE customer = $1 AND is_bought = 'false'`,
        values: [user.id],
    });
    //SOlved the payment bug
    const amountArr = 434;
    // for (let i = 0; i < cart_item.rows.length; i++) {
    //   const element = cart_item.rows[i];
    // }
    // cart_item.rows.forEach(async (element: any) => {
    //   const product: any = await pool.query(
    //     `SELECT price FROM products WHERE id = '${element.product}'`
    //   );
    // });
    yield db_1.default.query({
        text: `INSERT INTO orders (id,address,created_at,total_amount,customer)
     VALUES()`,
        values: [id, user.address, new Date().toDateString(), amountArr, user.id],
    });
    const order = yield db_1.default.query({
        text: `SELECT * FROM orders WHERE id = $1`,
        values: [id],
    });
    yield db_1.default.query({
        text: `UPDATE cart_items SET is_bought = 'true' WHERE customer = $1`,
        values: [user.id],
    });
    cart_item.rows.forEach((e) => __awaiter(void 0, void 0, void 0, function* () {
        const tempId = (0, uuid_1.v4)();
        yield db_1.default.query({
            text: `INSERT INTO order_cart_item_mapping (id,order_id,cart_item) VALUES ($1,$2,$3)`,
            values: [tempId, id, e.id],
        });
    }));
    if (order) {
        return (0, generateResponse_1.default)(200, order.rows);
    }
    else {
        throw new Error("Unable to create order");
    }
});
exports.createOrder = createOrder;
// @desc    Get All Order
// @route   POST /api/order/getallOrder
// @access  Private
const getAllOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, authMiddleware_1.protect)(req, res);
    const orderList = yield db_1.default.query({
        text: `SELECT * FROM orders WHERE customer = $1`,
        values: [user.id],
    });
    if (orderList) {
        return (0, generateResponse_1.default)(200, orderList.rows);
    }
    else {
        throw new Error("NO orders founf");
    }
});
exports.getAllOrder = getAllOrder;
// @desc    Update Order Item
// @route   POST /api/order/updateorder
// @access  Private
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderid = req.url.split("/")[3];
    const { is_delivered, is_paid } = yield (0, reqDataHelper_1.default)(req);
    const user = yield (0, authMiddleware_1.protect)(req, res);
    const updated_order = yield db_1.default.query({
        text: `UPDATE orders SET is_delivered=$1 and is_paid=$2 WHERE id = $3`,
        values: [is_delivered, is_paid, orderid],
    });
    const data = yield db_1.default.query({
        text: `SELECT * FROM orders WHERE id = $1`,
        values: [orderid],
    });
    if (updated_order && data) {
        return (0, generateResponse_1.default)(200, data.rows[0]);
    }
    else {
        throw new Error("Unable to update the order");
    }
});
exports.updateOrder = updateOrder;
