import { CharacterDto } from './character.dto';
import { uuid } from '../utils';

export class EnemyDto extends CharacterDto {
	public create(data: Partial<EnemyDto>): EnemyDto {
		const enemy = new EnemyDto();

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
		// Red palette options with opacity 0.5
		const colors = [
			'rgba(220, 38, 38, 0.5)',   // red-600
			'rgba(239, 68, 68, 0.5)',   // red-500
			'rgba(248, 113, 113, 0.5)', // red-400
			'rgba(185, 28, 28, 0.5)',   // red-700
			'rgba(153, 27, 27, 0.5)',   // red-800
		];
		return colors[Math.floor(Math.random() * colors.length)];
	}

	public static borderColor() {
		return 'rgb(220, 38, 38)'; // red-600
	}
}