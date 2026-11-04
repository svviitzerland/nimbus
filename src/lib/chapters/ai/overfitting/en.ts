import type { OverfittingText } from './types';

export const en: OverfittingText = {
	title: 'Overfitting',
	intro: [
		'Remember the house prices from [[before|ai/predict]]? A model learns from examples, the way a student learns from a practice exam. These nine houses are its practice questions, each one a size and a price.',
		'First the model may only draw a straight line. It is too stiff to follow how prices calm down for big houses, so it misses even its own practice houses. That is called <b>underfitting</b>, the model is too simple.',
		'Now give it a little freedom to bend. The curve follows the real trend (prices go up, then level off) and simply ignores the small random bumps. This is the sweet spot.',
		'But what if we keep giving it more freedom? Watch. The curve twists itself through every single house, and the practice score climbs all the way to 100.',
		'Time for the real exam. The green houses were hidden the whole time, the model never studied them. Between the practice houses the curve swings wildly, so its guesses for the new ones are way off. That is <b>overfitting</b>.',
		'[ingat] Overfitting is memorising the practice exam. A perfect score on questions you have seen, lost on the ones you have not. So a model is always judged by the real exam, never by the practice one.',
		'[fyi] Big chatbots can fall into this too. If a famous quiz leaks into their training data, they can recite the answers without really getting the ideas, so researchers keep their best test questions secret.',
		'Want to feel it yourself? Slide the curve from stiff to wiggly and watch both scores. Totally optional, the houses will wait.'
	],
	reactions: {
		under:
			'Too stiff again. A straight line misses on the practice houses and the new ones alike. That is underfitting.',
		fit: 'Sweet spot! A gentle bend follows the trend and shrugs off the noise, so it does best on houses it never saw.',
		over: 'Practice score up, real exam down. The curve memorised every practice house, quirks and all. That is overfitting.'
	},
	panels: [
		{
			tag: 'Training set',
			title: 'The practice questions',
			body: 'Each little house is one example the model studies, its size along the bottom and its price going up. Together they are called the <b>training set</b>.'
		},
		{
			tag: 'Too simple',
			title: 'A straight line',
			body: 'A line cannot bend, so it cuts through the middle and misses on both ends. A model this simple is <b>underfitting</b>.'
		},
		{
			tag: 'Just right',
			title: 'A gentle bend',
			body: 'The curve follows the overall shape and ignores the little bumps. Those bumps are <b>noise</b>, random wobbles that every real dataset has.'
		},
		{
			tag: 'Too much freedom',
			title: 'Hitting every dot',
			body: 'With enough bends the curve can pass through every practice house. The practice score says 100, which looks perfect, but watch the gaps between houses.'
		},
		{
			tag: 'Test set',
			title: 'The real exam',
			body: 'The green houses were kept aside, people call them the <b>test set</b>. The red lines show how far each guess is off. This is the score that counts.'
		},
		{
			tag: 'Make it stick',
			title: 'Memorising the practice exam',
			body: 'Great on what it has seen, poor on what it has not. Teams pick a model by its real exam score, and more data usually calms the wiggles down.'
		},
		{
			tag: 'Try it',
			title: 'Bend it yourself',
			body: 'Slide from stiff to wiggly. The practice score only ever goes up, while the real exam score rises first and then falls.'
		}
	],
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
	trainScore: 'Practice exam',
	testScore: 'Real exam',
	hidden: 'not yet',
	legendTrain: 'studied',
	legendTest: 'never seen',
	rule: 'Judge it by the real exam, never the practice one',
	chartLabel: 'House prices with a fitted curve'
};
