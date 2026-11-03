import type { CompilerText } from './types';

export const en: CompilerText = {
	title: 'Compilers and interpreters',
	intro: [
		'Remember the big problem? People write code in friendly languages, but a computer cannot understand any of it. The CPU only runs [[0 and 1|basics/binary]]. So someone has to <b>translate</b>.',
		'That translator is a program too, and it comes in two styles. Picture a book written in a language you cannot read.',
		'A <b>compiler</b> translates the <b>whole book first</b>, then hands you the finished translation. You wait at the start, but after that you read at full speed, and you can reread it any time without translating again. C, Go, and Rust work like this.',
		'An <b>interpreter</b> sits next to you and translates <b>one sentence at a time</b> while you read. You start right away, but every sentence costs a little extra time. Python and JavaScript usually work like this.',
		'There is one more difference, and it is about mistakes. A compiler reads everything before anything runs, so it catches a typo early. An interpreter only finds the typo when it reaches that line, after the lines before it already ran.',
		'[fyi] Real life is a little blurry. Java and C# compile to a halfway language first, then a virtual machine translates the rest while the program runs. Modern JavaScript engines in your browser do a mix of both too, just to go faster.',
		'Here is one small program and both translators. Run them side by side, run it again, then slip a typo into line 5 and see who notices first.'
	],
	reactions: {
		race: 'See that? The compiler made you wait while it translated everything, then raced through. The interpreter started instantly but walked, translating each line on the way. Now run it again.',
		rerun:
			'The compiler did not translate anything this time, the finished file was already saved, so it ran at once. That is why apps you install are usually compiled, translated once on the maker’s computer, fast for everyone after.',
		typo: 'The compiler caught the typo before a single line ran. The interpreter happily ran lines 1 to 4, printed stuff on screen, and only crashed when it reached line 5. Same mistake, found at very different moments.'
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
