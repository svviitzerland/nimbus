import type { ProgramText } from './types';

export const en: ProgramText = {
	title: 'Programs and algorithms',
	intro: [
		'Let us start in a kitchen, far away from any computer. Nim wants a cup of tea, so we write down how to make one, step by step. Watch the recipe fill itself in.',
		'That list has a fancy name, an <b>algorithm</b>. It simply means a clear list of steps that solves a problem. A recipe is an algorithm. So are the directions you text a friend to find your house (turn left at the bakery, third gate on the right).',
		'So who invented the algorithm? No single person did. Around 300 BC, <b>Euclid</b> in Greece already wrote down the steps to find the biggest number that divides two numbers evenly. The name comes from <b>al Khwarizmi</b>, a scholar in Baghdad around the year 820. His book on doing sums step by step was translated into Latin, where his name was written <b>Algoritmi</b>. That is where the word algorithm was born.',
		'A <b>program</b> is an algorithm written in a language a computer can follow. Same steps, same order, just spelled in a way the machine understands. Every app on your phone is a program like this.',
		'Here is the big thing. A computer follows the steps <b>exactly</b>, one after another, and never guesses what you meant. If a step is missing or in the wrong place, it still does what is written. That kind of mistake is called a <b>bug</b>.',
		'Now the fun part. Every algorithm in the world, from tea to a rocket launch, is built from just three building blocks. The first is <b>sequence</b>, steps done one after another, top to bottom.',
		'The second is <b>choice</b>. The algorithm asks a question and picks a path. If the water is hot, pour it. If not, boil it first.',
		'The third is <b>repetition</b>. Some steps run again and again until something is true. Stir, taste, still not sweet? Stir again, until it is sweet.',
		'[ingat] Three little words give the blocks away. <b>Then</b> means sequence, <b>if</b> means choice, <b>until</b> means repetition. Then, if, until, and you can read almost any algorithm.',
		'[fyi] Same word, different world. A TV program or the program of a wedding is also a list of things that happen in order. A computer program is the same idea, just written for a machine that takes every word literally.',
		'If you are curious, swap two lines of the recipe and watch Nim follow the new order without a second thought. Totally optional, the tea will forgive you.'
	],
	reactions: {
		spill:
			'Splash! Line 1 now says pour, and there is no cup yet, so the water lands on the counter. Nim did not guess, Nim did exactly what was written. That is a bug in action.',
		fixed:
			'Back in the right order, and the tea is perfect again. Same steps, only the order changed, and that alone made all the difference.'
	},
	panels: [
		{
			tag: 'Algorithm',
			title: 'A clear list of steps',
			body: 'An <b>algorithm</b> is a set of steps that solves a problem. It is clear enough that anyone who follows it gets the same result.'
		},
		{
			tag: 'History',
			title: 'Where does the word come from?',
			body: 'From the name of <b>al Khwarizmi</b>, a scholar in Baghdad in the ninth century. The steps themselves are much older, and in 1843 <b>Ada Lovelace</b> wrote the first algorithm meant for a calculating machine.'
		},
		{
			tag: 'Program',
			title: 'Steps a computer can read',
			body: 'The same recipe, now written in a programming language (this one is Python). The computer reads it from top to bottom.'
		},
		{
			tag: 'Following',
			title: 'Exactly as written',
			body: 'Nim does each line in order, nothing more and nothing less. The highlighted line is the one running right now.'
		},
		{
			tag: 'Block 1',
			title: 'Sequence',
			body: 'This drawing is a <b>flowchart</b>, a map of an algorithm. Boxes joined by arrows happen one after another, and the order matters.'
		},
		{
			tag: 'Block 2',
			title: 'Choice',
			body: 'A diamond asks a yes or no question. <b>Yes</b> takes one path, <b>no</b> takes the other, and both meet again further down.'
		},
		{
			tag: 'Block 3',
			title: 'Repetition',
			body: 'The arrow loops back. Stir, check, stir again, and only move on once the answer is yes. Programmers call this a <b>loop</b>.'
		},
		{
			tag: 'Make it stick',
			title: 'Then, if, until',
			body: 'Sequence, choice, repetition. Every app you use is these three blocks stacked many, many times.'
		},
		{
			tag: 'Try it',
			title: 'Swap two lines, get a bug',
			body: 'Trade two lines and the computer still follows them, line by line. Nothing is broken except the order.'
		}
	],
	history: {
		heading: 'The trail of the algorithm',
		people: [
			{
				year: 'c. 300 BC',
				name: 'Euclid',
				place: 'Greece',
				body: 'Wrote the steps to find the biggest number that divides two numbers evenly. Still used today.'
			},
			{
				year: 'c. 820',
				name: 'al Khwarizmi',
				place: 'Baghdad',
				body: 'Wrote a book on doing sums step by step. His name became the word algorithm.'
			},
			{
				year: '1843',
				name: 'Ada Lovelace',
				place: 'England',
				body: 'Wrote the first algorithm for a calculating machine, often called the first computer program.'
			}
		],
		word: ['al Khwarizmi', 'Algoritmi', 'algorithm']
	},
	recipeTitle: 'Tea recipe',
	programTitle: 'The same recipe, for a computer',
	steps: {
		cup: 'Take a cup',
		bag: 'Put a teabag in the cup',
		boil: 'If the water is not hot, boil it',
		pour: 'Pour the water into the cup',
		stir: 'Add sugar, stir until it is sweet'
	},
	flow: {
		start: 'Start',
		cup: 'Take a cup',
		bag: 'Add a teabag',
		hot: 'Water hot?',
		boil: 'Boil it',
		pour: 'Pour the water',
		sweet: 'Sweet yet?',
		stir: 'Stir',
		done: 'Tea!',
		yes: 'yes',
		no: 'no'
	},
	blocks: {
		sequence: { name: 'Sequence', word: 'then' },
		choice: { name: 'Choice', word: 'if' },
		repetition: { name: 'Repetition', word: 'until' }
	},
	rule: 'Then is sequence, if is choice, until is repetition.',
	swap: 'Swap lines 1 and 4',
	unswap: 'Put them back',
	result: {
		idle: 'Nim is ready in the kitchen',
		working: 'Nim follows line {n}, exactly as written',
		tea: 'A hot, sweet cup of tea',
		spill: 'Water on the counter, and an empty cup'
	}
};
