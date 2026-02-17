import React, { useMemo, useCallback, useEffect } from 'react';
import { DrawerSidebar } from '../components/drawer-sidebar';
import { CreateEnemyForm } from '../components/form/create-enemy.form';
import { CreatePlayerForm } from '../components/form/create-player.form';
import { SetGridBackgroundForm } from '../components/form/set-grid-background.form';
import { SetGridSizeForm } from '../components/form/set-grid-size.form';
import { Grid } from '../components/grid';
import { ActionLogPanel } from '../components/action-log-panel';
import { EntitiesContext, EntitiesContextType, TEntity } from '../../contexts/entities.context';
import { EnemyDto } from '../../dtos/enemy.dto';
import { PlayerDto } from '../../dtos/player.dto';
import { getCharacterSizeOption } from '../../enums/character-size.enum';
import type { ActionLogEntry, ActionLogEntryInput } from '../../types/action-log.types';

function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function Map() {
	const [tileSize, setTileSize] = React.useState(64);
	const [entities, setEntities] = React.useState<TEntity[]>([]);
	const [actionLog, setActionLog] = React.useState<ActionLogEntry[]>([]);
	const [selectedEntityIndex, setSelectedEntityIndex] = React.useState<number | null>(null);
	const [contextMenu, setContextMenu] = React.useState<{
		entityIndex: number;
		position: { x: number; y: number };
	} | null>(null);
	const [enemyDrawerOpen, setEnemyDrawerOpen] = React.useState(false);
	const [playerDrawerOpen, setPlayerDrawerOpen] = React.useState(false);
	const [backgroundDrawerOpen, setBackgroundDrawerOpen] = React.useState(false);
	const [gridSizeDrawerOpen, setGridSizeDrawerOpen] = React.useState(false);
	const [backgroundImageUrl, setBackgroundImageUrl] = React.useState<string | null>(null);
	const [gridWidth, setGridWidth] = React.useState(() => Math.floor(window.innerWidth / 64));
	const [gridHeight, setGridHeight] = React.useState(() => Math.floor(window.innerHeight / 64));

	useEffect(() => {
		return () => {
			if (backgroundImageUrl?.startsWith('blob:')) {
				URL.revokeObjectURL(backgroundImageUrl);
			}
		};
	}, [backgroundImageUrl]);

	const handleSetBackground = useCallback((url: string) => {
		setBackgroundImageUrl((prev) => {
			if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
			return url;
		});
	}, []);

	const handleRemoveBackground = useCallback(() => {
		setBackgroundImageUrl((prev) => {
			if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
			return null;
		});
	}, []);

	const handleSetGridSize = useCallback((width: number, height: number) => {
		setGridWidth(width);
		setGridHeight(height);
	}, []);

	const zoomIn = () => {
		setTileSize(prevSize => Math.min(prevSize + 16, 256));
	}

	const zoomOut = () => {
		setTileSize(prevSize => Math.max(prevSize - 16, 16));
	}

	const addLogEntry = useCallback((input: ActionLogEntryInput) => {
		setActionLog(prev => [...prev, {
			...input,
			id: generateId(),
			timestamp: Date.now(),
		}]);
	}, []);

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
		addLogEntry({
			type: 'create',
			message: `Inimigo "${enemy.name}" foi criado.`,
			actorName: enemy.name,
		});
	}, [tileSize, addLogEntry]);

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
		addLogEntry({
			type: 'create',
			message: `Jogador "${player.name}" foi criado.`,
			actorName: player.name,
		});
	}, [tileSize, addLogEntry]);

	const moveEntity = useCallback((entityIndex: number, newPosition: { x: number; y: number }) => {
		const entity = entities[entityIndex];
		if (entity) {
			const from = entity.position;
			addLogEntry({
				type: 'move',
				message: `${entity.character.name} moveu de (${from.x}, ${from.y}) para (${newPosition.x}, ${newPosition.y}).`,
				actorName: entity.character.name,
				fromPosition: from,
				toPosition: newPosition,
			});
		}
		setEntities(prevEntities =>
			prevEntities.map((e, index) =>
				index === entityIndex ? { ...e, position: newPosition } : e
			)
		);
	}, [entities, addLogEntry]);

	const deleteEntity = useCallback((entityIndex: number) => {
		setEntities(prevEntities => prevEntities.filter((_, index) => index !== entityIndex));
	}, []);

	const updateEntityHp = useCallback((entityIndex: number, currentHp: number) => {
		setEntities(prevEntities =>
			prevEntities.map((entity, index) => {
				if (index !== entityIndex) return entity;
				const char = entity.character;
				const updatedChar = Object.assign(Object.create(Object.getPrototypeOf(char)), char, { currentHp });
				return { ...entity, character: updatedChar };
			})
		);
	}, []);

	const contextValue: EntitiesContextType = useMemo(() => ({
		entities,
		actionLog,
		addEnemy,
		addPlayer,
		moveEntity,
		deleteEntity,
		updateEntityHp,
		addLogEntry,
	}), [entities, actionLog, addEnemy, addPlayer, moveEntity, deleteEntity, updateEntityHp, addLogEntry]);

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
					<DrawerSidebar 
						label="Background do Grid" 
						id="set-background-drawer"
						isOpen={backgroundDrawerOpen}
						onOpen={() => setBackgroundDrawerOpen(true)}
						onClose={() => setBackgroundDrawerOpen(false)}
					>
						<SetGridBackgroundForm
							onSetBackground={handleSetBackground}
							onRemoveBackground={handleRemoveBackground}
							onClose={() => setBackgroundDrawerOpen(false)}
						/>
					</DrawerSidebar>
					<DrawerSidebar 
						label="Tamanho do Grid" 
						id="set-grid-size-drawer"
						isOpen={gridSizeDrawerOpen}
						onOpen={() => setGridSizeDrawerOpen(true)}
						onClose={() => setGridSizeDrawerOpen(false)}
					>
						<SetGridSizeForm
							gridWidth={gridWidth}
							gridHeight={gridHeight}
							onSetSize={handleSetGridSize}
							onClose={() => setGridSizeDrawerOpen(false)}
						/>
					</DrawerSidebar>
				</div>
				<div className={'fixed top-2 right-[19rem] flex gap-2 z-40'}>
					<button onClick={zoomIn} className={'btn'}>+ Zoom In</button>
					<button onClick={zoomOut} className={'btn'}>- Zoom Out</button>
				</div>
				<ActionLogPanel entries={actionLog} />
				<Grid
					tileSize={tileSize}
					gridW={gridWidth}
					gridH={gridHeight}
					backgroundImageUrl={backgroundImageUrl}
					selectedEntityIndex={selectedEntityIndex}
					onEntitySelect={setSelectedEntityIndex}
					contextMenu={contextMenu}
					onContextMenu={setContextMenu}
				/>
			</div>
		</EntitiesContext>
	);
}
