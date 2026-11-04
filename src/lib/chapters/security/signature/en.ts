import type { SignatureText } from './types';

export const en: SignatureText = {
	title: 'Digital signatures',
	intro: [
		'Your phone updates its apps all the time, often while you sleep. But how does it know an update really came from the app maker, and that nobody slipped something nasty in along the way?',
		'On paper, you sign with a pen. A <b>digital signature</b> does the same job for files, only it is far harder to fake. It is built on the [[public and private keys|security/keys]] you met earlier.',
		'Remember the padlock? Anyone could lock it, only the private key could open it. A signature flips that around. Only the <b>private key</b> can make the signature, and anyone with the <b>public key</b> can check it.',
		'[ingat] A signature is <b>only I can write it, everyone can check it</b>. Just like your handwritten signature, except nobody can copy this one.',
		'First, the file gets a <b>fingerprint</b>, a short code calculated from every letter inside (its real name is a <b>hash</b>, more in [[hashing|security/hashing]]). Watch one single letter change, and the whole fingerprint changes with it.',
		'The developer at nimbus.com takes that fingerprint and locks it with their private key. The locked fingerprint is the <b>signature</b>, and it travels along with the file like a wax seal.',
		'Your phone opens the seal with the public key and reads the fingerprint inside. Then it calculates the fingerprint of the file it actually received. Same fingerprint? The file is untouched and really from nimbus.com, so it installs.',
		'Now an attacker sits in the middle and sneaks one line into the update. He cannot make a new seal, because he does not have the private key. Your phone calculates the fingerprint, it no longer matches, and the update is blocked.',
		'[fyi] You lean on this every day. App stores, Windows and Android updates, and the [[certificate behind HTTPS|security/tls]] are all checked with signatures. Many countries also accept certified digital signatures on contracts, just like ink.',
		'If you like, let the attacker meddle or keep his hands off, and watch the phone decide by itself.'
	],
	reactions: {
		clean:
			'Untouched. The fingerprint inside the seal and the fingerprint of the file match, so the phone installs it.',
		tampered:
			'Tampered. One changed line gave a totally different fingerprint, the seal does not match anymore, and the phone refuses.'
	},
	steps: [
		{
			tag: 'The question',
			title: 'Is this update real?',
			body: 'An update can run anything on your phone. Before installing, the phone needs to know <b>who</b> made it and that <b>nothing changed</b> on the way.'
		},
		{
			tag: 'Pen and paper',
			title: 'Digital signature',
			body: 'Like a signature on a letter, but made with math, so it cannot be traced or copied onto another file.'
		},
		{
			tag: 'Keys, flipped',
			title: 'Private writes, public checks',
			body: 'The <b>private key</b> stays with the developer and makes signatures. The <b>public key</b> is on every phone and checks them.'
		},
		{
			tag: 'Make it stick',
			title: 'Only I write, everyone checks',
			body: 'Making a signature needs the private key. Checking one needs only the public key, which anyone may have.'
		},
		{
			tag: 'Fingerprint',
			title: 'Hash',
			body: 'A short code calculated from the whole file. Same file, same fingerprint. Change one letter and it comes out completely different.'
		},
		{
			tag: 'Signing',
			title: 'Lock the fingerprint',
			body: 'The fingerprint, locked with the private key, becomes the <b>signature</b>. It rides along with the file.'
		},
		{
			tag: 'Checking',
			title: 'Compare two fingerprints',
			body: 'One from the seal, opened with the public key. One calculated fresh from the file. If they match, install.'
		},
		{
			tag: 'Tampered',
			title: 'The check fails',
			body: 'The attacker changed the file but could not redo the seal. The two fingerprints differ, so the phone says no.'
		},
		{
			tag: 'Everywhere',
			title: 'Signed every day',
			body: 'App updates, system updates, HTTPS certificates, and even contracts. Same idea every time.'
		},
		{
			tag: 'Optional',
			title: 'You decide',
			body: 'Let the attacker meddle, or not, and watch which fingerprint comes out.'
		}
	],
	devLabel: 'nimbus.com developer',
	userLabel: 'Your phone',
	attackerLabel: 'Attacker',
	fileName: 'update.zip',
	lines: ['nimbus app 2.1', 'add dark mode', 'save to nimbus.com'],
	oneLetter: 'add dark mods',
	tampered: 'send passwords',
	privateKey: 'private key',
	publicKey: 'public key',
	rule: 'only I can write it, everyone can check it',
	penLabel: 'pen on paper',
	digitalLabel: 'signed file',
	fingerprintLabel: 'fingerprint',
	check: {
		fromSig: 'in the seal',
		fromFile: 'from the file',
		ok: 'match, installing',
		bad: 'no match, blocked'
	},
	toggle: { label: 'The attacker', clean: 'Keeps his hands off', tampered: 'Sneaks a line in' }
};
