import type { InferenceText } from './types';

const spam = (text: string) => ({ text, spam: true });
const ham = (text: string) => ({ text, spam: false });

export const en: InferenceText = {
	title: 'Training and inference',
	intro: [
		'A model has two very different moments in its life. First it learns, then it works. Those two moments have names, <b>training</b> and <b>inference</b>.',
		'<b>Training</b> is the studying. The machine goes through every example, again and again, adjusting itself a tiny bit each time. For a big model that means thousands of computers busy for weeks, and a bill in the millions. Luckily it only happens once (or once in a while, for a new version).',
		'What comes out is the <b>model</b>, basically a file full of numbers. From then on it is frozen, it does not learn anything new while it works.',
		'<b>Inference</b> is the working. Someone asks a question, the model runs once and gives an answer, done. One answer takes a tiny fraction of a second, and the same model can serve millions of people a day.',
		"[fyi] Every time you chat with an AI app, you are doing inference. The training happened months earlier on special chips called [[GPUs|ai/gpu]]. Apps that use someone else's model pay a little for every answer, through an [[API|ai/ai-api]].",
		'Let me train a little spam filter for you. Press train and watch the long bar, then put the model on a server and fire questions at it.'
	],
	reactions: {
		training:
			'Training is running. My filter reads each labelled email and counts which words show up in spam and which in normal mail. The meters show what this step costs at the size of a real big model.',
		trained:
			'Done, and that was the slow, pricey part. Out came a small file of word counts. It moves onto the server, and from now on it only answers.',
		ask: 'Answered in less than a millisecond! It did not study anything new, it just looked the words up in what it already learned. That is inference.',
		typed:
			'Your own sentence, one it has never seen, and still an instant answer. It only knows words from training, so a word it never met simply counts for nothing.',
		rush: 'A thousand questions, answered faster than a blink, while training needed that whole long bar. Train once, slowly. Answer again and again, quickly. With millions of users those tiny answers still add up to a real bill, which is why companies care about both.'
	},
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
	trainBtn: 'Train the model',
	reading: 'Reading example {n} of {total}',
	days: 'Computers busy',
	daysValue: '{n} days',
	cost: 'Bill so far',
	costValue: '${n} million',
	decimal: '.',
	scaleNote: 'Meters show a big model at real scale',
	trainedOnce: 'Trained once, {days} days and {cost}',
	modelFile: 'spam model',
	modelInfo: '{n} words learned',
	frozen: 'frozen, not learning',
	you: 'You',
	server: 'Server',
	inferTitle: 'Inference, every question',
	askHint: 'Tap an email or type your own',
	placeholder: 'Type an email line',
	askBtn: 'Ask',
	spam: 'spam',
	ham: 'not spam',
	fast: 'under 1 ms',
	ms: '{n} ms',
	answered: '{n} questions answered',
	rushBtn: 'Send 1,000 at once',
	rushDone: '1,000 answers in {time}',
	spamTag: 'spam',
	hamTag: 'normal'
};
