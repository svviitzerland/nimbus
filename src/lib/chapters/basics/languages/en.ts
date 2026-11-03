import type { LanguagesText } from './types';

export const en: LanguagesText = {
	title: 'Programming languages',
	intro: [
		'Last time Nim wrote steps in plain words. Here is the catch, the chip inside a computer (the CPU) cannot read words at all. It only runs long rows of <b>0 and 1</b>, called <b>machine code</b>.',
		'People did write programs straight in 0 and 1 a long time ago. It was slow, painful, and one wrong digit broke everything. So they invented friendlier ways to write instructions.',
		'Those are <b>programming languages</b>. They look a bit like English and math, so people can read and write them. Then a translator turns them into the 0 and 1 the machine actually runs.',
		'There are hundreds of languages, and each one trades something. Some are easy to read but run a little slower. Some run blazing fast but ask you to spell out every tiny detail.',
		'[fyi] Same word, different world. A spoken language has grammar and slang, a programming language has rules too, only much stricter. Forget one bracket and the translator refuses to understand you, no matter how obvious it looks.',
		'So people pick the language that suits the job, like picking a tool from a toolbox. A hammer is not better than a screwdriver, it just fits nails.',
		'Here is the same tiny job written three ways. Tap each one and compare, then try matching languages to the jobs they are famous for.'
	],
	reactions: {
		machine:
			'This is what the CPU really runs. Every row is a byte, eight 0s and 1s. And this only adds 2 and 3, showing the answer on screen takes hundreds more rows. Nobody wants to write that by hand.',
		c: 'C is much friendlier, but still a bit fussy. You say which library you need, wrap the code in a main function, and end lines with semicolons. In return, it runs very close to the machine, so it is fast.',
		python:
			'One line! Python hides the fussy parts so you can focus on the idea. That ease costs a little speed, but for most jobs nobody notices. Either way, none of these is 0 and 1 yet, a [[compiler or interpreter|basics/compiler]] still has to translate them.',
		data: 'Yes, Python. Scientists and data people love it because it reads almost like notes, and it has huge collections of ready made tools for numbers and charts.',
		web: 'Right, JavaScript. It is the one language every browser understands, so anything that reacts when you tap a web page, like on nimbus.com, is almost always JavaScript.',
		fast: 'Exactly, C. When every millisecond matters, like a game engine or the [[operating system|basics/os]] itself, people reach for C (or its cousin C++) because it runs so close to the hardware.',
		wrong:
			'That one could work too, honestly, but it is not the usual pick. Think about where the code runs and what matters most there.'
	},
	taskLabel: 'The same job, add 2 and 3 and show the answer',
	pickHint: 'Tap a language to see its version',
	langs: {
		machine: { name: 'Machine code', sub: 'what the CPU runs', note: 'Only the adding part' },
		c: { name: 'C', sub: 'close to the machine', note: 'Fast, a bit fussy' },
		python: { name: 'Python', sub: 'close to people', note: 'Easy, a little slower' }
	},
	humanMeter: 'Easy for people',
	machineMeter: 'Close to the machine',
	linesLabel: '{n} lines',
	toJobs: 'Match languages to jobs',
	jobsLabel: 'Job {n} of {total}, which language would people usually pick?',
	jobLangs: { python: 'Python', js: 'JavaScript', c: 'C' },
	jobs: [
		{
			id: 'data',
			text: 'Crunch a big spreadsheet of nimbus.com visitors and draw a chart',
			answer: 'python'
		},
		{ id: 'web', text: 'Make a button on nimbus.com react when someone taps it', answer: 'js' },
		{ id: 'fast', text: 'Build a game engine that has to draw 60 frames every second', answer: 'c' }
	],
	wrongTag: 'not the usual pick',
	rightTag: 'good match',
	allDone: 'Three for three, every language has its job',
	backToCode: 'Back to the code'
};
