import type { ThreatsText } from './types';

export const en: ThreatsText = {
	title: 'Threat modeling',
	intro: [
		'A smart burglar never fights the big lock on the front door. He checks the window, the back gate, and the spare key under the flower pot.',
		"Attackers think the same way. <b>Threat modeling</b> means walking around your own system with an attacker's eyes, before a real attacker does, and fixing the weakest door first.",
		'It boils down to four plain questions. What are we building? What can go wrong? What will we do about it? Did we do a good enough job? The security writer Adam Shostack made these four famous.',
		'For nimbus.com the house looks like this. The front door is the login page. The window is old server software nobody updated. The back gate is a login given to a partner company. The key under the pot is a backup, a full copy of all the data.',
		'A real story. In 2013 the American store chain Target lost about 40 million card numbers. The attackers did not start at the front door. They first got in with the login of a small heating and air conditioning company that worked for Target.',
		"From that back gate they crept through Target's network all the way to the cash registers in the stores, and quietly copied cards as customers paid. The lock on the front door was never even touched.",
		'[ingat] <b>A house is only as safe as its weakest door.</b> Think like a burglar, then lock like an owner.',
		'[fyi] Back in 1999 two Microsoft engineers, Loren Kohnfelder and Praerit Garg, wrote a checklist called <b>STRIDE</b>, six kinds of threats to hunt for (pretending to be someone, tampering, denying what you did, leaking, blocking, and grabbing more power). Teams around the world still use it.',
		'Want to look around yourself? Tap any spot on the house to see what could go wrong there and how nimbus.com locks it.'
	],
	reactions: {
		door: 'The front door, the login page. Everyone attacks it first, so it usually has the best lock. Still, a bot guessing passwords all day will find the weak ones.',
		window:
			'The window, old software. Holes in old versions are public knowledge, and bots scan the whole internet for them every day. Updating is the cheapest lock there is.',
		gate: 'The back gate, exactly how Target fell. Anyone who can log in to your system is part of your security, even the AC technician.',
		pot: 'The key under the pot. Most people forget backups, yet a backup is a full copy of the data, so stealing it is as good as stealing the real thing.'
	},
	steps: [
		{
			tag: 'The burglar',
			title: 'He skips the big lock',
			body: 'Attackers go where the defence is <b>weakest</b>, not where it is strongest.'
		},
		{
			tag: 'The idea',
			title: 'Threat modeling',
			body: 'Look at your own system <b>through an attacker&#39;s eyes</b>, on purpose, before anyone else does.'
		},
		{
			tag: 'The method',
			title: 'Four questions',
			body: 'What are we building? What can go wrong? What will we do about it? Did we do a good job?'
		},
		{
			tag: 'nimbus.com',
			title: 'The house is the system',
			body: 'Door is the <b>login</b>, window is <b>old software</b>, gate is a <b>partner login</b>, the key is the <b>backup</b>.'
		},
		{
			tag: 'Target, 2013',
			title: 'In through the back gate',
			body: 'The attackers used the login of a small <b>air conditioning company</b> that worked for Target.'
		},
		{
			tag: 'Target, 2013',
			title: 'To the registers',
			body: 'Once inside they reached the <b>cash registers</b> and copied about 40 million cards.'
		},
		{
			tag: 'Make it stick',
			title: 'The weakest door',
			body: 'Your security is only as good as its <b>weakest</b> spot. Find it before they do.'
		},
		{
			tag: 'Good to know',
			title: 'STRIDE',
			body: 'Six kinds of threat to check, one per letter. A handy list when the four questions feel too open.'
		},
		{
			tag: 'Optional',
			title: 'Walk around',
			body: 'Tap a spot on the house. Each one has a threat and a fix.'
		}
	],
	spots: {
		door: {
			name: 'Front door',
			place: 'login page',
			threat: 'A bot guesses thousands of passwords a minute.',
			fix: 'Limit attempts and add a second login step.'
		},
		window: {
			name: 'Window',
			place: 'old software',
			threat: 'A well known hole in software nobody updated.',
			fix: 'Update often and switch off what nobody uses.'
		},
		gate: {
			name: 'Back gate',
			place: 'partner login',
			threat: 'A partner with weaker security still has a login.',
			fix: 'Give partners a tiny separate account and watch it.'
		},
		pot: {
			name: 'Key under the pot',
			place: 'backup',
			threat: 'A full copy of the data, guarded less carefully.',
			fix: 'Encrypt backups and keep them locked away.'
		}
	},
	news: {
		tag: 'Target, 2013',
		head: 'About 40 million card numbers stolen, starting from a partner login'
	},
	registerLabel: 'cash registers',
	cardsLabel: '40 million cards',
	threatLabel: 'What could go wrong',
	fixLabel: 'The fix',
	tapHint: 'Tap a spot on the house'
};
