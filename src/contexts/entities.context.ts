import { createContext } from 'react';
import { EnemyDto } from '../dtos/enemy.dto';
import { PlayerDto } from '../dtos/player.dto';
import { CharacterDto } from '../dtos/character.dto';

type TEntity = {
	position: { x: number; y: number };
	size: number;
	color: string; // background color (rgba)
	borderColor: string; // border color
	textColor: string; // text color for contrast
	character: CharacterDto;
	type: typeof EnemyDto | typeof PlayerDto;
};

type EntitiesContextType = {
	entities: TEntity[];
	addEnemy: (enemy: EnemyDto) => void;
	addPlayer: (player: PlayerDto) => void;
	moveEntity: (entityIndex: number, newPosition: { x: number; y: number }) => void;
	deleteEntity: (entityIndex: number) => void;
	updateEntityHp: (entityIndex: number, currentHp: number) => void;
};

const EntitiesContext = createContext<EntitiesContextType>({
	entities: [],
	addEnemy: () => {},
	addPlayer: () => {},
	moveEntity: () => {},
	deleteEntity: () => {},
	updateEntityHp: () => {},
});

export { EntitiesContext, EntitiesContextType, TEntity };