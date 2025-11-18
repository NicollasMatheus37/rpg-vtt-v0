import React, { useMemo, useCallback } from 'react';
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
	const [selectedEntityIndex, setSelectedEntityIndex] = React.useState<number | null>(null);
	const [contextMenu, setContextMenu] = React.useState<{
		entityIndex: number;
		position: { x: number; y: number };
	} | null>(null);
	const [enemyDrawerOpen, setEnemyDrawerOpen] = React.useState(false);
	const [playerDrawerOpen, setPlayerDrawerOpen] = React.useState(false);

	const gridWidth = Math.floor(window.innerWidth / 64);
	const gridHeight = Math.floor(window.innerHeight / 64);

	const zoomIn = () => {
		setTileSize(prevSize => Math.min(prevSize + 16, 256));
	}

	const zoomOut = () => {
		setTileSize(prevSize => Math.max(prevSize - 16, 16));
	}

	const addEnemy = useCallback((enemy: EnemyDto) => {
		const size = getCharacterSizeOption(enemy.size).gridSize || 0;

		// Red palette for enemies
		const entity: TEntity = {
			type: EnemyDto,
			position: { x: 0, y: 0 },
			size: size * tileSize,
			color: EnemyDto.colors(),
			borderColor: EnemyDto.borderColor(),
			textColor: 'white',
			character: enemy,
		}

		setEntities(prevEntities => [...prevEntities, entity]);
	}, [tileSize]);

	const addPlayer = useCallback((player: PlayerDto) => {
		const size = getCharacterSizeOption(player.size).gridSize || 0;

		// Blue palette for players
		const entity: TEntity = {
			type: PlayerDto,
			position: { x: 0, y: 0 },
			size: size * tileSize,
			color: PlayerDto.colors(),
			borderColor: PlayerDto.borderColor(),
			textColor: 'white',
			character: player,
		}

		setEntities(prevEntities => [...prevEntities, entity]);
	}, [tileSize]);

	const moveEntity = useCallback((entityIndex: number, newPosition: { x: number; y: number }) => {
		setEntities(prevEntities => 
			prevEntities.map((entity, index) => 
				index === entityIndex 
					? { ...entity, position: newPosition }
					: entity
			)
		);
	}, []);

	const deleteEntity = useCallback((entityIndex: number) => {
		setEntities(prevEntities => prevEntities.filter((_, index) => index !== entityIndex));
	}, []);

	const contextValue: EntitiesContextType = useMemo(() => ({
		entities,
		addEnemy,
		addPlayer,
		moveEntity,
		deleteEntity,
	}), [entities, addEnemy, addPlayer, moveEntity, deleteEntity]);

	return (
		<EntitiesContext value={contextValue}>
			<div className={'pt-12'}>
				<div className={'fixed top-2 left-2 flex gap-2 z-50'}>
					<DrawerSidebar 
						label="Criar inimigo" 
						id="create-enemy-drawer"
						isOpen={enemyDrawerOpen}
						onOpen={() => setEnemyDrawerOpen(true)}
						onClose={() => setEnemyDrawerOpen(false)}
					>
						<CreateEnemyForm onClose={() => setEnemyDrawerOpen(false)}/>
					</DrawerSidebar>
					<DrawerSidebar 
						label="Criar Jogador" 
						id="create-player-drawer"
						isOpen={playerDrawerOpen}
						onOpen={() => setPlayerDrawerOpen(true)}
						onClose={() => setPlayerDrawerOpen(false)}
					>
						<CreatePlayerForm onClose={() => setPlayerDrawerOpen(false)}/>
					</DrawerSidebar>
				</div>
				<div className={'fixed top-2 right-2 flex gap-2 z-40'}>
					<button onClick={zoomIn} className={'btn'}>+ Zoom In</button>
					<button onClick={zoomOut} className={'btn'}>- Zoom Out</button>
				</div>
				<Grid
					tileSize={tileSize}
					gridW={gridWidth}
					gridH={gridHeight}
					selectedEntityIndex={selectedEntityIndex}
					onEntitySelect={setSelectedEntityIndex}
					contextMenu={contextMenu}
					onContextMenu={setContextMenu}
				/>
			</div>
		</EntitiesContext>
	);
}
