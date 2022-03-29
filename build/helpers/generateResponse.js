"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateResponse = (status, data, json = {}) => {
    const response = {
        status: status,
        message: Object.assign(Object.assign({}, data), json),
    };
    return response;
};
exports.default = generateResponse;
