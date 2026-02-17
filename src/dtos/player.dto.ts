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
		enemy.movement = data.movement;
		enemy.size = data.size;
		enemy.range = data.range;
		enemy.type = data.type;

		return enemy;
	}

	public static colors() {
		// Blue palette options with opacity 0.5
		const colors = [
			'rgba(37, 99, 235, 0.5)',   // blue-600
			'rgba(59, 130, 246, 0.5)',  // blue-500
			'rgba(96, 165, 250, 0.5)',  // blue-400
			'rgba(29, 78, 216, 0.5)',   // blue-700
			'rgba(30, 64, 175, 0.5)',   // blue-800
		];
		return colors[Math.floor(Math.random() * colors.length)];
	}

	public static borderColor() {
		return 'rgb(37, 99, 235)'; // blue-600
	}
}