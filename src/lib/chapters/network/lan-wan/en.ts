import type { LanWanText } from './types';

export const en: LanWanText = {
	title: 'LAN, WAN, and the internet',
	intro: [
		'Plug two laptops into the same box with cables and they can already send files to each other. That little group is a network, and when it fits in one room or one building it is called a <b>LAN</b> (Local Area Network).',
		'Now your company opens more offices across the city, maybe in other cities too. Each office has its own LAN, and to link them you rent long lines from a telecom company. A network that spreads that wide is a <b>WAN</b> (Wide Area Network).',
		'And the <b>internet</b>? It is not one giant network that somebody owns. It is millions of networks (homes, campuses, companies, internet providers, data centers) all agreeing to pass data for each other. A network of networks.',
		'[fyi] Look at the back of a home router. One port is often labelled <b>WAN</b>, the one facing the outside world, and the others say <b>LAN</b>, facing your room. Same words, shrunk down to one box. You will meet that box in [[network devices|network/devices]].',
		'[ingat] A LAN connects devices within a local area. A WAN connects networks across a wider area. The internet connects many networks.',
		'Let us build it from the inside out. Start in one room, plug everything in, then zoom out until you reach the whole world.'
	],
	reactions: {
		lan: 'That is a LAN. Every device plugs into the switch in the middle, and now they can talk to each other directly and fast, no internet needed. Printers, shared folders, and office game nights all live here.',
		wan: 'The offices are now one WAN. Each still has its own LAN inside, the long lines just stitch them together. Data between offices travels kilometres, so it is a little slower than inside one room.',
		internet:
			'And that is the internet. No center and no single owner, just networks agreeing to carry each other’s data. If one link breaks, the data finds another way around. Your phone reaching nimbus.com hops across several of these networks.'
	},
	levels: {
		lan: {
			tab: 'LAN',
			scope: 'one room',
			hint: 'Tap each device to plug its cable into the switch',
			done: 'One room, one LAN'
		},
		wan: {
			tab: 'WAN',
			scope: 'a city',
			hint: 'Tap each branch office to link it to the head office',
			done: 'Many offices, one WAN'
		},
		net: {
			tab: 'Internet',
			scope: 'the world',
			hint: 'Tap each network to join it to the others',
			done: 'A network of networks, the internet'
		}
	},
	zoomBtn: 'Zoom out',
	againBtn: 'Back to the room',
	switchLabel: 'Switch',
	laptopLabel: 'Laptop',
	pcLabel: 'PC',
	hqLabel: 'Head office',
	branchLabel: 'Branch {n}',
	nets: ['Your company', 'Home ISP', 'Cafe', 'nimbus.com', 'Campus', 'Mobile network']
};
