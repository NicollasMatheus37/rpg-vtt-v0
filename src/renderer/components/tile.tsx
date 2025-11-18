import React from 'react';

type TileProps = {
	tileSize: number;
	x: number;
	y: number;
	isSelectable: boolean;
	onClick: (x: number, y: number) => void;
};

export function Tile({ tileSize, x, y, isSelectable, onClick }: TileProps) {
	return (
		<div 
			style={{ display: 'inline-block' }}
			onClick={() => onClick(x, y)}
		>
			<div
				className="box-border"
				style={{
					width: tileSize,
					height: tileSize,
					border: '1px solid black',
					boxSizing: 'border-box',
					cursor: isSelectable ? 'pointer' : 'default',
					backgroundColor: isSelectable ? 'rgba(0, 255, 0, 0.1)' : 'transparent',
				}}
			></div>
		</div>
	);
}

