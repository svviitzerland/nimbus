import type { DomainHostingText } from './types';

export const en: DomainHostingText = {
	title: 'Domains and hosting',
	intro: [
		'For the whole world to open <b>nimbus.com</b>, you need two things. A <b>name</b> people can type, and a <b>computer</b> that stays switched on day and night to hand out your pages. Let us get both, one at a time.',
		'The name is called a <b>domain</b>. You get it from a <b>registrar</b>, a shop that rents out names. You never own it forever, you rent it by the year, and if you forget to renew, someone else can grab it.',
		"The always on computer is your <b>host</b>. Renting a spot on someone else's server is called <b>hosting</b>. Your host gets its own <b>IP address</b>, a string of numbers like 203.0.113.10, which is how other computers find it.",
		'Hosting comes in sizes, like places to live. <b>Shared hosting</b> is a boarding house, cheap but shared with many sites. A <b>VPS</b> is your own room, a [[virtual machine|foundations/virtual-machine]] only you control. <b>Cloud</b> hosting stretches to fit as you grow.',
		'Now a friend types nimbus.com on their phone, and... nothing. Having a name and a host does not link them. The phone asks around, but nobody knows where that name lives.',
		'The link lives in [[DNS|networking/dns]], the phone book of the internet. You add one line saying nimbus.com lives at 203.0.113.10. That line is called an <b>A record</b>.',
		'Try again. The phone asks DNS, gets the IP address, knocks on the host, and the page comes back. nimbus.com is live! In real life a new record can take a few minutes to spread, so no panic if it is not instant.',
		'[ingat] <b>The domain is the address, the host is the house, and DNS is the map</b> that connects them. An address with no house on the map leads nowhere.',
		'[fyi] Same word, different world. In an office, a <b>domain</b> (like a Windows domain) is a group of computers sharing one login system. It has nothing to do with web addresses, only the name is the same.',
		'Want to see what a typo in DNS does? Point the A record at the wrong IP and watch the phone get lost. Then put it back.'
	],
	reactions: {
		wrongip:
			'The phone did exactly what DNS told it and knocked on the wrong door. Nobody there serves nimbus.com, so the page never comes. DNS does not check your typing, it just obeys.',
		fixed:
			'Right IP back in place. The phone asks DNS, finds your host, and the page is home again.'
	},
	steps: [
		{
			tag: 'The goal',
			title: 'A name and a home',
			body: 'People need something to type, and your pages need somewhere to live.'
		},
		{
			tag: 'Part 1',
			title: 'Domain',
			body: 'Rented from a <b>registrar</b>, paid every year, first come first served. A .com costs roughly $12 a year.'
		},
		{
			tag: 'Part 2',
			title: 'Host',
			body: 'A computer that never sleeps. Its <b>IP address</b> is the number other computers use to reach it.'
		},
		{
			tag: 'Sizes',
			title: 'Shared, VPS, cloud',
			body: '<b>Shared</b> is the cheapest, <b>VPS</b> gives you your own slice, <b>cloud</b> stretches on busy days.'
		},
		{
			tag: 'The gap',
			title: 'Not linked yet',
			body: 'The name and the host both exist, but nothing says one belongs to the other. The browser says <b>This site cannot be reached</b>.'
		},
		{
			tag: 'Part 3',
			title: 'A record',
			body: 'One line in DNS. <b>nimbus.com</b> points to <b>203.0.113.10</b>.'
		},
		{
			tag: 'Happy ending',
			title: 'Live',
			body: 'The phone asks DNS, DNS answers with the IP, the host sends the page.'
		},
		{
			tag: 'Rule of thumb',
			title: 'Address, house, map',
			body: '<b>Domain</b> is the address, <b>host</b> is the house, <b>DNS</b> is the map between them.'
		},
		{
			tag: 'Same word',
			title: 'Windows domain',
			body: 'In an office it means a group of computers sharing one login. Same word, unrelated idea.'
		},
		{
			tag: 'Optional',
			title: 'Break the record',
			body: 'Point the A record at the wrong IP. DNS obeys, so every visitor ends up at the wrong door.'
		}
	],
	shopLabel: 'Registrar',
	price: '$12 a year',
	hostLabel: 'Host',
	hostKinds: { shared: 'Shared', vps: 'VPS', cloud: 'Cloud' },
	dnsLabel: 'DNS',
	recordLabel: 'A record',
	noRecord: 'no record yet',
	phone: { cannot: 'Site cannot be reached', welcome: 'Welcome to Nimbus' },
	breakIt: 'Point it at the wrong IP',
	fixIt: 'Put the right IP back'
};
