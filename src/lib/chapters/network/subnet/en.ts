import type { SubnetText } from './types';

export const en: SubnetText = {
	title: 'Subnets and CIDR',
	intro: [
		'The nimbus.com network uses <b>192.168.1.0/24</b>, with 256 total addresses from 192.168.1.0 to 192.168.1.255. We will divide it into smaller subnets.',
		'A <b>subnet</b> divides IP address space into smaller parts. Separating Ethernet broadcasts also requires configuration such as [[VLANs|network/vlan]]. Changing addresses alone does not create a security boundary.',
		'To say how big a room is, we add a slash and a number after the address, like 192.168.1.0/24. That way of writing it is called <b>CIDR</b> (Classless Inter Domain Routing, a long name for a simple idea).',
		'IPv4 has 32 bits. The number after the slash is the network prefix length. <b>/24</b> uses 24 bits for the prefix and leaves 8 bits, giving 256 total addresses.',
		'The same boundary can be written as a <b>subnet mask</b>. /24 equals 255.255.255.0, with 24 one bits followed by 8 zero bits. One bits mark the network portion. Move the prefix to /25 and the mask becomes 255.255.255.128.',
		'Adding one prefix bit halves the address count. A /24 can become two /25 subnets with 128 addresses each or four /26 subnets with 64 each.',
		'In the ordinary IPv4 subnets used here, the first address is the <b>network address</b> and the last is the <b>broadcast address</b>. A /24 therefore provides 254 host addresses. Exceptions include /31 links.',
		'[fyi] [[VPC|networking/vpc]] subnets also use IP prefixes. Cloud providers may reserve extra addresses. AWS reserves five addresses in ordinary IPv4 subnets, so host capacity differs from this example.',
		'[ingat] In IPv4, a longer prefix means fewer addresses. A /24 has 256 total addresses. Adding one prefix bit halves that count.',
		'Adjust the prefix length and observe subnet count and capacity. Then choose sizes that meet nimbus.com’s device requirements.'
	],
	reactions: {
		split:
			'The prefix gained one bit. Each subnet has half as many addresses, and the subnet count doubles. The mask below the slider expresses the same boundary in another format.',
		tiny: 'A /30 has four total addresses and two host addresses in this model. It can be used for a link between two routers.',
		small:
			'There are not enough host addresses. Shorten the prefix to give each subnet more addresses.',
		waste:
			'It fits, but those rooms are bigger than needed. Slide the number up and you get more rooms while everyone still fits.',
		m1: 'A /26 divides the /24 into four subnets with 62 host addresses each. Each can hold a group of 50 devices.',
		m2: 'A /28 subnet provides 14 ordinary host addresses. Dividing a /24 into /28s produces 16 subnets, enough for the teams in this example.',
		done: 'The /24 provides 254 host addresses in this example, enough for 200 devices. A longer prefix means fewer addresses per subnet.'
	},
	missions: [
		'Create as many subnets as possible with room for 50 devices each',
		'Each small team has 12 devices. Make the rooms as small as they can be while everyone still fits',
		'Provide one subnet for 200 event devices'
	],
	missionLabel: 'Plan {n} of {total}',
	allDone: 'All subnet requirements met',
	checkBtn: 'Use this size',
	smaller: 'Shorter prefix, more addresses',
	bigger: 'Longer prefix, fewer addresses',
	status: {
		ok: 'Perfect fit',
		small: 'Needs {need} host addresses; this subnet supports {fit}',
		waste: 'Enough capacity, but a smaller subnet also meets the requirement'
	},
	roomsLabel: 'Subnets',
	sizeLabel: 'Addresses per subnet',
	usableLabel: 'Host addresses per subnet',
	locked: '{n} bits for the network prefix',
	free: '{n} bits free for devices',
	maskLabel: 'Subnet mask',
	hallLabel: 'All 256 addresses of 192.168.1.0',
	tapHint: 'Select a subnet to inspect its address range',
	roomTitle: 'Subnet {n} of {total}',
	rangeLabel: 'Addresses',
	range: '{a} to {b}',
	nameLabel: 'Network address',
	shoutLabel: 'Broadcast',
	devicesLabel: 'For devices',
	legendUse: 'a device seat',
	legendRes: 'reserved'
};
