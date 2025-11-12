"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Map;
const react_1 = __importDefault(require("react"));
function Map() {
    return (react_1.default.createElement("div", { style: { padding: 24, fontFamily: "sans-serif" } },
        react_1.default.createElement("h1", null, "\uD83D\uDDFA\uFE0F Map Page"),
        react_1.default.createElement("p", null, "This is the map page of the Electron + React + TypeScript application.")));
}
