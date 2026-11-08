import type { PredictText } from './types';

export const en: PredictText = {
	title: 'Regression and classification',
	intro: [
		'Last time the model sorted fruit into baskets. That is one of the two big jobs a machine learning model can do. Today we meet both of them.',
		'<b>Regression</b> predicts a <b>number</b>. How much will this house sell for, how many minutes until the food arrives, how hot will it be tomorrow. The answer can land anywhere on a scale.',
		'<b>Classification</b> picks a <b>group</b> (also called a class). Is this email spam or not, is this photo a cat, is this payment a fraud. The answer is always one of a few fixed choices.',
		'[fyi] In software development, a regression means previously working behavior breaks after a change. [[Application tests|web/testing]] help detect it. This differs from regression in statistics.',
		'A quick way to tell them apart is to picture the answer. If you would answer with a slider, it is regression. If you would answer by tapping one of a few buttons, it is classification.',
		'[ingat] Listen to the question. "How much" or "how many" means regression. "Which one" means classification. The price of a house is how much, spam or not is which one.',
		'Here are two mini models. The house one draws the straight line that fits its points best, the email one asks the three closest emails it knows. Add your own points, then ask both of them something.'
	],
	reactions: {
		reg_add:
			'New house added, and the line shifted to fit it. That line is the whole model, it tries to pass as close as it can to every point.',
		reg_ask:
			'To answer, it goes up from the size you picked to the line, then across to the price. Any number can come out, which is what makes it regression.',
		cls_add:
			'Your email joined the examples. See the shaded zones redraw? Each zone shows the group a new email dropped there would get.',
		cls_ask:
			'The new email checks the three known emails closest to it and goes with the majority. Only two answers exist, spam or not spam.',
		cls_flip:
			'It crossed the border and switched groups! A classification answer jumps from one group to the other, never somewhere in between.',
		both: 'You asked both! One handed back a number, the other a group, and that single difference tells you which kind of model you need. Both learned from labelled examples, which is called [[supervised learning|ai/supervised]].'
	},
	tabReg: 'House price',
	tabCls: 'Spam or not',
	regTitle: 'Regression, house prices',
	clsTitle: 'Classification, spam or not',
	regKind: 'answers a number',
	clsKind: 'answers a group',
	regX: 'Size (m²)',
	regY: 'Price',
	clsX: 'Links in the email',
	clsY: 'Exclamation marks',
	regHint: 'Tap the chart to add a house you know the price of',
	askSize: 'House size to ask about',
	regAnswer: 'A {size} m² house goes for about ${price}k',
	regNeed: 'Add a house so it can draw a line',
	spam: 'spam',
	ham: 'not spam',
	addAs: 'Tap to add',
	clsHint: 'Drag the new email (?) around',
	clsAnswer: 'The new email looks like {label}',
	newEmail: 'New email, use the arrow keys to move it',
	clear: 'Clear'
};
