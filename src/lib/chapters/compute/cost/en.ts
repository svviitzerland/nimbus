import type { CostText } from '../types';

export const en: CostText = {
	title: 'Taming the bill',
	intro: [
		'In the cloud you pay for what you use. That is the charm and the danger, because everything you forget to turn off keeps quietly charging.',
		'The two most common kinds of waste are an <b>idle</b> server running with no work to do, and an <b>oversized</b> server using only a sliver of its power.',
		'The fix is called <b>right sizing</b>, matching a server’s size to its real need. Turn off the idle one, shrink the oversized one, and your bill drops without your site noticing at all.',
		'This month’s bill is swollen, and the two wastes are hiding among those three servers. Clean them up and watch the number shrink.'
	],
	reactions: {
		off: 'One idle server switched off, thirty dollars straight back into your pocket every month. In real companies this exact waste is the most common one.',
		resize:
			'The oversized machine shrank to fit, the work still gets done, the price is far lower. That is right sizing.'
	},
	billLabel: 'This month’s bill',
	perMonth: 'per month',
	idleName: 'Test server',
	idleSub: 'always on, 2% used',
	bigName: 'Report server',
	bigSub: 'huge, 15% used',
	rightName: 'Web server',
	rightSub: 'sized just right',
	turnOff: 'Turn off',
	downsize: 'Shrink',
	offTag: 'off, $0',
	resizedTag: 'fits now',
	savedTag: 'saved ${n}',
	noteIdle: 'Two wastes are hiding in this bill',
	noteOff: 'The idle one stopped charging',
	noteResize: 'The oversized one fits now',
	noteDone: 'A lower bill, the site still runs'
};
