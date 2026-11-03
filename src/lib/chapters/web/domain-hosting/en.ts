import type { DomainHostingText } from './types';

export const en: DomainHostingText = {
	title: 'Domains and hosting',
	intro: [
		'For the whole world to open <b>nimbus.com</b>, you need two things. A <b>name</b> people can type, and a <b>computer</b> that stays switched on day and night to hand out your pages.',
		'The name is called a <b>domain</b>. You get it from a <b>registrar</b>, a shop that rents out names. You never own a domain forever, you rent it by the year, and if you forget to renew, someone else can grab it.',
		"The always on computer is your <b>host</b>. Renting a spot on someone else's server is called <b>hosting</b>, and it comes in a few sizes, like places to live.",
		'<b>Shared hosting</b> is a boarding house, many small sites on one server, cheap but you share everything. A <b>VPS</b> (virtual private server) is your own room, a [[virtual machine|foundations/virtual-machine]] only you control. <b>Cloud</b> hosting rents exactly as much as you need and grows with you.',
		"Buying a name and renting a host still does not link them. You have to tell [[DNS|networking/dns]], the phone book of the internet, that your name lives at your host's IP address. That entry is called an <b>A record</b>.",
		'[fyi] Same word, different world. In an office, a <b>domain</b> (like a Windows domain) is a group of computers sharing one login system. It has nothing to do with web addresses, only the name is the same.',
		'Your turn! Rent the name, pick a home for your site, then connect the two and open it on your phone.'
	],
	reactions: {
		taken:
			'Taken already. Names are first come, first served, and once someone rents one, nobody else can have it until they let it go. Try another name, or another ending.',
		bought:
			'It is yours! Well, rented. You pay the registrar every year, and as long as you keep paying, the name points wherever you say. Right now it points nowhere, though.',
		shared:
			'<b>Shared hosting</b>, the cheapest pick and plenty for a small blog. You live on one server with hundreds of other sites, so when a neighbour gets busy, your site can slow down too.',
		vps: 'A <b>VPS</b>. You get your own virtual machine carved out of a big server, with a fixed slice of its power and full control. More freedom, but you look after it yourself.',
		cloud:
			'<b>Cloud</b> hosting. You rent from a giant pool and pay for what you use. Quiet day, small bill. Sudden crowd, it stretches to fit. Most big sites live here.',
		unreachable:
			'This site cannot be reached. The phone asked DNS where your name lives, and DNS had no answer. The name and the host do not know about each other yet.',
		wrongip:
			'Hmm, that address is not your host. DNS will happily send everyone to the wrong place, so copy the IP straight from your host card.',
		connected:
			"Saved. Your A record now says your name lives at your host's IP address. Try opening the site again.",
		live: "Your site is live! The phone asked DNS, got your host's IP, and your host served the page. In real life a new record can take a few minutes (sometimes hours) to spread everywhere, so no panic if it is not instant."
	},
	acts: ['Rent a name', 'Pick a host', 'Connect them'],
	registrarLabel: 'Registrar',
	registrarSub: 'the shop that rents out names',
	searchLabel: 'Find a name',
	search: 'Search',
	available: 'available',
	taken: 'taken',
	prices: { com: '$12', id: '$15', dev: '$14' },
	perYear: '{price} a year',
	buy: 'Rent',
	owned: 'yours',
	toHost: 'Now find it a home',
	hosts: {
		shared: {
			name: 'Shared hosting',
			sub: 'a boarding house',
			price: '$3 a month',
			points: ['Cheapest way to start', 'One server shared with many sites']
		},
		vps: {
			name: 'VPS',
			sub: 'your own room',
			price: '$6 a month',
			points: ['Your own virtual machine', 'You look after it yourself']
		},
		cloud: {
			name: 'Cloud',
			sub: 'grows with you',
			price: 'pay for what you use',
			points: ['Stretches on busy days', 'Where most big sites live']
		}
	},
	pick: 'Pick',
	picked: 'picked',
	ipLabel: 'IP address',
	toConnect: 'Connect the name',
	dnsTitle: 'DNS records for {domain}',
	recordType: 'Type',
	recordName: 'Name',
	recordValue: 'Points to',
	valuePlaceholder: 'your host IP',
	copyHint: 'Tap the IP to copy it in',
	save: 'Save',
	saved: 'Record saved',
	wrong: 'That is not your host',
	open: 'Open {domain}',
	unreachable: 'This site cannot be reached',
	siteTitle: 'Welcome to Nimbus',
	siteSub: 'served from {ip}',
	youLabel: 'Your phone'
};
