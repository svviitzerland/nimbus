import type { MacText } from './types';

export const en: MacText = {
	title: 'MAC addresses and ARP',
	intro: [
		'Picture the nimbus.com office. A laptop, a printer, a TV, and a few phones all share one network inside the building. That small network is a <b>LAN</b> (local area network).',
		'Each of them already has an [[IP address|network/ip-address]], like 192.168.1.20 for the printer. But inside the room, the IP is not the whole story.',
		'A network interface also uses a <b>MAC address</b>, usually written as six pairs of hexadecimal digits. It has a factory address, but software can use a different one. Modern phones often randomize their WiFi MAC to improve privacy.',
		'On Ethernet, a frame is sent to a destination <b>MAC address</b> on the local link. A device needs to find the MAC for the local IP it wants to reach.',
		'The laptop knows the printer’s IP, 192.168.1.20, but not its MAC. It sends an <b>ARP</b> request to find the device with that IP.',
		'The ARP request is sent as a <b>broadcast</b> on the local network. The printer replies with its MAC. The laptop temporarily caches the mapping in its ARP table.',
		'[fyi] On Ethernet, a MAC label delivers a frame to the next hop. A router creates a new frame when forwarding the packet. IP addresses usually stay the same unless something translates them, like [[NAT|network/nat]]. This connects [[layers 2 and 3|networking/layers]].',
		'[ingat] IP helps choose the destination. MAC helps deliver to a neighbor on the local network. ARP matches that neighbor’s IP to its MAC. A MAC can change, so it is not a permanent identity for a person.',
		'Find the printer’s MAC with ARP, then send nimbus.pdf to it.'
	],
	reactions: {
		reply:
			'Everyone heard the question, but only the printer said "that is me" and sent back its MAC. The others just ignored it. Your laptop wrote the answer in its ARP table.',
		print:
			'Now the print job goes straight to the printer name tag, no shouting needed. The TV and the phone never even see it. Try asking about a few more addresses.',
		tv: 'The TV owns 192.168.1.30, so the TV answered this time. Another row in the table, one less shout for later.',
		nobody:
			'No device replied for 192.168.1.99. Check that the device is active and the destination address is correct.',
		cached:
			'No shouting this time. The laptop already has that MAC in its ARP table, so it goes straight there. Real computers keep these rows for a few minutes, then forget and ask again.'
	},
	roomLabel: 'LAN at the nimbus.com office',
	youLabel: 'Your laptop',
	names: { printer: 'Printer', tv: 'TV', phone: 'Phone', laptop: "Dina's laptop" },
	ipWord: 'IP',
	macWord: 'MAC',
	shout: 'who has {ip}?',
	itsMe: 'that is me',
	notMe: 'not me',
	printed: 'printed',
	askBtn: 'Ask who has {ip}',
	printBtn: 'Send the print job',
	moreLabel: 'Ask about another address',
	askTv: 'Who has {ip}',
	askNobody: 'Who has {ip}',
	tableTitle: "Your laptop's ARP table",
	tableEmpty: 'Still empty, it knows no name tags yet',
	ipHead: 'IP',
	macHead: 'MAC',
	frameLabel: 'to',
	notes: {
		idle: 'The laptop knows the printer IP, but not its MAC',
		shouting: 'ARP request broadcast on the local network',
		answered: 'Only the owner of that IP answers',
		printing: 'This time it goes to one MAC only',
		printed: 'Delivered by name tag, straight to the printer',
		cached: 'Mapping still available in the ARP table',
		nobody: 'No ARP reply for this IP'
	}
};
