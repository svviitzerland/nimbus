import type { PredictText } from './types';

export const en: PredictText = {
	title: 'Regression and classification',
	intro: [
		'Last time the model sorted fruit into baskets. That is one of the two big jobs a machine learning model can do. Let us meet both, starting with houses. Here come some houses that were sold, placed by their size and their price.',
		'The first job is <b>regression</b>, predicting a <b>number</b>. Watch the line tilt back and forth until it passes as close as it can to every house. The little gaps between the houses and the line shrink as it settles. That line is the model.',
		'Now a new house goes up for sale. Go up from its size to the line, then across to the price scale, and there is the prediction. The answer can be any number on the scale.',
		'The second job is <b>classification</b>, picking a <b>group</b> (also called a class). Is this email spam or not? The model splits the picture into two zones, and every new email simply lands in one of them.',
		'[ingat] Listen to the question. "How much" or "how many" means regression. "Which one" means classification. The price of a house is how much, spam or not is which one.',
		'[fyi] Same word, different world. Programmers also say <i>regression</i> when an old bug sneaks back in after an update. That has nothing to do with this one, it is just an unlucky shared name.',
		'If you like, slide the house size and watch the price follow the line. Totally optional.'
	],
	reactions: {
		ask: 'See it? Any size gives a price straight from the line, a number and never a group. Both models in this lesson learned from examples with the answers attached, which is called [[supervised learning|ai/supervised]].'
	},
	panels: [
		{
			tag: 'Examples',
			title: 'Houses that were sold',
			body: 'Each dot is one house. Left to right is its size, bottom to top is the price it sold for. Bigger houses tend to cost more.'
		},
		{
			tag: 'Regression',
			title: 'A line that fits',
			body: 'The model looks for the straight line with the smallest gaps to all the houses. That line is everything it learned.'
		},
		{
			tag: 'Prediction',
			title: 'Reading the line',
			body: 'For a new size, go up to the line and across. The answer is a <b>number</b>, and it can land anywhere on the scale.'
		},
		{
			tag: 'Classification',
			title: 'Two zones',
			body: 'Each email is placed by its links and its exclamation marks. The model draws a border, and the side decides the <b>group</b>.'
		},
		{
			tag: 'Remember',
			title: 'How much or which one',
			body: 'How much is regression, which one is classification.'
		},
		{
			tag: 'By the way',
			title: 'Regression, the other one',
			body: 'In software testing, a <b>regression</b> is an old bug that came back. Same word, completely different meaning.'
		},
		{
			tag: 'Try it',
			title: 'Slide the size',
			body: 'Move the slider and the new house moves with it. The price is read straight from the line.'
		}
	],
	regX: 'size',
	regY: 'price',
	clsX: 'links',
	clsY: 'exclamation marks',
	price: '${p}k',
	size: '{n} m²',
	spam: 'spam',
	ham: 'not spam',
	answerNumber: 'answers a number',
	answerGroup: 'answers a group',
	rule: 'How much is regression, which one is classification.',
	slider: 'House size'
};
