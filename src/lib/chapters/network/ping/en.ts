import type { PingText } from './types';

export const en: PingText = {
	title: 'Ping and traceroute',
	intro: [
		'nimbus.com feels slow, or will not open at all. Before guessing, a network person asks two calm questions. Is the server even there? And if it is, where along the road does it go wrong?',
		'The first question has a tool called <b>ping</b>. Watch the terminal. Your laptop sends a tiny packet saying "are you there?", and the server answers "here I am". It does that four times, to be sure.',
		'Each answer shows a <b>time</b> in ms (milliseconds, a thousandth of a second). That is the round trip, there and back. The name ping comes from sonar on submarines, a ping goes out and the echo tells you something is there.',
		'But your packet does not jump straight to the server. It is passed from router to router, from your home, to your ISP (your internet provider), across the city, maybe under the sea. Each handoff is called a <b>hop</b>, and that is [[routing|network/routing]] at work.',
		'<b>traceroute</b> (on Windows it is called <b>tracert</b>) lists every hop on the road, with the time to reach each one. If the times suddenly jump, or the list stops, you know roughly where the trouble lives.',
		'[fyi] See the <b>* * *</b> line? Some routers are told not to answer, often by a [[firewall|networking/firewall]]. They are not broken, your packet still passes through them.',
		'[ingat] Ping is the roll call, traceroute is the map. Ping asks "are you there?", traceroute asks "which way did you go?"',
		'Want to try one yourself? Type a command in the terminal, or tap a suggestion. <b>ping 192.168.1.1</b> is fun too, that is your own router.'
	],
	reactions: {
		ping: 'It answered four times, around 24 ms each. nimbus.com is alive, and a round trip is faster than a blink.',
		pingRouter:
			'Your own router answered in about 2 ms, it is right there in your house. Pinging the router is a quick way to check your home network before blaming the internet.',
		trace:
			'There is the whole road. Look at the big jump at the sea cable, that is the long stretch under the water to Singapore.',
		unknown:
			'Your laptop could not even find that name, so nothing was sent. Usually it is a typo. Finding the address behind a name is the job of [[DNS|networking/dns]].',
		error: 'The terminal does not know that one. Try <b>ping nimbus.com</b> or tap a suggestion.'
	},
	steps: [
		{
			title: 'Two questions',
			body: 'Is the server alive? And where along the way does it slow down or stop? Each question has its own tool.'
		},
		{
			tag: 'ping',
			title: 'Are you there?',
			body: 'ping sends a tiny echo request and waits for the echo reply. A reply means the server is alive and reachable.'
		},
		{
			title: 'Round trip time',
			body: 'The <b>time</b> on each line is how long the trip there and back took. Under 50 ms feels instant, hundreds of ms feels sluggish.'
		},
		{
			title: 'Hops',
			body: 'Between you and the server sit several routers. Each one reads the address and passes the packet one step closer.'
		},
		{
			tag: 'traceroute',
			title: 'Every stop on the road',
			body: 'traceroute prints one line per hop, in order, with its time. A sudden jump in time shows where the long stretch is.'
		},
		{
			title: 'Quiet routers',
			body: 'A line of <b>* * *</b> is a router that chose not to reply. As long as the next hops answer, the road is fine.'
		},
		{
			tag: 'Make it stick',
			title: 'Roll call and map',
			body: 'ping answers <b>is it there</b>. traceroute answers <b>which way</b>.'
		}
	],
	youLabel: 'You',
	hops: ['Home router', 'Your ISP', 'ISP core', 'Exchange', 'Sea cable', 'nimbus.com'],
	inputLabel: 'command',
	suggestLabel: 'Suggestions',
	demoHint: '# nothing sent yet',
	termHint: '# your turn, type a command and press Enter',
	hintUnknownCmd: '# try ping nimbus.com or traceroute nimbus.com',
	hintNeedHost: '# add where to, like ping nimbus.com',
	didYouMean: '# maybe you meant {word}',
	hintTimeout: '# nobody answered at that address',
	hintStars: '# * * * is a router that chose not to answer'
};
