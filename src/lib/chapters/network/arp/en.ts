import type { ExperimentText } from '../../types';

export const en: ExperimentText = {
	title: 'ARP and gateways',
	intro: [
		'We have [[IP|network/ip-address]] and [[MAC|network/mac]] addresses. For IPv4 on this LAN, a computer needs the next receiver’s MAC before sending an Ethernet frame.',
		'<b>ARP</b> asks the local network who owns an IP address. Its owner replies with a MAC address. The result is kept temporarily in the <b>ARP cache</b>.',
		'Send to 192.168.1.20. It is on the same subnet, so the phone looks up that computer’s MAC. Send again and the cache avoids another lookup.',
		'For nimbus.com outside the subnet, the phone looks up the <b>gateway</b> MAC. The packet’s destination IP still identifies the server. The frame’s MAC identifies this local next hop.',
		'[ingat] <b>IP names the destination. MAC names the next local receiver.</b> IPv6 uses Neighbor Discovery rather than ARP.'
	],
	reactions: {
		local: 'The neighboring computer replied. The cache now pairs its local IP with its MAC.',
		remote:
			'The lookup is for the gateway’s MAC, not the internet server’s MAC. The router forwards the packet onward.',
		cached: 'The mapping is cached. The frame can be sent without broadcasting another ARP request.'
	},
	labLabel: 'Your experiment',
	goal: 'Find the next local receiver',
	tasks: ['Send to a neighbor', 'Send outside the network', 'Reuse the cache'],
	hintLabel: 'Hint',
	hint: 'Send to the neighbor, then nimbus.com. Repeat one and watch the cache.',
	scope: 'Local simulation. All examples run in this page without contacting nimbus.com.',
	labels: {
		destination: 'Packet destination',
		local: 'Neighbor 192.168.1.20',
		remote: 'nimbus.com on the internet',
		send: 'Send packet',
		you: 'Your phone',
		router: 'Home router',
		cache: 'Phone ARP cache',
		empty: 'No address mappings yet',
		broadcast: 'ARP looks up',
		cached: 'Cache found',
		frame: 'Frame receiver MAC',
		packet: 'Packet destination IP',
		waiting: 'Choose a destination and send'
	}
};
