import type { BandwidthThroughputText } from '../types';

export const en: BandwidthThroughputText = {
	title: 'Bandwidth and throughput',
	intro: [
		'Imagine you put a video on your server, and it goes viral. Many people watch at once. This is where two terms, bandwidth and throughput, start to matter.',
		'<b>Bandwidth</b> is the capacity of the road from your server to the internet, the ceiling. <b>Throughput</b> is the data actually delivered each second.',
		'Add viewers one by one until some start buffering, then upgrade the bandwidth.'
	],
	reactions: {
		full: 'There, too many viewers for your bandwidth. Throughput hits the ceiling, so some videos start <b>buffering</b>. Exactly what happens when a video suddenly gets popular.',
		fixed:
			'After upgrading bandwidth, the capacity rises, throughput can go higher, and every viewer is smooth again. So <b>bandwidth</b> is the ceiling, <b>throughput</b> is what actually gets used. Other terms you will hear, <b>RPS</b> (requests per second), <b>concurrency</b> (how many served at once), and <b>jitter</b> (delay that wobbles and makes video stutter).'
	},
	sourceLabel: 'Your video',
	addBtn: 'Add a viewer',
	upgradeBtn: 'Upgrade bandwidth',
	tpLabel: 'Throughput',
	bwLabel: 'Bandwidth',
	unit: 'MB/s',
	hd: 'HD',
	buffering: 'Buffering'
};
