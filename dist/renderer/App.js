"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
const react_1 = __importDefault(require("react"));
const map_1 = __importDefault(require("./pages/map"));
function App() {
    // @ts-ignore
    const msg = window.electronAPI?.ping?.() ?? "no preload bridge";
    return (react_1.default.createElement("div", { style: { padding: 24, fontFamily: "sans-serif" } },
        react_1.default.createElement("h1", null, "\u269B\uFE0F Electron + React + TypeScript"),
        react_1.default.createElement("p", null,
            "Hello from React! preload says: ",
            react_1.default.createElement("b", null, msg)),
        react_1.default.createElement(map_1.default, null)));
}
