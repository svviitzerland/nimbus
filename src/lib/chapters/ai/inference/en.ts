import type { InferenceText } from './types';

const spam = (text: string) => ({ text, spam: true });
const ham = (text: string) => ({ text, spam: false });

export const en: InferenceText = {
	title: 'Training and inference',
	intro: [
		'A model is used in two processes, <b>training</b> to adjust parameters and <b>inference</b> to produce predictions.',
		'<b>Training</b> adjusts model parameters using training data. Time and cost depend on the model, data, and hardware.',
		'Training produces a model with adjusted parameters. In this example they remain fixed during inference. Updating them requires more training.',
		'<b>Inference</b> uses the model to process new input. This spam filter reads words in an email and predicts spam or not spam.',
		'[fyi] An application can run its own model or use an [[AI API|ai/ai-api]]. Inference costs depend on hardware, model, and usage.',
		'[ingat] Training adjusts model parameters. Inference uses the model to produce predictions or new outputs.',
		'Train the spam filter, deploy it to the simulated server, and try some emails. Compare training with inference.'
	],
	reactions: {
		training:
			'The filter counts words in spam and non-spam emails. Displayed time and cost are illustrations for this exercise.',
		trained:
			'Training is complete. The model stores word counts to use when predicting new emails.',
		ask: 'The prediction uses the trained model. This input does not change its parameters.',
		typed:
			'Your own sentence, one it has never seen, and still an instant answer. It only knows words from training, so a word it never met simply counts for nothing.',
		rush: 'Multiple inference requests use the same model. Total cost still grows with usage.'
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
	trainTitle: 'Training the model',
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
	inferTitle: 'Using the model for inference',
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
