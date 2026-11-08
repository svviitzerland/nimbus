import type { QosText } from './types';

export const en: QosText = {
	title: 'What is QoS',
	intro: [
		'Monday morning at the nimbus.com office. Someone is on a video call with a client, someone sneaks in a quick game, and someone starts downloading a 40 GB update. All of it squeezes through one internet line.',
		'Remember [[bandwidth|trafficflow/bandwidth-throughput]], every line has a ceiling. When more data arrives than the line can carry, the router makes packets wait in a <b>queue</b>, a waiting line. When the queue is full, new packets are simply thrown away.',
		'By default the queue is first come, first served. A tiny call packet stuck behind dozens of download chunks arrives late, or never. A late voice is useless, so the call stutters and freezes.',
		'<b>QoS</b> (Quality of Service) lets the router sort that queue by <b>priority</b>. Traffic that hates waiting (calls, games) goes first, traffic that does not mind (a big download) takes whatever is left. The download barely notices, it just finishes a little later.',
		'[fyi] On a MikroTik router you do this with queues, which you will meet in [[bandwidth management|netlab/router-queue]]. Big networks even stamp a priority number inside each packet header (called DSCP), so every router along the way knows who goes first.',
		'[ingat] QoS manages traffic priority and capacity sharing. It does not increase the connection’s physical capacity.',
		'Here the office line is jammed. Watch the call struggle, then switch QoS on and give each kind of traffic its priority.'
	],
	reactions: {
		stutter:
			'Hear that? The call keeps freezing. Its packets wait behind download chunks, and some get thrown away when the queue overflows. The line is not broken, it is just full.',
		qosOn:
			'QoS is on, but every flow still has the same priority, so the queue works just like before. Tell the router who matters most.',
		allSame: 'All classes have equal priority, so no traffic is prioritized.',
		dlFirst:
			'Ouch, now the download cuts in front of everyone, and the call gets even worse. Downloads do not mind waiting, give them the lowest spot.',
		callFixed:
			'The call is smooth again, its packets skip the line now. The game is still stuck behind the download though, give it a bump too.',
		fixed:
			'Smooth call, snappy game, and the download still runs, just a little slower. Nobody got more bandwidth, the router simply picked a smarter order. That is QoS.',
		qosOff: 'QoS off, back to first come, first served, and the call starts stuttering again.'
	},
	qosLabel: 'QoS',
	on: 'on',
	off: 'off',
	flows: ['Video call', 'Game', 'Download'],
	priorityBtn: 'Priority {p}',
	priorities: ['low', 'normal', 'high'],
	smooth: 'smooth',
	stutter: 'stuttering',
	lag: 'laggy',
	delay: '{n} ms delay',
	speed: '{n} Mbps',
	dropped: '{n} lost',
	routerLabel: 'Office router',
	queueLabel: 'Queue, waiting to leave',
	lineLabel: 'Internet line, 30 Mbps',
	noteOff: 'First come, first served',
	noteOn: 'Higher priority leaves first'
};
