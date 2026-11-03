import type { NatText } from './types';

export const en: NatText = {
	title: 'What is NAT',
	intro: [
		'Your home has three phones, a laptop, and a TV, all online at once. Yet your internet provider gave the whole house just <b>one</b> public [[IP address|network/ip-address]]. How do they all share it?',
		'Inside the house, every device has a <b>private</b> address like 192.168.1.10, lent out by [[DHCP|network/dhcp]]. Private addresses only work inside, the internet will not deliver to them, and millions of homes reuse the very same ones.',
		'The router stands at the front door and does a trick called <b>NAT</b> (Network Address Translation). For every packet going out, it crosses out the private sender address and writes its own public address instead.',
		'Then a reply comes back to that public address. Which phone was it for? The router remembers. It notes every outgoing trip in a <b>translation table</b>, each with its own [[port|foundations/port]] number, so every reply matches exactly one row.',
		'This is how the world got by once [[IPv4 ran short|network/ipv6]]. One public address can hide a whole house, or a whole office.',
		'[fyi] A handy side effect is that strangers on the internet cannot start a conversation with a device inside, because no row in the table points to it. The cloud has the same idea as a <b>NAT gateway</b>, letting servers in a private [[subnet|networking/vpc]] reach out without being reachable. In the MikroTik lab you switch it on yourself with [[masquerade|netlab/router-nat]].',
		'Three phones open nimbus.com at the same moment. Send the requests, watch the router rewrite them, and see every reply find its way home.'
	],
	reactions: {
		out: 'Look at the label change at the router. The private sender is crossed out and the public address goes on, with a new port number. The router writes that trip down in its table.',
		back: 'The reply came back to the public address and port. The router looked up the row, wrote the private address back on, and sent it to the right phone.',
		all: 'All three phones got their own page, even though Phone A and Phone B used the same port 51000 inside. Outside they became 40001 and 40002, so the router never mixes them up.',
		stranger:
			'Thrown away. Nobody inside asked for this, so there is no row for it in the table, and the router has no idea who it would be for. NAT quietly keeps strangers out.'
	},
	openLabel: 'Open nimbus.com on',
	allBtn: 'All three at once',
	phoneLabel: 'Phone {n}',
	strangerBtn: 'A stranger knocks from outside',
	routerLabel: 'Home router',
	publicLabel: 'public',
	privateLabel: 'private',
	serverLabel: 'nimbus.com',
	strangerLabel: 'Stranger',
	from: 'from {ip}',
	to: 'to {ip}',
	port: 'port {n}',
	loaded: 'loaded',
	dropped: 'dropped',
	tableTitle: 'Router translation table',
	tableEmpty: 'Empty, nobody has gone out yet',
	insideHead: 'Inside',
	outsideHead: 'Outside',
	notes: {
		idle: 'Three phones, one public address',
		rewriteOut: 'The router swaps the private sender for its public one',
		atServer: 'The server only ever sees the public address',
		rewriteBack: 'The table says which phone the reply belongs to',
		delivered: 'Every reply found its own phone',
		stranger: 'No row in the table, so it goes nowhere'
	}
};
