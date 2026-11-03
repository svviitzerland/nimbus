import type { HashingText } from './types';

export const en: HashingText = {
	title: 'Passwords and hashing',
	intro: [
		'When you sign up somewhere, the site has to keep your password so it can check it next time. The big question is how it keeps it.',
		'The careless way is to store it exactly as you typed it. In 2009 a company called RockYou did just that, and 32 million passwords leaked as plain, readable text. The most popular one was 123456, used by about 290 thousand people.',
		'The better way is a <b>hash</b>, a one way fingerprint. A math recipe turns your password into a long jumble of letters and numbers. The same password always gives the same jumble, but nobody can turn the jumble back into the password.',
		'When you log in, the server hashes whatever you typed and compares the two jumbles. If they match, you are in. The server never needs to keep your real password at all.',
		'Hashes have one weak spot though. Attackers prepare huge <b>lookup tables</b>, millions of common passwords already hashed. In 2012 about 6.5 million LinkedIn password hashes were posted online, and because they were stored without salt, a large share was cracked within days.',
		'The fix is <b>salt</b>, a few random characters mixed into each password before hashing, different for every user. The same password now gives different jumbles, and the ready made tables stop working.',
		"[fyi] Hashes are not only for passwords. Download pages often show a file's hash so you can check it arrived unchanged, that is the I in the [[CIA triad|security/cia]].",
		'Your turn. Pick a password, sign up at two shops, and then let both databases leak.'
	],
	reactions: {
		typed:
			'See the fingerprint? Change a single letter and the whole jumble changes. That is on purpose, so two similar passwords never look similar.',
		registered:
			'Both shops signed you up. The careless shop wrote your password down as it is, nimbus.com only kept the fingerprint. Now imagine a bad day for both of them.',
		leaked:
			'Ouch for the careless shop, the attacker reads your password straight away, and since people reuse passwords he will try it on your email next. From nimbus.com he only got a jumble that leads nowhere.',
		leakedWeak:
			'Careful. Your password is one of the most common ones, so even the hash gave it away, the attacker just looked it up in a ready made table. The next act shows the fix.',
		lookup:
			"Budi and Sari fell together. They use the same password, so their hashes are identical, and that hash was already in the attacker's table. Wati's long, odd password was not on any list.",
		salted:
			'Now nothing matches. Each user got their own salt, so even Budi and Sari look completely different and the ready made table is useless. Real sites also use slow hashes like bcrypt (from 1999), so every single guess costs the attacker time.'
	},
	acts: ['Two shops', 'Salt'],
	actLabel: 'Act {n}',
	nextAct: 'On to the next act',
	pwLabel: 'Your password',
	pwPlaceholder: 'type a password',
	hashLabel: 'hash',
	tooShort: 'Type {n} more characters',
	registerBtn: 'Sign up at both shops',
	leakBtn: 'Both databases leak',
	carelessName: 'Careless shop',
	carelessSub: 'keeps passwords as they are',
	nimbusName: 'nimbus.com',
	nimbusSub: 'keeps only the hash',
	colUser: 'user',
	colPassword: 'password',
	youUser: 'you',
	emptyRow: 'nobody yet',
	leakedTag: 'leaked',
	attackerReads: 'The attacker reads your password',
	attackerStuck: 'The attacker gets a jumble, no password',
	attackerCracked: 'The attacker finds it in a lookup table',
	lookupTitle: "The attacker's lookup table",
	lookupSub: 'common passwords, hashed in advance',
	runLookup: 'Run the lookup table',
	addSalt: 'Add salt and leak again',
	saltLabel: 'salt',
	crackedTag: 'cracked',
	safeTag: 'safe',
	usersTitle: 'Leaked users, no salt',
	usersTitleSalted: 'Leaked users, with salt'
};
