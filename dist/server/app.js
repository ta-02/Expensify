"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const router_1 = __importDefault(require("./router"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(body_parser_1.default.json());
const apiRoutes = app.use("/api", router_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, "../frontend/dist/index.html"));
});
exports.default = app;
