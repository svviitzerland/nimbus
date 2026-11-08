import type { RequestJourneyText } from '../../types';

export const en: RequestJourneyText = {
	title: 'From your phone to the server',
	intro: [
		'You just saw the client ask and the server answer. But between your phone and that server lies a very long trip, and the whole thing finishes in the blink of an eye.',
		'The moment you tap open, your request leaves the phone over WiFi to the <b>router</b> in your house. The router is the front gate, every device in your home enters and leaves the internet through it.',
		'Out on the street on mobile data, the first hop is not a router but the nearest <b>cell tower</b>. This is the part that confuses people, if data travels on cables, what are those tall towers for? A cable cannot follow you around. It stops at the router, or at the foot of the tower, and the distance left between there and your phone is crossed by radio, a few metres over WiFi, a few kilometres from a tower.',
		'And the waves stop right there. A router and a tower are both wired into fibre, and from either one your request is handed to your <b>ISP</b> (Internet Service Provider), through cables along the street, between cities, and later even the sea floor.',
		'At its destination, the server reads your request and sends an answer back along the very same road, all the way to the page on your screen. The round trip usually takes just tens of milliseconds.',
		'Now watch it happen. You ride along with your request, and I will explain each time we stop. Try the WiFi and mobile data buttons too, only the first hop changes.',
		'[ingat] A request carries the client’s request. A response carries the server’s reply.'
	],
	/** One line for each place the animation stops. */
	reactions: {
		atPhone:
			'This is your request, just born on the phone. It asks for one thing, please send the nimbus.com page.',
		atHopWifi:
			'The first hop is WiFi, a few metres to the router in your room. Everything after this is cable.',
		atHopCell:
			'The first hop is mobile, a few kilometres to the tower. At the tower your data drops into cable too.',
		inCable:
			'You are inside the cable now, under the pavement you were standing on. It is glass the width of a hair, and your request travels it as a flash of light.',
		underSea:
			'And the cable does not stop at the coast. What you are on now lies on the seabed, thousands of kilometres of it, and nearly all the traffic between continents goes this way.',
		atServer:
			'This is the server, one machine among all the others in this room. It reads your request and puts the page together.',
		back: 'The answer comes home the same way until it is a page on your screen. That whole round trip usually takes tens of milliseconds.'
	},
	watch: 'Watch the trip',
	again: 'Play it again',
	screen: {
		site: 'nimbus.com',
		button: 'Open',
		sending: 'Sending',
		page: {
			title: 'Learn cloud from zero',
			body: 'Play first, understand as you go. Nim walks you through every chapter.',
			cta: 'Start learning',
			cardA: 'Chapter 1, Client & Server',
			cardB: 'Chapter 2, The Cloud'
		}
	},
	modes: { wifi: 'Home WiFi', cell: 'Mobile data' },
	stations: {
		phone: 'Your phone',
		router: 'WiFi router',
		tower: 'Cell tower',
		isp: 'ISP',
		net: 'Global network',
		server: 'Server'
	}
};
