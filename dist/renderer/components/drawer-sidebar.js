"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawerSidebar = DrawerSidebar;
const react_1 = __importDefault(require("react"));
function DrawerSidebar({ label, children, key }) {
    const drawerId = key || 'sidebarDrawer';
    return (react_1.default.createElement("div", { className: "drawer", key: key },
        react_1.default.createElement("input", { id: drawerId, type: "checkbox", className: "drawer-toggle" }),
        react_1.default.createElement("div", { className: "drawer-content" },
            react_1.default.createElement("label", { htmlFor: drawerId, className: "btn drawer-button" }, label)),
        react_1.default.createElement("div", { className: "drawer-side" },
            react_1.default.createElement("label", { htmlFor: drawerId, "aria-label": "close sidebar", className: "drawer-overlay" }),
            react_1.default.createElement("ul", { className: "menu bg-base-200 min-h-full w-80 p-4" }, children))));
}
