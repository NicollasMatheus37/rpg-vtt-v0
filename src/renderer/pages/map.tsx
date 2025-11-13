import React, { useEffect } from 'react';
import { DrawerSidebar } from '../components/drawer-sidebar';
import { CreateEnemyForm } from '../components/form/create-enemy.form';
import { Grid } from '../components/grid';
import { CreatePlayerForm } from '../components/form/create-player.form';
import { useStorage } from '../../hooks/use-storage';

export default function Map() {
	const [tileSize, setTileSize] = React.useState(64);
	const [players, setPlayers] = React.useState<TEntity[]>([]);
	const [enemies, setEnemies] = React.useState<TEntity[]>([]);

	const enemiesStorage = useStorage({ groupKey: 'enemies' });
	const playersStorage = useStorage({ groupKey: 'players' });

	const gridWidth = Math.floor(window.innerWidth / 32) - 2;
	const gridHeight = Math.floor(window.innerHeight / 32) - 3;

	const zoomIn = () => {
		setTileSize(prevSize => Math.min(prevSize + 16, 256));
	}

	const zoomOut = () => {
		setTileSize(prevSize => Math.max(prevSize - 16, 16));
	}

	useEffect(() => {
		setPlayers(Object.values(playersStorage.group()) as TEntity[]);
		setEnemies(Object.values(enemiesStorage.group()) as TEntity[]);
	}, []);

	return (
		<div className={'pt-12'}>
			<div className={'fixed top-2 left-2 flex gap-2 z-10'}>
				<DrawerSidebar label="Criar inimigo" key="create-enemy-drawer">
					<CreateEnemyForm />
				</DrawerSidebar>
				<DrawerSidebar label="Criar Jogador" key="create-player-drawer">
					<CreatePlayerForm />
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
				entities={[...enemies, ...players]}
			/>
		</div>
	);
}
