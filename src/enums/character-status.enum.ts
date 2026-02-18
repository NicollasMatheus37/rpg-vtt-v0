export enum CharacterStatusEnum {
	ALIVE = 'alive',
	DEAD = 'dead',
}

const characterStatusOptions = [
	{ label: 'Vivo', value: CharacterStatusEnum.ALIVE },
	{ label: 'Morto', value: CharacterStatusEnum.DEAD },
];

export { characterStatusOptions };
