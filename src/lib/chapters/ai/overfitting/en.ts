import type { OverfittingText } from './types';

export const en: OverfittingText = {
	title: 'Overfitting',
	intro: [
		'Picture a student who memorises every answer in the practice book, word for word. Practice test, a perfect score. Then the real exam asks the same ideas with new numbers, and the student is lost.',
		'Models can do exactly that. When a model learns its examples too well, random little quirks included, it is called <b>overfitting</b>. It looks brilliant on the examples it studied and stumbles on anything new.',
		'The opposite happens too. A model that is too simple misses the real pattern, even on its own examples. That is <b>underfitting</b>. The goal sits in between, a model that catches the pattern and ignores the noise.',
		'That is why people hide some examples away before training, called the <b>test set</b>. The model never studies them, so they work like the real exam. The examples it does study are the <b>training set</b>.',
		'[fyi] Big chatbots can fall into this too. If a famous quiz leaks into their training data, they can recite the answers without really getting the ideas, so researchers keep their best test questions secret.',
		'Here are the house prices from [[before|ai/predict]], except my line can bend now. Slide it from stiff to wiggly and watch the practice score, then bring in houses it has never seen.'
	],
	reactions: {
		practice:
			'A perfect practice score! The curve now passes through every single house. Sounds great, but did it learn prices or just memorise these nine? Bring in the new houses and find out.',
		reveal:
			'These houses were hidden during training. The red lines show how far off the curve is for each one. The new houses score is the one that really counts.',
		under:
			'Too stiff. A straight line cannot follow the way prices level off for big houses, so it misses on practice and on new houses alike. That is underfitting.',
		fit: 'Sweet spot! A gentle bend follows the real trend and shrugs off the noise, so it does best on houses it never saw.',
		over: 'Practice score up, new houses score down. The curve twists itself through every practice house, quirks and all, and swings wildly in the gaps. That is overfitting.',
		done: 'You found both ends! More flexible is not always better. Real teams choose a model by its test score, never its practice score, and they gather more data when they can, which calms the wiggles down.'
	},
	xAxis: 'Size (m²)',
	yAxis: 'Price',
	bend: 'How bendy the curve is',
	stiff: 'stiff',
	wiggly: 'wiggly',
	verdicts: {
		under: 'Too simple',
		fit: 'Just right',
		mid: 'Getting twisty',
		over: 'Memorising'
	},
	trainScore: 'Practice houses',
	testScore: 'New houses',
	hidden: 'hidden',
	revealBtn: 'Bring in new houses',
	legendTrain: 'studied',
	legendTest: 'never seen',
	chartLabel: 'House prices with a fitted curve'
};
