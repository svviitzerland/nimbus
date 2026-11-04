import type { HashingText } from './types';

export const en: HashingText = {
	title: 'Passwords and hashing',
	intro: [
		'When you sign up somewhere, the site has to keep your password, so it can check it the next time you log in. The big question is how it keeps it.',
		'The careless way is to write it down exactly as you typed it. In 2009 a company called RockYou did just that, and 32 million passwords leaked as plain readable text. The most popular one was 123456, used by about 290 thousand people.',
		'The better way is a <b>hash</b>. Picture a math blender. Your password drops in, the blender whirs, and out comes a long jumble of letters and numbers. That jumble is the hash, and it is all the site keeps.',
		'Two magic rules. The same password always gives the very same jumble. And change just one character, sunflower1 into sunflower2, and the jumble changes completely.',
		'[ingat] A hash is a blender. <b>You can turn fruit into a smoothie, but you can never unblend a smoothie back into fruit.</b> Nobody can turn the jumble back into your password.',
		'So how does logging in work? The site blends whatever you just typed and compares it with the jumble it saved. Same jumble means same password, and you are in. The site never needs your real password at all.',
		'Hashes have one weak spot. Attackers blend millions of common passwords ahead of time and keep them in a <b>lookup table</b>. In 2012 about 6.5 million LinkedIn password hashes were posted online. They had no salt, so a big share was simply looked up and cracked within days.',
		'The fix is <b>salt</b>, a few random characters mixed in with each password before blending, different for every user. Budi and Sari both use 123456, yet their jumbles now look nothing alike, and the ready made table finds nothing.',
		"[fyi] Real sites also pick slow blenders on purpose, like bcrypt from 1999, so every single guess costs an attacker time. Hashes are not only for passwords either. Download pages show a file's hash so you can check it arrived unchanged, that is the I in the [[CIA triad|security/cia]].",
		'Want to try the blender? Type any password and watch the jumble jump around with every letter. Or just enjoy the whirring.'
	],
	reactions: {
		typed:
			'See? One more letter and the whole jumble changes. And it is still a one way trip, the jumble tells nobody what you typed. (Nim is not saving it anywhere, promise.)'
	},
	steps: [
		{
			tag: 'Signing up',
			title: 'Where does it go?',
			body: 'The site keeps a <b>database</b>, a big table of its users. The question is what goes in the password column.'
		},
		{
			tag: 'RockYou, 2009',
			title: 'Plain text',
			body: 'Passwords saved <b>as typed</b>. One leak and every single one is readable, instantly.'
		},
		{
			tag: 'The fix',
			title: 'Hash',
			body: 'A math blender turns any password into a jumble of the same length. The site keeps <b>only the jumble</b>.'
		},
		{
			tag: 'Two rules',
			title: 'Same in, same out',
			body: 'Same password, same hash, every time. One character different, a <b>totally different</b> hash.'
		},
		{
			tag: 'Rule of thumb',
			title: 'No way back',
			body: 'You cannot <b>unblend a smoothie</b>. A hash only ever goes one way.'
		},
		{
			tag: 'Logging in',
			title: 'Compare the jumbles',
			body: 'Blend what you typed just now and compare it with the saved jumble. A match means you are in.'
		},
		{
			tag: 'LinkedIn, 2012',
			title: 'Lookup table',
			body: 'Common passwords blended in advance. A leaked hash that sits on the list gives its password away.'
		},
		{
			tag: 'The fix',
			title: 'Salt',
			body: 'Random characters added per user before blending. Same password, <b>different</b> hash, and the table is useless.'
		},
		{
			tag: 'Good to know',
			title: 'Slow on purpose',
			body: 'Password blenders like <b>bcrypt</b> are slow by design, so trying millions of guesses takes forever.'
		},
		{
			tag: 'Optional',
			title: 'Try the blender',
			body: 'Type anything. The hash is the real thing (SHA256), worked out right here in your browser and never sent anywhere.'
		}
	],
	examples: ['sunflower1', 'sunflower2'],
	users: ['budi', 'sari'],
	dbTitle: 'nimbus.com database',
	colUser: 'user',
	colPassword: 'password',
	leakedTag: 'leaked',
	hashLabel: 'hash',
	noWayBack: 'no way back',
	savedLabel: 'saved at sign up',
	typedLabel: 'typed just now',
	matchTag: 'match, welcome in',
	tableTitle: "attacker's lookup table",
	leakedHashLabel: 'leaked hash',
	crackedTag: 'cracked',
	saltLabel: 'salt',
	sameTag: 'same hash',
	noMatchTag: 'nothing in the table',
	slowTag: 'slow on purpose',
	tryLabel: 'Type any password',
	tryPlaceholder: 'your password here'
};
