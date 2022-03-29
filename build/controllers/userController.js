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
exports.profile = exports.register = exports.login = void 0;
const db_1 = __importDefault(require("../config/db"));
const generateToken_1 = __importDefault(require("../helpers/generateToken"));
const reqDataHelper_1 = __importDefault(require("../helpers/reqDataHelper"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateResponse_1 = __importDefault(require("../helpers/generateResponse"));
const uuid_1 = require("uuid");
const authMiddleware_1 = require("../middleware/authMiddleware");
// @desc    Allow User to login
// @route   POST /api/user/login
// @access  Public
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = yield (0, reqDataHelper_1.default)(req);
    if (email && password) {
        const result = yield db_1.default.query(`SELECT password FROM users WHERE email = '${email}'`);
        //Password Matching
        const match = yield bcrypt_1.default.compare(password, result.rows[0].password);
        if (match) {
            //Generate Token
            const result = yield db_1.default.query({
                text: "SELECT id,email,first_name,last_name,address,profile_img,is_admin FROM users WHERE email = $1",
                values: [email],
            });
            return (0, generateResponse_1.default)(200, result.rows[0], {
                token: (0, generateToken_1.default)(result.rows[0].id),
            });
        }
        else {
            throw new Error("Invalid Passowrd");
        }
    }
    else {
        throw new Error("Invalid Email and Password");
    }
});
exports.login = login;
// @desc    Allow user to register
// @route   POST /api/user/register
// @access  Public
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, password, email, address, is_admin, profile_img, } = yield (0, reqDataHelper_1.default)(req);
    if (first_name &&
        last_name &&
        password &&
        email &&
        address &&
        address &&
        is_admin &&
        profile_img) {
        //Password Salting
        const salt = yield bcrypt_1.default.genSalt(10);
        const updatedPassword = yield bcrypt_1.default.hash(password, salt);
        //id generation
        const id = (0, uuid_1.v4)();
        const result = yield db_1.default.query({
            text: "insert into users (id,email,first_name,last_name,password,create_at,address,is_admin,profile_img) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
            values: [
                id,
                email,
                first_name,
                last_name,
                updatedPassword,
                new Date().toDateString(),
                address,
                is_admin,
                profile_img,
            ],
        });
        if (result) {
            const data = yield db_1.default.query({
                text: "SELECT id,email,first_name,last_name,address,profile_img,create_at,is_admin from users where email = $1",
                values: [email],
            });
            return (0, generateResponse_1.default)(200, data.rows[0], {
                token: (0, generateToken_1.default)(data.rows[0].id),
            });
        }
    }
    else {
        throw new Error("Invalid Data");
    }
});
exports.register = register;
// @desc    Get User Profile
// @route   /api/user/profile
// @access  Private
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, authMiddleware_1.protect)(req, res);
    if (user) {
        return (0, generateResponse_1.default)(200, user);
    }
    else {
        throw new Error("User not Found");
    }
});
exports.profile = profile;
