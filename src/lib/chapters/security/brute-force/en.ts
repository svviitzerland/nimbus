import type { BruteForceText } from './types';

export const en: BruteForceText = {
	title: 'Brute force',
	intro: [
		'Meet the guessing machine. It stands at a login and types password after password, aaaa, aaab, aaac, and never gets tired. Winning by simply trying every possibility is called a <b>brute force</b> attack.',
		'Computers are fast. A strong machine can try about <b>10 billion</b> guesses every second. A short password like <b>kopi</b> has under half a million possibilities, so it falls before you can blink.',
		'Here is the secret. Every extra letter <b>multiplies</b> the work by 26, because each new spot can be any letter. Watch the second password grow, and watch the time next to it jump.',
		'Now the race. The same machine attacks both at once. kopi opens instantly, while <b>kopisusupagihari</b> (sixteen plain letters, no tricks) would keep it busy for over a hundred thousand years.',
		'What about clever passwords like <b>P@ssw0rd</b>, with swapped letters and symbols? Huge lists of real passwords leak from hacked sites every year, and the machine tries those favourites first. Clever tricks are on the list too. Using a leaked password on other sites is called <b>credential stuffing</b>.',
		'[ingat] <b>Long beats clever.</b> Pick a long password made of a few random words, not a famous line. Length does the heavy lifting.',
		'Sites fight back too, with a <b>lockout</b>. After a few wrong tries the login makes you wait, so the machine slows from billions of guesses to a handful a minute. Even kopi would now take months.',
		'[fyi] If attackers steal the password file itself, there is no lockout, they guess on their own machines at full speed. That is why good sites store passwords with slow [[hashing|security/hashing]], and why [[MFA|security/mfa]] matters, a guessed password alone is not enough. A password manager can remember the long ones for you.',
		'Want to feel it? Drag the slider to change the length of the second password and watch the time. Or just watch the machine sweat, that works too.'
	],
	reactions: {
		weak: 'Short enough that the machine gets through it in hours or less. Add a few more letters and see what happens.',
		okay: 'Getting there. Days or years is already annoying for an attacker, and every extra letter multiplies it by 26.',
		strong:
			'Now that is long. Thousands of years or more, even at 10 billion guesses a second. Long beats clever, every time.'
	},
	steps: [
		{
			tag: 'The attacker',
			title: 'Brute force',
			body: 'Trying <b>every</b> possible password, one after another, until one fits.'
		},
		{
			tag: 'Speed',
			title: 'Short falls fast',
			body: 'Four letters means 26 × 26 × 26 × 26, under half a million tries. For a machine that is <b>nothing</b>.'
		},
		{
			tag: 'Length',
			title: 'Each letter multiplies',
			body: 'One more letter, <b>26 times</b> more work. A few extra letters turn seconds into centuries.'
		},
		{
			tag: 'The race',
			title: 'Short versus long',
			body: 'Same machine, same speed. The only difference is <b>length</b>.'
		},
		{
			tag: 'Leaked lists',
			title: 'Favourites go first',
			body: 'Popular passwords and common tricks sit on <b>leaked lists</b>. The machine tries them before anything else.'
		},
		{
			tag: 'Make it stick',
			title: 'Long beats clever',
			body: 'A few <b>random words</b> in a row beat any short password full of symbols.'
		},
		{
			tag: 'Defense',
			title: 'Lockout',
			body: 'A few wrong tries, then a <b>wait</b>. Billions of guesses a second drop to a handful a minute.'
		},
		{
			tag: 'Side note',
			title: 'Stolen files',
			body: 'A stolen password file has no lockout. Slow <b>hashing</b> and <b>MFA</b> protect you there.'
		},
		{
			tag: 'Optional',
			title: 'Try a length',
			body: 'Drag the slider and watch how long the machine would need.'
		}
	],
	machineLabel: 'Guessing machine',
	speedFast: '10 billion guesses a second',
	speedLock: 'Locked out, 5 guesses a minute',
	listLabel: 'leaked list',
	waitLabel: 'please wait',
	letters: '{n} letters',
	cracked: 'Cracked',
	holding: 'Holding',
	onList: 'on the list',
	units: {
		instant: 'instantly',
		seconds: 'about {n} seconds',
		minutes: 'about {n} minutes',
		hours: 'about {n} hours',
		days: 'about {n} days',
		years: 'about {n} years',
		million: 'about {n} million years',
		billion: 'about {n} billion years'
	},
	numberLocale: 'en-US',
	rule: 'Long beats clever',
	sliderLabel: 'Length of the second password'
};
