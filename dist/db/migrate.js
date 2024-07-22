"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const migrator_1 = require("drizzle-orm/postgres-js/migrator");
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
require("dotenv/config");
const migrationClient = (0, postgres_1.default)(process.env.DATABASE_URL, { max: 1 });
(0, migrator_1.migrate)((0, postgres_js_1.drizzle)(migrationClient), { migrationsFolder: "./drizzle" });
console.log("migration complete!");
