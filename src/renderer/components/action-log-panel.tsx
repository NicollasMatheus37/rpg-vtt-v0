import React from 'react';
import type { ActionLogEntry, ActionLogType } from '../../types/action-log.types';

type ActionLogPanelProps = {
	entries: ActionLogEntry[];
	maxEntries?: number;
};

const typeStyles: Record<ActionLogType, string> = {
	create: 'text-sky-600',
	move: 'text-amber-600',
	attack: 'text-red-600',
	heal: 'text-emerald-600',
};

const typeLabels: Record<ActionLogType, string> = {
	create: 'Criado',
	move: 'Movimento',
	attack: 'Ataque',
	heal: 'Cura',
};

function formatTime(ts: number): string {
	const d = new Date(ts);
	return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function ActionLogPanel({ entries, maxEntries = 100 }: ActionLogPanelProps) {
	const displayEntries = entries.slice(-maxEntries).reverse();

	return (
		<div
			className="fixed top-12 right-0 bottom-0 w-72 z-30 flex flex-col bg-stone-900/95 border-l border-stone-700 shadow-xl"
			aria-label="Log de ações"
		>
			<div className="shrink-0 px-3 py-2 border-b border-stone-700">
				<h2 className="text-sm font-semibold text-stone-200 uppercase tracking-wider">
					Log de ações
				</h2>
			</div>
			<div className="flex-1 overflow-y-auto p-2 space-y-2">
				{displayEntries.length === 0 ? (
					<p className="text-stone-500 text-sm py-4 text-center">Nenhuma ação registrada.</p>
				) : (
					displayEntries.map((entry) => (
						<div
							key={entry.id}
							className="rounded-md bg-stone-800/80 px-3 py-2 text-sm border border-stone-700/80"
						>
							<div className="flex items-center gap-2 flex-wrap">
								<span className={`font-medium ${typeStyles[entry.type]}`}>
									[{typeLabels[entry.type]}]
								</span>
								<span className="text-stone-400 text-xs">{formatTime(entry.timestamp)}</span>
							</div>
							<p className="text-stone-200 mt-1 break-words">{entry.message}</p>
							{entry.amount != null && (
								<p className="text-stone-400 text-xs mt-0.5">
									{entry.type === 'attack' ? `Dano: ${entry.amount}` : `Cura: +${entry.amount}`}
								</p>
							)}
						</div>
					))
				)}
			</div>
		</div>
	);
}
