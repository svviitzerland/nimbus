import type { HatColorsText } from './types';

export const en: HatColorsText = {
	title: 'Types of hackers',
	intro: [
		'<b>White hat</b>, <b>black hat</b>, and <b>gray hat</b> are terms used to discuss hacking activities. To assess these examples, check permission and purpose.',
		'A <b>hacker</b> is simply someone who knows a system so well they can make it do things nobody planned. The skill itself is neutral, a bit like a locksmith who can open any door.',
		'<b>White hats</b> test with permission to improve security. <b>Black hats</b> misuse systems, for example to steal or extort. <b>Gray hat</b> often describes testing without permission even when the person claims to help.',
		'Two people may use the same tools with different access boundaries. One has test accounts and a written scope, while the other accesses a system without its owner’s agreement.',
		'Permission needs to specify the systems and actions allowed. Knowing testing techniques does not grant permission to use them on someone else’s systems.',
		'[fyi] The good news is that companies now invite hackers in. Back in 1995 Netscape paid people for finding bugs in its browser, and today these <b>bug bounty</b> programs pay real money for a careful report. More on that in [[pentesting and bug bounties|security/pentest]].',
		'[ingat] <b>Check permission before technique.</b> Helpful intentions do not replace the owner’s agreement or testing boundaries.',
		'Read these six cases and decide whether the action is authorized. Then inspect the category that fits the case.'
	],
	reactions: {
		lab: 'Dina uses her own device and practice environment. The test does not touch another party’s systems.',
		wifi: 'The WiFi owner has not granted permission. Curiosity does not change the access boundaries.',
		pentest:
			'Sari has permission defining scope, timing, and methods. Testing must stay within those limits.',
		extort:
			'The access is unauthorized and followed by a threat to expose data. This is misuse of a system.',
		warn: 'Tono has no permission to access the system. Reporting afterward does not replace permission before testing.',
		bounty:
			'Bima follows the bug bounty program’s permission and rules, then reports through its designated channel.'
	},
	askLabel: 'Is this action authorized?',
	legalBtn: 'Authorized',
	illegalBtn: 'Unauthorized',
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
	legalTag: 'authorized',
	illegalTag: 'unauthorized',
	rightTag: 'you got it',
	wrongTag: 'not quite',
	nextBtn: 'Next story',
	progress: 'Story {n} of {total}',
	scoreLine: 'You judged {n} of {total} right',
	doneLine: 'Check permission, purpose, and testing boundaries in every case.',
	again: 'Hear the stories again'
};
