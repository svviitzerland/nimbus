import type { CtfText } from './types';

export const en: CtfText = {
	title: 'What is a CTF',
	intro: [
		'Here is a puzzle. If testing a real site without permission is against the law, where do people learn to hack in the first place? Not on real sites. They play games built for exactly that.',
		'The games are called <b>CTF</b>, short for Capture The Flag. Like the playground game, you hunt for a flag. Here the flag is a short secret text hidden inside a puzzle, something like nimbus{...}. Find it, type it in, score points.',
		'Puzzles come in flavours. <b>Crypto</b> is about secret writing, <b>web</b> hides things inside a page, and <b>passwords</b> tests how easy a login is to guess. Every solved puzzle adds points to a scoreboard, and teams race each other.',
		'Why is attacking allowed here? Because the organisers built every target to be attacked. Entering the game is the permission, just like the scope in a [[bug bounty|security/pentest]].',
		'[fyi] DEF CON, a hacker conference in Las Vegas, has run one of the most famous CTFs since 1996. For beginners there is picoCTF from Carnegie Mellon University, free and made for school students. Indonesia has its own too, like Cyber Jawara.',
		'Your own mini CTF is ready, three puzzles worth 100 points each. Every flag looks like nimbus{something}, and you only type the part inside the curly brackets.'
	],
	reactions: {
		decoded:
			'There it is. Shift every letter back by three and the gibberish turns into words. That is the Caesar trick from [[keys|security/keys]], and now you know the flag.',
		caesar:
			'Flag one captured. Real crypto puzzles start just like this, then get harder, with longer keys and stranger tricks.',
		peek: 'The page looks empty, but the browser only shows part of what it got. View the source to see the raw HTML that arrived.',
		source:
			'Flag two. A comment in [[HTML|web/html]] is hidden on screen but sent to every visitor anyway. Real developers have leaked passwords this way, so never hide secrets in a page.',
		tryFail: 'Nope. Try the others, the list is ordered by how often people really use them.',
		cracked:
			'In. nimbus123 is the site name plus a few numbers, one of the first things any attacker tries. The flag is on the welcome screen.',
		password:
			'Flag three. A long password, or better a password manager, would have made this list useless.',
		wrongFlag: 'Close, but that flag is not it. Check the spelling, small letters only.',
		allFlags:
			'All three flags, 300 points! You just solved a crypto, a web, and a password puzzle. picoCTF and friends have hundreds more, all legal and all free.'
	},
	scoreLabel: 'Score {n} of {total}',
	points: '{n} pts',
	solvedTag: 'solved',
	challenges: {
		caesar: {
			name: 'Old secret',
			category: 'Crypto',
			brief: 'Someone shifted every letter of the flag. Slide until it reads like words.'
		},
		source: {
			name: 'Empty page',
			category: 'Web',
			brief: 'This nimbus.com page looks like it has nothing to say. Look closer.'
		},
		password: {
			name: 'Practice login',
			category: 'Passwords',
			brief:
				'The admin of this practice box picked a common password. Try the list of the most used ones.'
		}
	},
	flagLabel: 'Your flag',
	flagPlaceholder: 'inside the brackets',
	submitBtn: 'Submit',
	wrongFlag: 'Not the flag',
	rightFlag: 'Captured, 100 points',
	allSolved: 'Every flag captured',
	shiftLabel: 'Shift back {n}',
	cipherLabel: 'What you found',
	plainLabel: 'After shifting',
	pageHeading: 'Welcome to nimbus.com',
	pageBody: 'Nothing to see here. Really.',
	viewPage: 'Page',
	viewSource: 'View source',
	loginTitle: 'practice.nimbus.com',
	userLabel: 'User',
	wordlistLabel: 'Most used passwords',
	wrongPass: 'Wrong password',
	welcome: 'Welcome, admin. Your flag is'
};
