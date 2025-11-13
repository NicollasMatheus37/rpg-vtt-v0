import React from 'react';

export function Grid({ tileSize, gridW, gridH, entities }: {
	tileSize: number,
	gridW: number,
	gridH: number,
	entities?: TEntity[]
}) {

	const tile = (
		<div
			style={{
				width: tileSize,
				height: tileSize,
				border: '1px solid black',
				boxSizing: 'border-box',
			}}
		></div>
	);

	const row = (
		<div style={{ lineHeight: 0, whiteSpace: 'nowrap' }}>
			{Array.from({ length: gridW }).map((_, x) => (
				<div key={x} style={{ display: 'inline-block' }}>
					{tile}
				</div>
			))}
		</div>
	);

	// se houver entidades, renderizá-las na grade
	const entityElements = entities?.map((entity, index) => {
		const entitySize = entity.size * tileSize;
		return (
			<div
				key={index}
				style={{
					position: 'absolute',
					top: entity.position.y * tileSize,
					left: entity.position.x * tileSize,
					width: entitySize,
					height: entitySize,
					backgroundColor: 'rgba(255, 0, 0, 0.5)',
					border: '2px solid red',
					boxSizing: 'border-box',
				}}
			></div>
		);
	});

	// criar a grade com as linhas e adicionar as entidades se houver
	const grid = (
		<div style={{ position: 'relative', width: gridW * tileSize, height: gridH * tileSize }}>
			{Array.from({ length: gridH }).map((_, y) => (
				<div key={y}>
					{row}
				</div>
			))}
			{entityElements}
		</div>
	);

	return (
		<div className={'w-full'}>
			{grid}
		</div>
	);
}