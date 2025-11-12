"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Map;
const react_1 = __importDefault(require("react"));
const react_konva_1 = require("react-konva");
const drawer_sidebar_1 = require("../components/drawer-sidebar");
const create_enemy_form_1 = require("../components/form/create-enemy.form");
const grid_1 = require("../components/grid");
function Map() {
    const [tileSize, setTileSize] = react_1.default.useState(64);
    const gridWidth = Math.floor(window.innerWidth / 32) - 2;
    const gridHeight = Math.floor(window.innerHeight / 32) - 3;
    const zoomIn = () => {
        setTileSize(prevSize => Math.min(prevSize + 16, 256));
    };
    const zoomOut = () => {
        setTileSize(prevSize => Math.max(prevSize - 16, 16));
    };
    return (react_1.default.createElement("div", { className: 'pt-12' },
        react_1.default.createElement("div", { className: 'fixed top-2 left-2 flex gap-2 z10' },
            react_1.default.createElement(drawer_sidebar_1.DrawerSidebar, { label: "Create Enemy", key: "create-enemy-drawer" },
                react_1.default.createElement(create_enemy_form_1.CreateEnemyForm, null))),
        react_1.default.createElement("div", { className: 'fixed top-2 right-2 flex gap-2' },
            react_1.default.createElement("button", { onClick: zoomIn, className: 'btn' }, "+ Zoom In"),
            react_1.default.createElement("button", { onClick: zoomOut, className: 'btn' }, "- Zoom Out")),
        react_1.default.createElement(grid_1.Grid, { tileSize: tileSize, gridW: gridWidth, gridH: gridHeight },
            react_1.default.createElement(react_konva_1.Stage, { width: window.innerWidth, height: window.innerHeight },
                react_1.default.createElement(react_konva_1.Layer, null)))));
}
