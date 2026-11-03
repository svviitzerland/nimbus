import type { TrainingText } from './types';

export const en: TrainingText = {
	title: 'What is machine learning',
	intro: [
		'Say you want a computer to tell apples from oranges using normal code. You would write rules by hand, like "red and small means apple". Then a slightly orange apple rolls in, and your rule falls apart.',
		'<b>Machine learning</b> flips that around. Instead of writing rules, you show the machine lots of examples that already carry the right answer (the <b>label</b>), and it finds the pattern by itself.',
		'That finding step is called <b>training</b>, and the pattern it ends up with is the <b>model</b>. After that you can show it a fruit it has never seen, and it makes a guess, called a <b>prediction</b>.',
		'[fyi] Your spam folder, the videos YouTube suggests, and the camera that blurs your background all work like this. Nobody typed those rules, they came out of examples.',
		'My model is tiny, it only sees two things about a fruit, its colour and its size. Put the first six fruits in the right basket, train it, then let it sort the rest alone.'
	],
	reactions: {
		label:
			'That is a label. You just told the machine the right answer for one example. Real datasets get labelled like this thousands of times, often by people clicking all day.',
		ready: 'Six examples, all labelled. Now press train and let it hunt for the pattern.',
		trained:
			'Done! It boiled your six examples down to an average apple and an average orange. That little summary is the model. Now send it a fruit it has never seen.',
		right:
			'Right on, and nobody wrote a rule for it. It simply checked which average the new fruit is closer to, in colour and in size.',
		wrong:
			'Oh, a wrong guess. Look in the baskets, the fruit with a red dot was taught with the wrong label, and the model faithfully learned your slip. Start over and teach it again.',
		done: 'All five sorted on its own! That is machine learning in a nutshell, examples in, pattern out, then guesses about new things. Big models just use far more examples and clues, like a [[neural network|ai/neural-net]].'
	},
	apple: 'apple',
	orange: 'orange',
	basket: 'Put it in the {label} basket',
	labelHint: 'Which basket? {n} of 6 labelled',
	readyHint: 'All six labelled, ready to learn',
	trainBtn: 'Train the model',
	training: 'Studying the examples',
	nextBtn: 'Send a new fruit',
	guess: 'Looks like an {label} ({n}% sure)',
	sorted: '{n} of 5 new fruits sorted',
	doneNote: 'Every new fruit sorted by the model',
	learnedTitle: 'What it learned',
	notYet: 'Nothing yet, it needs examples first',
	avg: 'average {label}',
	sees: 'It only sees colour and size',
	byYou: 'labelled by you',
	byModel: 'sorted by the model',
	reset: 'Start over'
};
