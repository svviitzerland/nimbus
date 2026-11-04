import type { VlanText } from './types';

export const en: VlanText = {
	title: 'What is a VLAN',
	intro: [
		'The nimbus.com office has one <b>switch</b> in a cupboard, a box with many sockets (called ports) that joins every cable in the building. The finance laptops, the payroll server and the guest corner all plug into it.',
		'Here is the problem. Watch a guest laptop send something. It goes up its cable, through the switch, and straight down to the payroll server. Not great.',
		'You could buy a second switch just for guests. Instead, a <b>VLAN</b> (virtual LAN) gives every port a colour, in software. Finance ports turn blue, guest ports turn orange.',
		'Ports with the same colour talk freely. A finance laptop still reaches the payroll server, exactly like before.',
		'But a guest packet now stops at the switch. The switch refuses to pass anything between two different colours. To the guest, the payroll server simply is not there.',
		'[ingat] Same colour, same room. Different colour, different building. One switch, many rooms.',
		'What if finance really must reach the guests? Then the packet has to leave through a <b>router</b>, where a [[firewall|networking/firewall]] can check it first. Most of the time you just do not allow it.',
		'[fyi] Same word, different world. In the cloud you never touch a switch, so the walls come from a [[VPC|networking/vpc]], a whole private network drawn in software. Same goal, keep the neighbours apart.',
		'That is a VLAN, coloured groups on one box. If you like, paint the first guest port blue and see who it can reach.'
	],
	reactions: {
		joined:
			'Now that port is blue, so as far as the switch knows, the guest is finance. It walks straight to the payroll server. One wrong colour is all it takes.',
		left: 'Orange again, back in the guest room, and the switch stops it at the door. Much better.'
	},
	steps: [
		{
			title: 'One switch',
			body: 'A <b>switch</b> joins the cables of one building. Every device plugs into one of its ports.'
		},
		{
			title: 'Everyone sees everyone',
			body: 'Out of the box, every port is in the same network, so a guest can reach the payroll server.'
		},
		{
			title: 'Colour the ports',
			body: 'A <b>VLAN</b> is a number given to a port. Here finance is <b>VLAN 10</b> and guests are <b>VLAN 20</b>.'
		},
		{
			title: 'Same colour talks',
			body: 'Ports in the same VLAN pass packets to each other freely, so work goes on as usual.'
		},
		{
			title: 'Different colour stops',
			body: 'The switch never passes a packet between two VLANs. Same box, same cables, two separate networks.'
		},
		{
			tag: 'Rule of thumb',
			title: 'One switch, many rooms',
			body: 'Same colour, same room. Different colour, different building.'
		},
		{
			title: 'Crossing over',
			body: 'Traffic between VLANs has to go through a <b>router</b>, where rules decide what may pass.'
		},
		{
			title: 'Also in the cloud',
			body: 'Cloud providers split networks with a <b>VPC</b> instead of a VLAN. Same idea, no switch to touch.'
		},
		{
			title: 'One wrong colour',
			body: 'A port in the wrong VLAN joins the wrong room. That is why network people label their ports carefully.'
		}
	],
	switchLabel: 'Office switch',
	routerLabel: 'Router',
	payrollLabel: 'Payroll',
	financeTag: 'Finance, VLAN 10',
	guestTag: 'Guests, VLAN 20',
	blockedTag: 'blocked',
	checkedTag: 'checked',
	paintBtn: 'Paint guest port blue',
	unpaintBtn: 'Paint it orange again'
};
