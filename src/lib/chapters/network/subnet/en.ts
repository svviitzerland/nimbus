import type { SubnetText } from './types';

export const en: SubnetText = {
	title: 'Subnets',
	intro: [
		'Think of a block of [[IP addresses|network/ip-address]] as a building, and every window is one address. The nimbus.com office owns the building 192.168.1.0, with 256 windows. Right now it is one big open hall, and everyone shares it.',
		'One big hall gets noisy, and guest phones end up sitting right next to the finance laptops. So we put up walls and make rooms. Each room is called a <b>subnet</b>. To say how big a room is, we write a slash and a number, like 192.168.1.0/24.',
		'The number after the slash says how big a room you get. Watch what happens when it goes up. <b>Bigger number, smaller room.</b> /25 cuts the building into two rooms of 128, /26 into four rooms of 64, and it keeps halving.',
		'Now the other way. Each step down doubles the room, and the walls disappear by themselves. /28 rooms of 16 merge into 32, then 64, then 128, until /24 is the whole building again.',
		'Go all the way up to /32 and the room is a single window, exactly one address. /30 is a tiny room of 4, just right for one cable joining two routers.',
		'Go down past /24 and the room gets bigger than this building. /16 is a whole campus of 256 buildings like ours, 65,536 addresses. /8 is a city of them, about 16.7 million.',
		'[ingat] Only one rule to remember. Bigger number, smaller room. /32 is one address, /24 is 256 (a home or an office), and every step down doubles the room. That small table is all you need on day one.',
		"[fyi] Two windows in every room are spoken for. The first is the room's name (the network address) and the last is for shouting to everyone inside (the broadcast address). So a /24 room fits 254 devices, not 256.",
		'[fyi] Same word, different world. In the cloud, the public and private rooms of your [[VPC|networking/vpc]] are subnets too, written with exactly this slash. The cloud just keeps a few more windows for itself.',
		'That is subnetting, the friendly version. If you like, nudge the number yourself and watch the rooms split and merge.'
	],
	reactions: {
		split: 'One step up, and every room is cut in half. Twice as many rooms, each half the size.',
		merge: 'One step down, and neighbouring rooms join into one twice as big.',
		one: '/32 means every room is a single window. When you see /32 in a setting, it simply means one exact address.'
	},
	steps: [
		{
			title: 'A block is a building',
			body: 'A block of addresses sits together like windows in one building. Here, <b>192.168.1.0</b> up to <b>192.168.1.255</b>.'
		},
		{
			title: 'Rooms are subnets',
			body: 'Walls split the building into rooms. The slash and the number after the address say how big each room is.'
		},
		{
			title: 'Bigger number',
			body: 'Each step up cuts every room in half. More rooms, each one smaller.'
		},
		{
			title: 'Smaller number',
			body: 'Each step down merges two rooms into one. Fewer rooms, each one <b>twice</b> as big.'
		},
		{
			title: 'The tiny ones',
			body: '<b>/32</b> is one address. <b>/30</b> is 4, a classic for a link between two routers.'
		},
		{
			title: 'The big ones',
			body: '<b>/16</b> is 65,536 addresses, a campus. <b>/8</b> is about 16.7 million, a city.'
		},
		{
			title: 'Bigger number, smaller room',
			tag: 'remember',
			body: '/32 is 1, /24 is 256, and each step down doubles. Keep this table in your pocket.'
		},
		{
			title: 'Two reserved windows',
			tag: 'by the way',
			body: 'First address names the room, last address reaches everyone in it. The rest are for devices.'
		},
		{
			title: 'Subnets in the cloud',
			tag: 'by the way',
			body: 'A VPC is your own building in the cloud, and you split it into public and private subnets the same way.'
		},
		{
			title: 'Nudge the number',
			tag: 'your turn',
			body: 'Optional. Use minus and plus above and watch the walls move.'
		}
	],
	buildingLabel: 'The address building 192.168.1.0',
	oneRoom: 'One room, {size} addresses',
	rooms: '{n} rooms, {size} addresses each',
	roomsSingle: '{n} rooms, one address each',
	cheat: [
		{ size: '1', note: 'one address' },
		{ size: '4', note: 'a link between two routers' },
		{ size: '256', note: 'a home or an office' },
		{ size: '65,536', note: 'a campus' },
		{ size: '16.7 million', note: 'a city' }
	],
	cheatTitle: 'Cheat sheet',
	ruleLine: 'Bigger number, smaller room',
	campus16: '/16 is 256 buildings like ours, 65,536 addresses',
	campus8: '/8 is 256 campuses like this, about 16.7 million',
	nameLabel: 'name',
	shoutLabel: 'everyone',
	publicLabel: 'public subnet',
	privateLabel: 'private subnet',
	smaller: 'Smaller number, bigger rooms',
	bigger: 'Bigger number, smaller rooms',
	thousands: ','
};
