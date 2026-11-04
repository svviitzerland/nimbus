import type { BuildToolsText } from './types';

export const en: BuildToolsText = {
	title: 'Build tools',
	intro: [
		'While you build nimbus.com, you write code for humans. Lots of small files, clear long names, neat spaces, and comments (notes to yourself that the computer skips). Great for you to read.',
		'For a browser it is wasteful. Every file is a separate trip over the network, and every space and comment is extra weight to download. Watch six files make six trips to a phone.',
		'So right before the site goes online, a <b>build tool</b> steps in. It is a program that takes your friendly code and packs it for travel. It does three jobs.',
		'Job one, <b>bundle</b>. Many files are joined into a few. Six trips become two.',
		'Job two, <b>minify</b>. Spaces and comments are stripped out, and long names become single letters. Hard for you to read, but the browser does not mind at all.',
		'Job three, <b>compress</b>. The files are squeezed like a zip file, so they travel even lighter, and the browser unsqueezes them on arrival.',
		'You keep editing the friendly version, and the build tool makes the tiny version only for browsers. Frameworks lean on this a lot, since your [[components|web/components]] all have to become plain [[JavaScript|web/js]] and CSS in the end.',
		'[fyi] Popular build tools include <b>Vite</b>, <b>webpack</b>, and <b>esbuild</b>. Vite comes from the creator of Vue, and it is what builds this very site.',
		'[ingat] Packing for a trip home. Bundle is putting everything into one suitcase, minify is leaving out what you do not need, compress is the vacuum bag that squeezes the air out.',
		'Your turn, if you like. Switch the build tool off and on, and watch the download change.'
	],
	reactions: {
		off: 'Without the build tool, the browser gets your files exactly as you wrote them. Six trips, all the spaces and comments, far more to download.',
		on: 'Build tool back on. Two small files instead of six big ones, same site, same features, just packed for travel.'
	},
	steps: [
		{
			title: 'Code for humans',
			body: 'Many small files, long clear names, and <b>comments</b>. Easy to read and change, but heavy.'
		},
		{
			title: 'Trips and weight',
			body: 'Each file is <b>one trip</b> over the network, and every extra character is <b>weight</b>. Slow on a weak phone signal.'
		},
		{
			title: 'The build tool',
			body: 'A program that runs <b>before</b> your site goes online and packs your code for browsers.'
		},
		{
			title: 'Bundle',
			body: 'Joins <b>many files into a few</b>, so the browser makes fewer trips.'
		},
		{
			title: 'Minify',
			body: 'Removes spaces and comments and shortens names. <b>function addToCart(item)</b> becomes <b>function a(t)</b>.'
		},
		{
			title: 'Compress',
			body: 'Squeezes the files like a <b>zip</b> for the journey. The browser unsqueezes them when they arrive.'
		},
		{
			title: 'Two versions',
			body: 'You edit the <b>friendly</b> version. Browsers get the <b>packed</b> version. The build tool turns one into the other.'
		},
		{
			title: 'Real tools',
			tag: 'By the way',
			body: '<b>Vite</b>, <b>webpack</b>, and <b>esbuild</b> are the common ones. Nimbus is built with Vite.'
		},
		{
			title: 'Remember it',
			tag: 'Remember it',
			body: 'Bundle is <b>one suitcase</b>, minify is <b>leave the extras</b>, compress is the <b>vacuum bag</b>.'
		}
	],
	srcLabel: 'Your code',
	outLabel: 'Goes online',
	toolLabel: 'Build tool',
	jobs: { bundle: 'Bundle', minify: 'Minify', compress: 'Compress' },
	tripsTpl: '{n} trips',
	sizeLabel: 'Download',
	kbTpl: '{n} KB',
	turnOff: 'Switch the build tool off',
	turnOn: 'Switch the build tool on'
};
