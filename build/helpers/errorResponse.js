"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errResponse = (err) => {
    const msg = {
        err: err.message,
        stack: err.stack,
    };
    return msg;
};
exports.default = errResponse;
