export enum CharacterRangeEnum {
	LOW = 'low',
	MEDIUM = 'medium',
	HIGH = 'high',
}

const characterRangeOptions = [
	{ label: 'Curto', value: CharacterRangeEnum.LOW, gridRange: 1 },
	{ label: 'Médio', value: CharacterRangeEnum.MEDIUM, gridRange: 5 },
	{ label: 'Longo', value: CharacterRangeEnum.HIGH, gridRange: 9 },
];

const getCharacterRangeOption = (range: CharacterRangeEnum) => {
	return characterRangeOptions.find(option => option.value === range);
}

export { characterRangeOptions, getCharacterRangeOption };