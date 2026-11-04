import type { DevicesText } from './types';

export const en: DevicesText = {
	title: 'Network devices',
	intro: [
		'The internet does not fall from the sky into your laptop. It arrives on a cable from your internet provider (the <b>ISP</b>), and then a few boxes pass it along, each with one job.',
		'First comes the <b>modem</b>. It sits where the provider’s cable enters the building and translates that signal into something your gear understands. When the cable is fibre, people call this box an <b>ONT</b>.',
		'Next is the <b>router</b>, the one who knows the way. It gives every device an [[IP address|network/ip-address]] and decides what goes out to the internet and what stays inside.',
		'Then the <b>switch</b>, a box full of ports. Every cable in the office plugs in here, and it passes data straight to the right device.',
		'Last, the <b>access point</b> turns the wired network into radio, so phones and laptops can join without a cable. That radio is the WiFi you know, more on it in [[What is WiFi|network/wifi]].',
		'[ingat] Picture an office building. The modem is the front gate, the router is the receptionist who knows where everyone sits, the switch is the hallway full of doors, and the access point is the loudspeaker for everyone without a cable.',
		'[fyi] At home, the one box your provider installs usually does all four jobs inside a single case. Offices split them apart so each can be bigger and be swapped on its own. In the cloud they turn into settings, like the virtual router inside a [[VPC|networking/vpc]].',
		'Curious what each box is really worth? Tap one to unplug it and see who loses the internet. Tap it again to plug it back in.'
	],
	reactions: {
		noModem:
			'Without the modem, nothing reaches the provider. The PCs can still share files with each other (the LAN inside is fine), but the internet is gone for everyone.',
		noRouter:
			'No router, no way out. Nobody hands out addresses or knows the way to the internet, so everyone is stuck inside. The switch still links the devices to each other.',
		noSwitch:
			'Pull the switch and every cable inside has nowhere to plug in. The PCs and even the access point are cut off, so the whole office goes dark.',
		noAp: 'Only the phone lost its connection. The PCs on cables do not even notice, they never used the radio.',
		fixed: 'Plugged back in, and everyone is online again. Try another box.'
	},
	steps: [
		{
			title: 'From the street to your desk',
			body: 'The internet arrives on one cable from your <b>ISP</b> (internet service provider). A short chain of boxes carries it to every device.'
		},
		{
			title: 'Modem (ONT)',
			body: 'Sits where the provider’s cable comes in and translates its signal. Without it, that cable is unreadable.'
		},
		{
			title: 'Router',
			body: 'Gives every device an address and picks the way, out to the internet or over to another device inside.'
		},
		{
			title: 'Switch',
			body: 'A box full of ports. Every cable plugs in here, and it sends data only to the device it is meant for.'
		},
		{
			title: 'Access point',
			body: 'Turns the wired network into radio (the WiFi) so phones and laptops can join without a cable.'
		},
		{
			tag: 'Make it stick',
			title: 'Gate, receptionist, hallway, loudspeaker',
			body: 'Follow the data inward, <b>modem</b> then <b>router</b> then <b>switch</b>, plus the <b>access point</b> for everyone without a cable.'
		},
		{
			tag: 'FYI',
			title: 'One box at home',
			body: 'A home router usually holds all four inside one case. Offices keep them separate.'
		},
		{
			tag: 'Try it',
			title: 'Unplug one',
			body: 'Tap a box in the picture. Green means online, amber means inside only, red means cut off.'
		}
	],
	parts: {
		modem: { name: 'Modem', memo: 'gate' },
		router: { name: 'Router', memo: 'receptionist' },
		switch: { name: 'Switch', memo: 'hallway' },
		ap: { name: 'Access point', memo: 'loudspeaker' }
	},
	internetLabel: 'From the ISP',
	pcLabel: 'PC {n}',
	phoneLabel: 'Phone',
	homeBoxLabel: 'At home, all in one box',
	status: { online: 'online', local: 'inside only', offline: 'cut off' },
	unplugHint: 'Tap a box in the picture to unplug it'
};
