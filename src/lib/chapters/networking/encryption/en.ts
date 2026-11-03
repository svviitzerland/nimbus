import type { EncryptionText } from '../types';

export const en: EncryptionText = {
	title: 'Encryption',
	intro: [
		'Data traveling the internet passes through many hands, your home router, the ISP, cables between countries. Anywhere along that road someone could be listening.',
		'<b>Encryption</b> scrambles your message into random letters that only a <b>key</b> holder can read. An eavesdropper still sees the traffic, but the content is meaningless noise.',
		'The little padlock in your browser means exactly this, your connection uses [[HTTPS|security/tls]] and everything passing through is encrypted. Data sitting on disks can be scrambled too, that is encryption at rest.',
		'An eavesdropper is waiting along this line. Send your card PIN twice, once without a key and once locked, then compare what he manages to read.'
	],
	reactions: {
		plain:
			'Dangerous. Without encryption, the eavesdropper in the middle reads your PIN in full. That is the fate of naked data on the internet.',
		encrypted:
			'Now the eavesdropper only gets random letters. The message opens at its destination only, because only the server holds the key. That is the little padlock in your browser at work.'
	},
	youLabel: 'Your phone',
	snooperLabel: 'Eavesdropper',
	serverLabel: 'Server',
	message: 'PIN 1234',
	cipher: 'x7#q!9z@f2',
	sendPlain: 'Send without a key',
	sendLocked: 'Send locked',
	readTag: 'read it!',
	scrambledTag: 'just gibberish',
	noteIdle: 'Someone is listening along the road',
	notePlain: 'A naked message, the eavesdropper reads it',
	noteLocked: 'Scrambled tight, only the server can open it'
};
