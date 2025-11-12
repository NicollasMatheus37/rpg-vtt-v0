export enum CharacterTypeEnum {
	TANK = 'tank',
	DAMAGE = 'damage',
	SUPPORT = 'support',
}

const characterTypeOptions = [
	{ label: 'Tanque', value: CharacterTypeEnum.TANK },
	{ label: 'Dano', value: CharacterTypeEnum.DAMAGE },
	{ label: 'Suporte', value: CharacterTypeEnum.SUPPORT },
];

export { characterTypeOptions };