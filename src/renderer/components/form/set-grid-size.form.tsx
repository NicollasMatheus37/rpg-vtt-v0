import React, { useState, useEffect } from 'react';

const MIN_SIZE = 5;
const MAX_SIZE = 50;

export function SetGridSizeForm({
	gridWidth,
	gridHeight,
	onSetSize,
	onClose,
}: {
	gridWidth: number;
	gridHeight: number;
	onSetSize: (width: number, height: number) => void;
	onClose?: () => void;
}) {
	const [width, setWidth] = useState(String(gridWidth));
	const [height, setHeight] = useState(String(gridHeight));
	const [errors, setErrors] = useState<{ width?: string; height?: string }>({});

	useEffect(() => {
		setWidth(String(gridWidth));
		setHeight(String(gridHeight));
	}, [gridWidth, gridHeight]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const newErrors: { width?: string; height?: string } = {};

		const w = parseInt(width, 10);
		const h = parseInt(height, 10);

		if (isNaN(w) || w < MIN_SIZE || w > MAX_SIZE) {
			newErrors.width = `Entre ${MIN_SIZE} e ${MAX_SIZE}`;
		}
		if (isNaN(h) || h < MIN_SIZE || h > MAX_SIZE) {
			newErrors.height = `Entre ${MIN_SIZE} e ${MAX_SIZE}`;
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		onSetSize(w, h);
		onClose?.();
	};

	const handleReset = () => {
		const sidebarWidthPx = 300; // largura do painel de logs (w-72 = 18rem, 1rem = 16px)
		const availableWidth = Math.max(window.innerWidth - sidebarWidthPx, 0);

		const rawDefaultW = Math.floor(availableWidth / 64);
		const rawDefaultH = Math.floor(window.innerHeight / 64);

		const defaultW = Math.min(Math.max(rawDefaultW, MIN_SIZE), MAX_SIZE);
		const defaultH = Math.min(Math.max(rawDefaultH, MIN_SIZE), MAX_SIZE);

		setWidth(String(defaultW));
		setHeight(String(defaultH));
		setErrors({});
		onSetSize(defaultW, defaultH);
		onClose?.();
	};

	return (
		<div className="p-4 flex flex-col gap-4">
			<h2 className="text-xl font-bold">Tamanho do Grid</h2>
			<p className="text-sm opacity-80">
				Defina a quantidade de colunas e linhas do grid.
			</p>

			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<fieldset className="fieldset">
					<legend className="fieldset-legend">Largura (colunas)</legend>
					<input
						type="number"
						min={MIN_SIZE}
						max={MAX_SIZE}
						className={`input ${errors.width ? 'input-error' : ''}`}
						value={width}
						onChange={(e) => {
							setWidth(e.target.value);
							setErrors((prev) => ({ ...prev, width: undefined }));
						}}
					/>
					{errors.width && <p className="text-error text-xs mt-1">{errors.width}</p>}
				</fieldset>

				<fieldset className="fieldset">
					<legend className="fieldset-legend">Altura (linhas)</legend>
					<input
						type="number"
						min={MIN_SIZE}
						max={MAX_SIZE}
						className={`input ${errors.height ? 'input-error' : ''}`}
						value={height}
						onChange={(e) => {
							setHeight(e.target.value);
							setErrors((prev) => ({ ...prev, height: undefined }));
						}}
					/>
					{errors.height && <p className="text-error text-xs mt-1">{errors.height}</p>}
				</fieldset>

				<div className="flex gap-2">
					<button type="submit" className="btn btn-primary flex-1">
						Aplicar
					</button>
					<button type="button" className="btn btn-ghost" onClick={handleReset}>
						Padrão
					</button>
				</div>
			</form>
		</div>
	);
}
