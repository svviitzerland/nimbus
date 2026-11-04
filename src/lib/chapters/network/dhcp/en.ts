import type { DhcpText } from './types';

export const en: DhcpText = {
	title: 'What is DHCP',
	intro: [
		'Walk into a cafe, join its WiFi, and a second later your phone is online. You never typed an [[IP address|network/ip-address]]. So who gave it one?',
		'The cafe router has a little helper inside called <b>DHCP</b> (Dynamic Host Configuration Protocol). Picture a receptionist behind a desk, with a board of keys on the wall. Every key is one free address.',
		'Your phone walks in with no address at all, so it calls out to the whole room, "is anyone handing out addresses?" That first message is <b>Discover</b>.',
		'The receptionist hears it, takes a free key off the board, and holds it out. "How about 192.168.1.12?" That is the <b>Offer</b>.',
		'The phone answers, "yes please, that one." That is the <b>Request</b>. (It says it out loud, in case another receptionist offered something too.)',
		'The receptionist writes it in the book and hands the key over. That is the <b>Ack</b> (short for acknowledge). Along with the key comes a little slip, the way out (the <b>gateway</b>) and which [[DNS|networking/dns]] server to ask for names.',
		'The key is only lent, never given forever. The loan is called a <b>lease</b> and has a time limit. When the phone leaves and stops renewing, the time runs out and the key goes back on the board for the next guest.',
		'[ingat] DHCP is the receptionist lending you a room key. You arrive, you get a key, you give it back when you leave. And the four steps spell <b>DORA</b>, Discover, Offer, Request, Ack.',
		'[fyi] Later, in the MikroTik lab, you set up this receptionist yourself and choose the board of keys and the lease time by hand. That is [[IP address and DHCP server|netlab/router-ip]].',
		'That is all DHCP does, quietly, every time you join a network. If you like, let more guests walk in and see what happens when the board runs out.'
	],
	reactions: {
		join: 'Another guest, another quick DORA, another key off the board. The receptionist keeps track of who has which one.',
		empty:
			'The board is empty, so this guest gets no address and cannot get online. Real networks avoid this with a bigger board or shorter leases, so keys come back sooner.'
	},
	steps: [
		{
			title: 'No address yet',
			body: 'A device that just joined has no IP address. It cannot talk to anything until it gets one.'
		},
		{
			title: 'The DHCP server',
			body: 'A small service, usually inside the router. It keeps a <b>pool</b> of free addresses, the board of keys.'
		},
		{
			title: 'Discover',
			tag: 'D',
			body: 'The phone sends one message to everyone in the network, asking for an address.'
		},
		{
			title: 'Offer',
			tag: 'O',
			body: 'The server picks a free address and offers it to the phone.'
		},
		{ title: 'Request', tag: 'R', body: 'The phone says which offer it accepts.' },
		{
			title: 'Ack',
			tag: 'A',
			body: 'The server confirms. The phone now has an address, a gateway, a DNS server, and a lease time.'
		},
		{
			title: 'The lease',
			body: 'Every address is lent for a while. Stay and the phone renews it. Leave and it returns to the pool.'
		},
		{
			title: 'A receptionist lending keys',
			tag: 'remember',
			body: '<b>D</b>iscover, <b>O</b>ffer, <b>R</b>equest, <b>A</b>ck. Arrive, get a key, give it back.'
		},
		{
			title: 'Your own DHCP server',
			tag: 'by the way',
			body: 'On a real router you choose the pool (which keys) and the lease (how long).'
		},
		{
			title: 'More guests',
			tag: 'your turn',
			body: 'Optional. Tap the button to let another guest walk in.'
		}
	],
	sceneLabel: 'A cafe with a router acting as receptionist',
	routerLabel: 'Router',
	routerSub: 'DHCP server',
	boardLabel: 'Free addresses',
	noAddress: 'no address',
	dora: [
		{ name: 'Discover', say: 'anyone giving addresses?' },
		{ name: 'Offer', say: 'how about .12?' },
		{ name: 'Request', say: 'yes please, .12' },
		{ name: 'Ack', say: 'it is yours for now' }
	],
	slipTitle: 'What the phone received',
	slip: {
		address: 'Address',
		gateway: 'Gateway',
		dns: 'DNS',
		lease: 'Lease',
		leaseValue: '1 hour'
	},
	leaving: 'lease running out',
	arriveBtn: 'Let another guest in',
	emptyLabel: 'no key left'
};
