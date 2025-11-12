import React, { ReactNode } from 'react';

export function Grid({ children, tileSize, gridW, gridH }: {
	children: ReactNode,
	tileSize: number,
	gridW: number,
	gridH: number
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

	const grid = Array.from({ length: gridH }).map((_, y) => (
		<div key={y}>
			{row}
		</div>
	));

	return (
		<div className={'w-full'}>
			{grid}
		</div>
	);
}