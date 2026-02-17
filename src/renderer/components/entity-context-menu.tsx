import React, { useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { EntitiesContext, TEntity } from '../../contexts/entities.context';
import { getCharacterRangeOption } from '../../enums/character-range.enum';
import { EnemyDto } from '../../dtos/enemy.dto';
import { PlayerDto } from '../../dtos/player.dto';
import { CharacterTypeEnum } from '../../enums/character-type.enum';

type EntityContextMenuProps = {
	entity: TEntity;
	entityIndex: number;
	position: { x: number; y: number };
	onClose: () => void;
	onDelete: (index: number) => void;
	onSelect: (index: number) => void;
};

type PlayerEntityWithMeta = {
	entity: TEntity;
	index: number;
};

const manhattanDistance = (a: { x: number; y: number }, b: { x: number; y: number }) => {
	return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

const getRangeInTiles = (entity: TEntity): number => {
	const option = getCharacterRangeOption(entity.character.range);
	return option?.gridRange ?? 0;
};

const isEnemy = (entity: TEntity) => entity.type === EnemyDto;
const isPlayer = (entity: TEntity) => entity.type === PlayerDto;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getPriorityBucket = (player: PlayerEntityWithMeta, minHp: number): number => {
	const { character } = player.entity;

	// Prioridade 0: player mais vulnerável (menor HP atual)
	if (character.currentHp === minHp) {
		return 0;
	}

	// Prioridade 1: suporte
	if (character.type === CharacterTypeEnum.SUPPORT) {
		return 1;
	}

	// Prioridade 2: dano
	if (character.type === CharacterTypeEnum.DAMAGE) {
		return 2;
	}

	// Prioridade 3: tanque
	if (character.type === CharacterTypeEnum.TANK) {
		return 3;
	}

	// Qualquer outro tipo inesperado cai na menor prioridade
	return 4;
};

const getMovementInTiles = (enemy: TEntity): number => {
	// A ficha usa movimento em "metros", aqui consideramos que cada unidade corresponde a 1 tile
	// (6, 9, 12 => 6, 9, 12 tiles). Se precisar de outra conversão, é só ajustar aqui.
	return enemy.character.movement ?? 0;
};

type ScoredPlayer = PlayerEntityWithMeta & {
	priority: number;
	distance: number;
};

const scorePlayers = (enemy: TEntity, players: PlayerEntityWithMeta[]): ScoredPlayer[] => {
	const minHp = Math.min(...players.map(p => p.entity.character.currentHp));
	return players.map(p => ({
		...p,
		priority: getPriorityBucket(p, minHp),
		distance: manhattanDistance(enemy.position, p.entity.position),
	}));
};

// player0 = maior prioridade; se empatar/der ruim, o mais próximo.
const getPlayer0 = (enemy: TEntity, players: PlayerEntityWithMeta[]) => {
	const scored = scorePlayers(enemy, players);
	const allAreUnknownPriority = scored.every(p => p.priority >= 4);

	return scored.sort((a, b) => {
		// Se o sistema de prioridade "não funcionar", escolhe só por proximidade
		if (allAreUnknownPriority) {
			return a.distance - b.distance;
		}

		if (a.priority !== b.priority) return a.priority - b.priority;
		return a.distance - b.distance;
	})[0];
};

const getClosestPlayer = (enemy: TEntity, players: PlayerEntityWithMeta[]) => {
	const scored = scorePlayers(enemy, players);
	return scored.sort((a, b) => a.distance - b.distance)[0];
};

const canEndInRangeThisTurn = (enemy: TEntity, player: PlayerEntityWithMeta) => {
	const movementTiles = getMovementInTiles(enemy);
	const rangeTiles = getRangeInTiles(enemy);
	const distance = manhattanDistance(enemy.position, player.entity.position);
	return distance <= movementTiles + rangeTiles;
};

const pickAutoMoveTarget = (enemy: TEntity, players: PlayerEntityWithMeta[]) => {
	const player0 = getPlayer0(enemy, players);

	// Se NENHUM player é "alcançável" para terminar o turno em alcance, vai no mais próximo.
	const anyoneReachableThisTurn = players.some(p => canEndInRangeThisTurn(enemy, p));
	if (!anyoneReachableThisTurn) {
		return getClosestPlayer(enemy, players);
	}

	return player0;
};

const calculateNewEnemyPosition = (enemy: TEntity, target: PlayerEntityWithMeta): { x: number; y: number } => {
	const movementTiles = getMovementInTiles(enemy);

	const start = { ...enemy.position };
	const targetPos = target.entity.position;

	let current = { ...start };

	for (let step = 0; step < movementTiles; step++) {
		const dx = targetPos.x - current.x;
		const dy = targetPos.y - current.y;

		if (dx === 0 && dy === 0) break;

		// Movimento simples em linha reta na grade, aproximando do alvo
		let next = { ...current };
		if (Math.abs(dx) >= Math.abs(dy)) {
			next.x += dx > 0 ? 1 : -1;
		} else {
			next.y += dy > 0 ? 1 : -1;
		}

		// Evita "entrar" no mesmo tile do player alvo; para o mais perto possível.
		if (next.x === targetPos.x && next.y === targetPos.y) {
			break;
		}

		current = next;
	}

	return current;
};

type SubmenuMode = null | 'attack' | 'heal';

export function EntityContextMenu({
	entity,
	entityIndex,
	position,
	onClose,
	onDelete,
	onSelect,
}: EntityContextMenuProps) {
	const entitiesContext = useContext(EntitiesContext);
	const menuRef = useRef<HTMLDivElement | null>(null);
	const [adjustedPosition, setAdjustedPosition] = useState(position);
	const [submenu, setSubmenu] = useState<SubmenuMode>(null);

	const viewportPadding = 8;

	const basePosition = useMemo(() => position, [position.x, position.y]);

	useLayoutEffect(() => {
		const el = menuRef.current;
		if (!el) return;

		// O menu é `fixed`, então usamos o viewport (innerWidth/innerHeight).
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const rect = el.getBoundingClientRect();

		// Primeiro tenta abrir para baixo; se estourar embaixo, abre para cima.
		let left = basePosition.x;
		let top = basePosition.y;

		if (top + rect.height > vh - viewportPadding) {
			top = basePosition.y - rect.height;
		}

		// Mantém dentro das bordas do viewport.
		const maxLeft = Math.max(viewportPadding, vw - viewportPadding - rect.width);
		const maxTop = Math.max(viewportPadding, vh - viewportPadding - rect.height);
		left = clamp(left, viewportPadding, maxLeft);
		top = clamp(top, viewportPadding, maxTop);

		setAdjustedPosition(prev => {
			if (prev.x === left && prev.y === top) return prev;
			return { x: left, y: top };
		});
	}, [basePosition, viewportPadding]);

	const handleDelete = () => {
		onDelete(entityIndex);
		onClose();
	};

	const handleSelect = () => {
		onSelect(entityIndex);
		onClose();
	};

	const rangeTiles = getRangeInTiles(entity);
	const allEntities = entitiesContext.entities;

	const enemiesInRange = useMemo(() => {
		if (!isPlayer(entity)) return [];
		return allEntities
			.map((e, idx) => ({ entity: e, index: idx }))
			.filter(({ entity: e }) => isEnemy(e))
			.filter(({ entity: e }) => manhattanDistance(entity.position, e.position) <= rangeTiles);
	}, [entity, allEntities, rangeTiles]);

	const alliesInRange = useMemo(() => {
		if (!isPlayer(entity)) return [];
		return allEntities
			.map((e, idx) => ({ entity: e, index: idx }))
			.filter(({ entity: e }) => isPlayer(e))
			.filter(({ entity: e }) => manhattanDistance(entity.position, e.position) <= rangeTiles);
	}, [entity, allEntities, rangeTiles]);

	const handleAttack = (targetIndex: number) => {
		const target = entitiesContext.entities[targetIndex];
		if (!target || !isEnemy(target)) return;
		const damage = entity.character.rollDamage();
		const newHp = Math.max(0, target.character.currentHp - damage);
		entitiesContext.updateEntityHp(targetIndex, newHp);
		setSubmenu(null);
		onClose();
	};

	const handleHeal = (targetIndex: number) => {
		const target = entitiesContext.entities[targetIndex];
		if (!target || !isPlayer(target)) return;
		const healing = entity.character.rollHealing();
		const newHp = Math.min(target.character.hp, target.character.currentHp + healing);
		entitiesContext.updateEntityHp(targetIndex, newHp);
		setSubmenu(null);
		onClose();
	};

	const handleAutoMoveEnemy = () => {
		if (!isEnemy(entity)) {
			return;
		}

		const allEntities = entitiesContext.entities;
		const playerEntities: PlayerEntityWithMeta[] = allEntities
			.map((e, idx) => ({ entity: e, index: idx }))
			.filter(p => isPlayer(p.entity));

		if (!playerEntities.length) {
			return;
		}

		// Sempre recalcula o player0 a cada clique.
		const player0 = getPlayer0(entity, playerEntities);
		if (!player0) return;

		const rangeTiles = getRangeInTiles(entity);
		const distanceToPlayer0 = manhattanDistance(entity.position, player0.entity.position);

		// Se já está "de frente" ao player0 (em alcance), não se move.
		if (distanceToPlayer0 <= rangeTiles) {
			onClose();
			return;
		}

		// Se ninguém é alcançável neste turno (movimento + alcance), move para o player mais próximo.
		// Caso contrário, sempre tenta ir em direção ao player0.
		const targetForMovement = pickAutoMoveTarget(entity, playerEntities);
		const newPosition = calculateNewEnemyPosition(entity, targetForMovement);

		entitiesContext.moveEntity(entityIndex, newPosition);
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
				ref={menuRef}
				className="fixed bg-white border border-gray-300 rounded shadow-md z-[101] min-w-[150px] py-1"
				style={{
					left: adjustedPosition.x,
					top: adjustedPosition.y,
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="text-black text-xs px-4">
					<p className='font-bold text-lg'>{entity.character.name}</p>
					<p><span className="font-bold">HP</span>: {entity.character.hp} / {entity.character.currentHp}</p>
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
				{isPlayer(entity) && (
					<>
						{submenu === null && (
							<>
								<button
									onClick={() => setSubmenu('attack')}
									className="w-full px-4 py-2 text-left bg-transparent border-none cursor-pointer text-sm hover:bg-gray-100"
								>
									Atacar {enemiesInRange.length > 0 ? `(${enemiesInRange.length} no alcance)` : ''}
								</button>
								{entity.character.type === CharacterTypeEnum.SUPPORT && (
									<button
										onClick={() => setSubmenu('heal')}
										className="w-full px-4 py-2 text-left bg-transparent border-none cursor-pointer text-sm hover:bg-gray-100"
									>
										Curar {alliesInRange.length > 0 ? `(${alliesInRange.length} no alcance)` : ''}
									</button>
								)}
							</>
						)}
						{submenu === 'attack' && (
							<>
								<button
									onClick={() => setSubmenu(null)}
									className="w-full px-4 py-2 text-left bg-transparent border-none cursor-pointer text-sm hover:bg-gray-100 text-gray-600"
								>
									← Voltar
								</button>
								{enemiesInRange.length === 0 ? (
									<div className="px-4 py-2 text-sm text-gray-500">Nenhum inimigo no alcance</div>
								) : (
									enemiesInRange.map(({ entity: target, index: targetIndex }) => (
										<button
											key={targetIndex}
											onClick={() => handleAttack(targetIndex)}
											className="w-full px-4 py-2 text-left bg-transparent border-none cursor-pointer text-sm hover:bg-red-50"
										>
											{target.character.name} (HP: {target.character.currentHp}/{target.character.hp})
										</button>
									))
								)}
							</>
						)}
						{submenu === 'heal' && (
							<>
								<button
									onClick={() => setSubmenu(null)}
									className="w-full px-4 py-2 text-left bg-transparent border-none cursor-pointer text-sm hover:bg-gray-100 text-gray-600"
								>
									← Voltar
								</button>
								{alliesInRange.length === 0 ? (
									<div className="px-4 py-2 text-sm text-gray-500">Nenhum aliado no alcance</div>
								) : (
									alliesInRange.map(({ entity: target, index: targetIndex }) => (
										<button
											key={targetIndex}
											onClick={() => handleHeal(targetIndex)}
											className="w-full px-4 py-2 text-left bg-transparent border-none cursor-pointer text-sm hover:bg-green-50"
										>
											{target.character.name} (HP: {target.character.currentHp}/{target.character.hp})
										</button>
									))
								)}
							</>
						)}
					</>
				)}
				{isEnemy(entity) && (
					<button
						onClick={handleAutoMoveEnemy}
						className="w-full px-4 py-2 text-left bg-transparent border-none cursor-pointer text-sm hover:bg-gray-100"
					>
						Mover inimigo automaticamente
					</button>
				)}
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

