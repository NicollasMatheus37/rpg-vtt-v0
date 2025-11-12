import React, { useEffect, useReducer } from 'react';
import { characterSizeOptions } from '../../../enums/character-size.enum';
import { characterRangeOptions } from '../../../enums/character-range.enum';
import { characterTypeOptions } from '../../../enums/character-type.enum';

export function CreateEnemyForm() {
	// use hook 'useReducer' to manage form state
	const [formState, dispatch] = useReducer((state: any, action: any) => {
		switch (action.type) {
			case 'SET_FIELD':
				return {
					...state,
					[action.field]: action.value
				};
			case 'RESET':
				return {};
			default:
				return state;
		}
	}, {});

	return (
		<form className={'p-4 flex flex-col'}>
			<h2 className="text-xl">Create Enemy</h2>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Nome</legend>
				<input type="text" className="input" placeholder="Nome"/>
			</fieldset>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Vida</legend>
				<input type="number" className="input" placeholder="Vida"/>
			</fieldset>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Armadura</legend>
				<input type="number" className="input" placeholder="Armadura"/>
			</fieldset>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Movimento</legend>
				<select defaultValue="select" className="select">
					<option disabled={true} value={'select'}>Selecione...</option>
					{[6, 9, 12].map(movement => (
						<option key={movement} value={movement}>{movement} metros</option>
					))}
				</select>
			</fieldset>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Tamanho</legend>
				<select defaultValue="select" className="select">
					<option disabled={true} value={'select'}>Selecione...</option>
					{characterSizeOptions.map((option, index) => (
						<option key={'sizeSelect_'+index} value={option.value}>
							{option.label} ({option.gridSize} {option.gridSize > 1 ? 'quadrados' : 'quadrado'})
						</option>
					))}
				</select>
			</fieldset>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Alcance</legend>
				<select defaultValue="select" className="select">
					<option disabled={true} value={'select'}>Selecione...</option>
					{characterRangeOptions.map((option, index) => (
						<option key={'rangeSelect_'+index} value={option.value}>
							{option.label} ({option.gridRange} {option.gridRange > 1 ? 'quadrados' : 'quadrado'})
						</option>
					))}
				</select>
			</fieldset>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Tipo</legend>
				<select defaultValue="select" className="select">
					<option disabled={true} value={'select'}>Selecione...</option>
					{characterTypeOptions.map((option, index) => (
						<option key={'typeSelect_'+index} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</fieldset>

			<button type="submit" className="btn btn-primary mt-4">Create Enemy</button>
		</form>
	)
}