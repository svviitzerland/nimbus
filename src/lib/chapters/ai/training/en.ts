import type { TrainingText } from './types';

export const en: TrainingText = {
	title: 'What is machine learning',
	intro: [
		'Say you want a computer to tell apples from oranges with normal code. You would write the rule by hand, like "red and small means apple". Then a slightly orange apple rolls in, and your rule calls it an orange. Oops.',
		'<b>Machine learning</b> flips that around. Instead of writing rules, you show the machine examples that already carry the right answer (the <b>label</b>). Here come six fruits, each one put in the right basket by a person.',
		'[ingat] Telling versus showing. Normal code is <b>told</b> the rule. Machine learning is <b>shown</b> examples and works the rule out itself, the way a kid learns what a dog is by meeting lots of dogs, not by reading a definition.',
		'Now the learning part, called <b>training</b>. The machine places every example by its colour and its size, then looks for a border that keeps apples on one side and oranges on the other. That border is the pattern it found, and the finished result is called the <b>model</b>.',
		'Then a fruit it has never seen rolls in. The model checks which side of the border it lands on and makes a guess, called a <b>prediction</b>. Nobody wrote a rule, yet it sorts new fruit all by itself.',
		'[fyi] Your spam folder, the videos YouTube suggests, and the camera that blurs your background all work like this. Nobody typed those rules, they came out of examples. Big models just use far more examples and clues, like a [[neural network|ai/neural-net]].',
		'Remember the slightly orange apple that broke our hand written rule? Send it to the model if you like, and see what happens.'
	],
	reactions: {
		tricky:
			'Apple! It is a bit orange, but it is small, and in the examples small fruit were apples. The model weighed both clues at once, something our single hand written rule never did.'
	},
	panels: [
		{
			tag: 'Normal code',
			title: 'A rule written by hand',
			body: 'A person guesses the rule and types it in. It works until the world throws something the rule did not expect.'
		},
		{
			tag: 'Examples',
			title: 'Fruit with labels',
			body: 'Each example comes with its right answer, its <b>label</b>. Here the label is simply the basket it sits in.'
		},
		{
			tag: 'Make it stick',
			title: 'Told or shown',
			body: 'Normal code is told the rule. Machine learning is shown examples and finds the rule itself.'
		},
		{
			tag: 'Training',
			title: 'Finding the pattern',
			body: 'Each fruit is placed by two clues, colour and size. The machine draws the border that splits the two groups best. That border is the <b>model</b>.'
		},
		{
			tag: 'Prediction',
			title: 'Sorting something new',
			body: 'A new fruit is placed by the same two clues. Whichever side of the border it lands on, that is the guess.'
		},
		{
			tag: 'In real life',
			title: 'Everywhere around you',
			body: 'Spam filters, video suggestions, and photo apps all learned from examples, just with millions of them and many more clues.'
		},
		{
			tag: 'Try it',
			title: 'The tricky apple',
			body: 'Send the fruit that fooled the hand written rule, and watch where the model puts it.'
		}
	],
	apple: 'apple',
	orange: 'orange',
	ruleTitle: 'A rule written by hand',
	ruleLines: ['Red and small means apple.', 'Anything else is an orange.'],
	ruleWrong: 'The rule called this apple an orange',
	axisColour: 'colour',
	axisSize: 'size',
	guess: 'The model says {label}',
	incoming: 'A fruit it has never seen',
	rule: 'Told the rule, normal code. Shown examples, machine learning.',
	trickyBtn: 'Send the tricky apple'
};
