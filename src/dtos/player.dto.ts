import { CharacterDto } from './character.dto';
import { CharacterTypeEnum } from '../enums/character-type.enum';
import { uuid } from '../utils';

export class PlayerDto extends CharacterDto {
	public create(data: Partial<PlayerDto>): PlayerDto {
		const enemy = new PlayerDto();

		enemy.id = uuid();
		enemy.name = data.name;
		enemy.currentHp = data.hp;
		enemy.hp = data.hp;
		enemy.armor = data.armor;
		enemy.movement = data.movement;
		enemy.size = data.size;
		enemy.range = data.range;
		enemy.type = data.type;

		return enemy;
	}
}