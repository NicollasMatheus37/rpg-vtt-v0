"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.characterRangeOptions = exports.CharacterRangeEnum = void 0;
var CharacterRangeEnum;
(function (CharacterRangeEnum) {
    CharacterRangeEnum["LOW"] = "low";
    CharacterRangeEnum["MEDIUM"] = "medium";
    CharacterRangeEnum["HIGH"] = "high";
})(CharacterRangeEnum || (exports.CharacterRangeEnum = CharacterRangeEnum = {}));
const characterRangeOptions = [
    { label: 'Curto', value: CharacterRangeEnum.LOW, gridRange: 1 },
    { label: 'Médio', value: CharacterRangeEnum.MEDIUM, gridRange: 5 },
    { label: 'Longo', value: CharacterRangeEnum.HIGH, gridRange: 9 },
];
exports.characterRangeOptions = characterRangeOptions;
