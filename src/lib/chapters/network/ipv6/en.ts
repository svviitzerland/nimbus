import type { Ipv6Text } from './types';

export const en: Ipv6Text = {
	title: 'IPv4 and IPv6',
	intro: [
		'In the [[IP address lesson|network/ip-address]] you met addresses like 192.168.1.20, four numbers from 0 to 255 with dots between them. That style is <b>IPv4</b>, version 4 of the Internet Protocol, written down in 1981.',
		'Four numbers like that can make about 4.3 billion different addresses. Back then the whole internet was a few hundred big computers, so it felt like room forever.',
		'Then came home computers, then phones, then watches, TVs, cameras, and even fridges. Watch the pool fill up, year after year.',
		'In 2011 the world’s central reserve of addresses ran dry. New devices kept arriving, and there were simply no fresh IPv4 addresses left to hand out.',
		'The fix is <b>IPv6</b>. Its addresses are four times as long, written in eight groups of letters and numbers (the digits 0 to 9 plus a to f), with colons between the groups.',
		'How much bigger is that? So big that every IPv4 address in the world is just one tiny dot inside the IPv6 space. IPv6 has about 340 undecillion addresses, a number 39 digits long.',
		'[ingat] An easy way to tell them apart. IPv4 has dots and four short numbers. IPv6 has colons, letters, and eight groups. If you see letters in an address, it is IPv6.',
		'[fyi] Why not IPv5? The number 5 was already taken in the 1980s by an experimental protocol for streaming voice, so the next version became 6.',
		'Moving the whole world takes decades, so today most devices carry both kinds, and a trick called [[NAT|network/nat]] stretches the old IPv4 addresses. If you like, give every grain of sand on Earth an address and see how much room is left.'
	],
	reactions: {
		sand: 'Every grain of sand on Earth now has its own IPv6 address, and the space barely noticed. You could give each grain billions of addresses and still have plenty left.'
	},
	steps: [
		{
			title: 'An IPv4 address',
			body: 'Four numbers, each from <b>0 to 255</b>, with dots between. Every device online needs one to be reached.'
		},
		{
			title: 'The IPv4 pool',
			body: 'All possible IPv4 addresses together make about <b>4.3 billion</b>. That sounds like a lot, until everyone wants one.'
		},
		{
			title: 'Filling up',
			body: 'Each new phone, laptop, or camera takes an address from the same pool.'
		},
		{
			title: 'Empty',
			body: 'In 2011 the last big blocks were handed out. Devices still arrive, with nothing left to give them.'
		},
		{
			title: 'An IPv6 address',
			body: 'Eight groups of letters and numbers, with colons between. Long, but you rarely type it yourself.'
		},
		{
			title: 'Room for everything',
			body: 'The whole IPv4 pool is a speck inside IPv6. There is no realistic way to run out.'
		},
		{
			title: 'Dots or colons',
			tag: 'make it stick',
			body: 'Dots and 4 numbers means <b>IPv4</b>. Colons, letters, and 8 groups means <b>IPv6</b>.'
		},
		{
			title: 'Where did 5 go',
			tag: 'by the way',
			body: 'Version 5 was an experiment that never became the internet, so the count jumped from 4 to 6.'
		},
		{
			title: 'Both at once',
			tag: 'your turn',
			body: 'Most phones today hold an IPv4 and an IPv6 address side by side. Optional, try the sand button.'
		}
	],
	v4Label: 'IPv4',
	v6Label: 'IPv6',
	partHint: '0 to 255',
	poolLabel: 'Every IPv4 address',
	poolCount: 'about 4.3 billion',
	yearLabel: 'Year {year}',
	outsideLabel: 'no address left',
	fieldLabel: 'Every IPv6 address',
	fieldCount: 'about 340 undecillion',
	dotLabel: 'all of IPv4',
	ruleV4: 'dots, 4 numbers',
	ruleV6: 'colons, letters, 8 groups',
	skipped: 'never shipped',
	bothLabel: 'Your phone today',
	sandBtn: 'Give every grain of sand an address',
	sandLabel: 'every grain of sand on Earth'
};
