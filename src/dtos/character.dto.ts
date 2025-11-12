import { CharacterTypeEnum } from '../enums/character-type.enum';
import { CharacterRangeEnum } from '../enums/character-range-enum';

export class CharacterDto {
	id: number;
	name: string;
	currentHp: number;
	hp: number;
	resistance: number;
	movement: number; // 6, 9, 12
	range: CharacterRangeEnum;
	type: CharacterTypeEnum;
}