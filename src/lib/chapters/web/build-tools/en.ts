import type { BuildToolsText } from './types';

export const en: BuildToolsText = {
	title: 'Build tools',
	intro: [
		'While you build nimbus.com, you write code for humans. Lots of small files, clear names, spaces, and comments explaining things. That is great for you, and pretty wasteful for a browser.',
		'Every file is a separate trip over the network, and every space and comment is extra weight to download. On a slow phone, nine chunky files can mean a long wait before the page works.',
		'A <b>build tool</b> fixes that right before your site goes online. It <b>bundles</b> many files into a few, <b>minifies</b> them by stripping spaces and comments and shortening names, and <b>compresses</b> them so they travel even lighter.',
		'You keep editing the friendly version, and the build tool spits out a tiny version only for browsers. Frameworks lean on this heavily, since your [[components|web/components]] all have to become plain [[JavaScript|web/js]] and [[CSS|web/css]] in the end.',
		'[fyi] Popular build tools include <b>Vite</b>, <b>webpack</b>, and <b>esbuild</b>. Vite comes from the creator of Vue, and it is what builds this very site.',
		'[ingat] Bundling combines code modules. Minification shortens code without changing its behavior. Compression reduces the data sent.',
		'Here are the nine source files of nimbus.com. Pick which build steps to switch on, press Build, and see how much lighter the site gets.'
	],
	reactions: {
		none: 'With every step switched off, the build just copies your files as they are. Same nine trips, same weight. Try switching a step on.',
		partial:
			'Lighter already! Each step helps in its own way, bundling cuts the trips and the other two cut the weight. See what happens with all three on.',
		best: 'Look at that, nine files became three, and the download shrank to a small slice of the original. Same site, same features, just packed for travel.',
		peek: '[fyi] That is minified code. Spaces gone, comments gone, long names turned into single letters. Hard for you to read, but the browser does not care at all.'
	},
	srcLabel: 'Your source code',
	outLabel: 'What goes online',
	steps: {
		bundle: { label: 'Bundle', sub: 'Join files together' },
		minify: { label: 'Minify', sub: 'Strip spaces and comments' },
		compress: { label: 'Compress', sub: 'Squeeze for travel' }
	},
	build: 'Build',
	building: 'Building',
	filesLabel: 'Files',
	sizeLabel: 'Download',
	loadLabel: 'Slow phone',
	loadValue: '{s} s',
	outEmpty: 'Press Build to make the online version',
	peek: 'Peek inside cart.js',
	before: 'Before',
	after: 'After minify'
};
