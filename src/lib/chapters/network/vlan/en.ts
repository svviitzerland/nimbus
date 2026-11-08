import type { VlanText } from './types';

export const en: VlanText = {
	title: 'What is a VLAN',
	intro: [
		'Staff laptops, the payroll server, and guest devices share a switch. Initially they all belong to VLAN 1 and can reach each other in this simulation.',
		'We need to separate guest and staff traffic. A VLAN-capable switch can do this without a separate physical switch for each group.',
		'A <b>VLAN</b> (virtual LAN) splits one physical switch into several separate networks, in software. Each port gets a VLAN number. Ports with the same number talk freely, ports with different numbers behave as if they sat in different buildings.',
		'If finance really needs to reach the guests, that traffic has to leave through a router, where a [[firewall|networking/firewall]] can check it first. Most of the time you simply do not let it.',
		"[fyi] Same word, different world. In the cloud you never touch a switch, so the walls come from a [[VPC|networking/vpc]], a whole private network drawn in software. A VLAN splits a physical switch in an office, a VPC carves a network out of a provider's data centre. Same goal, keep the neighbours apart.",
		'[ingat] VLANs separate broadcast domains on a switched network. Communication between VLANs requires routing and still needs access rules.',
		'Here is the switch, and every port starts in VLAN 1. Test whether a guest can reach the payroll server, then colour the ports and test again.'
	],
	reactions: {
		leak: 'The guest request reached payroll because both ports are still in the same VLAN. Change their VLAN membership and test again.',
		reach:
			'Same VLAN, same team, they reach each other just fine. A VLAN never stops the work, it only draws the walls.',
		split:
			'Staff and guest ports now belong to different VLANs. Test whether the separation meets the requirements.',
		blocked:
			'This model’s switch does not forward the request between VLANs. In a real network, inter-VLAN routing needs appropriate configuration and access restrictions.',
		oops: 'Wait, these two are on the same team but you put them in different VLANs, so now they cannot reach each other. Give their ports the same colour.',
		done: 'Guest and finance devices are on different VLANs using the same switch. Traffic between VLANs requires routing and appropriate access rules.'
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
