import React, { useState } from 'react';

export function SetGridBackgroundForm({
	onSetBackground,
	onRemoveBackground,
	onClose,
}: {
	onSetBackground: (url: string) => void;
	onRemoveBackground: () => void;
	onClose?: () => void;
}) {
	const [url, setUrl] = useState('');
	const [error, setError] = useState<string | null>(null);

	const handleUrlSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		const trimmed = url.trim();
		if (!trimmed) {
			setError('Informe uma URL ou selecione um arquivo');
			return;
		}

		// Basic URL validation
		try {
			new URL(trimmed);
		} catch {
			setError('URL inválida');
			return;
		}

		onSetBackground(trimmed);
		onClose?.();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setError(null);
		const file = e.target.files?.[0];
		if (!file) return;

		const objectUrl = URL.createObjectURL(file);
		onSetBackground(objectUrl);
		e.target.value = '';
		onClose?.();
	};

	const handleRemove = () => {
		setUrl('');
		setError(null);
		onRemoveBackground();
		onClose?.();
	};

	return (
		<div className="p-4 flex flex-col gap-4">
			<h2 className="text-xl font-bold">Background do Grid</h2>
			<p className="text-sm opacity-80">
				Defina uma imagem de fundo para o mapa. Use uma URL ou selecione um arquivo local.
			</p>

			<form onSubmit={handleUrlSubmit} className="flex flex-col gap-3">
				<fieldset className="fieldset">
					<legend className="fieldset-legend">URL da imagem</legend>
					<input
						type="url"
						className={`input ${error ? 'input-error' : ''}`}
						placeholder="https://exemplo.com/mapa.png"
						value={url}
						onChange={(e) => {
							setUrl(e.target.value);
							setError(null);
						}}
					/>
					{error && <p className="text-error text-xs mt-1">{error}</p>}
				</fieldset>
				<button type="submit" className="btn btn-primary">
					Aplicar URL
				</button>
			</form>

			<div className="divider text-sm">ou</div>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Arquivo local</legend>
				<input
					type="file"
					accept="image/*"
					className="file-input file-input-bordered w-full"
					onChange={handleFileChange}
				/>
				<p className="text-xs opacity-70 mt-1">
					PNG, JPG, GIF, WebP
				</p>
			</fieldset>

			<button
				type="button"
				className="btn btn-ghost btn-sm mt-2"
				onClick={handleRemove}
			>
				Remover background
			</button>
		</div>
	);
}
