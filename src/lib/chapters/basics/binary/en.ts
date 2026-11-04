import type { BinaryText } from './types';

export const en: BinaryText = {
	title: 'Bits and bytes',
	intro: [
		'Deep inside every computer sit billions of tiny switches. Each one can only be <b>on</b> or <b>off</b>, just like the light switch in your room. On is written as 1, off as 0.',
		'One switch on its own is called a <b>bit</b>. A bit can only answer yes or no, which is not much. So computers line bits up in a row of eight, and that row is called a <b>byte</b>.',
		'[ingat] 8 bits make 1 byte, like 8 friends making one team. Whenever you hear byte, picture eight little switches standing side by side.',
		'So how does a letter fit in? People agreed on a list where every letter gets a number. Small n is number 110, and 110 has its own pattern of switches. Press n on the keyboard and the computer stores exactly that pattern.',
		'A word is just bytes in a row, one byte for each letter. The word nimbus has six letters, so it takes six bytes, 48 little switches in total.',
		'[fyi] The first popular list was called ASCII, from the 1960s. Today we use <b>Unicode</b>, a much longer list that also covers Japanese, Arabic, Javanese script, and even emoji.',
		'Photos use the same trick. A photo is a grid of tiny colored dots, and each dot is three bytes saying how much red, green, and blue it has. Songs too, the sound is measured tens of thousands of times every second and each measurement becomes a few bytes.',
		'Bytes pile up fast, so we count them in bigger boxes. A <b>KB</b> (kilobyte) is about a thousand bytes, an <b>MB</b> (megabyte) about a million, and a <b>GB</b> (gigabyte) about a billion. A photo is a few MB, a movie a few GB.',
		'[ingat] Kilo, mega, giga. Every step up is a thousand times bigger, just like counting money in thousands, millions, and billions.',
		'Everything on a computer is bytes in the end, even apps (more on that in [[What is a program|basics/program]]). If you like, flip a few switches yourself and see which letter comes out.'
	],
	reactions: {
		flip: 'One switch flipped, and the number changed with it. Change a single bit and you can get a different letter, that is how tiny the difference is.',
		letter:
			'A brand new letter! Same eight switches, just a different pattern. Every letter you have ever typed was a pattern like this one.'
	},
	steps: [
		{
			title: 'A switch',
			body: 'The smallest thing a computer knows. <b>On</b> is 1, <b>off</b> is 0, nothing in between.'
		},
		{
			title: 'Bit and byte',
			body: '<b>1 bit</b> is one switch. <b>1 byte</b> is a row of 8 bits, and those eight can make 256 different patterns.'
		},
		{
			title: 'A letter',
			body: 'Every letter has a number on a shared list. The switches store the number, and the number stands for the letter.'
		},
		{
			title: 'A word',
			body: 'One byte for every letter. Six letters, six bytes, 48 switches.'
		},
		{
			title: 'A photo',
			body: 'Millions of colored dots. Each dot is <b>3 bytes</b>, one for red, one for green, one for blue. A song is sound turned into bytes the same way.'
		},
		{
			title: 'Bigger boxes',
			body: '<b>KB</b> is about a thousand bytes, <b>MB</b> about a million, <b>GB</b> about a billion. Each box holds roughly a thousand of the one before.'
		},
		{
			title: 'Try it, if you like',
			body: 'Tap any switch. The number changes, and so does the letter.'
		}
	],
	on: 'on',
	off: 'off',
	bitLabel: '8 bits',
	byteLabel: '1 byte',
	byteTrick: '8 friends, one team',
	keyLabel: 'you press',
	numberLabel: 'number {n}',
	letterLabel: 'letter {c}',
	wordNote: '{b} bytes, {n} switches',
	dotNote: 'one dot',
	colors: ['red', 'green', 'blue'],
	oneByte: '1 byte',
	boxes: [
		{ unit: 'byte', what: 'one letter' },
		{ unit: 'KB', what: 'a page of text' },
		{ unit: 'MB', what: 'a photo or a song' },
		{ unit: 'GB', what: 'a movie' }
	],
	boxNote: 'Each box holds about a thousand of the one before',
	sizeTrick: 'thousand, million, billion',
	playHint: 'Tap a switch',
	notLetter: 'not a small letter',
	flipLabel: 'Switch {i}'
};
