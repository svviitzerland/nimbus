import type { DdosText } from './types';

export const en: DdosText = {
	title: 'What is DDoS',
	intro: [
		'Think of nimbus.com as a small shop with a few cashiers. The server behind it has only so much computing power and so much internet cable, so it can only serve so many visitors per second.',
		'Now picture a crowd of fake customers who walk in, ask a silly question, and never leave. Real customers cannot even reach the counter. That is a <b>denial of service</b> attack, DoS for short. Nothing gets stolen, the goal is simply to keep everyone else out.',
		'One troublemaker is easy, you just block that one address. So attackers use thousands of devices at once, a <b>distributed</b> denial of service, or <b>DDoS</b>. The devices usually belong to strangers who have no idea, hacked computers, cameras, and home routers, all bundled into a <b>botnet</b>.',
		'In October 2016 a botnet called <b>Mirai</b>, built mostly from cameras and routers still using their factory passwords, flooded a DNS company named Dyn. For hours many people in the US and Europe could not open Twitter, Netflix, Reddit, and plenty of others.',
		'[fyi] In 2018 GitHub was hit by a flood of 1.35 terabits per second, one of the biggest ever seen at the time. With help from a DDoS protection service it was back up in about ten minutes.',
		'Defenders fight back with a <b>rate limit</b> (each address only gets so many requests per second) and a [[CDN|traffic/cdn]], hundreds of servers around the world that soak up the flood far from yours. Start the flood, then keep nimbus.com open for real visitors, even with the botnet at its biggest.'
	],
	reactions: {
		flood:
			'Down it goes. Those red dots are junk requests from the botnet, and the green ones are real people. The server is so busy answering junk that almost no real visitor gets a turn.',
		rateWin:
			'Back up. Each bot may send only a few requests per second now, and a real person clicking around never hits that limit. Against a small botnet this alone is enough. Try making the botnet bigger.',
		rateLose:
			'The rate limit helps, but there are simply too many bots. Each one stays politely under the limit, and together they still bury the server. You need something with a lot more room.',
		cdnWin:
			'The shield holds. The CDN spreads the flood over many edge servers around the world, so each one only feels a small piece. Most junk never even reaches your server.',
		cdnLose:
			'Even the CDN is struggling at this size, every bot is firing at full speed. Is there a way to make each bot send less?',
		down: 'Too much traffic, real visitors are getting turned away again. Try a different mix of defenses.',
		holding: 'Still standing. Try pushing the botnet bigger and see whether your defenses keep up.',
		saved:
			'Ten thousand bots and nimbus.com is still open for real people. The rate limit makes every bot weak, and the CDN gives you room to absorb the rest. Behind the shield a [[load balancer|traffic/load-balancer]] shares out what is left, and if a whole region still falls, [[failover|resilience/failover]] steps in.'
	},
	startBtn: 'Start the flood',
	stopBtn: 'Stop the flood',
	sizeLabel: 'Botnet size',
	rateToggle: 'Rate limit',
	cdnToggle: 'CDN shield',
	on: 'on',
	off: 'off',
	visitorsLabel: 'Real visitors',
	botsLabel: '{n} hijacked devices',
	cdnLabel: 'CDN edge servers',
	serverLabel: 'nimbus.com',
	rps: '{n} requests per second',
	served: 'Real visitors getting in, {n}%',
	calm: 'A quiet day, every visitor gets in',
	states: { up: 'online', slow: 'very slow', down: 'down' },
	numberLocale: 'en-US'
};
