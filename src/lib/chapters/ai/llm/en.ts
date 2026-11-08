import type { LlmText } from './types';

const end = (): [string, number][] => [
	['.', 60],
	['and', 25],
	['every', 15]
];

export const en: LlmText = {
	title: 'LLMs and tokens',
	intro: [
		'You have probably chatted with ChatGPT, Gemini, or Claude. They write so smoothly it feels like someone is typing back. Inside each of them sits an <b>LLM</b>, short for large language model.',
		'An LLM generates text by predicting the <b>next token</b> from context. The selected token joins that context, then the process repeats until generation ends.',
		'Those pieces are called <b>tokens</b>. A token is often a whole word, sometimes half a word, sometimes just a comma. The word "networking" might become "network" plus "ing". Each token is then turned into a number, because a computer only works with numbers.',
		'For every next token, the model scores thousands of options and turns the scores into chances. "Nim likes to eat" might continue with "rice" at 40 percent, "noodles" at 24, and so on. Then it picks one, adds it, and guesses again.',
		'<b>Temperature</b> changes the token probability distribution. Low values concentrate it on likely tokens. Higher values increase variation without guaranteeing more accurate or useful answers.',
		"[fyi] A real LLM is a giant [[neural network|ai/neural-net]] with billions of weights, trained to make these guesses. Mine below is just a tiny hand made word table, but the loop of guess, pick, add, repeat is exactly the same. That's also why an LLM can sound sure while being wrong, it only knows what usually comes next.",
		'[ingat] <b>Predict, select, append, repeat.</b> This is the token generation loop. Check factual accuracy separately from fluent wording.',
		'Type a sentence (or tap a starter) and watch it fall apart into tokens. Then pick the next token a few times, and play with the temperature to see the guesses change.'
	],
	reactions: {
		typed:
			'See how it broke apart? Short common words stay whole, long ones get cut into pieces, and the full stop is its own token. The little numbers are what the model actually reads.',
		pick: 'One token added! The model looked only at what came before, scored its options, and picked one. Now it does the whole thing again for the next one.',
		cold: 'Probability concentrates on the leading choices. Output tends to be more consistent, but low temperature does not guarantee factual accuracy.',
		hot: 'The probability distribution is flatter, so less likely tokens have more chance of being selected. Variation increases, but quality still needs testing.',
		surprise:
			'Ha, it did not take the top guess! With some temperature, a less likely token can still win the dice roll. Run it twice and you get two different sentences.',
		done: 'You just generated text the way an LLM does it, one token at a time. Every long answer from a chatbot is this same loop, repeated hundreds of times in a blink.'
	},
	inputLabel: 'Your sentence',
	presets: ['Nim likes to eat', 'The server is', 'I want to learn'],
	tokensCount: '{n} tokens',
	idsNote: 'The number under each token is how the model sees it',
	nextTitle: 'Top guesses for the next token',
	tempLabel: 'Temperature',
	tempCold: 'Low variation',
	tempHot: 'High variation',
	pickBtn: 'Pick the next token',
	full: 'That is a long sentence already, start a new one',
	reset: 'Start over',
	splits: {
		networking: ['network', 'ing'],
		learning: ['learn', 'ing'],
		everything: ['every', 'thing'],
		smoothly: ['smooth', 'ly'],
		nimbus: ['nim', 'bus'],
		noodles: ['nood', 'les'],
		morning: ['morn', 'ing'],
		sleeping: ['sleep', 'ing'],
		because: ['be', 'cause']
	},
	table: {
		'.': [
			['Nim', 40],
			['Then', 25],
			['The', 20],
			['It', 15]
		],
		nim: [
			['likes', 40],
			['is', 30],
			['wants', 30]
		],
		then: [
			['Nim', 40],
			['it', 30],
			['the', 30]
		],
		the: [
			['server', 50],
			['cloud', 30],
			['cat', 20]
		],
		cat: [
			['is', 60],
			['eats', 40]
		],
		likes: [
			['to', 80],
			['rice', 20]
		],
		wants: [
			['to', 80],
			['a', 20]
		],
		want: [
			['to', 80],
			['a', 20]
		],
		i: [
			['want', 50],
			['like', 30],
			['am', 20]
		],
		like: [
			['to', 60],
			['rice', 40]
		],
		am: [
			['learning', 40],
			['hungry', 35],
			['happy', 25]
		],
		to: [
			['learn', 40],
			['eat', 30],
			['sleep', 15],
			['code', 15]
		],
		eat: [
			['rice', 40],
			['noodles', 24],
			['bread', 16],
			['pizza', 12],
			['clouds', 8]
		],
		eats: [
			['rice', 40],
			['noodles', 24],
			['bread', 16],
			['pizza', 12],
			['clouds', 8]
		],
		rice: [
			['.', 40],
			['with', 28],
			['and', 20],
			['every', 12]
		],
		noodles: [
			['.', 40],
			['with', 30],
			['and', 20],
			['every', 10]
		],
		bread: [
			['.', 40],
			['with', 30],
			['and', 20],
			['every', 10]
		],
		pizza: [
			['.', 40],
			['with', 30],
			['and', 20],
			['every', 10]
		],
		clouds: [
			['.', 30],
			['because', 30],
			['and', 25],
			['every', 15]
		],
		with: [
			['friends', 40],
			['cheese', 20],
			['chili', 25],
			['Nim', 15]
		],
		friends: end(),
		cheese: end(),
		chili: end(),
		and: [
			['drink', 35],
			['sleep', 25],
			['learn', 25],
			['code', 15]
		],
		drink: [
			['tea', 45],
			['water', 35],
			['coffee', 20]
		],
		tea: end(),
		water: end(),
		coffee: end(),
		sleep: [
			['.', 50],
			['early', 30],
			['every', 20]
		],
		early: [
			['.', 70],
			['and', 30]
		],
		every: [
			['day', 55],
			['morning', 30],
			['night', 15]
		],
		day: [
			['.', 70],
			['and', 30]
		],
		morning: [
			['.', 70],
			['and', 30]
		],
		night: [
			['.', 70],
			['and', 30]
		],
		because: [
			['it', 40],
			['they', 30],
			['Nim', 30]
		],
		it: [
			['is', 60],
			['was', 40]
		],
		they: [
			['are', 60],
			['taste', 40]
		],
		taste: [
			['good', 50],
			['sweet', 30],
			['fluffy', 20]
		],
		are: [
			['fluffy', 40],
			['tasty', 35],
			['busy', 25]
		],
		good: end(),
		sweet: end(),
		fluffy: end(),
		tasty: end(),
		server: [
			['is', 50],
			['runs', 30],
			['was', 20]
		],
		cloud: [
			['.', 40],
			['server', 30],
			['and', 30]
		],
		is: [
			['busy', 30],
			['fast', 25],
			['down', 20],
			['sleeping', 15],
			['happy', 10]
		],
		was: [
			['busy', 30],
			['fast', 25],
			['down', 20],
			['sleeping', 15],
			['happy', 10]
		],
		busy: [
			['.', 50],
			['today', 30],
			['and', 20]
		],
		down: [
			['.', 40],
			['again', 35],
			['today', 25]
		],
		fast: [
			['.', 50],
			['today', 25],
			['and', 25]
		],
		sleeping: [
			['.', 60],
			['again', 40]
		],
		happy: [
			['.', 60],
			['today', 40]
		],
		hungry: [
			['.', 60],
			['and', 40]
		],
		today: [
			['.', 80],
			['and', 20]
		],
		again: [
			['.', 80],
			['and', 20]
		],
		runs: [
			['fast', 50],
			['all', 30],
			['smoothly', 20]
		],
		all: [
			['day', 60],
			['night', 40]
		],
		smoothly: end(),
		learn: [
			['AI', 30],
			['everything', 25],
			['code', 25],
			['networking', 20]
		],
		learning: [
			['AI', 50],
			['code', 50]
		],
		ai: end(),
		code: end(),
		networking: end(),
		everything: end(),
		a: [
			['snack', 35],
			['server', 35],
			['cloud', 30]
		],
		snack: end()
	},
	fallback: [
		['.', 30],
		['and', 25],
		['the', 20],
		['is', 15],
		['very', 10]
	]
};
