export const trainingRows = [
	{ id: 'A', label: 'cat' },
	{ id: 'B', label: 'dog' },
	{ id: 'C', label: 'cat' }
];
export const testRows = [
	{ id: 'A', label: 'cat' },
	{ id: 'B', label: 'dog' },
	{ id: 'D', label: 'cat' },
	{ id: 'E', label: 'dog' }
];
/** Deliberately weak model, memorizes IDs and guesses cat for unseen examples. */
export function evaluate(removeOverlap: boolean) {
	const train = new Map(trainingRows.map((row) => [row.id, row.label]));
	return testRows
		.filter((row) => !removeOverlap || !train.has(row.id))
		.map((row) => ({
			...row,
			overlap: train.has(row.id),
			prediction: train.get(row.id) ?? 'cat'
		}));
}
