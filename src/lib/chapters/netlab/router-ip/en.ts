import type { RouterIpText } from './types';

export const en: RouterIpText = {
	title: 'IP addresses and DHCP server',
	intro: [
		'Remember the router from last time? It is called nimbus, and ether2 already has <b>192.168.88.1/24</b>. That is the router seen from the office, the door every laptop walks through to reach the internet.',
		'Today three new staff arrive with laptops. Every device on a network needs its own <b>IP address</b>, like a house number, otherwise nobody knows where to send its replies.',
		'Typing an address into every laptop by hand works for three, not for thirty. So networks use <b>DHCP</b>, a service that hands out addresses by itself, like a receptionist giving each guest a numbered badge. The idea is in [[What is DHCP|network/dhcp]].',
		'A MikroTik DHCP server needs three pieces. A <b>pool</b> (which addresses it may hand out), the <b>network</b> info (which gateway and DNS every laptop should use), and the <b>server</b> itself, switched on at the office port.',
		'[fyi] Your WiFi router at home does exactly this, which is why your phone gets an address the moment it joins. A cloud network like a [[VPC|networking/vpc]] hands out addresses the same way, you just never see its DHCP server.',
		'Your turn. Plug a laptop in first and see what happens with no DHCP, then build the pool, the network, and the server. Prefer one go? <b>/ip dhcp-server setup</b> asks you everything step by step.'
	],
	reactions: {
		noIp: 'The laptop shouted into the cable, anyone got an address for me? Nobody answered, so it made one up, <b>169.254.x.x</b>. That address works nowhere, it is the laptop saying I gave up.',
		gotIp:
			'Look, it asked and got an answer straight away. The router handed it an address from the pool, plus the gateway and DNS to use. Nobody typed anything on the laptop.',
		pool: 'The pool is ready. These are the badges the receptionist may hand out, 192.168.88.10 up to .254. The low numbers stay free for things you set by hand, like printers.',
		poolBad:
			'Careful with that range. It has to sit inside 192.168.88.0/24, and it must not include <b>192.168.88.1</b>, that one already belongs to the router.',
		network:
			'Now DHCP knows what to tell every laptop. Your gateway is 192.168.88.1 (the router), and ask 8.8.8.8 when you need to look up a name like nimbus.com.',
		gatewayBad:
			'The gateway has to be the router itself, <b>192.168.88.1</b>. Point it anywhere else and the laptops would knock on a door that does not exist.',
		server:
			'The DHCP server is running on ether2. Every laptop that was waiting asks again, and this time it gets an answer. Watch their screens turn green.',
		wizard:
			'The setup wizard built all three pieces for you, a pool, the network info, and a running server on ether2. Same result as typing them one by one.',
		wizardBad:
			'The wizard did not like that answer. Read the hint line, then try again (the default is already filled in, so Enter usually works).',
		disabled:
			'The server exists, but look at the <b>X</b>, it is still disabled. RouterOS adds it switched off to be safe. Turn it on with <b>/ip dhcp-server enable dhcp1</b>.',
		wrongPort:
			'Whoa, that server would hand out addresses towards the ISP on ether1. The office laptops live on <b>ether2</b>, so use interface=ether2.',
		noPool:
			'The server has no pool to hand out from. Make a pool first, then point address-pool at its name.',
		noLease:
			'The list is empty, nobody has an address yet. Plug a laptop in and make sure the server is running.',
		leases:
			'This is the receptionist’s logbook. Each line says which address went to which laptop (the MAC address is the laptop’s own hardware name), and bound means it is in use right now.',
		error:
			'RouterOS did not get that one. Check the spelling, or type <b>?</b> to see what is there. Help can also type it for you.',
		done: 'Done! The office laptops now get their addresses by themselves. Plug in a fourth one tomorrow and it just works. Next up, these addresses are private, so they cannot reach the internet on their own yet.'
	},
	missionsLabel: 'Missions',
	missions: [
		'Plug a laptop into the switch',
		'Make an address pool',
		'Tell DHCP the gateway and DNS',
		'Start the DHCP server on ether2',
		'Check who got an address'
	],
	hintBtn: 'Help',
	doneNote: 'Every laptop gets an address by itself',
	ispLabel: 'ISP',
	inputLabel: 'command',
	termHint: '# type a RouterOS command, then press Enter',
	hintUnknown: '# that command does not exist, type ? to see the menu',
	didYouMean: '# maybe you meant {word}',
	plugCaption: 'Tap a laptop to plug its cable into the switch',
	gotCaption: 'The laptops got their addresses from the router',
	hintApipa: '# 169.254.x.x means the laptop got no answer and made one up',
	hintPoolRange:
		'# use a range inside 192.168.88.0/24 that skips .1, like 192.168.88.10-192.168.88.254',
	hintGateway: '# the gateway is the router itself, 192.168.88.1',
	hintIface: '# the office laptops are plugged into ether2',
	hintDisabled: '# X means disabled, run /ip dhcp-server enable dhcp1',
	hintNoPool: '# make a pool first with /ip pool add, then use its name',
	hintNeeds: '# this command still needs {keys}',
	hintNoLease: '# nobody has an address yet',
	hintBound: '# bound means the laptop is using that address right now',
	hintWizard: '# the wizard asks one question per line, press Enter to keep the value shown'
};
