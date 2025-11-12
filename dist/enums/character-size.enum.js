"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.characterSizeOptions = exports.CharacterSizeEnum = void 0;
var CharacterSizeEnum;
(function (CharacterSizeEnum) {
    CharacterSizeEnum["SMALL"] = "small";
    CharacterSizeEnum["MEDIUM"] = "medium";
    CharacterSizeEnum["LARGE"] = "large";
    CharacterSizeEnum["GIANT"] = "giant";
    CharacterSizeEnum["COLOSSAL"] = "colossal";
})(CharacterSizeEnum || (exports.CharacterSizeEnum = CharacterSizeEnum = {}));
const characterSizeOptions = [
    { label: 'Pequeno', value: CharacterSizeEnum.SMALL, gridSize: 1 },
    { label: 'Médio', value: CharacterSizeEnum.MEDIUM, gridSize: 1 },
    { label: 'Grande', value: CharacterSizeEnum.LARGE, gridSize: 1 },
    { label: 'Gigante', value: CharacterSizeEnum.GIANT, gridSize: 4 },
    { label: 'Colossal', value: CharacterSizeEnum.COLOSSAL, gridSize: 9 },
];
exports.characterSizeOptions = characterSizeOptions;
