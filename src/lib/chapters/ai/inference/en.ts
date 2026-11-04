import type { InferenceText } from './types';

const spam = (text: string) => ({ text, spam: true });
const ham = (text: string) => ({ text, spam: false });

export const en: InferenceText = {
	title: 'Training and inference',
	intro: [
		'A model has two very different moments in its life. First it learns, then it works. Those two moments have names, <b>training</b> and <b>inference</b>.',
		'<b>Training</b> is the studying. The computer reads lots of examples (here, emails already marked spam or normal) again and again, adjusting itself a tiny bit each time. For a big model that keeps thousands of computers busy for weeks.',
		'What comes out is the <b>model</b>, basically a file full of numbers. It moves onto a server, and from then on it is frozen. It does not learn anything new while it works.',
		'<b>Inference</b> is the working. Someone sends a question, the model runs once and answers, done. One answer takes a tiny fraction of a second.',
		'And it never gets tired. The same frozen model can answer millions of people a day, one quick answer after another.',
		'[ingat] Cook once, serve many times. Training is cooking a huge pot, slow and expensive. Inference is scooping out a plate, quick, again and again.',
		"[fyi] Every time you chat with an AI app, you are doing inference. The training happened months earlier on special chips called [[GPUs|ai/gpu]]. Apps that use someone else's model pay a little for every answer, through an [[API|ai/ai-api]].",
		'If you like, tap one of the emails below and send it to the model yourself. The answer is back before you can blink.'
	],
	reactions: {
		ask: 'Answered in less than a millisecond! It did not study anything new, it just looked the words up in what it already learned. That is inference.'
	},
	panels: [
		{
			tag: 'Two moments',
			title: 'Learn first, then work',
			body: 'The top half is where the model learns, the bottom half is where it works for people. They happen at different times, often on different machines.'
		},
		{
			tag: 'Training',
			title: 'The long study',
			body: 'Examples flow into the machines, and the model adjusts itself after each one. The bar is slow on purpose, real training takes days or weeks.'
		},
		{
			tag: 'The model',
			title: 'A frozen file of numbers',
			body: 'All that studying ends up as one file. It gets copied onto a server, and from now on it only answers, it does not learn.'
		},
		{
			tag: 'Inference',
			title: 'One question, one quick answer',
			body: 'A phone sends an email to the server, the model checks its words against what it learned, and replies spam or not spam in under a millisecond.'
		},
		{
			tag: 'At scale',
			title: 'Again and again',
			body: 'Each answer is tiny, but there are millions of them. That is why companies care about the cost of inference too, not just training.'
		},
		{
			tag: 'Remember',
			title: 'Cook once, serve many times',
			body: 'Training happens once (or once in a while, for a new version) and is slow. Inference happens on every question and is fast.'
		},
		{
			tag: 'Try it',
			title: 'Ask the model',
			body: 'Tap an email. The model has never seen it, but it still answers instantly from what it learned.'
		}
	],
	examples: [
		spam('win a free phone now'),
		ham('the meeting moved to monday'),
		spam('claim your free prize today'),
		ham('lunch with the team tomorrow'),
		spam('cheap pills, click this link'),
		ham('here are my notes from class'),
		spam('you won cash, click now'),
		ham('can you review my code today'),
		spam('urgent, verify your bank password'),
		ham('mom says dinner at seven'),
		spam('free gift card, claim it now'),
		ham('the report is attached'),
		spam('earn money fast from home'),
		ham('see you at the gym later'),
		spam('limited offer, buy now and win'),
		ham('thanks for the help with nimbus.com')
	],
	questions: [
		'claim your free cash now',
		'notes for the meeting tomorrow',
		'click this link to win',
		'dinner with the team tonight'
	],
	trainTitle: 'Training, happens once',
	inferTitle: 'Inference, every question',
	reading: 'Reading example {n} of {total}',
	day: 'Day {n} of computer time',
	modelFile: 'spam model',
	frozen: 'frozen',
	you: 'You',
	server: 'Server',
	spam: 'spam',
	ham: 'not spam',
	spamTag: 'spam',
	hamTag: 'normal',
	fast: 'under 1 ms',
	answered: '{n} answered',
	sep: ',',
	longBar: 'Training',
	shortBar: 'One answer',
	longTime: 'weeks',
	shortTime: 'a blink',
	rule: 'Cook once, serve many times',
	askHint: 'Tap an email to ask the model'
};
