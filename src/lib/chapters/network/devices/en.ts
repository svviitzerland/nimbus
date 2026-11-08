import type { DevicesText } from './types';

export const en: DevicesText = {
	title: 'Network devices',
	intro: [
		'The internet does not fall from the sky into your laptop. It arrives on a cable from your internet provider (the <b>ISP</b>), and then a few boxes pass it along, each one with its own job.',
		'First comes the <b>modem</b>. It sits where the provider’s cable enters the building and translates the signal on that cable into something the rest of your gear understands. When the cable is fibre, this box is called an <b>ONT</b> (Optical Network Terminal).',
		'Next is the <b>router</b>, the one who picks the way. It hands every device an address and decides what goes out to the internet and what stays inside. Behind it sits the <b>switch</b>, a box full of ports where every cable in the office plugs in.',
		'Last, the <b>access point</b> turns the wired network into radio, so phones and laptops can join without a cable. That radio is the WiFi you know.',
		'[fyi] At home, the one box your provider installs often does all four jobs inside a single case, modem, router, switch, and access point together. Offices split them apart so each can be bigger and be replaced on its own. In the cloud they turn into settings, like the virtual router inside a [[VPC|networking/vpc]].',
		'[ingat] A modem connects to the provider’s access medium. A router connects networks, a switch connects devices within a LAN, and an access point provides WiFi access.',
		'Here is an empty office waiting for its boxes. Put each one in the right spot, then pull one out and see who loses the internet.'
	],
	reactions: {
		modem:
			'The modem goes first, right where the provider’s cable comes in. Without it, that cable is just a signal nobody inside can read.',
		router:
			'The router sits behind the modem. It gives every device an [[IP address|network/ip-address]] and decides which packets leave for the internet and which stay home.',
		switch:
			'The switch is the power strip of the network. Every cable in the office plugs in here, and it passes data straight to the right device.',
		ap: 'The access point hangs off the switch and speaks radio, so the phone can join without a cable. Learn how that radio behaves in [[What is WiFi|network/wifi]].',
		wrong:
			'That box does not belong there. Follow the path from the internet inward, first the one that reads the provider’s cable, then the one that picks the way, then the one with lots of ports.',
		built:
			'The office is online. Data from the internet passes the modem, then the router, then the switch, and from there either down a cable to a PC or through the air from the access point to the phone. Now pull one box out.',
		noModem:
			'Without the modem, nothing reaches the provider. The PCs can still share files with each other (the LAN inside is fine), but the internet is gone for everyone.',
		noRouter:
			'No router, no way out. The provider’s line still reaches the door, but nobody hands out addresses or picks the route, so nobody gets online. The switch still links the devices inside.',
		noSwitch:
			'Pull the switch and every cable inside has nowhere to plug in. The PCs and even the access point are cut off, so the whole office goes dark.',
		noAp: 'Only the phone lost its connection. The PCs on cables do not even notice, they never used the radio. The access point only serves wireless devices.',
		fixed: 'Back in place, and everyone is online again. Try pulling a different box.'
	},
	parts: {
		modem: { name: 'Modem (ONT)', job: 'reads the provider’s cable' },
		router: { name: 'Router', job: 'picks the way out' },
		switch: { name: 'Switch', job: 'connects the cables inside' },
		ap: { name: 'Access point', job: 'turns it into WiFi' }
	},
	trayLabel: 'Your boxes',
	internetLabel: 'Internet from the ISP',
	pcLabel: 'PC {n}',
	phoneLabel: 'Phone',
	status: { online: 'online', local: 'inside only', offline: 'offline' },
	pickHint: 'Pick a box from the shelf above',
	placeHint: 'Now tap the empty spot where the {name} belongs',
	builtNote: 'Everything works. Tap any box in the office to pull it out',
	brokenNote: 'The {name} is out. Put it back from the shelf'
};
