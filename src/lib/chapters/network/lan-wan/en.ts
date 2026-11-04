import type { LanWanText } from './types';

export const en: LanWanText = {
	title: 'LAN, WAN, and the internet',
	intro: [
		'Plug two laptops into the same little box with cables, and they can already send files to each other. That tiny group is a <b>network</b>.',
		'When a network fits in one room or one building, it is called a <b>LAN</b>, a Local Area Network. The box in the middle is a <b>switch</b>, and every cable in the room plugs into it.',
		'Now your company opens more offices around the city. Each office keeps its own LAN, and long lines rented from a telecom company stitch them together. A network that spreads that wide is a <b>WAN</b>, a Wide Area Network.',
		'And the <b>internet</b>? It is not one giant network that somebody owns. It is millions of networks (homes, campuses, companies, internet providers) agreeing to carry data for each other. A network of networks.',
		'[ingat] L is for Local, one building. W is for Wide, a whole city or even a country. And the internet is every one of them joined together. Small, big, worldwide.',
		'[fyi] Look at the back of a home router. One port says <b>WAN</b>, the one facing the outside world, and the others say <b>LAN</b>, facing your rooms. The same words, shrunk into one box. You will meet that box in [[network devices|network/devices]].',
		'Want to fly around yourself? Tap LAN, WAN, or Internet and the camera zooms right there.'
	],
	reactions: {
		lan: 'Back in the room. Every device plugs into the switch, so they talk to each other directly and fast, no internet needed. Printers and shared folders live here.',
		wan: 'The whole company, one WAN. Each office still has its own LAN inside, the long lines just stitch them together. Data between offices travels kilometres, so it is a little slower than inside one room.',
		internet:
			'The whole world. No center and no single owner, just networks agreeing to carry each other’s data. If one link breaks, the data finds another way around. Your phone reaching nimbus.com hops across several of these.'
	},
	steps: [
		{
			title: 'Network',
			body: 'Two or more devices joined so they can send data to each other. A few cables and one box are enough.'
		},
		{
			title: 'LAN',
			body: '<b>Local Area Network</b>. One room or one building, fast and private. Every cable meets at the switch.'
		},
		{
			title: 'WAN',
			body: '<b>Wide Area Network</b>. Several LANs in different places, linked by long lines rented from a telecom company.'
		},
		{
			title: 'Internet',
			body: 'Millions of networks agreeing to pass data along. Nobody owns all of it, and data can go around a broken link.'
		},
		{
			tag: 'Make it stick',
			title: 'L for Local, W for Wide',
			body: '<b>LAN</b> is one building, <b>WAN</b> is a city or a country, and the <b>internet</b> is all of them joined.'
		},
		{
			tag: 'FYI',
			title: 'On your router too',
			body: 'The port facing the outside world is labelled WAN. The ports facing your rooms are labelled LAN.'
		},
		{
			tag: 'Try it',
			title: 'Fly around',
			body: 'Tap a level above and the camera zooms there. Notice the room is still inside, just very small.'
		}
	],
	levels: { lan: 'LAN', wan: 'WAN', net: 'Internet' },
	zoomLabel: 'Zoom to',
	switchLabel: 'Switch',
	hqLabel: 'Head office',
	branchLabel: 'Branch {n}',
	nets: ['Your company', 'Home ISP', 'Cafe', 'nimbus.com', 'Campus', 'Mobile network']
};
