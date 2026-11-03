import type { RoutingText } from './types';

export const en: RoutingText = {
	title: 'Routers and routing',
	intro: [
		'When you open nimbus.com, your packet almost never flies straight to the server. It hops through a chain of boxes across the city, maybe across the sea. Each of those boxes is a <b>router</b>.',
		'Remember from [[Layers and packets|networking/layers]], every packet carries a label with its destination address. A router reads that label, then looks it up in its <b>routing table</b>, a short list that says "to reach this network, hand it to that neighbour". That neighbour is called the <b>next hop</b>.',
		'Think of a signpost at every junction. A router does not know the whole road to nimbus.com, it only knows which way to point next. The next router does the same, hop by hop, until the packet arrives.',
		'And if nothing in the table matches? The router simply drops the packet, it never guesses. That is why almost every router has a <b>default route</b>, one line that says "anything else, send it to the ISP". Your router at home runs on basically that one line.',
		'[fyi] Same word, different world. A cloud network (a [[VPC|networking/vpc]]) has route tables too. You never touch a physical box there, you fill in the lines from a web console, but the idea is exactly the same.',
		'Here Router A sits between your office laptop and the internet, and its table is still empty. Send a packet to nimbus.com, give Router A a route, then try deleting it.'
	],
	reactions: {
		noRoute:
			'Router A read the label, found nothing for 203.0.113.0/24 in its table, and dropped the packet on the spot. Routers never guess. Give it a route.',
		added:
			'A new line in the table. Router A now knows which neighbour gets packets for nimbus.com. Send one and see if you pointed the right way.',
		wrongWay:
			'Router C got the packet, but its own table only knows the office files. Nothing for nimbus.com, so it drops it too. One wrong line and the packet gets lost on the road. Point the route at Router B.',
		delivered:
			'It arrived! A handed it to B, B knew where the server lives, and the server got it. Each router only knew its next step, yet together they found the way. Now delete that route and send again.',
		deleted: 'The line is gone, like a signpost knocked over. What happens to the next packet?',
		lost: 'Lost, right where the signpost used to be. A single missing line can cut off a whole website, which is why network admins guard their routing tables so carefully.'
	},
	laptopLabel: 'Your laptop',
	routerA: 'Router A',
	routerB: 'Router B',
	routerC: 'Router C',
	knowsB: 'knows nimbus.com',
	knowsC: 'knows office files',
	serverLabel: 'nimbus.com',
	serverSub: '203.0.113.10',
	filesLabel: 'Office files',
	packetChip: 'to 203.0.113.10',
	tableTitle: 'Routing table of {name}',
	destCol: 'Destination',
	hopCol: 'Next hop',
	destValue: '203.0.113.0/24',
	emptyRow: 'No routes yet',
	pickHop: 'Add a route to nimbus.com through',
	viaB: 'Router B',
	viaC: 'Router C',
	deleteBtn: 'Delete route',
	sendBtn: 'Send a packet',
	noteIdle: 'The packet is addressed to 203.0.113.10, the nimbus.com server',
	noteDelivered: 'Delivered, hop by hop',
	noteNoRoute: '{name} has no matching route, packet dropped',
	noteWrong: '{name} has no route to nimbus.com either, packet dropped',
	lostTag: 'dropped',
	okTag: 'arrived'
};
