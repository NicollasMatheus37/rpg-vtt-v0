import React, { useMemo } from 'react';
import { DrawerSidebar } from '../components/drawer-sidebar';
import { CreateEnemyForm } from '../components/form/create-enemy.form';
import { Grid } from '../components/grid';
import { CreatePlayerForm } from '../components/form/create-player.form';
import { EntitiesContext, EntitiesContextType, TEntity } from '../../contexts/entities.context';
import { EnemyDto } from '../../dtos/enemy.dto';
import { PlayerDto } from '../../dtos/player.dto';
import { getCharacterSizeOption } from '../../enums/character-size.enum';

export default function Map() {
	const [tileSize, setTileSize] = React.useState(64);
	const [entities, setEntities] = React.useState<TEntity[]>([]);

	const gridWidth = Math.floor(window.innerWidth / 32) - 2;
	const gridHeight = Math.floor(window.innerHeight / 32) - 3;

	const zoomIn = () => {
		setTileSize(prevSize => Math.min(prevSize + 16, 256));
	}

	const zoomOut = () => {
		setTileSize(prevSize => Math.max(prevSize - 16, 16));
	}

	const addEnemy = (enemy: EnemyDto) => {
		const size = getCharacterSizeOption(enemy.size).gridSize || 0;

		const entity: TEntity = {
			type: EnemyDto,
			position: { x: 0, y: 0 },
			size: size * tileSize,
			color: 'red',
			character: enemy,
		}

		setEntities(prevEntities => [...prevEntities, entity]);
	};
	const addPlayer = (player: PlayerDto) => {
		const size = getCharacterSizeOption(player.size).gridSize || 0;

		const entity: TEntity = {
			type: PlayerDto,
			position: { x: 0, y: 0 },
			size: size * tileSize,
			color: 'blue',
			character: player,
		}

		setEntities(prevEntities => [...prevEntities, entity]);
	};

	const contextValue: EntitiesContextType = useMemo(() => ({
		entities,
		addEnemy,
		addPlayer,
	}), [entities]);

	return (
		<EntitiesContext value={contextValue}>
			<div className={'pt-12'}>
				<div className={'fixed top-2 left-2 flex gap-2 z-10'}>
					<DrawerSidebar label="Criar inimigo" id="create-enemy-drawer">
						<CreateEnemyForm/>
					</DrawerSidebar>
					<DrawerSidebar label="Criar Jogador" id="create-player-drawer">
						<CreatePlayerForm/>
					</DrawerSidebar>
				</div>
				<div className={'fixed top-2 right-2 flex gap-2'}>
					<button onClick={zoomIn} className={'btn'}>+ Zoom In</button>
					<button onClick={zoomOut} className={'btn'}>- Zoom Out</button>
				</div>
				<Grid
					tileSize={tileSize}
					gridW={gridWidth}
					gridH={gridHeight}
				/>
			</div>
		</EntitiesContext>
	);
}
