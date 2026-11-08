import type { BinaryText } from './types';

export const en: BinaryText = {
	title: 'Bits and bytes',
	intro: [
		'Deep inside, a computer only knows one thing, whether a tiny switch is <b>on</b> or <b>off</b>. On is written as 1, off as 0. One single switch like that is called a <b>bit</b>.',
		'One switch can only say yes or no. But line up eight of them and you get 256 different patterns. A group of eight bits gets its own name, a <b>byte</b>.',
		'Each switch in the row is worth a number, starting at 1 on the right and doubling as you go left, 2, 4, 8, all the way to 128. Add up the switches that are on and you get the number the byte holds, anywhere from 0 to 255.',
		'And letters? People simply agreed on a list where every letter gets its own number. Small n is 110, small i is 105. So when you type n, the computer really stores the switches that make 110.',
		'[fyi] The first popular list was called ASCII, from the 1960s. Today we use <b>Unicode</b>, a far longer list that also covers Japanese, Arabic, Javanese script, and even emoji. The plain English letters still sit at their old numbers.',
		'Photos, songs, and videos use the same trick, just with much longer rows of switches. A photo is millions of tiny colored dots, and each dot is a few bytes saying how much red, green, and blue it has. Even apps are bytes, instructions for the CPU, more on that in [[What is a program|basics/program]].',
		'[ingat] One bit has a value of 0 or 1. Eight bits make one byte.',
		'Here are eight switches, one byte. Flip them until they spell the first letter of nimbus.'
	],
	reactions: {
		letter:
			'You did it! 64 plus 32 plus 8 plus 4 plus 2 makes 110, and 110 means n. You just wrote a letter exactly the way a computer does, eight switches, one byte.',
		word: 'Six letters, six bytes, 48 switches. That is every single bit it takes to store the word nimbus. Every message you have ever sent is made of rows like these.',
		char: 'One letter, one byte, eight switches. You built one yourself a moment ago.',
		chat: 'A whole chat message is only around a hundred bytes. Tiny, a single photo could hold thousands of them.',
		photo:
			'A phone photo is about 3 MB, that is 3 million bytes, or roughly 24 million switches. Every colored dot needs its own few bytes, and a photo has millions of dots.',
		song: 'A song is about 4 MB. Sound is measured thousands of times every second, and every measurement becomes a couple of bytes.',
		movie:
			'A movie is around 4 GB, billions of bytes, more than 30 billion switches. It is really thousands of photos in a row, plus sound. That is why movies fill up your phone so fast.'
	},
	locale: 'en-US',
	acts: ['One byte', 'How big'],
	goal: 'Make the letter {c}',
	sumLabel: 'Your switches add up to {n}',
	letterIs: 'which means',
	noLetter: 'which is not a small letter yet',
	hintHigh: 'A bit too big, turn a switch off',
	hintLow: 'Not there yet, turn another switch on',
	hintTap: 'Tap a switch to flip it between 0 and 1',
	matched: 'That is {c}, spot on',
	helpBtn: 'Let Nim flip the rest of nimbus',
	wordLabel: 'nimbus, byte by byte',
	wordNote: '{b} bytes, {n} switches',
	sizesBtn: 'Now see bigger things',
	sizePrompt: 'Tap each thing to see how many switches it needs',
	units: 'KB is about a thousand bytes, MB about a million, GB about a billion',
	switches: 'about {n} switches',
	sizes: [
		{ id: 'char', name: 'One letter', size: '1 byte' },
		{ id: 'chat', name: 'A chat message', size: '100 bytes' },
		{ id: 'photo', name: 'A phone photo', size: '3 MB' },
		{ id: 'song', name: 'A song', size: '4 MB' },
		{ id: 'movie', name: 'A movie', size: '4 GB' }
	],
	doneNote: 'Everything on a computer is switches, just a different number of them'
};
