import type { DynamicRoutingText } from './types';

export const en: DynamicRoutingText = {
	title: 'Dynamic routing',
	intro: [
		'In [[Routers and routing|network/routing]] you wrote a route by hand. That is fine for three routers. An ISP has thousands, though, and somewhere a digger cuts a cable almost every day.',
		'If every route were written by hand, someone would have to wake up at three in the morning and fix dozens of tables each time a cable broke. Nobody could keep up.',
		'So routers talk to each other. Each one tells its neighbours which roads it has and how long they are. When a road breaks, the news spreads, and every router works out a new way by itself. That is <b>dynamic routing</b>.',
		'Inside one company the usual language is <b>OSPF</b> (Open Shortest Path First). Every router learns the whole map of the company network, each link gets a <b>cost</b> (lower means faster), and the cheapest path wins.',
		'Between whole networks on the internet (your ISP, Google, Facebook, each one is an <b>autonomous system</b> with its own number) they speak <b>BGP</b> (Border Gateway Protocol). Each network announces "these addresses can be reached through me", and the rest of the internet believes it.',
		'That trust is powerful and fragile. On 4 October 2021, one routine command made Facebook, Instagram and WhatsApp vanish from the whole internet for about six hours. You are about to replay it.',
		'Act one, cut links in a company network and watch OSPF find a new road. Act two, zoom out to the internet and relive the Facebook outage one moment at a time.'
	],
	reactions: {
		rerouted:
			'Snip! The routers next to the cut noticed first, told their neighbours, and the news flooded the whole network in a blink. Everyone recalculated and traffic now takes the next cheapest road. Nobody touched a single table.',
		sameRoad:
			'The routers still spread the news, but that cable was not on the cheapest road, so traffic keeps flowing the same way. Try cutting one of the blue links.',
		restoredLink:
			'The link is back, and the routers quietly switch back to the cheapest road on their own too.',
		noPath:
			'No road left at all. Even the smartest protocol cannot invent a cable, which is why real networks always build spare links. Put one back.',
		bgpAct:
			'Now zoom out. Every box here is a whole network. Before anything breaks, open facebook.com from your phone and see it work.',
		tryOk:
			"It opens. Behind the scenes your phone first asked Facebook's own [[DNS|networking/dns]] servers for the address, and your ISP knew the road to them only because Facebook announced it over BGP.",
		backbone:
			"A command meant to measure how much capacity the backbone had did something else. It took down every link between Facebook's data centres at once. A tool that should have blocked the command had a bug and let it through.",
		withdraw:
			"Facebook's DNS servers could not reach any data centre, so they assumed they were broken and stopped announcing themselves over BGP (they were built to do exactly that). Within minutes every network on earth forgot the road to them.",
		tryFail:
			'Your phone asks where facebook.com is, and nobody knows the way to ask. Not slow, simply gone. Facebook, Instagram, WhatsApp and Messenger all at once, while resolvers everywhere got flooded with retries.',
		onsite:
			"The painful part was that Facebook's own internal tools ran on that same broken network, so nothing could be fixed remotely. Engineers had to get into the data centres in person, and those buildings are designed to be very hard to get into.",
		restored:
			'About six hours later the backbone was back, the DNS servers announced themselves again, and BGP spread the news across the world in minutes. One command, one withdrawn announcement, and billions of people felt it.'
	},
	acts: ['OSPF', 'BGP'],
	actLabel: 'Act {n}',
	nextAct: 'On to BGP',
	ospf: {
		routers: ['Jakarta', 'Bandung', 'Semarang', 'Yogyakarta', 'Surabaya'],
		startTag: 'office',
		endTag: 'server',
		cutHint: 'Each number is a link cost. Tap one to cut that cable.',
		pathLabel: 'Path now',
		costLabel: 'cost {n}',
		noPath: 'No road to Surabaya',
		flooding: 'Routers are telling each other about the change',
		restoreBtn: 'Fix every cable',
		cutAria: 'Cut or repair the link between {a} and {b}'
	},
	bgp: {
		phoneLabel: 'Your phone',
		ispLabel: 'Your ISP',
		netLabel: 'The internet',
		fbLabel: 'Facebook network',
		dnsLabel: 'DNS servers',
		dcLabel: 'Data centres',
		tableTitle: 'What your ISP learned over BGP',
		routeEntry: 'Facebook DNS, through AS32934',
		withdrawn: 'withdrawn',
		tryBtn: 'Open facebook.com',
		tryOk: 'facebook.com loaded',
		tryFail: 'facebook.com not found',
		steps: [
			{
				btn: 'Run the maintenance command',
				time: '4 October 2021, about 3.40 pm UTC',
				note: 'The backbone between data centres goes dark'
			},
			{
				btn: 'DNS servers check themselves',
				time: 'A few minutes later',
				note: 'The BGP announcement is pulled'
			},
			{
				btn: 'Send engineers on site',
				time: 'The next few hours',
				note: 'Engineers head to the data centres in person'
			},
			{
				btn: 'Bring the backbone back',
				time: 'About six hours after it began',
				note: 'Announced again, the world finds Facebook'
			}
		],
		startNote: 'A normal Monday, everything is announced and reachable'
	}
};
