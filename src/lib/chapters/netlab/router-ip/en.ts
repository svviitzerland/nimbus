import type { RouterIpText } from './types';

export const en: RouterIpText = {
	title: 'IP addresses and DHCP server',
	intro: [
		'Three new staff just plugged their laptops into the office switch. The cables are fine and the lights blink, but look at the addresses under each laptop. Nothing yet.',
		'Every device on a network needs its own <b>IP address</b>, like a house number, or replies never find it. Nobody is handing them out here, so each laptop gives up and makes one up, <b>169.254.x.x</b>, an address that works nowhere.',
		'Typing an address into every laptop by hand works for three, not for thirty. So networks use <b>DHCP</b>, a service that hands out addresses by itself, like a receptionist giving each guest a numbered badge. The idea is in [[What is DHCP|network/dhcp]].',
		'A MikroTik DHCP server needs three pieces. First the <b>pool</b>, the box of badges it may hand out. Watch the terminal, 192.168.88.10 up to .254, so the low numbers stay free for things like printers.',
		'Second, the <b>network</b> info, the welcome note that comes with every badge. Your gateway (the way out) is the router at 192.168.88.1, and ask 8.8.8.8 when you need to look up a name.',
		'Third, the <b>server</b> itself, the receptionist, standing at ether2 where the office is. The moment it starts, the laptops ask again, and this time somebody answers.',
		'[ingat] Pool is the box of badges, network is the welcome note, server is the receptionist. No receptionist, no badges. And whenever you see 169.254, it means nobody answered.',
		'[fyi] Your WiFi router at home does exactly this, which is why your phone gets an address the moment it joins. A cloud network like a [[VPC|networking/vpc]] does it too, you just never see the server.',
		'Your turn. Open the receptionist’s logbook with <b>/ip dhcp-server lease print</b> and see who got which badge.'
	],
	reactions: {
		leases:
			'That is the logbook. Each line says which address went to which laptop (the MAC address is the laptop’s own hardware name), and <b>bound</b> means it is in use right now.',
		pool: 'That is the pool, the box of badges. Now peek at who actually got one with <b>/ip dhcp-server lease print</b>.',
		error:
			'RouterOS did not get that one. Check the spelling, or tap the suggestion and watch it get typed.'
	},
	steps: [
		{
			title: 'Plugged in, no address',
			body: 'A cable gives a laptop a road. It still needs an <b>address</b> before anyone can send it anything.'
		},
		{
			tag: '169.254.x.x',
			title: 'Nobody answered',
			body: 'When a laptop asks for an address and hears nothing, it picks a <b>169.254</b> one by itself. That only means it gave up.'
		},
		{
			tag: 'DHCP',
			title: 'The receptionist',
			body: 'A <b>DHCP server</b> hands every new device an address, plus the gateway and DNS to use, without anyone typing.'
		},
		{
			tag: 'ip pool',
			title: 'The box of badges',
			body: 'The <b>pool</b> is the range DHCP may give out. It must sit inside the office network and skip the router’s own .1.'
		},
		{
			tag: 'dhcp-server network',
			title: 'The welcome note',
			body: '<b>gateway</b> is the way out (the router), <b>dns-server</b> is who to ask for names like nimbus.com.'
		},
		{
			tag: 'dhcp-server',
			title: 'Open for business',
			body: 'The server listens on <b>ether2</b>, hands out from the pool, and writes every handout down as a <b>lease</b>.'
		},
		{
			tag: 'Remember it',
			title: 'Badges, note, receptionist',
			body: 'Pool, network, server. Miss the receptionist and nobody gets a badge.'
		},
		{
			title: 'Same idea everywhere',
			body: 'Home WiFi, phone hotspots, and cloud networks all hand out addresses with DHCP.'
		},
		{
			title: 'Your turn',
			body: 'A <b>lease</b> is one handout, an address lent to one device for a while.'
		}
	],
	ispLabel: 'ISP',
	inputLabel: 'command',
	tryLabel: 'Try this',
	termHint: '# your turn, type the command and press Enter',
	hintTry: '# try {cmd}',
	didYouMean: '# maybe you meant {word}',
	hintBound: '# bound means the laptop is using that address right now'
};
