import type { EncryptionText } from '../types';

export const en: EncryptionText = {
	title: 'Encryption',
	intro: [
		'Data traveling the internet passes through many hands, your home router, the ISP, cables between countries. Anywhere along that road someone could be listening.',
		'<b>Encryption</b> scrambles your message into random letters that only a <b>key</b> holder can read. An eavesdropper still sees the traffic, but the content is meaningless noise.',
		'<b>HTTPS</b> uses [[TLS|security/tls]] to protect data in transit. Stored data can also be encrypted, called encryption at rest. These protect different stages.',
		'An eavesdropper is waiting along this line. Send your card PIN twice, once without a key and once locked, then compare what he manages to read.',
		'[ingat] Encryption transforms content using a key. Without the right key, recovery should be difficult.'
	],
	reactions: {
		plain:
			'Dangerous. Without encryption, the eavesdropper in the middle reads your PIN in full. That is the fate of naked data on the internet.',
		encrypted:
			'The message is sent as ciphertext. The observer in this example lacks the key needed to read it.'
	},
	youLabel: 'Your phone',
	snooperLabel: 'Eavesdropper',
	serverLabel: 'Server',
	message: 'PIN 1234',
	cipher: 'x7#q!9z@f2',
	sendPlain: 'Send without encryption',
	sendLocked: 'Send with encryption',
	readTag: 'Content readable',
	scrambledTag: 'Content encrypted',
	noteIdle: 'An observer can capture the transmitted data',
	notePlain: 'The message is unencrypted; the observer can read it',
	noteLocked: 'The message is encrypted; the observer lacks the key to read it'
};
