import type { Guess, LlmText } from './types';

const after = (): Guess[] => [
	['with', 36],
	['.', 30],
	['and', 20],
	['every', 14]
];
const end = (): Guess[] => [
	['.', 70],
	['every', 20],
	['and', 10]
];
const stop = (): Guess[] => [
	['.', 80],
	['every', 20]
];

export const en: LlmText = {
	title: 'LLMs and tokens',
	intro: [
		'You have probably chatted with ChatGPT, Gemini, or Claude. You ask something, and a smooth answer appears word by word, as if someone were typing back. The brain inside each of them is an <b>LLM</b>, short for large language model.',
		'Here is the surprise. An LLM does one tiny job, over and over. It guesses what comes <b>next</b>. Your phone keyboard does the same thing when it suggests the next word above the keys.',
		'First, the model chops your text into small pieces called <b>tokens</b>. A token is often a whole word, sometimes half a word, sometimes just a full stop. Then every token becomes a number, because computers only work with numbers.',
		'Now the guessing. After "Nim likes to eat", the model gives every possible next token a chance. "rice" gets 40 percent, "noodles" 24, and so on down to the odd ones.',
		'It picks one, sticks it on the end, and guesses again with the longer sentence. Guess, pick, add, repeat. A long chatbot answer is just this loop running hundreds of times in a blink.',
		'There is a knob called <b>temperature</b>. Turn it down and the top guess wins almost every time (safe, a bit boring). Turn it up and the bars even out, so surprising words sneak in (creative, sometimes nonsense).',
		'[ingat] An LLM is your phone autocomplete with super powers. Your keyboard guesses one word and stops. An LLM keeps guessing until a whole answer is written.',
		'[fyi] A real LLM is a giant [[neural network|ai/neural-net]] trained on a mountain of books and websites. That is also why it can sound sure while being wrong. It only knows what usually comes next, not what is true.',
		'Want to watch it write something new? Roll another ending and see it guess its way to the full stop. Totally optional.'
	],
	reactions: {
		roll: 'A fresh ending, built one token at a time. It took the top guess each time, so it came out tidy and expected.',
		surprise:
			'Ha, it did not always take the top guess! A less likely token won the roll. That is why asking a chatbot the same thing twice can give two different answers.'
	},
	panels: [
		{
			tag: 'Chatbot',
			title: 'An answer, word by word',
			body: 'Behind the chat window sits an <b>LLM</b>. The reply shows up a little at a time because it really is made a little at a time.'
		},
		{
			tag: 'Next word',
			title: 'Just like your keyboard',
			body: 'Your phone looks at what you typed and offers the three most likely next words. An LLM does the same job, only much, much better.'
		},
		{
			tag: 'Tokens',
			title: 'Text becomes pieces',
			body: 'Common words stay whole, long ones split (learn plus ing), and the full stop is its own piece. The number under each piece is what the model actually reads.'
		},
		{
			tag: 'Guesses',
			title: 'Every option gets a chance',
			body: 'Each bar is one guess for the next token. A longer bar means more likely. All the chances together add up to 100 percent.'
		},
		{
			tag: 'The loop',
			title: 'Guess, pick, add, repeat',
			body: 'The picked token joins the sentence, and the model guesses again from the new, longer sentence. It never plans the whole answer ahead.'
		},
		{
			tag: 'Temperature',
			title: 'Safe or wild',
			body: 'Low temperature makes the top bar huge, so the answer is predictable. High temperature flattens the bars, so rare words get a real chance.'
		},
		{
			tag: 'Remember it',
			title: 'Super powered autocomplete',
			body: 'Your keyboard guesses one word. An LLM keeps guessing, token after token, until the answer is done.'
		},
		{
			tag: 'Try it',
			title: 'Roll another ending',
			body: 'Each roll picks by chance using the bars, so the same start can end in a different sentence every time.'
		}
	],
	picture: 'A phone where an AI writes a sentence one token at a time',
	chatTitle: 'nimbus chat',
	you: 'You',
	ai: 'AI',
	chatAsk: 'What does Nim like to eat?',
	start: 'Nim likes to eat',
	suggestions: ['rice', 'noodles', 'bread'],
	tokenWords: [['Nim'], ['is'], ['learn', 'ing'], ['network', 'ing'], ['.']],
	tokensCount: '{n} tokens',
	idsNote: 'The number under each token is what the model sees',
	nextLabel: 'Top guesses for the next token',
	path: ['rice', 'with', 'friends', '.'],
	table: {
		eat: [
			['rice', 40],
			['noodles', 24],
			['bread', 16],
			['pizza', 12],
			['clouds', 8]
		],
		rice: after(),
		noodles: after(),
		bread: after(),
		pizza: after(),
		clouds: [
			['.', 45],
			['with', 30],
			['every', 25]
		],
		with: [
			['friends', 42],
			['chili', 26],
			['cheese', 18],
			['chicken', 14]
		],
		friends: end(),
		chili: end(),
		cheese: end(),
		chicken: end(),
		and: [
			['tea', 45],
			['cake', 35],
			['soup', 20]
		],
		tea: stop(),
		cake: stop(),
		soup: stop(),
		every: [
			['day', 60],
			['night', 40]
		],
		day: [['.', 100]],
		night: [['.', 100]]
	},
	tempLabel: 'Temperature',
	cold: 'Safe',
	hot: 'Wild',
	rule: 'Autocomplete, with super powers',
	rollBtn: 'Roll another ending'
};
