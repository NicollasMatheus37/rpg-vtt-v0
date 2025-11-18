import React, { useReducer, useContext } from 'react';
import { characterSizeOptions } from '../../../enums/character-size.enum';
import { characterRangeOptions } from '../../../enums/character-range.enum';
import { characterTypeOptions } from '../../../enums/character-type.enum';
import { EnemyDto } from '../../../dtos/enemy.dto';
import { EntitiesContext } from '../../../contexts/entities.context';

type Action = { type: 'SET_FIELD', field: keyof EnemyDto, value: any } | { type: 'RESET' };

export function CreateEnemyForm({ onClose }: { onClose?: () => void }) {
	const entitiesContext = useContext(EntitiesContext);
	const [formState, dispatch] = useReducer((state: Partial<EnemyDto>, action: Action) => {
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

	const [errors, setErrors] = React.useState<Partial<Record<keyof EnemyDto, string>>>({});

	const getFieldValue = (field: keyof EnemyDto): any => {
		return formState[field] ?? '';
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		const numValue = e.target.type === 'number' ? Number(value) : value;
		dispatch({ type: 'SET_FIELD', field: name as keyof EnemyDto, value: numValue });
		// Clear error when user starts typing
		if (errors[name as keyof EnemyDto]) {
			setErrors(prev => ({ ...prev, [name]: undefined }));
		}
	}

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		const numValue = ['movement', 'size', 'range', 'type'].includes(name) ? value : value;
		dispatch({ type: 'SET_FIELD', field: name as keyof EnemyDto, value: numValue });
		// Clear error when user selects
		if (errors[name as keyof EnemyDto]) {
			setErrors(prev => ({ ...prev, [name]: undefined }));
		}
	}

	const validateForm = (): boolean => {
		const newErrors: Partial<Record<keyof EnemyDto, string>> = {};
		
		if (!formState.name || (typeof formState.name === 'string' && formState.name.trim() === '')) {
			newErrors.name = 'Nome é obrigatório';
		}
		if (!formState.hp || formState.hp <= 0) {
			newErrors.hp = 'Vida deve ser maior que 0';
		}
		if (formState.armor === undefined || formState.armor < 0) {
			newErrors.armor = 'Armadura é obrigatória';
		}
		if (!formState.movement) {
			newErrors.movement = 'Movimento é obrigatório';
		}
		if (!formState.size) {
			newErrors.size = 'Tamanho é obrigatório';
		}
		if (!formState.range) {
			newErrors.range = 'Alcance é obrigatório';
		}
		if (!formState.type) {
			newErrors.type = 'Tipo é obrigatório';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		const enemy = new EnemyDto().create(formState);
		entitiesContext.addEnemy(enemy);
		dispatch({ type: 'RESET' });
		setErrors({});
		
		if (onClose) {
			onClose();
		}
	}

	return (
		<form className={'p-4 flex flex-col'} onSubmit={handleSubmit}>
			<h2 className="text-xl">Create Enemy</h2>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Nome</legend>
				<input 
					type="text" 
					name="name" 
					className={`input ${errors.name ? 'input-error' : ''}`} 
					placeholder="Nome" 
					value={getFieldValue('name')}
					required
					onChange={handleInputChange}
				/>
				{errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
			</fieldset>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Vida</legend>
				<input 
					type="number" 
					name="hp" 
					className={`input ${errors.hp ? 'input-error' : ''}`} 
					placeholder="Vida" 
					min="1"
					value={getFieldValue('hp')}
					required
					onChange={handleInputChange}
				/>
				{errors.hp && <p className="text-error text-xs mt-1">{errors.hp}</p>}
			</fieldset>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Armadura</legend>
				<input 
					type="number" 
					name="armor" 
					className={`input ${errors.armor ? 'input-error' : ''}`} 
					placeholder="Armadura" 
					min="0"
					value={getFieldValue('armor')}
					required
					onChange={handleInputChange}
				/>
				{errors.armor && <p className="text-error text-xs mt-1">{errors.armor}</p>}
			</fieldset>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Movimento</legend>
				<select 
					name="movement" 
					className={`select ${errors.movement ? 'select-error' : ''}`} 
					value={getFieldValue('movement') || 'select'}
					required
					onChange={handleSelectChange}
				>
					<option disabled={true} value={'select'}>Selecione...</option>
					{[6, 9, 12].map(movement => (
						<option key={movement} value={movement}>{movement} metros</option>
					))}
				</select>
				{errors.movement && <p className="text-error text-xs mt-1">{errors.movement}</p>}
			</fieldset>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Tamanho</legend>
				<select 
					name="size" 
					className={`select ${errors.size ? 'select-error' : ''}`} 
					value={getFieldValue('size') || 'select'}
					required
					onChange={handleSelectChange}
				>
					<option disabled={true} value={'select'}>Selecione...</option>
					{characterSizeOptions.map((option, index) => (
						<option key={'sizeSelect_'+index} value={option.value}>
							{option.label} ({option.gridSize}x{option.gridSize})
						</option>
					))}
				</select>
				{errors.size && <p className="text-error text-xs mt-1">{errors.size}</p>}
			</fieldset>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Alcance</legend>
				<select 
					name="range" 
					className={`select ${errors.range ? 'select-error' : ''}`} 
					value={getFieldValue('range') || 'select'}
					required
					onChange={handleSelectChange}
				>
					<option disabled={true} value={'select'}>Selecione...</option>
					{characterRangeOptions.map((option, index) => (
						<option key={'rangeSelect_'+index} value={option.value}>
							{option.label} ({option.gridRange} {option.gridRange > 1 ? 'quadrados' : 'quadrado'})
						</option>
					))}
				</select>
				{errors.range && <p className="text-error text-xs mt-1">{errors.range}</p>}
			</fieldset>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Tipo</legend>
				<select 
					name="type" 
					className={`select ${errors.type ? 'select-error' : ''}`} 
					value={getFieldValue('type') || 'select'}
					required
					onChange={handleSelectChange}
				>
					<option disabled={true} value={'select'}>Selecione...</option>
					{characterTypeOptions.map((option, index) => (
						<option key={'typeSelect_'+index} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				{errors.type && <p className="text-error text-xs mt-1">{errors.type}</p>}
			</fieldset>

			<button type="submit" className="btn btn-primary mt-4">Create Enemy</button>
		</form>
	)
}