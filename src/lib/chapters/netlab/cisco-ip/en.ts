import type { CiscoIpText } from './types';

export const en: CiscoIpText = {
	title: 'Interfaces and DHCP pools',
	intro: [
		'Our router is called nimbus now, and a cable already runs from <b>GigabitEthernet0/1</b> to the office switch. But look, the light is off. Cisco ships router ports switched off, so nothing gets through yet.',
		'First the port needs an address, the router’s own house number on the office side. We step into the port with <b>interface g0/1</b>, then give it <b>192.168.88.1</b>. Notice Cisco wants the mask spelled out, <b>255.255.255.0</b>, not /24.',
		'Then we switch it on with <b>no shutdown</b>. The light turns green and IOS announces it in yellow, changed state to up.',
		'[ingat] In IOS, no generally removes or disables a command’s configuration. no shutdown enables an interface. Check what a command does before running it.',
		'Sari, Budi, and Dewi’s laptops send <b>DHCP</b> requests for IP configuration. No DHCP server is replying yet. See the flow in [[DHCP|network/dhcp]].',
		'Before creating the pool, exclude 192.168.88.1 through 192.168.88.10 using <b>ip dhcp excluded-address</b>. These addresses are reserved for the router and manually configured devices.',
		'Create a <b>pool</b> named OFFICE. Set network, default-router, and dns-server. Once DHCP is active, the laptops receive addresses and these settings.',
		'[ingat] A DHCP pool defines the address network, default gateway, and DNS server supplied to clients.',
		'<b>show ip dhcp binding</b> lists addresses leased to clients. Assignment starts at .11 here because .1 through .10 are excluded.',
		'Your turn. Check that Dewi’s laptop really answers, type <b>ping 192.168.88.13</b>.'
	],
	reactions: {
		task: 'Five exclamation marks, five replies! Each ! is one answer from Dewi’s laptop. The port is up, the pool works, and the whole office has addresses.',
		pingOther:
			'That laptop answered too. The mission was Dewi though, she got <b>192.168.88.13</b>.',
		pingMiss:
			'Dots mean no reply. Nobody has that address. Dewi has <b>192.168.88.13</b>, check the binding list above.',
		needEnable: 'This command requires privileged EXEC mode. Run <b>enable</b>, then try again.',
		needConfig: 'That changes the router, type <b>conf t</b> first.',
		needDo:
			'In config mode, put <b>do</b> in front of it, like <b>do ping 192.168.88.13</b>, or type <b>end</b> first.',
		needSub:
			'That command lives one level deeper. Enter the interface or the pool first, for example <b>interface g0/1</b>.',
		mask: 'Cisco does not take /24 there. Write the mask out in full, <b>255.255.255.0</b>.',
		error:
			'IOS did not understand that one. The ^ points at the word it tripped on, and <b>?</b> shows what fits.'
	},
	steps: [
		{
			title: 'Inactive interface',
			body: 'In the table, Gi0/1 says <b>administratively down</b>. The cable is there, but the port was never switched on.'
		},
		{
			title: 'Interface mode',
			body: '<code>interface g0/1</code> moves you inside that one port, and the prompt shows <b>(config-if)#</b>. Everything you type now applies only to this port.'
		},
		{
			title: 'Enabling the interface',
			body: '<code>no shutdown</code> brings the port up. The yellow lines are the router’s diary, called log messages.'
		},
		{
			title: 'Removing configuration with no',
			tag: 'Remember it',
			body: 'Put <b>no</b> in front to undo. <code>shutdown</code> is off, <code>no shutdown</code> is on.'
		},
		{
			title: 'Laptops asking',
			body: 'A laptop without an address cannot talk to anyone. With DHCP it asks the network, and the router can answer. Your WiFi router at home does exactly this.'
		},
		{
			title: 'Excluding IP addresses',
			body: '<code>ip dhcp excluded-address 192.168.88.1 192.168.88.10</code> means never hand these out. The router already uses .1.'
		},
		{
			title: 'Creating a DHCP pool',
			body: '<code>ip dhcp pool OFFICE</code> opens the pool, and the prompt becomes <b>(dhcp-config)#</b>. The next three lines fill in what every laptop should be told.'
		},
		{
			title: 'Address, gateway, and DNS',
			tag: 'Remember it',
			body: '<b>network</b> which number is mine, <b>default-router</b> where is the exit, <b>dns-server</b> who knows the names.'
		},
		{
			title: 'DHCP lease table',
			body: 'One line per laptop, its address and its hardware address. On MikroTik the same list is the DHCP lease list.'
		},
		{
			title: 'Configure the interface and DHCP',
			tag: 'Try it',
			body: 'Tap the console and type <code>ping 192.168.88.13</code>. Each <b>!</b> is a reply, each <b>.</b> is silence.'
		}
	],
	tagAsk: 'DHCP?',
	capDark: 'Gi0/1 is switched off, the office is in the dark',
	capLit: 'Gi0/1 is up with 192.168.88.1',
	capWaiting: 'The laptops keep asking for an address',
	capLeased: 'Every laptop got an address from the pool',
	ispLabel: 'ISP',
	inputLabel: 'command',
	doneNote: 'Done',
	termHint: '! Nim types here first, your turn comes at the end',
	hintInvalid: '! IOS got lost at the ^ mark, check that word or type ? to see what fits there',
	hintIncomplete: '! almost, the command needs more words, add a space and ? to see them',
	hintAmbiguous: '! too short, more than one command starts like that, add a letter or two',
	hintUnknown: '! that is not a command here, type ? to see the list',
	didYouMean: '! maybe you meant {word}',
	hintNeedEnable: '! use enable to enter privileged EXEC',
	hintNeedConfig: '! that changes the router, type conf t first',
	hintDo: '! you are in config mode, put do in front, like do sh run',
	hintSub: '! that one goes inside an interface, pool, or line, enter it first',
	hintMask: '! write the full subnet mask, for example 255.255.255.0',
	hintWild: '! careful, a wildcard is the mask flipped, 255.255.255.0 becomes 0.0.0.255'
};
