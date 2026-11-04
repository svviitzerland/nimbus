import type { DynamicRoutingText } from './types';

export const en: DynamicRoutingText = {
	title: 'Dynamic routing',
	intro: [
		'In [[Routers and routing|network/routing]] every signpost was written by hand. That works for three routers. An internet provider runs thousands, and somewhere a digger cuts a cable almost every day.',
		'Like right now. The road the packets were using just snapped. With hand written signposts, someone would have to wake up at three in the morning and fix every one of them.',
		'So routers talk to each other instead. Each one keeps telling its neighbours which roads it can reach. When a road breaks, the news spreads from router to router in about a second. That is <b>dynamic routing</b>.',
		'Every router redraws its own map and picks a new way by itself. Inside one company this chatter is usually <b>OSPF</b>, and it picks the shortest road that still works. Nobody woke up.',
		'[ingat] Two names are enough for now. OSPF talks inside one network, like the hallways of one building. BGP talks between networks, B for Border.',
		'The internet is thousands of networks (your provider, Google, Facebook) stitched together with <b>BGP</b>. Each one announces "these addresses live with me", and everyone else simply believes it. Here is a short true story about that trust.',
		'4 October 2021. During routine maintenance, a command at Facebook accidentally cut every link inside its own backbone. Its DNS servers (the address books from [[DNS|networking/dns]]) noticed they were cut off and, just as designed, stopped announcing.',
		'Within minutes Facebook vanished from every map on the internet, and Instagram and WhatsApp with it. The servers were still running. Billions of phones kept asking, and every router answered "no idea where that is".',
		'Engineers had to go to the data centres in person, and it took about six hours to put Facebook back on the map. If you like, pull the announcement yourself and watch the internet forget.'
	],
	reactions: {
		withdraw:
			'The announcement is gone, so the provider erases Facebook from its map. Every packet now stops right there, even though the servers are fine.',
		announce:
			'Announced again. The provider learns the road back within seconds, and the phone gets through. That is how fragile and how powerful one BGP line is.'
	},
	steps: [
		{
			title: 'Many roads',
			body: 'Real networks have lots of routers and more than one road between them, so there is almost always another way.'
		},
		{
			title: 'A broken road',
			body: 'Cables get cut and routers crash. A signpost that still points at a broken road sends packets into nowhere.'
		},
		{
			title: 'Routers talk',
			body: 'Each router tells its neighbours which roads it can reach. News of a broken road spreads in about a second.'
		},
		{
			title: 'A new way',
			body: 'Every router works out the best road left, by itself. Inside one company this is <b>OSPF</b> (Open Shortest Path First).'
		},
		{
			tag: 'Rule of thumb',
			title: 'O inside, B at the border',
			body: '<b>OSPF</b> inside one network. <b>BGP</b> (Border Gateway Protocol) between networks.'
		},
		{
			title: 'BGP announcements',
			body: 'Each network tells the world which addresses it owns. Your provider writes that on its map and sends you that way.'
		},
		{
			tag: '4 October 2021',
			title: 'The announcement stops',
			body: 'The backbone inside Facebook went down, so its DNS servers stopped announcing. The rest of the internet erased the road.'
		},
		{
			tag: '4 October 2021',
			title: 'Gone from the map',
			body: 'With no announcement, no router knew where Facebook was. The servers were fine, nobody could find them.'
		},
		{
			tag: 'About six hours later',
			title: 'Back on the map',
			body: 'The backbone was fixed on site, the announcements came back, and so did Facebook, Instagram and WhatsApp.'
		}
	],
	officeLabel: 'Office',
	dcLabel: 'Data centre',
	brokenTag: 'cut',
	phoneLabel: 'Your phone',
	providerLabel: 'Your provider',
	fbLabel: 'Facebook',
	dnsLabel: 'DNS',
	fbDcLabel: 'Data centres',
	mapTitle: "Provider's map",
	mapKnown: 'Facebook, that way',
	mapGone: 'Facebook, unknown',
	announce: 'Facebook lives here',
	lostTag: 'where?',
	pullBtn: 'Pull the announcement',
	backBtn: 'Announce again'
};
