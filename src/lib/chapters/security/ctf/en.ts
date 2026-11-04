import type { CtfText } from './types';

export const en: CtfText = {
	title: 'Capture The Flag',
	caesar: {
		alt: 'Marble bust of Julius Caesar in the Vatican Museums',
		caption: 'Julius Caesar, a Roman bust'
	},
	intro: [
		'Here is a puzzle. If testing a real site without permission is against the law, where do people learn to hack in the first place? Not on real sites. They play games built for exactly that.',
		'The games are called <b>CTF</b>, short for Capture The Flag. Like the playground game, you hunt for a flag. Here the flag is a short secret text hidden inside a puzzle, something like nimbus{...}. Find it, type it in, score points.',
		'Why is attacking allowed here? Because the organisers built every target to be attacked, and joining the game is your permission. It is the same idea as the scope in a [[bug bounty|security/pentest]], just friendlier.',
		'Let us solve a tiny one together. Someone left this scrambled note. It uses the <b>Caesar cipher</b>, the trick Julius Caesar used for his letters about two thousand years ago. Every letter is pushed a few places further along the alphabet, here three, so a becomes d.',
		'To read it, push every letter back three places. Watch. q goes back to n, l goes back to i, p goes back to m. The curly brackets are not letters, so they stay as they are.',
		'And there is the flag, nimbus{salad}. A Caesar salad, of course. Puzzle makers love a bad joke.',
		'[fyi] DEF CON, a hacker conference in Las Vegas, has run one of the most famous CTFs since 1996. For beginners there is picoCTF from Carnegie Mellon University, free and made for school students. Indonesia has its own too, like Cyber Jawara.',
		'[ingat] Caesar only slides the alphabet. Slide forward to hide, slide back to read. And with just 25 possible slides, you can simply try them all.',
		'Your turn, if you like. Here is a new note with a different slide. Move the slider until the message makes sense.'
	],
	reactions: {
		solved:
			'Seven places, and out comes nimbus{cloud}. You just cracked a cipher by trying the slides, exactly how CTF players do it.'
	},
	steps: [
		{
			title: 'Practice, legally',
			body: 'Hacking skills are learned in <b>games</b> made for it, never on real sites.'
		},
		{
			title: 'Capture The Flag',
			body: 'The flag is a <b>secret text</b> like nimbus{...}. Find it, submit it, score.'
		},
		{
			title: 'Built to be attacked',
			body: 'The organisers own every target and <b>invite</b> you to break it. Joining is the permission.'
		},
		{
			title: 'Caesar cipher',
			body: 'Each letter moves <b>3 places</b> along the alphabet. a becomes d, b becomes e, and so on.'
		},
		{
			title: 'Decoding',
			body: 'Go back the same number of places. Anything that is not a letter <b>stays</b> the same.'
		},
		{
			title: 'Captured',
			body: 'The flag reads <b>nimbus{salad}</b>. In a real CTF you would paste it in for points.'
		},
		{
			tag: 'By the way',
			title: 'Where to play',
			body: '<b>picoCTF</b> is free and made for beginners. Indonesia has <b>Cyber Jawara</b>.'
		},
		{
			tag: 'Remember it',
			title: 'Slide it',
			body: 'Forward to <b>hide</b>, back to <b>read</b>. Only 25 slides to try.'
		},
		{
			tag: 'Your turn',
			title: 'Find the slide',
			body: 'Move the slider until the note reads like a flag.'
		}
	],
	sign: 'Built to be attacked',
	noteLabel: 'The note',
	stripCap: 'Each letter moves {n} places',
	shiftLabel: 'Slide back {n}'
};
