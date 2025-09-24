"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = require("./app/routes");
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "https://digital-wallet-frontend-lake.vercel.app",
        "https://digital-wallet-frontend-abujayed007-abujayed007s-projects.vercel.app",
    ],
    credentials: true,
}));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use("/api/v1", routes_1.router);
exports.app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Digital wallet Backend",
    });
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.app.use(globalErrorHandler_1.globalErrorHandler);
exports.app.use(notFound_1.default);
