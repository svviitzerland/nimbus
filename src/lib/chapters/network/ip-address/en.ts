import type { IpAddressText } from './types';

export const en: IpAddressText = {
	title: 'IP addresses',
	intro: [
		'Every device that joins a network gets an <b>IP address</b>, four numbers joined by dots, like 192.168.1.5. Think of it as a house number. Data needs it to know where to go.',
		'At home, your router hands these numbers out to every phone and laptop that joins the WiFi. They usually start with 192.168, and they are called <b>private addresses</b>, because they only mean something inside your home.',
		'Your neighbour probably has a laptop at 192.168.1.5 too. That is fine, just like two different streets can both have a house number 5. Nobody outside ever uses these numbers to find you.',
		'The router itself has two faces. Inside, it has a private address. Outside, your internet provider gives it a <b>public address</b>, the one the whole internet can see. Every device in your home goes out through that one door.',
		'[fyi] The cloud has the same idea. A [[VPC|networking/vpc]] gives your servers private addresses, and only the ones that greet visitors get a public one. A site like nimbus.com has a public address too, and [[DNS|networking/dns]] turns its name into that number.',
		'[ingat] An IP address identifies an interface on a network. Private addresses are used within private networks and are not routed directly on the public internet.',
		'Here is a home with a phone, a laptop, and a router. Tap each one to look up its address, then let a stranger on the internet try to knock on them.'
	],
	reactions: {
		phone:
			'Your phone is 192.168.1.7. The router handed it that number the moment it joined the WiFi, and it might get a different one tomorrow.',
		laptop:
			'The laptop is 192.168.1.5, a neighbour of the phone. Both start with 192.168.1, which tells you they live in the same home network.',
		router:
			'The router wears two numbers. Inside it is 192.168.1.1, the door every device knocks on to get out. Outside it is 36.85.120.14, given by your internet provider, and that is the one the world sees.',
		lost: 'The knock went nowhere. Millions of homes use 192.168 numbers, so out on the internet that address points at nobody in particular. Private addresses simply cannot be reached from outside.',
		public:
			'This time it landed, right on your router. The public address is the only one a stranger can find. What the router lets in after that is the job of [[NAT|network/nat]] and the [[firewall|networking/firewall]].'
	},
	internetLabel: 'The internet',
	strangerLabel: 'A stranger',
	houseLabel: 'Your home',
	phoneLabel: 'Phone',
	laptopLabel: 'Laptop',
	routerLabel: 'Router',
	ips: {
		phone: '192.168.1.7',
		laptop: '192.168.1.5',
		routerIn: '192.168.1.1',
		routerOut: '36.85.120.14'
	},
	insideTag: 'inside',
	outsideTag: 'outside',
	privateTag: 'private',
	publicTag: 'public',
	tapHint: 'Tap the phone, the laptop, and the router',
	knockPrompt: 'Pick an address for the stranger to knock on',
	knockLabel: 'The stranger knocks on',
	lostNote: 'Nobody on the internet answers to {ip}',
	hitNote: '{ip} leads straight to your router',
	lostTag: 'nobody here',
	hitTag: 'knock knock'
};
