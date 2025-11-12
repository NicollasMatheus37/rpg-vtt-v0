export enum CharacterSizeEnum {
	SMALL = 'small',
	MEDIUM = 'medium',
	LARGE = 'large',
	GIANT = 'giant',
	COLOSSAL = 'colossal',
}

const characterSizeOptions = [
	{ label: 'Pequeno', value: CharacterSizeEnum.SMALL, gridSize: 1 },
	{ label: 'Médio', value: CharacterSizeEnum.MEDIUM, gridSize: 1 },
	{ label: 'Grande', value: CharacterSizeEnum.LARGE, gridSize: 1 },
	{ label: 'Gigante', value: CharacterSizeEnum.GIANT, gridSize: 4 },
	{ label: 'Colossal', value: CharacterSizeEnum.COLOSSAL, gridSize: 9 },
];

export { characterSizeOptions };
