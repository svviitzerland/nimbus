import type { MacText } from './types';

export const en: MacText = {
	title: 'MAC addresses and ARP',
	intro: [
		'Picture the nimbus.com office. A laptop, a printer, a TV, and a few phones all share one network inside the building. That small network is a <b>LAN</b> (local area network).',
		'Each of them already has an [[IP address|network/ip-address]], like 192.168.1.20 for the printer. But inside the room, the IP is not the whole story.',
		'Every network card is born with a second number, burned in at the factory. It is the <b>MAC address</b>, six pairs of letters and numbers, and no two cards in the world are meant to share one. Flip over a WiFi router and you will often find it printed on the sticker.',
		'Think of the IP as the desk number on the office plan, and the MAC as the name tag of the person sitting there. Inside the room, the cable delivers by name tag. So knowing the desk number is not enough, you also need the name tag.',
		'Your laptop knows the printer sits at 192.168.1.20, but not its name tag. So it simply asks the whole room out loud, "who has 192.168.1.20?" That question is <b>ARP</b> (Address Resolution Protocol).',
		'A message to everyone in the room is called a <b>broadcast</b>. Everyone hears it, only the owner answers, and the laptop writes the answer in its <b>ARP table</b>, a little memory so it does not have to shout again next time.',
		'[fyi] MAC addresses only matter inside one room. When a packet leaves through the router, its MAC labels get swapped at every stop, while the IP stays the same all the way to the end. That is the line between layer 2 and layer 3 from the [[layers lesson|networking/layers]].',
		'You want to print nimbus.pdf. Ask the room who has the printer address, then send the job.'
	],
	reactions: {
		reply:
			'Everyone heard the question, but only the printer said "that is me" and sent back its MAC. The others just ignored it. Your laptop wrote the answer in its ARP table.',
		print:
			'Now the print job goes straight to the printer name tag, no shouting needed. The TV and the phone never even see it. Try asking about a few more addresses.',
		tv: 'The TV owns 192.168.1.30, so the TV answered this time. Another row in the table, one less shout for later.',
		nobody:
			'Silence. Nobody in the room owns 192.168.1.99, so no one answers. When your computer says a device is unreachable inside the LAN, a silent ARP like this is often the reason.',
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
		shouting: 'A broadcast, every device in the room hears it',
		answered: 'Only the owner of that IP answers',
		printing: 'This time it goes to one MAC only',
		printed: 'Delivered by name tag, straight to the printer',
		cached: 'Already in the table, no need to ask the room',
		nobody: 'No device owns that IP, so the room stays quiet'
	}
};
