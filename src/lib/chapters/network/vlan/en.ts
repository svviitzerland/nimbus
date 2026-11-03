import type { VlanText } from './types';

export const en: VlanText = {
	title: 'What is a VLAN',
	intro: [
		"The nimbus.com office has one <b>switch</b> in the corner, a box that joins many cables so the devices in one building can talk. The finance laptops, the payroll server and the guest corner all plug into it. That means a guest's laptop can see the payroll server too.",
		'You could buy a second switch just for guests. Then a third for the meeting room, a fourth for the cameras, and soon the cupboard is full of boxes and cables.',
		'A <b>VLAN</b> (virtual LAN) splits one physical switch into several separate networks, in software. Each port gets a VLAN number. Ports with the same number talk freely, ports with different numbers behave as if they sat in different buildings.',
		'If finance really needs to reach the guests, that traffic has to leave through a router, where a [[firewall|networking/firewall]] can check it first. Most of the time you simply do not let it.',
		"[fyi] Same word, different world. In the cloud you never touch a switch, so the walls come from a [[VPC|networking/vpc]], a whole private network drawn in software. A VLAN splits a physical switch in an office, a VPC carves a network out of a provider's data centre. Same goal, keep the neighbours apart.",
		'Here is the switch, and every port starts in VLAN 1. Test whether a guest can reach the payroll server, then colour the ports and test again.'
	],
	reactions: {
		leak: 'Uh oh, it got through. Everyone is still on the same VLAN, so as far as the switch knows, the guest and the payroll server share one room. Colour the ports to split them.',
		reach:
			'Same VLAN, same team, they reach each other just fine. A VLAN never stops the work, it only draws the walls.',
		split:
			'Finance and guests now sit on different VLANs. Same switch, same cables, yet two separate worlds. Go test it.',
		blocked:
			'Blocked. The switch will not pass anything between ports of different VLANs. To the guest, the payroll server simply does not exist.',
		oops: 'Wait, these two are on the same team but you put them in different VLANs, so now they cannot reach each other. Give their ports the same colour.',
		done: 'That is it! Guests surf in their own corner, finance works in theirs, and one switch does both jobs. Offices, campuses and hotels split their networks exactly like this every day.'
	},
	switchLabel: 'Office switch',
	goalTitle: 'Goal',
	goal: 'Guests cannot reach finance, and finance still reaches its server',
	portHint: 'Tap a port on the switch to change its VLAN',
	pingHint: 'Tap two devices to test if they can reach each other',
	pickTarget: 'Now tap who {name} should try to reach',
	vlans: ['VLAN 1, default', 'VLAN 10, finance', 'VLAN 20, guests'],
	portAria: 'Port {n}, now in {vlan}, tap to change',
	devices: ['Rina', 'Budi', 'Payroll server', 'Guest 1', 'Guest 2', 'Guest 3'],
	financeTag: 'Finance',
	guestTag: 'Guest corner',
	reachOk: '{a} reached {b}',
	reachNo: '{a} cannot reach {b}',
	resetBtn: 'Reset ports',
	solvedNote: 'Two networks on one switch'
};
