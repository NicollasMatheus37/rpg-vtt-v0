import React from 'react';
import { Layer, Stage } from 'react-konva';
import { DrawerSidebar } from '../components/drawer-sidebar';
import { CreateEnemyForm } from '../components/form/create-enemy.form';
import { Grid } from '../components/grid';

export default function Map() {
	const [tileSize, setTileSize] = React.useState(64);

	const gridWidth = Math.floor(window.innerWidth / 32) - 2;
	const gridHeight = Math.floor(window.innerHeight / 32) - 3;

	const zoomIn = () => {
		setTileSize(prevSize => Math.min(prevSize + 16, 256));
	}

	const zoomOut = () => {
		setTileSize(prevSize => Math.max(prevSize - 16, 16));
	}

	return (
		<div className={'pt-12'}>
			<div className={'fixed top-2 left-2 flex gap-2 z10'}>
				<DrawerSidebar label="Create Enemy" key="create-enemy-drawer">
					<CreateEnemyForm />
				</DrawerSidebar>
			</div>
			<div className={'fixed top-2 right-2 flex gap-2'}>
				<button onClick={zoomIn} className={'btn'}>+ Zoom In</button>
				<button onClick={zoomOut} className={'btn'}>- Zoom Out</button>
			</div>
			<Grid tileSize={tileSize} gridW={gridWidth} gridH={gridHeight}>
				<Stage width={window.innerWidth} height={window.innerHeight}>
					<Layer>
					</Layer>
				</Stage>
			</Grid>
		</div>
	);
}
