import { createContext } from 'react';
import { EnemyDto } from '../dtos/enemy.dto';
import { PlayerDto } from '../dtos/player.dto';
import { CharacterDto } from '../dtos/character.dto';

type TEntity = {
	position: { x: number; y: number };
	size: number;
	color: string;
	character: CharacterDto;
	type: typeof EnemyDto | typeof PlayerDto;
};

type EntitiesContextType = {
	entities: TEntity[];
	addEnemy: (enemy: EnemyDto) => void;
	addPlayer: (player: PlayerDto) => void;
};

const EntitiesContext = createContext<EntitiesContextType>({
	entities: [],
	addEnemy: () => {},
	addPlayer: () => {},
});

export { EntitiesContext, EntitiesContextType, TEntity };