import type { ThreatsText } from './types';

export const en: ThreatsText = {
	title: 'Threat modeling',
	intro: [
		'A smart burglar never fights the big lock on the front door. He checks the bathroom window, the back gate, and the spare key under the flower pot.',
		"Attackers think the same way. <b>Threat modeling</b> means looking at your own system through an attacker's eyes, before a real attacker does, and fixing the weakest door first.",
		'It boils down to four plain questions. What are we building? What can go wrong? What will we do about it? Did we do a good enough job? The security writer Adam Shostack made these four famous.',
		'A real story shows why. In 2013 the American store chain Target lost about 40 million card numbers. The attackers did not start at the shop website. They first got in with the login of a small heating and air conditioning company that worked for Target.',
		'[fyi] Back in 1999, two Microsoft engineers, Loren Kohnfelder and Praerit Garg, wrote a checklist called <b>STRIDE</b>, six kinds of threats to hunt for. Teams around the world still use it today.',
		"Here is a map of the nimbus.com shop. Tap every place you think an attacker could try, then compare your list with Nim's."
	],
	reactions: {
		first:
			'Good start. Each mark is one door worth guarding. Keep going, and think beyond the website itself.',
		vendor:
			'Sharp eye. That is exactly how Target was breached, through a partner with a weaker lock. Anyone who can log in to your system is part of your security, even the AC technician.',
		backup:
			'Nice one, most people forget backups. A backup is a full copy of your data, so stealing it is as good as stealing the real thing.',
		compareAll:
			'You found every spot Nim had. You already think like a defender. Real teams do this on a whiteboard before they write any code.',
		compareSome:
			'Not bad at all. The amber spots are the ones you missed, tap them to see why they matter. Missing a few is normal, that is why teams model threats together, more eyes find more doors.'
	},
	spots: {
		phone: {
			name: 'Customer phone',
			threat: 'A fake login page tricks the customer into typing their password (phishing).',
			fix: 'Add a second login step, so a stolen password alone is not enough.'
		},
		wifi: {
			name: 'Cafe WiFi',
			threat: 'Someone on the same WiFi listens to the traffic going past.',
			fix: 'Use HTTPS everywhere, so whatever travels is encrypted.'
		},
		login: {
			name: 'Login page',
			threat: 'A bot guesses thousands of passwords every minute.',
			fix: 'Limit the attempts and slow down repeated failures.'
		},
		server: {
			name: 'Web server',
			threat: 'Old software with a well known hole that nobody updated.',
			fix: 'Update often and close every port nobody uses.'
		},
		db: {
			name: 'Database',
			threat: 'Customer data copied out in one go.',
			fix: 'Keep only password hashes and encrypt sensitive data.'
		},
		admin: {
			name: 'Admin laptop',
			threat: 'It holds the keys to everything, and sometimes sits unlocked on a desk.',
			fix: 'Give each person only the access they need, and lock the screen.'
		},
		vendor: {
			name: 'Partner account',
			threat: 'The AC technician has a login too, and their security may be weaker than yours.',
			fix: 'Give partners a separate, tiny account and watch what it does.'
		},
		backup: {
			name: 'Backup drive',
			threat: 'A full copy of the data, often guarded less carefully than the original.',
			fix: 'Encrypt backups and store them somewhere locked.'
		}
	},
	tapHint: 'Tap a spot on the map to mark it',
	compareBtn: "Compare with Nim's list",
	compareNeed: 'Mark {n} more to compare',
	score: 'You found {n} of {total}',
	missedLabel: 'Nim also found',
	threatLabel: 'What could go wrong',
	fixLabel: 'The fix',
	foundTag: 'yours',
	missedTag: 'missed',
	resetBtn: 'Start the map over'
};
