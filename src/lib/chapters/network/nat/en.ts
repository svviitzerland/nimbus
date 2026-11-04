import type { NatText } from './types';

export const en: NatText = {
	title: 'What is NAT',
	intro: [
		'Your home has three phones online at once. Yet your internet provider gave the whole house just <b>one</b> public [[IP address|network/ip-address]], the one on the router. How do they all share it?',
		'Inside the house, every phone has a <b>private</b> address like 192.168.1.10, lent out by [[DHCP|network/dhcp]]. Private addresses only work inside. Millions of homes reuse the very same ones, so the internet will not deliver to them.',
		'Phone A opens nimbus.com. Its letter leaves with a private sender address. At the door, the router crosses it out and writes its own public address instead, plus a number of its own. That trick is <b>NAT</b> (Network Address Translation).',
		'So it does not forget, the router writes one line in its <b>translation table</b>, "number 40001 belongs to phone A." That number is a [[port|foundations/port]], a little room number on the public address.',
		'The reply from nimbus.com comes back to the public address, number 40001. The router checks its table, writes phone A back on the letter, and hands it over. Phone A gets its page.',
		'Now all three phones at once. Each trip gets its own number, so every reply matches exactly one line. That is how the world kept going once [[IPv4 ran short|network/ipv6]].',
		'[ingat] NAT is the office front desk forwarding mail. The outside world only knows the office address. The desk keeps a list of who sent what, so every reply lands on the right desk inside.',
		'[fyi] A nice side effect is that strangers cannot start a conversation with a phone inside, because no line in the table points to it. The cloud has the same idea, called a <b>NAT gateway</b>, so servers in a private [[subnet|networking/vpc]] can reach out without being reachable. In the MikroTik lab you switch it on with [[masquerade|netlab/router-nat]].',
		'One public address, a whole house behind it. If you are curious, let a stranger knock from outside and watch what the front desk does.'
	],
	reactions: {
		stranger:
			'Thrown away. Nobody inside asked for this, so there is no line in the table, and the router has no idea who it is for. NAT quietly keeps strangers outside.'
	},
	steps: [
		{
			title: 'One public address',
			body: 'The provider gives the router one address the whole internet can reach. Here it is <b>203.0.113.5</b>.'
		},
		{
			title: 'Private addresses',
			body: 'Addresses like <b>192.168.x.x</b> only work inside a home or office. The same ones are reused everywhere.'
		},
		{
			title: 'Rewrite on the way out',
			body: 'The router swaps the private sender for its public address and a fresh port number.'
		},
		{
			title: 'The translation table',
			body: 'One line per trip, linking the port number outside to the phone inside.'
		},
		{
			title: 'Rewrite on the way back',
			body: 'A reply arrives at the public address and port. The router looks it up and passes it to the right phone.'
		},
		{
			title: 'Many phones, one address',
			body: 'Different port numbers keep every conversation apart.'
		},
		{
			title: 'The front desk',
			tag: 'remember',
			body: 'Outside sees one office address. The desk knows who inside is waiting for each reply.'
		},
		{
			title: 'Strangers stay out',
			tag: 'by the way',
			body: 'No line in the table means nowhere to send it. Cloud NAT gateways work the same way.'
		},
		{
			title: 'A knock from outside',
			tag: 'your turn',
			body: 'Optional. Let a stranger try to reach a phone inside.'
		}
	],
	homeLabel: 'Home',
	phoneLabel: 'Phone {n}',
	routerLabel: 'Router',
	frontDesk: 'front desk',
	publicLabel: 'public',
	privateLabel: 'private',
	serverLabel: 'nimbus.com',
	strangerLabel: 'Stranger',
	from: 'from {ip}',
	to: 'to {ip}',
	port: 'port {n}',
	loaded: 'page loaded',
	dropped: 'dropped',
	tableTitle: 'Translation table',
	insideHead: 'Inside',
	outsideHead: 'Outside',
	strangerBtn: 'Let a stranger knock'
};
