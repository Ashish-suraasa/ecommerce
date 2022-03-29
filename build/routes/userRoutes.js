"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controllers/userController");
const errorResponse_1 = __importDefault(require("../helpers/errorResponse"));
const UserRoutes = (req, res) => {
    const url = req.url.split("/");
    switch (url[2]) {
        case "login":
            (0, userController_1.login)(req, res)
                .then((message) => {
                res.write(JSON.stringify(message), "utf-8");
                res.end();
            })
                .catch((err) => {
                res.write(JSON.stringify((0, errorResponse_1.default)(err)));
                res.end();
            });
            break;
        case "register":
            (0, userController_1.register)(req, res)
                .then((message) => {
                res.write(JSON.stringify(message), "utf-8");
                res.end();
            })
                .catch((err) => {
                res.write(JSON.stringify((0, errorResponse_1.default)(err)));
                res.end();
            });
            break;
        case "profile":
            (0, userController_1.profile)(req, res)
                .then((message) => {
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
exports.default = UserRoutes;
