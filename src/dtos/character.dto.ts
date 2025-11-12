import { CharacterTypeEnum } from '../enums/character-type.enum';
import { CharacterRangeEnum } from '../enums/character-range.enum';
import { CharacterSizeEnum } from '../enums/character-size.enum';

export class CharacterDto {
	id: number;
	name: string;
	currentHp: number;
	hp: number;
	resistance: number;
	movement: number; // 6, 9, 12
	size: CharacterSizeEnum;
	range: CharacterRangeEnum;
	type: CharacterTypeEnum;
}