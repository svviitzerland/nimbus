import type { SignatureText } from './types';

export const en: SignatureText = {
	title: 'Digital signatures',
	intro: [
		'Your phone updates its apps all the time. But how does it know an update really came from the app maker, and that nobody slipped something nasty in along the way?',
		'On paper, you sign with a pen. A <b>digital signature</b> does the same job, only far harder to fake. It is built on the [[public and private keys|security/keys]] you met earlier, just used the other way round.',
		'Remember the padlock? Anyone could lock it, only the private key could open it. A signature flips that. Only your <b>private key</b> can make the signature, and anyone holding your <b>public key</b> can check it.',
		'First, the file gets a <b>fingerprint</b>, a short code calculated from every single letter inside (its real name is a <b>hash</b>, more in [[hashing|security/hashing]]). Change even one letter and the fingerprint comes out completely different.',
		'Then the developer locks that fingerprint with their private key. The locked fingerprint is the signature, and it travels along with the file.',
		'The phone opens the signature with the public key, then calculates the fingerprint of the file it actually received. If they match, the file is untouched and really from the developer. If not, the phone refuses to install it.',
		'[fyi] You lean on this every day. App stores, Windows and Android updates, and the [[certificate behind HTTPS|security/tls]] are all checked with signatures. Many countries also accept certified digital signatures on contracts, just like ink.',
		'Your turn. You build the nimbus.com app. Sign an update and send it out, then play the villain and try to sneak something in.'
	],
	reactions: {
		fingerprint:
			'There is the fingerprint of your update. Same file, same fingerprint, every single time, on any computer in the world.',
		signed:
			'Signed. You locked the fingerprint with your private key, which never leaves your laptop. Only you could have made this exact signature.',
		verified:
			'The phone opened the signature with your public key and got the fingerprint back, then calculated its own from the file. They match, so the update installs. It is from you, and nobody touched it.',
		edit: 'See the fingerprint jump? One small change and the whole code is different. The signature, though, still carries the old fingerprint.',
		untouched:
			'Nothing was changed, so everything still matches and the update installs. Try slipping in a sneaky change before it reaches the phone.',
		tampered:
			'Caught. The signature still opens to the old fingerprint, but the file now gives a new one. The phone refuses the update, and the user is safe.',
		forged:
			'Nice try, villain. The attacker signed with his own private key, but the phone checks with the nimbus public key, which only opens signatures made by the real nimbus key. Out comes gibberish, so the update is refused again.'
	},
	acts: ['Sign', 'Tamper', 'Forge'],
	actLabel: 'Act {n}',
	nextAct: 'On to the next act',
	devLabel: 'You, the developer',
	userLabel: 'A user',
	attackerLabel: 'Attacker',
	fileName: 'nimbus app update',
	lines: ['nimbus app version 2.0', 'adds dark mode', 'loads posts from nimbus.com'],
	tampers: [
		{ btn: 'Change one number', line: 0, text: 'nimbus app version 2.1' },
		{ btn: 'Hide a password stealer', line: 1, text: 'adds dark mode, copies passwords' },
		{ btn: 'Send data to a stranger', line: 2, text: 'loads posts, sends them away' }
	],
	fingerprintLabel: 'Fingerprint',
	signatureLabel: 'Signature',
	noSig: 'not signed yet',
	nimbusKey: 'nimbus private key',
	attackerKey: "attacker's private key",
	hashBtn: 'Make the fingerprint',
	signBtn: 'Sign with your private key',
	sendBtn: 'Send the update',
	tamperHint: 'The update passes the attacker. Pick a sneaky change',
	deliverBtn: 'Let it reach the phone',
	retryBtn: 'Grab it again and change something',
	forgeBtn: 'Sign it with the attacker key and send',
	check: {
		heading: 'The phone checks',
		opened: 'Signature opened with the nimbus public key',
		computed: 'Fingerprint of the file it got',
		ok: 'Match, update installed',
		bad: 'No match, update refused'
	}
};
