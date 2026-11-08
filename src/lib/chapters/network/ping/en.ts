import type { PingText } from './types';

export const en: PingText = {
	title: 'Ping and traceroute',
	intro: [
		'nimbus.com feels slow, or will not open at all. Before guessing, a network person asks two simple questions. Is the server even there? And where along the way does it go wrong?',
		'The first question has a tool called <b>ping</b>. Your computer sends a tiny packet saying "are you there?", and the server answers "here I am". The time it takes to come back is measured in milliseconds (ms, a thousandth of a second).',
		'The name comes from sonar on submarines. A sound goes out, bounces off something, and the echo tells you it exists and how far it is. Ping works the same way, with packets instead of sound.',
		'But your packet does not jump straight to the server. It is passed from router to router, from your home, to your ISP, across cities, maybe across the sea. Each handoff is called a <b>hop</b>, and that is [[routing|network/routing]] at work.',
		'<b>traceroute</b> (on Windows it is <b>tracert</b>) lists every hop on the way, with the time to reach each one. If the times suddenly jump, or the list stops, you know roughly where the trouble lives.',
		'[fyi] Some routers stay quiet and show up as <b>* * *</b>. They are not broken, they are just told not to answer, often by a [[firewall|networking/firewall]]. The packet still passes through them.',
		'[ingat] Ping tests ICMP replies and round trip time. Traceroute attempts to show the hops along a path. No reply does not necessarily mean a device is down.',
		'The terminal is yours. First ping nimbus.com to see if it is alive, then traceroute it to see the whole road. Stuck? Tap Help and the command gets typed for you.'
	],
	reactions: {
		ping: 'It answered four times, each around 24 ms. So nimbus.com is alive, and a round trip is faster than a blink. But ping only knows the two ends, everything between is still a mystery.',
		pingRouter:
			'Your own router answered in about 2 ms, because it is right there in your house. Pinging the router is a quick way to check your home network before blaming the internet.',
		trace:
			'There is the whole road. Your router, your ISP, a quiet one, the exchange in Jakarta, then the sea cable to Singapore where the server lives. See the big jump at Singapore? That is the distance under the sea.',
		unknown:
			'Your computer could not even find that name, so no packet was sent. Usually it is a typo in the address, or the name really does not exist. Finding the address behind a name is the job of [[DNS|networking/dns]].',
		error:
			'The terminal does not know that command. Try <b>ping nimbus.com</b> or <b>traceroute nimbus.com</b>, or tap Help.',
		done: 'Both done! Ping told you the server is alive and how far it feels, traceroute showed you every hop on the way. Together they are the first tools anyone reaches for when the network acts up.'
	},
	missionsLabel: 'Missions',
	missions: ['Ping nimbus.com', 'Traceroute nimbus.com'],
	hintBtn: 'Help',
	doneNote: 'Both missions done',
	inputLabel: 'command',
	termHint: '# type a command, then press Enter',
	hintUnknownCmd: '# try ping nimbus.com or traceroute nimbus.com',
	hintNeedHost: '# add where to, like ping nimbus.com',
	didYouMean: '# maybe you meant {word}',
	hintTimeout: '# nobody answered at that address',
	hintStars: '# * * * is a router that chose not to answer',
	routeLabel: 'The road to nimbus.com',
	youLabel: 'Your laptop',
	hops: [
		{ name: 'Home router', place: 'your house' },
		{ name: 'Your ISP', place: 'Jakarta' },
		{ name: 'ISP backbone', place: 'Jakarta' },
		{ name: 'Internet exchange', place: 'Jakarta' },
		{ name: 'Sea cable landing', place: 'Singapore' },
		{ name: 'nimbus.com server', place: 'Singapore' }
	],
	hiddenHop: 'hidden from ping',
	quietTag: 'stayed quiet',
	roundTrip: '{ms} ms round trip'
};
