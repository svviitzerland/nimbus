import type { Ipv6Text } from './types';

export const en: Ipv6Text = {
	title: 'IPv4 and IPv6',
	intro: [
		'In the [[IP address lesson|network/ip-address]] you met addresses like 192.168.1.20, four numbers from 0 to 255. That format is <b>IPv4</b>, version 4 of the Internet Protocol, written down in 1981 when the whole internet was a few hundred big computers.',
		'Each IPv4 address is 32 <b>bits</b>, 32 tiny switches that are either on or off. Count every possible pattern and you get about 4.3 billion addresses. Back then that sounded like far more than anyone would ever need.',
		'Then came home computers, then phones, then watches, TVs, cameras, and even fridges. Today there are billions more devices online than there are IPv4 addresses.',
		'In 2011 the central pool of IPv4 addresses officially ran dry. The fix is <b>IPv6</b>, with addresses 128 bits long. They are written in hexadecimal (the digits 0 to 9 plus the letters a to f), in eight groups.',
		'[fyi] Why not IPv5? The number 5 was already used in the 1980s by an experimental protocol for streaming voice and video, so the next version became 6.',
		'Moving the whole world to IPv6 takes decades, so in the meantime a trick called [[NAT|network/nat]] lets a whole house share one IPv4 address. That is why IPv4 still works today.',
		'[ingat] IPv4 uses 32 bits and is normally written as four decimal numbers. IPv6 uses 128 bits and is written in hexadecimal groups.',
		'Hand out IPv4 addresses to the world as it grows, five years at a time, and watch what happens when the pool runs dry.'
	],
	reactions: {
		grow: 'Plenty of room. Each square in the pool stands for about 67 million addresses, and only a few are taken so far.',
		tight:
			'Look how full it is. Around this time, people running the internet started counting every leftover address. In 2011 the last big blocks were handed out.',
		full: 'The pool is empty, and devices keep coming. They are left standing outside with no address of their own. Time to switch to IPv6.',
		ipv6: 'Every single device from before now fits inside one tiny dot. IPv6 has about 340 undecillion addresses, a number 39 digits long. Try something silly next.',
		sand: 'Even after giving every grain of sand on Earth its own address, the pool barely notices. You could hand each grain billions of addresses and still have plenty left.'
	},
	growBtn: 'Hand out addresses for {year}',
	switchBtn: 'Switch the world to IPv6',
	sandBtn: 'Give every grain of sand an address',
	yearLabel: 'Year {year}',
	devicesLabel: '{n} devices want an address',
	billion: '{n} billion',
	poolV4: 'The IPv4 pool',
	poolV6: 'The IPv6 pool',
	seatHint: 'one square is about 67 million addresses',
	outside: '{n} devices with no address',
	dotLabel: 'every device fits in here',
	sandLabel: 'plus every grain of sand',
	sampleLabel: 'An address looks like',
	totalLabel: 'Addresses in total',
	bits: '{n} bits',
	scale:
		'If all of IPv6 were spread over the surface of the Earth, the whole of IPv4 would be a dot smaller than a single bacterium.',
	decimal: '.',
	thousands: ',',
	notes: {
		idle: 'The internet is young, and the pool is wide open',
		growing: 'More devices, more squares taken',
		tight: 'Almost every square is taken',
		full: 'The pool is empty, the rest wait outside',
		v6: 'Same devices, an unimaginably bigger pool',
		sand: 'Sand included, still basically empty'
	}
};
