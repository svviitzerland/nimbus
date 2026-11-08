import type { ApiStyleText } from '../../types';

export const en: ApiStyleText = {
	title: 'Webhook',
	intro: [
		'A webhook is the other way around. You are not the one asking the server, the server contacts you when something happens.',
		'You give the server an address, then simply wait. As soon as something happens, like a payment coming in, the server sends a message to that address. Watch the server reach out first.',
		'Use a webhook when you want to be told the moment something happens without asking over and over, like a payment confirmation or an incoming message.',
		'[fyi] Because the server contacts you, you must have a public address it can reach. Unlike polling that keeps asking, here you simply wait to be notified.',
		'[ingat] A webhook sends news when an event happens, to a registered address.'
	],
	reactions: {},
	style: 'webhook',
	clientLabel: 'Client',
	serverLabel: 'Server',
	replayBtn: 'Replay'
};
