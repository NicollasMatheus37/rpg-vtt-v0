export type ActionLogType = 'create' | 'move' | 'attack' | 'heal' | 'death';

export type ActionLogEntry = {
	id: string;
	timestamp: number;
	type: ActionLogType;
	message: string;
	/** Nome da entidade que realizou a ação (criador, quem moveu, atacante, curador). */
	actorName?: string;
	/** Para ataque/cura: nome do alvo. */
	targetName?: string;
	/** Para ataque: dano causado. Para cura: pontos de vida restaurados. */
	amount?: number;
	/** Para movimento: posição anterior e nova. */
	fromPosition?: { x: number; y: number };
	toPosition?: { x: number; y: number };
};

export type ActionLogEntryInput = Omit<ActionLogEntry, 'id' | 'timestamp'>;
