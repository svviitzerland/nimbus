import type { RuntimeText } from './types';

export const en: RuntimeText = {
	title: 'Runtimes and libraries',
	intro: [
		'Your code is written, and you know it has to be translated. But here is a surprise. Most programs cannot run all alone, they float there with nothing to stand on.',
		'A program needs a <b>runtime</b>, a helper program that runs your program. Think of it as a stage. The actor (your code) only performs once there is a stage under its feet.',
		'Different code needs a different stage. JavaScript on a server runs on <b>Node.js</b>, JavaScript on a web page runs inside your <b>browser</b>, and Java runs on the <b>JVM</b>.',
		'[fyi] Same word, different world. "Runtime" also means the moment a program is running. A crash while it runs is called a runtime error, unlike the typo a [[compiler|basics/compiler]] catches before anything runs.',
		'Next come <b>libraries</b>, ready made parts other people wrote and share, often for free. Instead of building login or date handling from scratch, you borrow a part that already works.',
		'You get libraries with a <b>package manager</b>, a tool that downloads them for you. JavaScript has npm, Python has pip. One short command, and a new part clicks into place. More in [[Installing software|linux/packages]].',
		'Look at the whole stack now. The part you wrote is small and sits on top. Most of what runs is borrowed, the runtime, the libraries, the operating system below.',
		'[ingat] Runtime is the stage, libraries are ready made parts, your code is the actor. No stage, no show.',
		'[fyi] Borrowing has one catch. When a library releases a new version, your app might break without you touching a line. Real teams lock the exact version that works (in a file like package-lock.json) and update carefully.',
		'Want to see the stage matter? Take the runtime away and watch the shop, then put it back.'
	],
	reactions: {
		noRuntime:
			'The shop stopped. Your code and its libraries are still there, but nothing on this computer reads JavaScript without Node.js.',
		runtime: 'Stage is back, and the shop runs again. Same code, it just needed somewhere to stand.'
	},
	steps: [
		{
			title: 'Code alone',
			body: 'A file like <b>app.js</b> is just text. The operating system has no idea how to run it by itself.'
		},
		{
			title: 'The runtime',
			body: 'A program that <b>runs your program</b>. It reads your code and asks the operating system for memory, files, and the network for you.'
		},
		{
			title: 'Many runtimes',
			body: '<b>Node.js</b> for JavaScript on servers, the <b>browser</b> for JavaScript on web pages, the <b>JVM</b> for Java.'
		},
		{
			title: 'Runtime error',
			tag: 'Fun fact',
			body: 'The same word also means <b>while the program runs</b>. A runtime error happens then, not before.'
		},
		{
			title: 'Libraries',
			body: '<b>Ready made parts</b> of code, written and tested by others. You borrow them instead of building everything from scratch.'
		},
		{
			title: 'Package manager',
			body: 'A tool that downloads libraries for you. <b>npm</b> for JavaScript, <b>pip</b> for Python.'
		},
		{
			title: 'Mostly borrowed',
			body: 'Your own code is often a few hundred lines. The libraries and runtime under it can be <b>millions</b>.'
		},
		{
			title: 'Remember it',
			tag: 'Remember it',
			body: 'Runtime is the <b>stage</b>, libraries are <b>ready made parts</b>, your code is the <b>actor</b>.'
		},
		{
			title: 'Lock the version',
			body: 'A new library version can break your app. Teams <b>lock</b> the version that works and update one at a time.'
		},
		{
			title: 'No stage, no show',
			body: 'Without its runtime, the code is still there but nothing can run it.'
		}
	],
	layers: {
		code: 'app.js',
		runtime: 'Runtime',
		os: 'Operating system',
		hw: 'Hardware'
	},
	osNote: 'Linux, macOS, Windows',
	hwNote: 'CPU, RAM, storage',
	runtimes: [
		{ name: 'Node.js', note: 'JavaScript on a server' },
		{ name: 'Browser', note: 'JavaScript on a web page' },
		{ name: 'JVM', note: 'Java' }
	],
	libs: ['Login', 'Dates', 'Charts'],
	installCmd: 'npm install chart.js',
	installDone: 'added 1 package',
	appName: 'nimbus.com shop',
	appUp: 'running',
	appDown: 'crashed',
	appOff: 'not running',
	newVersion: 'v3',
	oldVersion: 'v2',
	removeBtn: 'Take the runtime away',
	returnBtn: 'Put the runtime back'
};
