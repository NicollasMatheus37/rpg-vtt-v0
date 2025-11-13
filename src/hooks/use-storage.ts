type TUseStorage = {
	groupKey: string;
}

export function useStorage<T>({ groupKey }: TUseStorage) {
	function group() {
		const group = JSON.parse(localStorage.getItem(groupKey) || '{}');
		const parsedGroup: Record<string, T> = {};

		for (const key in group) {
			parsedGroup[key] = JSON.parse(group[key]);
		}

		return parsedGroup;
	}

	function get(key: keyof T): T | undefined {
		const group = JSON.parse(localStorage.getItem(groupKey) || '{}');
		const item = group[key as string];

		if (item) return JSON.parse(item);
	}

	function set(key: string, value: any) {
		const group = this.get(groupKey) || {};
		console.log(value);

		group[key] = JSON.stringify(value);
		console.log(group);

		localStorage.setItem(groupKey, JSON.stringify(group));
	}

	function remove(key: string) {
		const group = this.get(groupKey);

		delete group[key];

		localStorage.setItem(groupKey, JSON.stringify(group));
	}

	return {
		group,
		get,
		set,
		remove
	};
}