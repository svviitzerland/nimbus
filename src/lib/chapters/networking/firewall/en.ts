import type { FirewallText } from '../types';

export const en: FirewallText = {
	title: 'Firewalls',
	intro: [
		'A door that opens to the internet gets visited by everyone, good guests and snoops alike. Someone has to screen them out front.',
		'The <b>firewall</b> is that security guard. It stands in front of the server holding a guest list, checking every arrival before they may enter.',
		'You write the rules, and the safest rules start from <b>deny everything</b>, then allow only what is needed. Say, guests coming to view the web page are welcomed, everyone else is turned away.',
		'[fyi] Firewalls are not only a cloud thing. In the cloud it is a set of rules you manage from a screen (AWS calls it a security group), in an office it lives on the router, like a [[MikroTik firewall filter|netlab/router-firewall]] or a [[Cisco access list|netlab/cisco-acl]], and even your laptop has one. Same idea every time, a guest list.',
		'The guard is on duty in front of the server, guest list in hand. Send in a web guest, follow up with a snoop, and see who gets through.'
	],
	reactions: {
		allow:
			'The web guest is on the list, so the guard opens the door. Your visitors never feel the check, yet it always happens.',
		deny: 'The snoop is not on the list and gets turned away at the door, before ever touching the server. That is a firewall, deny first, allow only what is needed.'
	},
	guardLabel: 'Firewall',
	guardSub: 'the guard at the door',
	serverLabel: 'Server',
	rulesTitle: 'Guest list',
	ruleAllow: 'Web guests, welcome in',
	ruleDeny: 'Everyone else, turn away',
	guestWeb: 'Web guest',
	guestBad: 'Snoop',
	sendWeb: 'Send a web guest',
	sendBad: 'Send a snoop',
	allowedTag: 'in',
	deniedTag: 'denied',
	noteIdle: 'The guard stands ready with the list',
	noteAllow: 'On the list, shown right in',
	noteDeny: 'Not on the list, stops right here'
};
