import type { RouterIpText } from './types';

export const en: RouterIpText = {
	title: 'IP addresses and DHCP server',
	intro: [
		'Three new staff just plugged their laptops into the office switch. The cables are fine and the lights blink, but look at the addresses under each laptop. Nothing yet.',
		'Each interface needs an IP address for IP communication. Without a DHCP reply, these laptops select a link local <b>169.254.x.x</b> address. It only works on the local link and does not provide internet access.',
		'<b>DHCP</b> distributes IP configuration automatically so each laptop does not need manual setup. See [[DHCP|network/dhcp]] for the request flow.',
		'MikroTik uses a <b>pool</b> to define which addresses may be assigned. This example uses 192.168.88.10 through 192.168.88.254. Addresses outside the range are reserved for manual configuration.',
		'The <b>network</b> settings define the gateway and DNS supplied to clients. Here the gateway is 192.168.88.1 and the DNS server is 8.8.8.8.',
		'The <b>DHCP server</b> is enabled on ether2, the office interface. When clients request configuration, it supplies an address from the pool with gateway and DNS settings.',
		'[ingat] The pool defines an address range. Network settings specify the gateway and DNS. The DHCP server distributes configuration to clients.',
		'[fyi] Your WiFi router at home does exactly this, which is why your phone gets an address the moment it joins. A cloud network like a [[VPC|networking/vpc]] does it too, you just never see the server.',
		'Run <b>/ip dhcp-server lease print</b> to see the address leased to each device.'
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
			title: 'Connected without an IP address',
			body: 'A cable gives a laptop a road. It still needs an <b>address</b> before anyone can send it anything.'
		},
		{
			tag: '169.254.x.x',
			title: 'No DHCP response',
			body: 'When a laptop asks for an address and hears nothing, it picks a <b>169.254</b> one by itself. That only means it gave up.'
		},
		{
			tag: 'DHCP',
			title: 'Automatic IP assignment',
			body: 'A <b>DHCP server</b> hands every new device an address, plus the gateway and DNS to use, without anyone typing.'
		},
		{
			tag: 'ip pool',
			title: 'IP address range',
			body: 'The <b>pool</b> is the range DHCP may give out. It must sit inside the office network and skip the router’s own .1.'
		},
		{
			tag: 'dhcp-server network',
			title: 'Client gateway and DNS',
			body: '<b>gateway</b> specifies the router for destinations outside the subnet. <b>dns-server</b> specifies the server used for domain lookups.'
		},
		{
			tag: 'dhcp-server',
			title: 'Enabling the DHCP server',
			body: 'The server listens on <b>ether2</b>, hands out from the pool, and writes every handout down as a <b>lease</b>.'
		},
		{
			tag: 'Remember it',
			title: 'Three DHCP settings',
			body: 'The pool supplies addresses, network settings supply client configuration, and the DHCP server handles requests.'
		},
		{
			title: 'DHCP on other networks',
			body: 'Home WiFi, phone hotspots, and cloud networks all hand out addresses with DHCP.'
		},
		{
			title: 'Configure DHCP',
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
