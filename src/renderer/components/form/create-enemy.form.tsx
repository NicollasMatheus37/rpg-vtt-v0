import React, { useEffect, useReducer } from 'react';
import { characterSizeOptions } from '../../../enums/character-size.enum';
import { characterRangeOptions } from '../../../enums/character-range.enum';
import { characterTypeOptions } from '../../../enums/character-type.enum';
import { EnemyDto } from '../../../dtos/enemy.dto';
import { useStorage } from '../../../hooks/use-storage';

type Action = { type: 'SET_FIELD', field: keyof EnemyDto, value: any } | { type: 'RESET' };

export function CreateEnemyForm() {
	const [formState, dispatch] = useReducer((state: EnemyDto, action: Action) => {
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

	const storage = useStorage<EnemyDto>({ groupKey: 'enemies' });

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		dispatch({ type: 'SET_FIELD', field: name as keyof EnemyDto, value });
	}

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		dispatch({ type: 'SET_FIELD', field: name as keyof EnemyDto, value });
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const enemy = new EnemyDto().create(formState);
		storage.set(enemy.id.toString(), enemy);

		dispatch({ type: 'RESET' });
	}

	return (
		<form className={'p-4 flex flex-col'} onSubmit={handleSubmit}>
			<h2 className="text-xl">Create Enemy</h2>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Nome</legend>
				<input type="text" name="name" className="input" placeholder="Nome" onChange={handleInputChange}/>
			</fieldset>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Vida</legend>
				<input type="number" name="hp" className="input" placeholder="Vida" onChange={handleInputChange}/>
			</fieldset>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Armadura</legend>
				<input type="number" name="armor" className="input" placeholder="Armadura" onChange={handleInputChange}/>
			</fieldset>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Movimento</legend>
				<select defaultValue="select" name="movement" className="select" onChange={handleSelectChange}>
					<option disabled={true} value={'select'}>Selecione...</option>
					{[6, 9, 12].map(movement => (
						<option key={movement} value={movement}>{movement} metros</option>
					))}
				</select>
			</fieldset>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Tamanho</legend>
				<select defaultValue="select" name="size" className="select" onChange={handleSelectChange}>
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
				<select defaultValue="select" name="range" className="select" onChange={handleSelectChange}>
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
				<select defaultValue="select" name="type" className="select" onChange={handleSelectChange}>
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