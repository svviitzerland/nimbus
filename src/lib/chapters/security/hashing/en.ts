import type { HashingText } from './types';

export const en: HashingText = {
	title: 'Passwords and hashing',
	intro: [
		'A site needs to check your password at sign in, but does not need to store the original. Compare the two shops in this lab.',
		'The careless shop stores plain text. A database leak exposes the password immediately. The other shop stores a <b>hash</b>, the result of a one way computation.',
		'At sign in, the server processes the entered password the same way and checks the result. A hash has no decryption operation.',
		'An attacker can still <b>guess</b>. Try a common password such as 123456, then run the lookup table. A matching hash reveals a successful guess.',
		'A <b>salt</b> is a random value unique to each stored password. It is stored alongside the hash. It prevents reuse of one lookup table across users, but does not stop every guess.',
		'[fyi] The lab uses SHA256 for a quick visible result. Real password storage needs a deliberately costly algorithm such as Argon2id, with a salt.',
		'[ingat] <b>Not reversible does not mean not guessable.</b> Strong passwords, salts, and an appropriate algorithm work together.',
		'Register with a test password, inspect the leak, and compare lookup results before and after adding a salt.'
	],
	reactions: {
		typed:
			'See the fingerprint? Change a single letter and the whole jumble changes. That is on purpose, so two similar passwords never look similar.',
		registered:
			'Both shops signed you up. The careless shop wrote your password down as it is, nimbus.com only kept the fingerprint. Now imagine a bad day for both of them.',
		leaked:
			'The careless shop exposes the password directly. A hash does not reveal it directly, but attackers can still hash guesses and compare.',
		leakedWeak:
			'Careful. Your password is one of the most common ones, so even the hash gave it away, the attacker just looked it up in a ready made table. The next act shows the fix.',
		lookup:
			'Two common passwords match this table. The other is absent from this sample list, which does not mean it is impossible to guess.',
		salted:
			'Different salts defeat this precomputed table. Per user guessing remains possible. Real storage also uses a deliberately costly password hashing algorithm.'
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
	safeTag: 'No match in this table',
	usersTitle: 'Leaked users, no salt',
	usersTitleSalted: 'Leaked users, with salt'
};
