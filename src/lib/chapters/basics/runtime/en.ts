import type { RuntimeText } from './types';

export const en: RuntimeText = {
	title: 'Runtimes and libraries',
	intro: [
		'Your code is written, and you know it gets translated. But most programs never run all alone. They need a helper program running underneath them the whole time, called a <b>runtime</b>.',
		'JavaScript on a server needs <b>Node.js</b>. Java needs the <b>JVM</b>. JavaScript on a web page uses the runtime built right into your <b>browser</b>. No runtime, and the computer just stares at your file.',
		'Then there are <b>libraries</b>, ready made code that other people wrote and share, often for free. Login, payments, charts, dates, someone already built them and tested them on millions of users.',
		'You get them through a [[package manager|linux/packages]], a tool that downloads libraries for you. JavaScript has npm, Python has pip. One short command, and thousands of lines of code are yours.',
		'[fyi] Same word, different world. A town library lends you books so you do not have to write them, a code library lends you code. And "runtime" also means the moment a program is running, so a crash while it runs is a runtime error, unlike the typo the [[compiler|basics/compiler]] caught before anything ran.',
		'Borrowing has one catch. When a library changes, your app changes with it, ready or not.',
		'Let us build the nimbus.com shop. Give it a runtime, add its features, then see what happens when every library updates at once.'
	],
	reactions: {
		noRuntime:
			'The computer has no idea what to do with app.js. It is JavaScript, and nothing on this machine reads JavaScript yet. Install the runtime first.',
		runtime:
			'Now it runs! Node.js sits between your code and the [[operating system|basics/os]], reading your JavaScript and asking the system for files, memory, and the network on its behalf.',
		scratch:
			'Writing it yourself works, but look at the days and lines piling up. And every bug in those lines is yours to fix, forever.',
		library:
			'One command and it is in. Somebody else wrote and tested those thousands of lines, you just plugged them in.',
		built:
			'The shop has every feature now. Compare the days spent writing things yourself with the seconds a library takes. That is why almost every real app is mostly libraries.',
		broke:
			'Ouch, the shop crashed. The newest version of that library changed how it works, and your code still uses it the old way. You did not touch a single line, yet the app broke.',
		pinned:
			'Back on the old version, and the shop runs again. Real teams pin exact versions in a lock file (like package-lock.json), then update one library at a time, carefully, with tests.'
	},
	steps: ['Runtime', 'Libraries', 'Update'],
	layers: {
		code: 'Your code',
		libs: 'Libraries',
		runtime: 'Runtime',
		os: 'Operating system',
		hw: 'Hardware'
	},
	osNote: 'Linux, macOS, or Windows',
	hwNote: 'CPU, RAM, and storage',
	appName: 'nimbus.com shop',
	appUp: 'running',
	appDown: 'crashed',
	appOff: 'not running',
	notInstalled: 'not installed',
	noLibs: 'none yet',
	runBtn: 'Run app.js',
	installBtn: 'Install Node.js',
	installing: 'Installing Node.js',
	installed: 'Node.js is installed',
	features: {
		login: { name: 'Login', days: 14, lines: 1800 },
		payments: { name: 'Payments', days: 30, lines: 4200 },
		charts: { name: 'Sales charts', days: 10, lines: 1500 }
	},
	scratchBtn: 'Write it myself, {n} days',
	libBtn: 'npm install {lib}',
	wroteChip: 'written by you',
	linesLabel: '{n} lines written by you',
	daysLabel: '{n} days of work',
	secondsLabel: 'a few seconds',
	toUpdate: 'Next, update the libraries',
	needLib: 'Use at least one library to see the next part',
	updateBtn: 'Update every library to the newest version',
	pinBtn: 'Go back to {lib} {v}',
	runningAgain: 'The shop is running again',
	fixedNote: 'Pinned to the version that works'
};
