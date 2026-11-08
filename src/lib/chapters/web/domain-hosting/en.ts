import type { DomainHostingText } from './types';

export const en: DomainHostingText = {
	title: 'Domains and hosting',
	intro: [
		'For the whole world to open <b>nimbus.com</b>, you need two things. A <b>name</b> people can type, and a <b>computer</b> that stays switched on day and night to hand out your pages.',
		'The name is called a <b>domain</b>. You get it from a <b>registrar</b>, a shop that rents out names. You never own a domain forever, you rent it by the year, and if you forget to renew, someone else can grab it.',
		'<b>Hosting</b> provides a place to run or store a site so visitors can access it. Choose a service based on application and management needs.',
		'<b>Shared hosting</b> shares a server with other sites. A <b>VPS</b> provides a virtual machine you manage. <b>Cloud</b> services offer resources and managed services with capacity determined by configuration.',
		'After choosing a domain and host, configure [[DNS|networking/dns]]. The <b>A record</b> in this example maps the domain name to the host’s IPv4 address.',
		'[fyi] Same word, different world. In an office, a <b>domain</b> (like a Windows domain) is a group of computers sharing one login system. It has nothing to do with web addresses, only the name is the same.',
		'[ingat] A domain names a site. Hosting runs or stores the site. DNS provides records that connect names to service destinations.',
		'Your turn! Rent the name, pick a home for your site, then connect the two and open it on your phone.'
	],
	reactions: {
		taken:
			'Taken already. Names are first come, first served, and once someone rents one, nobody else can have it until they let it go. Try another name, or another ending.',
		bought:
			'It is yours! Well, rented. You pay the registrar every year, and as long as you keep paying, the name points wherever you say. Right now it points nowhere, though.',
		shared:
			'Shared hosting shares resources with other sites. Check its capacity limits and management features before choosing a service.',
		vps: 'A <b>VPS</b>. You get your own virtual machine carved out of a big server, with a fixed slice of its power and full control. More freedom, but you look after it yourself.',
		cloud:
			'Cloud services provide configurable capacity and services. Automatic scaling requires service support and suitable configuration.',
		unreachable:
			'The simulated DNS has no record pointing to the host yet. Add the record so the browser can find the destination.',
		wrongip:
			'Hmm, that address is not your host. DNS will happily send everyone to the wrong place, so copy the IP straight from your host card.',
		connected: 'The A record is saved and points to the host. Try opening the site again.',
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
	toHost: 'Choose where to host the site',
	hosts: {
		shared: {
			name: 'Shared hosting',
			sub: 'One server for many sites',
			price: '$3 a month',
			points: ['Cheapest way to start', 'One server shared with many sites']
		},
		vps: {
			name: 'VPS',
			sub: 'A virtual machine for your site',
			price: '$6 a month',
			points: ['Your own virtual machine', 'You look after it yourself']
		},
		cloud: {
			name: 'Cloud',
			sub: 'Adjustable capacity',
			price: 'pay for what you use',
			points: ['Capacity can be increased as needed', 'Managed services available']
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
