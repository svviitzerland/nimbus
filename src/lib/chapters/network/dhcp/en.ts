import type { DhcpText } from './types';

export const en: DhcpText = {
	title: 'What is DHCP',
	intro: [
		'Walk into a cafe, join its WiFi, and a second later your phone is online. You never typed an [[IP address|network/ip-address]]. So who gave it one?',
		'The cafe router runs a small service called <b>DHCP</b> (Dynamic Host Configuration Protocol). Its whole job is handing out addresses to whoever joins.',
		'DHCP assigns an address for a period called a <b>lease</b>. The client renews the lease to keep using the address.',
		'That loan is called a <b>lease</b>, and it has a time limit, often a few hours or a day. A phone that stays keeps renewing it. A phone that leaves stops renewing, and once the time runs out the address goes back on the board.',
		'Getting an address takes four quick messages, easy to remember as <b>DORA</b>. Discover (is anyone handing out addresses?), Offer (here, take this one), Request (yes please, that one), and Acknowledge (it is yours for now).',
		'Along with the address, the phone also learns the way out of the network (the <b>gateway</b>, usually the router itself) and which [[DNS|networking/dns]] server to ask for names. Everything it needs to get online.',
		'[fyi] Later, in the MikroTik lab, you set up a DHCP server yourself and choose the pool and the lease time by hand. That is [[IP address and DHCP server|netlab/router-ip]].',
		'[ingat] DORA stands for Discover, Offer, Request, and Acknowledgment. The client finds a server, receives an offer, requests an address, and receives lease confirmation.',
		'The cafe opens. Its router only has 6 addresses to lend. Let customers in one by one and see what happens when the board runs empty.'
	],
	reactions: {
		dora: 'Four quick messages and the phone has an address, a gateway, and a DNS server, all without anyone typing a thing. That is DHCP doing its job.',
		empty:
			'The board is empty. The new customer shouted Discover, but there was no key left to offer. Their phone shows "connected, no internet" and quietly gives itself a 169.254 address that cannot reach anything. Free up a key.',
		leave:
			'The customer left, but their key does not come back right away. The router waits until the lease runs out, in case that phone returns.',
		rejoin:
			'The lease ran out, the key went back on the board, and the waiting customer got it straight away. Lending, returning, and lending again, that is how a few addresses serve a whole day of customers.'
	},
	routerLabel: 'Cafe router',
	routerSub: 'the DHCP server',
	boardLabel: 'Address pool',
	keyFree: 'free',
	keyLent: 'lent',
	keyCooling: 'lease ending',
	arriveBtn: 'A customer walks in',
	guestLabel: 'Device {n}',
	doorLabel: 'At the door',
	noAddress: 'no address',
	tapToLeave: 'Tap a customer to send them home',
	steps: [
		{ name: 'Discover', say: 'Is anyone handing out addresses?' },
		{ name: 'Offer', say: 'Here, take this one' },
		{ name: 'Request', say: 'Yes please, that one' },
		{ name: 'Ack', say: 'It is yours for now' }
	],
	slipTitle: 'Configuration for device {n}',
	slip: {
		address: 'Address',
		gateway: 'Gateway',
		dns: 'DNS',
		lease: 'Lease',
		leaseValue: '1 hour'
	},
	notes: {
		idle: 'Six available addresses, no active leases',
		asking: 'The device sends a DHCP request',
		joined: 'Seated and online',
		empty: 'No key left, the newcomer waits at the door',
		cooling: 'The key comes back once the lease runs out',
		rejoin: 'A returned key, lent out again'
	}
};
