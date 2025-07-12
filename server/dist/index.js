"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const admin_auth_1 = __importDefault(require("./routes/admin.auth"));
const cloudinary_1 = require("./config/cloudinary");
const item_routes_1 = __importDefault(require("./routes/item.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
dotenv_1.default.config();
(0, cloudinary_1.connectCloudinary)();
app.get("/test", (req, res) => {
    res.send("Backend is alive");
});
app.use("/api/admin", admin_auth_1.default);
app.use("/api/product", item_routes_1.default);
app.listen(4000);
