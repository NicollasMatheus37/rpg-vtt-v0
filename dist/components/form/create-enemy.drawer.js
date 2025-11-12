"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEnemyDrawer = CreateEnemyDrawer;
const react_1 = __importDefault(require("react"));
function CreateEnemyDrawer() {
    return (react_1.default.createElement("div", { className: "drawer" },
        react_1.default.createElement("input", { id: "my-drawer-1", type: "checkbox", className: "drawer-toggle" }),
        react_1.default.createElement("div", { className: "drawer-content" },
            react_1.default.createElement("label", { htmlFor: "my-drawer-1", className: "btn drawer-button" }, "Open drawer")),
        react_1.default.createElement("div", { className: "drawer-side" },
            react_1.default.createElement("label", { htmlFor: "my-drawer-1", "aria-label": "close sidebar", className: "drawer-overlay" }),
            react_1.default.createElement("ul", { className: "menu bg-base-200 min-h-full w-80 p-4" },
                react_1.default.createElement("li", null,
                    react_1.default.createElement("a", null, "Sidebar Item 1")),
                react_1.default.createElement("li", null,
                    react_1.default.createElement("a", null, "Sidebar Item 2"))))));
}
