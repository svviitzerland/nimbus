import type { RouterQueueText } from './types';

export const en: RouterQueueText = {
	title: 'Bandwidth management',
	intro: [
		'Monday morning. Sari is on a video call with a client, Dewi is reading her email, and Budi just started downloading a huge game update. Suddenly Sari’s call freezes.',
		'The office connection has 20 Mbps of capacity, or 20 megabits per second. Budi’s download uses most of it and disrupts the video call. This is a [[bottleneck|trafficflow/bottleneck]].',
		'Before fixing anything, find out who. <b>torch</b> shows the traffic on a port right now, biggest first. Watch the terminal.',
		'The fix is a <b>queue</b>. A simple queue on MikroTik says this address may use at most this much, its <b>max-limit</b>. Whatever Budi cannot use is left for the others.',
		'Watch the terminal give Budi a queue. <b>target</b> is his address, and <b>max-limit=5M/10M</b> means up to 5 Mbps up and 10 Mbps down. Keep an eye on the bars.',
		'Sharing a line fairly, or giving some traffic priority, is called <b>QoS</b> (quality of service). The idea is in [[What is QoS|network/qos]]. Budi still downloads quickly, he just cannot drown everyone else anymore.',
		'[ingat] In this simple queue, max-limit lists upload then download, from the target device’s perspective.',
		'[fyi] Almost every RT RW net in Indonesia runs on this. Ten houses share one line, and a queue per house is what stops one family’s downloads from ruining the whole street’s evening.',
		'Your turn. Check Budi’s queue with <b>/queue simple print</b>.'
	],
	reactions: {
		queuePrint:
			'There is Budi’s queue, target 192.168.88.253 and max-limit 5M/10M. Upload on the left, download on the right.',
		torch:
			'Torch again, live traffic on ether2. Budi is capped at 10 Mbps now, and Sari’s call has room to breathe.',
		error:
			'RouterOS did not get that one. Check the spelling, or tap the suggestion and watch it get typed.'
	},
	steps: [
		{
			title: 'Interrupted video call',
			body: 'Three people, one internet line. When one of them takes everything, the others feel it first.'
		},
		{
			tag: 'Mbps',
			title: 'Connection capacity',
			body: 'Bandwidth is how many lanes the road has. <b>20 Mbps</b> is the whole road, shared by everyone in the office.'
		},
		{
			tag: 'torch',
			title: 'Checking bandwidth usage',
			body: '<b>torch</b> is a live look at one port. <b>RX</b> is what comes in (download), <b>TX</b> what goes out.'
		},
		{
			tag: 'queue',
			title: 'A limit per address',
			body: 'A <b>simple queue</b> gives one address a ceiling. Below it, nothing changes. Above it, the router slows that address down.'
		},
		{
			tag: 'max-limit',
			title: 'Limiting Budi’s connection',
			body: '<b>5M/10M</b> means at most 5 Mbps up and 10 Mbps down for 192.168.88.253.'
		},
		{
			tag: 'QoS',
			title: 'Sharing network capacity',
			body: 'The line did not get faster. It just got shared, so the call has the 3 Mbps it needs.'
		},
		{
			tag: 'Remember it',
			title: 'Upload and download order',
			body: 'In <b>5M/10M</b> the left number is upload, the right number is download.'
		},
		{
			title: 'Limiting each customer',
			body: 'RT RW nets and cafes give every customer a queue, so the line stays fair at busy hours.'
		},
		{
			title: 'Set bandwidth limits',
			body: '<b>/queue simple</b> lists every queue, in order, with its target and limit.'
		}
	],
	ispLabel: 'ISP',
	lineLabel: 'Office line, 20 Mbps',
	roles: ['video call', 'email', 'game update'],
	inputLabel: 'command',
	tryLabel: 'Try this',
	termHint: '# your turn, type the command and press Enter',
	hintTry: '# try {cmd}',
	didYouMean: '# maybe you meant {word}',
	hintBudi: '# 192.168.88.253 is Budi, eating most of the line'
};
