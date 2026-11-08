import type { CompilerText } from './types';

export const en: CompilerText = {
	title: 'Compilers and interpreters',
	intro: [
		'A CPU does not directly execute the sentences we write. A program needs translation or another program that understands its language.',
		'A <b>compiler</b> translates code to another form, such as machine code or bytecode. Its output can be saved for later execution.',
		'An <b>interpreter</b> executes instructions through another program at runtime. Real systems often combine compilation and interpretation.',
		'This bench compares two <b>simplified models</b>. One translates first; the other executes step by step. Time is slowed down to make the difference visible.',
		'Change print to prnit. The left model checks function names before running. The right checks on execution. This is a model choice, not a rule for every language.',
		'[fyi] Python can detect syntax errors before execution. An unknown function name can cause NameError when used. Compiled programs can also fail at runtime.',
		'[ingat] <b>A compiler produces a translation; an interpreter executes instructions.</b> One application can use both.',
		'Run once, rerun using the saved translation, then try the unknown function. Compare when the models stop.'
	],
	reactions: {
		race: 'In this model, upfront translation takes time. Real timing depends on the language, runtime, and program. Try running again.',
		rerun:
			'The left model saved its translation, so it skips that stage. Real runtimes may also cache bytecode or optimized code in different ways.',
		typo: 'The early checking model stops before execution. The stepwise model stops at prnit, an unknown function name, not a syntax error.'
	},
	code: [
		'name = "Nimbus"',
		'visitors = 120',
		'visitors = visitors + 1',
		'print("Hello,", name)',
		'print(visitors)',
		'print("Bye!")'
	],
	output: [null, null, null, 'Hello, Nimbus', '121', 'Bye!'],
	typoLine: 4,
	typoCode: 'prnit(visitors)',
	compiler: { name: 'Compiler', sub: 'translates everything first' },
	interpreter: { name: 'Interpreter', sub: 'translates line by line' },
	run: 'Run both',
	runAgain: 'Run again',
	addTypo: 'Put a typo in line 5',
	fixTypo: 'Fix the typo',
	compiling: 'Translating the whole program',
	ready: 'Translated and saved as nimbus.exe',
	reused: 'Already translated, running nimbus.exe',
	readingLine: 'Translating line {n}, then running it',
	finishedIn: 'Done in {s} s',
	errCompile: 'Typo found in line {n}, nothing ran',
	errInterp: 'Crashed at line {n}, after the lines above already ran',
	screenLabel: 'Screen',
	waiting: 'nothing yet',
	noteIdle: 'Ready when you are'
};
