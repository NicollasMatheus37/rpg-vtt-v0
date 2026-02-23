export {};

declare global {
	interface Window {
		electronAPI: {
			ping: () => string;
			saveCurrentGrid: (snapshot: unknown) => Promise<{ gridId: string }>;
		};
	}
}
