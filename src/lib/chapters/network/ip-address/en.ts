import type { IpAddressText } from './types';

export const en: IpAddressText = {
	title: 'IP addresses',
	intro: [
		'Every device that joins a network gets an <b>IP address</b>. It is four numbers joined by dots, like 192.168.1.5, and it tells data where to go.',
		'Think of a letter. Without an address on the envelope, the postman has no idea where to take it. Data travels in small pieces called <b>packets</b>, and every packet carries the address it is heading for.',
		'Inside your home, the router hands an address to every phone and laptop that joins the WiFi. These usually start with 192.168 and are called <b>private addresses</b>, because they only mean something inside your home.',
		'Your home as a whole has one more address, the <b>public address</b>. Your internet provider gives it to the router, and it is the only one the rest of the internet can see.',
		'[ingat] An IP address is a house address. The public address is the house number on the street, and the private addresses are the room numbers inside. The postman only knows the street, the router knows the rooms.',
		'That is why your neighbour can also have a laptop at 192.168.1.5. Two houses can both have a room number 5, and nobody outside ever uses room numbers to find you.',
		'[fyi] The cloud works the same way. A [[VPC|networking/vpc]] gives your servers private addresses, and only the ones that greet visitors get a public one. A site like nimbus.com has a public address too, and [[DNS|networking/dns]] turns the name into that number.',
		'Want to try it yourself? Send a letter from the internet, once to a room number and once to the house number, and see where each one ends up.'
	],
	reactions: {
		lost: 'Lost on the way. Millions of homes use the same 192.168 room numbers, so out on the internet that address points at nobody. Private addresses cannot be reached from outside.',
		public:
			'Delivered! The letter found the house by its public address, and the router carried it to the right room. Deciding what is allowed in is the job of [[NAT|network/nat]] and the [[firewall|networking/firewall]].'
	},
	steps: [
		{
			title: 'IP address',
			body: 'Four numbers joined by dots, each between 0 and 255. Every device on a network has one, so data knows where to go.'
		},
		{
			title: 'Packets',
			body: 'Data is cut into small pieces called <b>packets</b>. Each one carries the address it is going to, just like an envelope.'
		},
		{
			title: 'Private address',
			body: 'Handed out by your router, usually starting with <b>192.168</b>. It only works inside your home.'
		},
		{
			title: 'Public address',
			body: 'One per home, given to your router by your internet provider. This is the number the rest of the internet sees.'
		},
		{
			tag: 'Make it stick',
			title: 'House and rooms',
			body: 'The public address is the <b>house number</b> on the street. Private addresses are the <b>room numbers</b> inside.'
		},
		{
			title: 'Reused everywhere',
			body: 'Almost every home reuses the same 192.168 numbers. That is fine, because they never leave the house.'
		},
		{
			tag: 'FYI',
			title: 'Same idea in the cloud',
			body: 'Cloud networks give servers private addresses too, and only the servers facing visitors get a public one.'
		},
		{
			tag: 'Try it',
			title: 'Send a letter',
			body: 'Pick an address above. A room number gets lost outside, while the house number reaches the router, which knows the rooms.'
		}
	],
	internetLabel: 'Internet',
	neighbourLabel: 'Next door',
	ips: {
		phone: '192.168.1.7',
		laptop: '192.168.1.5',
		routerIn: '192.168.1.1',
		routerOut: '36.85.120.14'
	},
	streetTag: 'house number',
	roomTag: 'room numbers',
	sendLabel: 'Send a letter to',
	lostTag: 'nobody here',
	hitTag: 'delivered'
};
