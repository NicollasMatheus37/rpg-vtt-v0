"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.characterTypeOptions = exports.CharacterTypeEnum = void 0;
var CharacterTypeEnum;
(function (CharacterTypeEnum) {
    CharacterTypeEnum["TANK"] = "tank";
    CharacterTypeEnum["DAMAGE"] = "damage";
    CharacterTypeEnum["SUPPORT"] = "support";
})(CharacterTypeEnum || (exports.CharacterTypeEnum = CharacterTypeEnum = {}));
const characterTypeOptions = [
    { label: 'Tanque', value: CharacterTypeEnum.TANK },
    { label: 'Dano', value: CharacterTypeEnum.DAMAGE },
    { label: 'Suporte', value: CharacterTypeEnum.SUPPORT },
];
exports.characterTypeOptions = characterTypeOptions;
