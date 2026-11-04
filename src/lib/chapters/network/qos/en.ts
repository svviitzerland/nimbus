import type { QosText } from './types';

export const en: QosText = {
	title: 'What is QoS',
	intro: [
		'Monday morning at the nimbus.com office. Someone is on a video call with a client, someone sneaks in a quick game, and someone starts a 40 GB download. All of it squeezes through one internet line.',
		'Every line has a ceiling (remember [[bandwidth|trafficflow/bandwidth-throughput]]). When more arrives than the line can carry, the router lines the packets up in a <b>queue</b>, a waiting line, like cars at a toll gate.',
		'By default the queue is first come, first served. The tiny green call packets get stuck behind piles of orange download chunks. A voice that arrives late is useless, so the call stutters.',
		'<b>QoS</b> (Quality of Service) lets the router sort that queue by <b>priority</b>. Watch the call and game packets slip to the front.',
		'The call is smooth again. The download hardly notices, it just finishes a few seconds later. Traffic that hates waiting goes first, traffic that does not mind takes what is left.',
		'[ingat] QoS is the ambulance on a jammed road. Everyone pulls over for it, and the trucks still get home, just a little later.',
		'[fyi] On a MikroTik router you set this up with queues, which you will meet in [[bandwidth management|netlab/router-queue]]. Big networks even stamp a priority number inside each packet (called DSCP), so every router along the way knows who goes first.',
		'That is QoS, a smarter waiting line. Flip it off and on if you want to see the difference.'
	],
	reactions: {
		qosOff:
			'First come, first served again. The call packets wait behind the download chunks, and the voice starts to break up.',
		qosOn: 'Priority is back. Call packets jump the line, and the voice is smooth again.'
	},
	steps: [
		{
			title: 'One line, three jobs',
			body: 'A video call, a game and a big download all share the same internet line.'
		},
		{
			title: 'The queue',
			body: 'When packets arrive faster than the line can send them, they wait in a <b>queue</b> inside the router.'
		},
		{
			title: 'First come, first served',
			body: 'Without rules, a call packet waits behind every download chunk ahead of it. A late voice sounds broken.'
		},
		{
			title: 'Priority',
			body: 'With <b>QoS</b> the router sends urgent packets first. Calls and games are urgent, downloads are not.'
		},
		{
			title: 'Everyone gets there',
			body: 'The call gets the few packets it needs right away. The download simply uses whatever is left.'
		},
		{
			tag: 'Rule of thumb',
			title: 'The ambulance lane',
			body: 'Urgent traffic goes first. Big traffic still arrives, just a little later.'
		},
		{
			title: 'Marked packets',
			body: 'A priority number called <b>DSCP</b> can ride inside each packet, so every router on the way sorts it the same.'
		},
		{
			title: 'Try it',
			body: 'Switch QoS off and on and keep an eye on the green call packets.'
		}
	],
	flows: ['Video call', 'Game', 'Download'],
	routerLabel: 'Router queue',
	lineLabel: 'Office line',
	qosOn: 'QoS on',
	qosOff: 'QoS off',
	callStatus: 'Video call',
	smooth: 'smooth',
	stutter: 'stuttering',
	offBtn: 'Switch QoS off',
	onBtn: 'Switch QoS on'
};
