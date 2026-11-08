import type { JobsText } from './types';

export const en: JobsText = {
	title: 'Queues and background jobs',
	intro: [
		'When you check out on <b>nimbus.com</b>, the backend has more to do than saving your order. It also sends a receipt email and makes an invoice PDF. Those two are slow, a couple of seconds each.',
		'If the backend does everything before answering, you stare at a spinning wheel the whole time. Plenty of people give up and close the tab, and the shop loses the sale.',
		'The fix is a <b>queue</b>, a waiting line for work. The backend saves the order, drops the slow chores into the queue as little tickets called <b>jobs</b>, and answers you right away.',
		'Behind the scenes, a separate program called a <b>worker</b> picks jobs off the queue one by one and does them in the background. Your email still arrives, just a few seconds later, and you never had to wait for it.',
		'[fyi] Same word, different world. Routers also have queues, a line of packets waiting for their turn on a busy link. See [[bandwidth management|netlab/router-queue]].',
		'[ingat] A queue holds jobs for workers to process. The server can reply sooner when those jobs do not need to finish immediately.',
		'Check out once with the queue off and once with it on, and watch the stopwatch on the phone. Then try the rush hour and see what more workers do.'
	],
	reactions: {
		slow: 'That felt long, right? The visitor waited for the email and the PDF even though they did not need either one to see the order was placed.',
		fast: 'Order placed almost instantly! The slow chores are tickets in the queue now, and the worker is chewing through them while the visitor already moved on.',
		rush: 'Rush hour, a pile of orders at once. Every visitor still gets an instant answer, but the queue grows faster than one worker can empty it.',
		workers:
			'Additional workers take jobs from the same queue. In this simulation, more jobs can be processed at once.',
		drained:
			'The queue is empty and the jobs are complete. Real systems need retry policies, queue persistence, and protection against duplicate processing.'
	},
	modeDirect: 'No queue',
	modeQueue: 'With a queue',
	checkout: 'Check out',
	rush: 'Rush hour (5 orders)',
	workers: 'Workers',
	phone: { idle: 'Cart ready', waiting: 'Processing', done: 'Order placed' },
	waited: 'Waited {s} s',
	jobs: { save: 'Save order', email: 'Send email', pdf: 'Make invoice PDF' },
	serverLabel: 'Backend',
	queueLabel: 'Queue',
	queueEmpty: 'Empty',
	workerLabel: 'Worker',
	idle: 'idle',
	orderTag: 'order {n}'
};
