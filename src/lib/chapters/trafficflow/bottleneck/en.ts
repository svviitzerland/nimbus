import type { BottleneckText } from '../types';

export const en: BottleneckText = {
	title: 'What is a bottleneck?',
	intro: [
		'This is your online shop. Visitors open it from their own phones, and behind the scenes each request is handled by a server and then visits one <b>database</b> to fetch data.',
		'With few visitors everything is smooth. But when it gets busy, everyone piles up at the slowest point, that database. The one point that limits everyone is called a <b>bottleneck</b>.',
		'Add visitors until the database is overwhelmed. They line up in front of it (the red ones are waiting) and their page takes ages to open. Then make the database bigger, the line clears and the page is fast again.',
		'[ingat] A bottleneck is the part limiting system performance. Improve that part, then measure the result.'
	],
	reactions: {
		jam: 'There, the database is overwhelmed. Only this one point is slow, but every visitor feels it, the page takes ages to open.',
		fixed:
			'Flowing again. But making one box bigger has a limit. In the next chapter, <b>Traffic</b>, we learn other ways to beat a bottleneck, like adding servers and spreading the load.'
	},
	okStatus: 'Flowing',
	jamStatus: 'Overwhelmed',
	queueLabel: 'queued',
	customerLabel: 'What visitors see',
	devLabel: 'Behind the scenes',
	visitorsLabel: 'visitors',
	shopUrl: 'nimbus.com',
	loadingLabel: 'Loading',
	okPageLabel: 'Loaded',
	secUnit: 's',
	dbLabel: 'Database',
	bottleneckTag: 'bottleneck',
	addBtn: 'Add visitors',
	fixBtn: 'Scale up the database'
};
