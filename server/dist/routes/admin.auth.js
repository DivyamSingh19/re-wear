"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminAuth_1 = __importDefault(require("../controllers/adminAuth"));
const express_1 = __importDefault(require("express"));
const adminrouter = express_1.default.Router();
adminrouter.post("/admin-login", adminAuth_1.default);
exports.default = adminrouter;
