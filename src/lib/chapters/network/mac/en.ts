import type { MacText } from './types';

export const en: MacText = {
	title: 'MAC addresses and ARP',
	intro: [
		'Picture the nimbus.com office. A laptop, a printer, a TV, and a phone all share one network inside the room. A small network like this is called a <b>LAN</b> (local area network).',
		'Each of them got an [[IP address|network/ip-address]] when it joined, like 192.168.1.20 for the printer. Think of it as the address of the desk it sits at.',
		'But every network card also carries a second number, put there at the factory. It is the <b>MAC address</b>, six pairs of letters and numbers, and no two cards in the world are meant to share one.',
		'[ingat] Here is the easy way to keep them apart. The MAC is the name tag sewn into the device, it never changes. The IP is the address you are given, so it changes when you move. Watch the phone walk from the office to a cafe.',
		'Now your laptop wants to print. It knows the printer sits at 192.168.1.20, but inside the room the cable delivers by name tag. So it asks the whole room out loud, "who has 192.168.1.20?" That question is <b>ARP</b>.',
		'Everyone hears it (a message to everyone is a <b>broadcast</b>), but only the printer answers with its name tag. The laptop writes it down in its <b>ARP table</b>, so next time it will not need to ask.',
		'Now the print job goes straight to that one name tag. The TV and the phone never even see it. Out comes nimbus.pdf.',
		'[fyi] A MAC only matters inside one room. When a packet leaves through the router, its name tag labels get swapped at every stop, while the IP stays the same all the way. That is the line between layer 2 and layer 3 from the [[layers lesson|networking/layers]].',
		'That is the whole trick, ask by IP, deliver by MAC. If you are curious, ask the room about an address nobody owns and see what happens.'
	],
	reactions: {
		nobody:
			'Silence. Nobody in the room owns 192.168.1.99, so nobody answers and the laptop gives up. When a device on your LAN seems unreachable, a quiet ARP like this is often the reason.'
	},
	steps: [
		{
			title: 'One room, one LAN',
			body: 'Devices in the same room are linked by a switch or by WiFi, and can talk to each other directly.'
		},
		{
			title: 'IP address',
			tag: 'given',
			body: 'An address handed out by the network when a device joins. It says <b>where</b> the device is right now.'
		},
		{
			title: 'MAC address',
			tag: 'built in',
			body: 'A name tag set at the factory, like <b>00:1B:A9:4C:22:10</b>. It says <b>who</b> the device is.'
		},
		{
			title: 'Tag stays, address changes',
			tag: 'make it stick',
			body: 'Same phone, same name tag. A new network gives it a new IP.'
		},
		{
			title: 'ARP, asking the room',
			body: 'The laptop has the IP but needs the MAC, so it sends one question to every device in the room.'
		},
		{
			title: 'Only the owner answers',
			body: 'The printer replies with its MAC. The laptop saves the pair (IP and MAC) in its ARP table for a few minutes.'
		},
		{
			title: 'Delivered by name tag',
			body: 'With the MAC known, the data goes to that one device only. No more shouting.'
		},
		{
			title: 'Inside one room only',
			tag: 'by the way',
			body: 'MAC labels are local. IP addresses are what carry a packet across the internet.'
		},
		{
			title: 'Ask by IP, deliver by MAC',
			tag: 'your turn',
			body: 'Optional. Ask about <b>192.168.1.99</b> and watch the room stay quiet.'
		}
	],
	roomLabel: 'LAN at the nimbus.com office',
	names: { you: 'Your laptop', printer: 'Printer', tv: 'TV', phone: 'Phone' },
	officeLabel: 'Office WiFi',
	cafeLabel: 'Cafe WiFi',
	shout: 'who has {ip}?',
	itsMe: 'that is me',
	silence: 'nobody answers',
	printed: 'printed',
	tableTitle: "Your laptop's ARP table",
	ipHead: 'IP',
	macHead: 'MAC',
	ghostBtn: 'Ask who has {ip}'
};
