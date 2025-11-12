"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grid = Grid;
const react_1 = __importDefault(require("react"));
function Grid({ children, tileSize, gridW, gridH }) {
    const tile = (react_1.default.createElement("div", { style: {
            width: tileSize,
            height: tileSize,
            border: '1px solid black',
            boxSizing: 'border-box',
        } }));
    const row = (react_1.default.createElement("div", { style: { lineHeight: 0, whiteSpace: 'nowrap' } }, Array.from({ length: gridW }).map((_, x) => (react_1.default.createElement("div", { key: x, style: { display: 'inline-block' } }, tile)))));
    const grid = Array.from({ length: gridH }).map((_, y) => (react_1.default.createElement("div", { key: y }, row)));
    return (react_1.default.createElement("div", { className: 'w-full' }, grid));
}
