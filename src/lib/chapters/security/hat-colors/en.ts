import type { HatColorsText } from './types';

export const en: HatColorsText = {
	title: 'Types of hackers',
	intro: [
		'In old Western films you could spot the hero by his white hat and the villain by his black one. The computer world borrowed that idea to sort out its hackers.',
		'A <b>hacker</b> is simply someone who knows a system so well they can make it do things nobody planned. The skill itself is neutral, a bit like a locksmith who can open any door.',
		'A <b>white hat</b> works with permission, testing systems so they can be fixed. A <b>black hat</b> breaks in without permission to steal, spy, or blackmail. A <b>gray hat</b> sits in between, no permission but no bad intent either, and the law still sees it as breaking in.',
		'A real story. In the 1980s and 90s Kevin Mitnick was the most wanted hacker in America. He was caught in 1995 and spent about five years in prison. Later he ran a security company and got paid to break in, this time with permission. Same skills, the other side of the line.',
		"That line has a name, <b>permission</b>. Most countries put it into law. In Indonesia it is the UU ITE, in the United States the Computer Fraud and Abuse Act. Getting into a system without the owner's permission is a crime even if you take nothing.",
		'[fyi] The good news is that companies now invite hackers in. Back in 1995 Netscape paid people for finding bugs in its browser, and today these <b>bug bounty</b> programs pay real money for a careful report. More on that in [[pentesting and bug bounties|security/pentest]].',
		'Six short stories are coming. For each one, decide whether it is legal, then see which hat it wears.'
	],
	reactions: {
		lab: 'Legal and a great way to learn. Your own laptop, your own rules. Lots of security pros started exactly like this, breaking their own stuff at home.',
		wifi: 'Not legal, even if Raka only wanted to see whether he could. The WiFi belongs to the neighbour, and nobody said yes. Curiosity is great, just point it at things you own.',
		pentest:
			'Legal. The signed contract is the whole difference. It says what Sari may test, when, and how. That job is called a <b>pentest</b> (penetration test).',
		extort:
			'Not legal, and this one is black hat for sure. Finding the hole was already uninvited, and asking for money turns it into blackmail.',
		warn: 'The tricky one. Tono meant well, yet he still got in without asking first, so it is not legal. Gray hats sometimes end up in court even with good intentions. The safe way is to report without breaking in.',
		bounty:
			'Legal, and paid. The bug bounty page is written permission with rules attached. Bima stayed inside them, reported privately, and nimbus.com fixed the hole before anyone got hurt.'
	},
	askLabel: 'Is this legal?',
	legalBtn: 'Legal',
	illegalBtn: 'Not legal',
	scenarios: {
		lab: {
			who: 'Dina, 16',
			story: 'Dina tries to break into an old laptop she owns, at home, to learn how it works.',
			why: "Her own device, so she needs nobody else's permission."
		},
		wifi: {
			who: 'Raka',
			story: "Raka guesses the password of his neighbour's WiFi, just to see if he can.",
			why: 'No permission from the owner, even without bad intent.'
		},
		pentest: {
			who: 'Sari, security consultant',
			story: 'A bank signs a contract with Sari and asks her to try to break into its app.',
			why: 'Written permission from the owner, with clear limits.'
		},
		extort: {
			who: 'An anonymous email',
			story:
				'Someone breaks into a shop, then demands money or they will publish its customer data.',
			why: 'No permission, and it turns into blackmail.'
		},
		warn: {
			who: 'Tono',
			story:
				'Tono sneaks into his school website without asking, then emails the admin to warn them about the hole.',
			why: 'Good intent, but still no permission before he got in.'
		},
		bounty: {
			who: 'Bima',
			story:
				'Bima reads the nimbus.com bug bounty rules, finds a bug within them, and reports it privately.',
			why: 'The bounty program is written permission, and he followed its rules.'
		}
	},
	hats: { white: 'White hat', gray: 'Gray hat', black: 'Black hat' },
	legalTag: 'legal',
	illegalTag: 'not legal',
	rightTag: 'you got it',
	wrongTag: 'not quite',
	nextBtn: 'Next story',
	progress: 'Story {n} of {total}',
	scoreLine: 'You judged {n} of {total} right',
	doneLine: 'Same skills every time. The only thing that changed was permission.',
	again: 'Hear the stories again'
};
