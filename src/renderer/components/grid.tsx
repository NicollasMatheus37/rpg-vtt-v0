import React from 'react';
import { EntitiesContext, TEntity } from '../../contexts/entities.context';
import { CharacterStatusEnum } from '../../enums/character-status.enum';
import { EntityContextMenu } from './entity-context-menu';
import { Tile } from './tile';

export function Grid({ 
	tileSize, 
	gridW, 
	gridH,
	backgroundImageUrl,
	selectedEntityIndex,
	onEntitySelect,
	contextMenu,
	onContextMenu,
}: {
	tileSize: number,
	gridW: number,
	gridH: number,
	backgroundImageUrl?: string | null,
	selectedEntityIndex: number | null,
	onEntitySelect: (index: number | null) => void,
	contextMenu: { entityIndex: number; position: { x: number; y: number } } | null,
	onContextMenu: (menu: { entityIndex: number; position: { x: number; y: number } } | null) => void,
}) {
	const entitiesContext = React.useContext(EntitiesContext);

	const handleTileClick = (x: number, y: number) => {
		if (contextMenu) {
			onContextMenu(null); // Close context menu
			return;
		}
		if (selectedEntityIndex !== null) {
			entitiesContext.moveEntity(selectedEntityIndex, { x, y });
			onEntitySelect(null); // Deselect after moving
		}
	};

	const handleEntityClick = (e: React.MouseEvent, index: number) => {
		e.stopPropagation(); // Prevent tile click when clicking entity
		onEntitySelect(index === selectedEntityIndex ? null : index);
	};

	const handleEntityContextMenu = (e: React.MouseEvent, index: number) => {
		e.preventDefault();
		e.stopPropagation();
		onContextMenu({
			entityIndex: index,
			position: { x: e.clientX, y: e.clientY },
		});
	};

	const row = (y: number) => (
		<div style={{ lineHeight: 0, whiteSpace: 'nowrap' }}>
			{Array.from({ length: gridW }).map((_, x) => (
				<Tile
					key={x}
					tileSize={tileSize}
					x={x}
					y={y}
					isSelectable={selectedEntityIndex !== null}
					onClick={handleTileClick}
				/>
			))}
		</div>
	);

	const entities = entitiesContext.entities;
	const entityElements = entities?.map((entity: TEntity, index: number) => {
		if (!entity.position) return null;

		const entitySize = entity.size;
		const isSelected = index === selectedEntityIndex;
		const isDead = entity.character.status === CharacterStatusEnum.DEAD;

		return (
			<div
				key={index}
				onClick={(e) => handleEntityClick(e, index)}
				onContextMenu={(e) => handleEntityContextMenu(e, index)}
				className={`absolute box-border cursor-pointer ${isSelected ? 'z-10' : 'z-[5]'}`}
				style={{
					top: entity.position?.y * tileSize,
					left: entity.position?.x * tileSize,
					width: entitySize,
					height: entitySize,
					backgroundColor: entity.color,
					border: isSelected ? '3px solid yellow' : `2px solid ${entity.borderColor}`,
				}}
			>
				{isDead && (
					<>
						{/* Darken only the token background, not the text */}
						<div
							className="absolute inset-0"
							style={{
								pointerEvents: 'none',
								backgroundColor: 'rgba(0, 0, 0, 0.25)',
								zIndex: 0,
							}}
						/>
						{/* Draw an "X" per tile */}
						<div
							className="absolute inset-0"
							style={{
								pointerEvents: 'none',
								backgroundImage: `
									linear-gradient(45deg,
										transparent calc(50% - 1px),
										rgba(0, 0, 0, 0.45) calc(50% - 1px),
										rgba(0, 0, 0, 0.45) calc(50% + 1px),
										transparent calc(50% + 1px)
									),
									linear-gradient(-45deg,
										transparent calc(50% - 1px),
										rgba(0, 0, 0, 0.45) calc(50% - 1px),
										rgba(0, 0, 0, 0.45) calc(50% + 1px),
										transparent calc(50% + 1px)
									)
								`,
								backgroundSize: `${tileSize}px ${tileSize}px`,
								backgroundRepeat: 'repeat',
								zIndex: 1,
							}}
						/>
					</>
				)}
				<div className={'text-xs'} style={{ color: entity.textColor, position: 'relative', zIndex: 2 }}>
					<p className='font-bold text-lg'>{entity.character.name}</p>
					<p>{entity.character.hp} / {entity.character.currentHp}</p>
				</div>
			</div>
		);
	});

	const grid = (
		<div style={{ position: 'relative', width: gridW * tileSize, height: gridH * tileSize }}>
			{backgroundImageUrl && (
				<div
					className="absolute inset-0 z-0"
					style={{
						backgroundImage: `url(${backgroundImageUrl})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
						opacity: 0.75,
					}}
				/>
			)}
			<div className="relative z-[1]">
			{Array.from({ length: gridH }).map((_, y) => (
				<div key={y}>
					{row(y)}
				</div>
			))}
			</div>
			{entityElements}
		</div>
	);

	const contextMenuEntity = contextMenu 
		? entitiesContext.entities[contextMenu.entityIndex]
		: null;

	return (
		<div className={'w-full'}>
			{grid}
			{contextMenu && contextMenuEntity && (
				<EntityContextMenu
					entity={contextMenuEntity}
					entityIndex={contextMenu.entityIndex}
					position={contextMenu.position}
					onClose={() => onContextMenu(null)}
					onDelete={entitiesContext.deleteEntity}
					onSelect={onEntitySelect}
				/>
			)}
		</div>
	);
}