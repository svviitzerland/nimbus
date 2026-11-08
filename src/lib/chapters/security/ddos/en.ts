import type { DdosText } from './types';

export const en: DdosText = {
	title: 'What is DDoS',
	intro: [
		'The nimbus.com server has limited computing and network capacity. Requests can slow down or fail when load exceeds that capacity.',
		'<b>Denial of service</b>, or DoS, disrupts service availability. Here excessive traffic consumes capacity and prevents other visitors from accessing the site.',
		'<b>Distributed denial of service</b>, or DDoS, uses multiple attack sources. Some attacks use a botnet, a collection of devices controlled by an attacker.',
		'In October 2016 a botnet called <b>Mirai</b>, built mostly from cameras and routers still using their factory passwords, flooded a DNS company named Dyn. For hours many people in the US and Europe could not open Twitter, Netflix, Reddit, and plenty of others.',
		'[fyi] In 2018 GitHub was hit by a flood of 1.35 terabits per second, one of the biggest ever seen at the time. With help from a DDoS protection service it was back up in about ten minutes.',
		'[ingat] DDoS disrupts availability through excessive traffic or work. Defenses must suit the attack type and network capacity.',
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
