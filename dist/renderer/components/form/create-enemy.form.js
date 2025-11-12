"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEnemyForm = CreateEnemyForm;
const react_1 = __importStar(require("react"));
const character_size_enum_1 = require("../../../enums/character-size.enum");
const character_range_enum_1 = require("../../../enums/character-range.enum");
const character_type_enum_1 = require("../../../enums/character-type.enum");
function CreateEnemyForm() {
    // use hook 'useReducer' to manage form state
    const [formState, dispatch] = (0, react_1.useReducer)((state, action) => {
        switch (action.type) {
            case 'SET_FIELD':
                return {
                    ...state,
                    [action.field]: action.value
                };
            case 'RESET':
                return {};
            default:
                return state;
        }
    }, {});
    return (react_1.default.createElement("form", { className: 'p-4 flex flex-col' },
        react_1.default.createElement("h2", { className: "text-xl" }, "Create Enemy"),
        react_1.default.createElement("fieldset", { className: "fieldset" },
            react_1.default.createElement("legend", { className: "fieldset-legend" }, "Nome"),
            react_1.default.createElement("input", { type: "text", className: "input", placeholder: "Nome" })),
        react_1.default.createElement("fieldset", { className: "fieldset" },
            react_1.default.createElement("legend", { className: "fieldset-legend" }, "Vida"),
            react_1.default.createElement("input", { type: "number", className: "input", placeholder: "Vida" })),
        react_1.default.createElement("fieldset", { className: "fieldset" },
            react_1.default.createElement("legend", { className: "fieldset-legend" }, "Armadura"),
            react_1.default.createElement("input", { type: "number", className: "input", placeholder: "Armadura" })),
        react_1.default.createElement("fieldset", { className: "fieldset" },
            react_1.default.createElement("legend", { className: "fieldset-legend" }, "Movimento"),
            react_1.default.createElement("select", { defaultValue: "select", className: "select" },
                react_1.default.createElement("option", { disabled: true, value: 'select' }, "Selecione..."),
                [6, 9, 12].map(movement => (react_1.default.createElement("option", { key: movement, value: movement },
                    movement,
                    " metros"))))),
        react_1.default.createElement("fieldset", { className: "fieldset" },
            react_1.default.createElement("legend", { className: "fieldset-legend" }, "Tamanho"),
            react_1.default.createElement("select", { defaultValue: "select", className: "select" },
                react_1.default.createElement("option", { disabled: true, value: 'select' }, "Selecione..."),
                character_size_enum_1.characterSizeOptions.map((option, index) => (react_1.default.createElement("option", { key: 'sizeSelect_' + index, value: option.value },
                    option.label,
                    " (",
                    option.gridSize,
                    " ",
                    option.gridSize > 1 ? 'quadrados' : 'quadrado',
                    ")"))))),
        react_1.default.createElement("fieldset", { className: "fieldset" },
            react_1.default.createElement("legend", { className: "fieldset-legend" }, "Alcance"),
            react_1.default.createElement("select", { defaultValue: "select", className: "select" },
                react_1.default.createElement("option", { disabled: true, value: 'select' }, "Selecione..."),
                character_range_enum_1.characterRangeOptions.map((option, index) => (react_1.default.createElement("option", { key: 'rangeSelect_' + index, value: option.value },
                    option.label,
                    " (",
                    option.gridRange,
                    " ",
                    option.gridRange > 1 ? 'quadrados' : 'quadrado',
                    ")"))))),
        react_1.default.createElement("fieldset", { className: "fieldset" },
            react_1.default.createElement("legend", { className: "fieldset-legend" }, "Tipo"),
            react_1.default.createElement("select", { defaultValue: "select", className: "select" },
                react_1.default.createElement("option", { disabled: true, value: 'select' }, "Selecione..."),
                character_type_enum_1.characterTypeOptions.map((option, index) => (react_1.default.createElement("option", { key: 'typeSelect_' + index, value: option.value }, option.label))))),
        react_1.default.createElement("button", { type: "submit", className: "btn btn-primary mt-4" }, "Create Enemy")));
}
