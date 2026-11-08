import type { DnsText } from '../types';

export const en: DnsText = {
	title: 'IP and DNS',
	intro: [
		'Every server on the internet has an <b>IP address</b>, a string of numbers marking its location, like a house number. The browser needs those numbers to connect.',
		'The catch is that humans are terrible at memorizing numbers. So we use friendly names like nimbus.com. But computers still need the numbers.',
		'That is where <b>DNS</b> comes in. It is the phone book of the internet. You say a name, it answers with the IP address, and only then can the browser reach the right server.',
		'The phone book is already open. Call out a name and follow DNS as it digs up the number until your phone connects.',
		'[ingat] DNS helps find addresses from names. A site name and an IP address are different things.'
	],
	reactions: {
		resolved:
			'That fast. You only said a name, DNS replied with the IP address, and your phone instantly knew where to connect. This happens silently every time you open any site.'
	},
	youLabel: 'Your phone',
	bookTitle: 'DNS',
	bookSub: 'Looking up IP addresses by domain name',
	serverLabel: 'Server',
	domains: [
		{ host: 'nimbus.com', ip: '76.76.21.21' },
		{ host: 'kopi.com', ip: '104.18.36.92' },
		{ host: 'warta.com', ip: '151.101.1.67' }
	],
	idleNote: 'Pick a site name below',
	lookupNote: 'DNS looks up the IP address for this name',
	connectNote: 'Found it, {ip}. Your phone connects there'
};
