import type { SubnetText } from './types';

export const en: SubnetText = {
	title: 'Subnets and CIDR',
	intro: [
		'The nimbus.com office has one network, 192.168.1.0, with room for 256 [[IP addresses|network/ip-address]] (192.168.1.0 up to 192.168.1.255). Staff laptops, guest phones, cameras, and printers all share one big hall.',
		'One big hall gets messy. Every [[ARP shout|network/mac]] reaches every device, and a guest phone sits right next to the finance laptop. So we split the hall into smaller rooms, and each room is a <b>subnet</b>.',
		'To say how big a room is, we add a slash and a number after the address, like 192.168.1.0/24. That way of writing it is called <b>CIDR</b> (Classless Inter Domain Routing, a long name for a simple idea).',
		'An IPv4 address is 32 bits, 32 little switches. The number after the slash says how many of those bits are locked as the name of the room. The rest are free for the devices inside. /24 locks 24 bits and leaves 8 free, and 8 free bits make exactly 256 addresses.',
		'Here is the only rule you need. Each time the number goes up by one, every room is cut in half and you get twice as many rooms. /25 makes two rooms of 128, /26 makes four rooms of 64, and so on.',
		'Two addresses in every room are spoken for. The first is the name of the room (the <b>network address</b>), and the last is for shouting to everyone inside it (the <b>broadcast address</b>). So a /24 room fits 254 devices, not 256.',
		'[fyi] Same word, different world. The public and private rooms in your cloud [[VPC|networking/vpc]] are subnets too, written with exactly this slash. The only twist is that AWS keeps 5 addresses in every subnet instead of 2, for its own router and DNS.',
		'Slide the number and watch the hall split into rooms. Then plan the rooms nimbus.com needs.'
	],
	reactions: {
		split:
			'See it split? One more locked bit, half the room size, twice the rooms. Older screens show the same thing as a <b>subnet mask</b>, the row of numbers under the slider. Same idea, written another way.',
		tiny: 'A /30 room has 4 addresses, and after the name and the broadcast only 2 are left for devices. Perfect for a single cable joining two routers, and nothing else.',
		small:
			'Too tight. Count the devices against the room size, someone would be left without a seat. Slide the number down to make the rooms bigger.',
		waste:
			'It fits, but those rooms are bigger than needed. Slide the number up and you get more rooms while everyone still fits.',
		m1: 'Spot on. /26 gives four rooms of 62 devices, one each for staff, guests, cameras, and one spare.',
		m2: 'Nice. /28 rooms hold 14 devices each, and you get sixteen of them, enough for every small team.',
		done: 'Back to one big room of 254, which fits the 200 devices with space to grow. You can now read any slash you see, bigger number, smaller rooms.'
	},
	missions: [
		'Make rooms that fit 50 devices each, with as many rooms as possible',
		'Each small team has 12 devices. Make the rooms as small as they can be while everyone still fits',
		'The event hall needs one room for 200 devices'
	],
	missionLabel: 'Plan {n} of {total}',
	allDone: 'Every room planned',
	checkBtn: 'Use this size',
	smaller: 'Smaller number, bigger rooms',
	bigger: 'Bigger number, smaller rooms',
	status: {
		ok: 'Perfect fit',
		small: '{need} devices do not fit, a room here holds only {fit}',
		waste: 'It fits, but smaller rooms would still fit and give you more of them'
	},
	roomsLabel: 'Rooms',
	sizeLabel: 'Addresses each',
	usableLabel: 'Devices each',
	locked: '{n} bits lock the room name',
	free: '{n} bits free for devices',
	maskLabel: 'Subnet mask',
	hallLabel: 'All 256 addresses of 192.168.1.0',
	tapHint: 'Tap any room to look inside',
	roomTitle: 'Room {n} of {total}',
	rangeLabel: 'Addresses',
	range: '{a} to {b}',
	nameLabel: 'Room name',
	shoutLabel: 'Broadcast',
	devicesLabel: 'For devices',
	legendUse: 'a device seat',
	legendRes: 'reserved'
};
