import type { RoutingText } from './types';

export const en: RoutingText = {
	title: 'Routers and routing',
	intro: [
		'When you open nimbus.com, your laptop wraps the request in a tiny envelope called a <b>packet</b> (you met it in [[Layers and packets|networking/layers]]). Look at it sitting on your laptop, ready to go.',
		'The packet never flies straight to the server. First it hops to the box at home, a <b>router</b>. Routers sit wherever cables meet, like junctions on a road.',
		'Now it reaches the router at your internet provider. The router reads the address on the label, and only the label. It never opens the envelope.',
		'Beside every router stands a signpost, its <b>routing table</b>. Each arm says "for this address, take that road". The arm for nimbus.com points to the next router.',
		'So the router passes the packet along and forgets about it. The next router reads the label, checks its own signpost, and does the same. Hop by hop, the packet arrives.',
		'[ingat] A router is a post office sorting letters. It reads the address, drops the letter on the right road, and is done. Nobody drives the letter all the way.',
		'And when no arm matches? The router never guesses, it throws the packet away. That is why almost every router has one arm marked "everything else", the <b>default route</b>. Your home router lives on basically that one arm.',
		'[fyi] Same word, different world. A cloud network (a [[VPC|networking/vpc]]) has route tables too. You fill in the lines from a web page instead of touching a box, but the idea is exactly the same.',
		'That is routing, a chain of signposts. If you are curious, knock the signpost at the provider over and watch what happens to the next packet.'
	],
	reactions: {
		knocked:
			'Gone. The provider router read the label, found no arm for nimbus.com, and dropped the packet right there. One missing line can cut off a whole website.',
		fixed:
			'Signpost back up, and the packets flow again. That is why network people guard their routing tables so carefully.'
	},
	steps: [
		{
			title: 'A packet',
			body: 'A small envelope of data. Its label carries the destination address, here the nimbus.com server at <b>203.0.113.10</b>.'
		},
		{
			title: 'A router',
			body: 'A box that sits where networks meet. Its one job is to move each packet one step closer to where it is going.'
		},
		{
			title: 'Reading the label',
			body: 'The router looks only at the destination address. What is inside the packet does not matter to it.'
		},
		{
			title: 'Routing table',
			body: 'A short list inside the router. Each line pairs a destination with the neighbour to hand it to, called the <b>next hop</b>.'
		},
		{
			title: 'Hop by hop',
			body: 'No router knows the whole road. Each one only knows the next step, and together that is enough.'
		},
		{
			tag: 'Rule of thumb',
			title: 'Read, pick, pass',
			body: 'Read the address, pick the arm that matches, pass the packet to the next hop. Every router does only this.'
		},
		{
			title: 'Default route',
			body: 'The catch all line. Anything the table does not know goes to the provider, which knows far more roads.'
		},
		{
			title: 'Also in the cloud',
			body: 'Cloud networks have <b>route tables</b> that work the same way. You just edit them from a web page.'
		},
		{
			title: 'One missing arm',
			body: 'Without a matching line, the packet is dropped on the spot. Routers never guess.'
		}
	],
	laptopLabel: 'Your laptop',
	homeRouter: 'Home router',
	ispRouter: 'Provider router',
	nextRouter: 'Next router',
	otherLabel: 'Other networks',
	serverLabel: 'nimbus.com',
	serverSub: '203.0.113.10',
	packetTo: 'to 203.0.113.10',
	signNimbus: 'nimbus.com',
	signOther: 'others',
	signDefault: 'everything else',
	droppedTag: 'dropped',
	knockBtn: 'Knock the signpost over',
	fixBtn: 'Put the signpost back'
};
