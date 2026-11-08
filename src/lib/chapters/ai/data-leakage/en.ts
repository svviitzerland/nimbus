import type { ExperimentText } from '../../types';

export const en: ExperimentText = {
	title: 'Data leakage',
	intro: [
		'A high test score feels good. But what if the test questions were already in the practice book? A model can look capable just by remembering the same examples.',
		'This is a deliberately simple memorizer. It remembers IDs A, B, and C and their labels. For a new ID it always guesses cat. Evaluate and check which examples it has seen.',
		'A and B appear again in the test set. The 75 percent score includes those memorized examples. <b>Data leakage</b> happens when information that should stay separate leaks into training or evaluation.',
		'Remove duplicates and evaluate again. Two new examples remain, one right and one wrong. The 50 percent score is more honest for these two cases, but the sample is too small for a broad conclusion.',
		'[ingat] <b>The test must bring new examples.</b> Split before learning. If many rows belong to one person or event, split by the appropriate group or time.'
	],
	reactions: {
		leak: '3 of 4 are correct, but two were memorized. This score does not establish performance on new examples.',
		clean: 'Now 1 of 2 is correct. The model stayed the same; the evaluation changed.'
	},
	labLabel: 'Your experiment',
	goal: 'Separate memorization from new performance',
	tasks: ['Evaluate overlapping data', 'Remove overlap and reevaluate'],
	hintLabel: 'Hint',
	hint: 'Evaluate with duplicates included. Check the box, then evaluate again. Compare the counted examples.',
	scope: 'Local simulation. All examples run in this page without contacting nimbus.com.',
	labels: {
		run: 'Run evaluation',
		clean: 'Exclude training IDs',
		train: 'Training data',
		test: 'True label then prediction',
		model: 'The model memorizes training IDs and guesses cat for new IDs.',
		cat: 'Cat',
		dog: 'Dog',
		seen: 'Seen before',
		new: 'New example',
		waiting: 'Run to see predictions'
	}
};
