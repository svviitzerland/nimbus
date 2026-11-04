import type { CompilerText } from './types';

export const en: CompilerText = {
	title: 'Compilers and interpreters',
	intro: [
		'Here is the big problem. People write code with words like print and name, but a computer cannot understand a single one of them. Deep inside, the CPU only runs [[0 and 1|basics/binary]].',
		'So before anything can run, the code has to be <b>translated</b> into 0 and 1. That is the whole reason compilers and interpreters exist. Both are translators, they just work in different styles.',
		'A <b>compiler</b> is like a translator who translates a <b>whole book first</b>. You wait at the start, then you get the finished book and read it at full speed. C and Go work like this.',
		'An <b>interpreter</b> is like a live interpreter standing next to a speaker, translating <b>sentence by sentence</b>. You start right away, but every sentence takes a little extra time. Python and JavaScript usually work like this.',
		'Watch them translate the same tiny program, side by side. The compiler pauses, then races. The interpreter starts at once, then walks.',
		'Now a typo sneaks into line 3. The compiler reads everything before anything runs, so it stops right there and nothing runs at all. The interpreter happily runs the first lines and only crashes when it reaches line 3.',
		'Some history. In 1952 <b>Grace Hopper</b> built one of the very first compilers, called A0. People told her computers could only do math, but she believed we should write programs in words closer to English, an idea that later grew into the language COBOL. Her team even found a real moth stuck inside the Harvard Mark II computer in 1947, and she loved telling the story of that first actual "bug".',
		'One more win for the compiler. Its translation is saved as a file, so the next run skips translating and starts instantly. That is why the apps you install are usually compiled, translated once on the maker’s computer, fast for everyone after.',
		'[fyi] Real life is a little blurry. Java first compiles to a halfway language, then a virtual machine translates the rest while the program runs. The JavaScript engine in your browser mixes both styles too, just to go faster.',
		'[ingat] A compiler is a book translator, the whole book first, then you read fast. An interpreter is the live interpreter at a meeting, one sentence at a time, starting right away.',
		'Your turn, if you like. Slip a typo into line 3 and watch who notices first, then fix it again.'
	],
	reactions: {
		typo: 'The compiler caught it before a single line ran. The interpreter already printed a line on screen, then crashed at line 3. Same mistake, found at very different moments.',
		fixed: 'Fixed, and both translators get all the way to the end again.'
	},
	steps: [
		{
			title: 'Only 0 and 1',
			body: 'The CPU, the brain of the computer, only understands patterns of <b>0 and 1</b>. Words like <b>print</b> mean nothing to it.'
		},
		{
			title: 'Translation',
			body: 'A translator program turns your code into 0 and 1, and only then can the CPU run it.'
		},
		{
			title: 'The compiler',
			body: 'Translates <b>every line first</b> and saves the result as a file. Then that file runs fast, with no translating along the way.'
		},
		{
			title: 'The interpreter',
			body: 'Takes <b>one line</b>, translates it, runs it, then moves to the next. Nothing is saved, so the next run translates again.'
		},
		{
			title: 'Side by side',
			body: 'The compiler waits at the start, then flies. The interpreter starts at once, but pays a little on every line.'
		},
		{
			title: 'Catching a typo',
			body: 'A compiler finds the mistake <b>before anything runs</b>. An interpreter finds it only <b>when it gets there</b>, after earlier lines already ran.'
		},
		{
			title: 'Grace Hopper',
			tag: 'History',
			body: 'Built the <b>A0</b> compiler in 1952 and pushed for code written in words close to English, which led to <b>COBOL</b>. She also made the word <b>bug</b> famous.'
		},
		{
			title: 'Translate once',
			body: 'The saved file (here <b>nimbus.exe</b>) runs again without any translating. The interpreter has to start over every time.'
		},
		{
			title: 'A bit of both',
			body: 'Java and the JavaScript in your browser mix the two styles, translating some parts early and the rest while the program runs.'
		},
		{
			title: 'Remember it',
			tag: 'Remember it',
			body: 'Compiler is the <b>book translator</b>, whole book first. Interpreter is the <b>live interpreter</b> at a meeting, sentence by sentence.'
		}
	],
	code: ['name = "Nim"', 'print("Hi", name)', 'print(1 + 1)', 'print("Bye")'],
	output: [null, 'Hi Nim', '2', 'Bye'],
	typoLine: 2,
	typoCode: 'prnit(1 + 1)',
	codeLabel: 'Your code',
	cpuLabel: 'CPU',
	translatorLabel: 'Translator',
	compiler: { name: 'Compiler', sub: 'C, Go' },
	interpreter: { name: 'Interpreter', sub: 'Python, JavaScript' },
	fileName: 'nimbus.exe',
	screenLabel: 'Screen',
	waiting: 'Waiting',
	compiling: 'Translating every line',
	saved: 'Saved, now running fast',
	reused: 'Already translated, running now',
	running: 'Running',
	readingLine: 'Line {n}, translate then run',
	done: 'Done',
	errCompile: 'Typo in line {n}, nothing ran',
	errInterp: 'Crashed at line {n}',
	hopper: {
		alt: 'Portrait of Grace Hopper in her United States Navy uniform',
		name: 'Grace Hopper',
		caption: 'Computer pioneer, 1906 to 1992',
		logbook: 'First actual case of bug being found.'
	},
	addTypo: 'Put a typo in line 3',
	fixTypo: 'Fix the typo'
};
