"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const expenseRoutes_1 = __importDefault(require("./expenseRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const app = (0, express_1.default)();
const middlewares = [
    (0, morgan_1.default)("dev"),
    body_parser_1.default.json(),
    (0, cookie_parser_1.default)(),
    express_1.default.static(path_1.default.join(__dirname, "../frontend/dist")),
];
middlewares.forEach((middleware) => app.use(middleware));
app.use("/api", expenseRoutes_1.default);
app.use("/api", authRoutes_1.default);
app.get("*", (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, "../frontend/dist/index.html"));
});
exports.default = app;
