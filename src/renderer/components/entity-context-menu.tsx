import React from 'react';
import { TEntity } from '../../contexts/entities.context';
import { getCharacterRangeOption } from '../../enums/character-range.enum';
type EntityContextMenuProps = {
	entity: TEntity;
	entityIndex: number;
	position: { x: number; y: number };
	onClose: () => void;
	onDelete: (index: number) => void;
	onSelect: (index: number) => void;
};

export function EntityContextMenu({
	entity,
	entityIndex,
	position,
	onClose,
	onDelete,
	onSelect,
}: EntityContextMenuProps) {
	const handleDelete = () => {
		onDelete(entityIndex);
		onClose();
	};

	const handleSelect = () => {
		onSelect(entityIndex);
		onClose();
	};

	return (
		<>
			{/* Backdrop to close menu when clicking outside */}
			<div
				className="fixed top-0 left-0 right-0 bottom-0 z-[100]"
				onClick={onClose}
			/>
			{/* Context Menu */}
			<div
				className="fixed bg-white border border-gray-300 rounded shadow-md z-[101] min-w-[150px] py-1"
				style={{
					left: position.x,
					top: position.y,
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="text-black text-xs px-4">
					<p className='font-bold text-lg'>{entity.character.name}</p>
					<p><span className="font-bold">HP</span>: {entity.character.hp} / {entity.character.currentHp}</p>
					<p><span className="font-bold">Armadura</span>: {entity.character.armor}</p>
					<p><span className="font-bold">Tipo</span>: {entity.character.type.charAt(0).toUpperCase() + entity.character.type.slice(1)}</p>
					<p><span className="font-bold">Movimento</span>: {entity.character.movement}</p>
					<p><span className="font-bold">Alcance</span>: {getCharacterRangeOption(entity.character.range)?.label}</p>
				</div>
				<div className="h-px bg-gray-200 my-1" />
				<button
					onClick={handleSelect}
					className="w-full px-4 py-2 text-left bg-transparent border-none cursor-pointer text-sm hover:bg-gray-100"
				>
					Select
				</button>
				<button
					onClick={handleDelete}
					className="w-full px-4 py-2 text-left bg-transparent border-none cursor-pointer text-sm text-red-600 hover:bg-red-100"
				>
					Delete
				</button>
			</div>
		</>
	);
}

