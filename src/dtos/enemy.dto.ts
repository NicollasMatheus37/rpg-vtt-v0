import { CharacterDto } from './character.dto';
import { uuid } from '../utils';

export class EnemyDto extends CharacterDto {
	public create(data: Partial<EnemyDto>): EnemyDto {
		const enemy = new EnemyDto();

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