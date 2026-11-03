import type { ProgramText } from './types';

export const en: ProgramText = {
	title: 'What is a program',
	intro: [
		'Every app on your phone, every game, even the page you are reading right now, is a <b>program</b>. And a program is simply a <b>list of steps</b> for a computer to follow, one after another.',
		'Computers are wildly fast, but they have zero common sense. They do <b>exactly</b> what the steps say, in that exact order, and nothing more. They never guess what you meant.',
		'Ask a friend to make tea and they just know to boil the water first. Give the same job to a computer, forget that one step, and it will happily pour cold water on a teabag and call it tea.',
		'When a program does something silly like that, people call it a <b>bug</b>. Most of the time the computer is not broken at all, the steps are. Hunting down the wrong step and fixing it is called <b>debugging</b>.',
		'[fyi] Same word, different world. A TV program or the program of a wedding is also a list of things that happen in order. A computer program is the same idea, just written for a machine that takes every word literally.',
		'One more secret. Deep inside, a computer cannot even read a word like "pour". It only runs [[0 and 1|basics/binary]], so every step we write has to be translated for it first. Hold that thought, the next lessons are all about it.',
		'Nim wrote a tea program, but something is off. Run it, watch Nim follow every line literally, then fix the steps (add, move, or remove them) until you get a proper cup of tea.'
	],
	reactions: {
		spill:
			'Splash! The program said pour, so Nim poured, straight onto the table, because no step ever said to take a cup. The computer did not think, it just followed the line.',
		empty:
			'The program finished and the cup is still empty. Nothing crashed, the steps simply never said to pour anything. Quiet bugs like this are often the sneakiest.',
		plain:
			'That is just hot water. Look at the steps, no line ever puts the teabag into the cup. A person would notice, a computer never does.',
		cold: 'Ugh, cold tea. The water went into the cup before it was boiled, because that is the order the lines said. Same steps, wrong order, totally different result. Try moving a line.',
		tea: 'A perfect cup of tea! Every step was there, in the right order, so following them literally gave exactly what you wanted. That is all a working program is.'
	},
	programLabel: "Nim's tea program",
	paletteLabel: 'Steps you can add',
	emptyProgram: 'No steps yet, add one from below',
	steps: {
		cup: 'Take a cup',
		boil: 'Boil the water',
		bag: 'Put a teabag in the cup',
		pour: 'Pour the water into the cup',
		stir: 'Stir'
	},
	run: 'Run the program',
	running: 'Running',
	reset: 'Start over',
	moveUp: 'Move up',
	moveDown: 'Move down',
	remove: 'Remove',
	noteIdle: 'Nim waits in the kitchen, ready to follow the steps',
	noteLine: 'Line {n}, Nim does exactly this',
	notes: {
		spill: 'Water all over the table',
		empty: 'The cup stayed empty',
		plain: 'Hot water, no tea',
		cold: 'Cold water with a soggy teabag',
		tea: 'A hot cup of tea'
	},
	cupTag: 'cup',
	tableTag: 'table'
};
