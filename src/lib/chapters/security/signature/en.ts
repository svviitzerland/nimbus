import type { SignatureText } from './types';

export const en: SignatureText = {
	title: 'Digital signatures',
	intro: [
		'When a phone receives an app update, it needs to check its publisher and whether the file changed in transit. A <b>digital signature</b> helps check both.',
		'The developer signs with a <b>private key</b>. The device verifies with the trusted publisher’s <b>public key</b>. The pair is covered in [[public and private keys|security/keys]].',
		'Verification must use the correct public key. A signature from someone else’s key does not prove that Nimbus published the file.',
		'Signing usually involves a <b>hash</b>, a digest calculated from the file contents. Changing the contents produces a different hash. Explore this in [[hashing|security/hashing]].',
		'A signature algorithm uses the private key and the data being signed to produce a signature. Signing a file does not hide its contents.',
		'The device verifies the file, signature, and public key together. A changed file or a signature from a different key fails verification.',
		'[fyi] The short numbers here are a visual model, not cryptographic software. Real systems use standard algorithms such as Ed25519, ECDSA, or RSA with appropriate parameters.',
		'[ingat] <b>The private key signs, the public key verifies.</b> Protect the private key and obtain the public key from a trusted publisher.',
		'Sign an update and send it. Then edit the file and try a different signing key. Compare the phone’s verification results.'
	],
	reactions: {
		fingerprint:
			'There is the fingerprint of your update. Same file, same fingerprint, every single time, on any computer in the world.',
		signed:
			'The update is signed with the Nimbus private key. Keep that key secret while sharing the file and signature.',
		verified:
			'Verification succeeds with the Nimbus public key. The file matches the data signed by the owner of its paired private key.',
		edit: 'The file contents changed and so did its hash. The existing signature was made for the previous contents.',
		untouched:
			'The file is unchanged, so verification succeeds. Change one part before sending it again.',
		tampered:
			'Verification fails because the file differs from the signed data. The phone rejects the update.',
		forged:
			'The attacker’s key signed the file, while the phone verifies using the Nimbus public key. They do not match, so the update is rejected.'
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
	tamperHint: 'Choose part of the file to change',
	deliverBtn: 'Let it reach the phone',
	retryBtn: 'Edit the file again',
	forgeBtn: 'Sign it with the attacker key and send',
	check: {
		heading: 'The phone checks',
		opened: 'Public key used for verification',
		computed: 'Fingerprint of the file it got',
		ok: 'Verification passed, update installed',
		bad: 'Verification failed, update rejected'
	}
};
