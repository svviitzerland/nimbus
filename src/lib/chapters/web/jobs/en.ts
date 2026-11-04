import type { JobsText } from './types';

export const en: JobsText = {
	title: 'Queues and background jobs',
	intro: [
		'When you check out on <b>nimbus.com</b>, the backend does more than save your order. It also emails you a receipt and makes a PDF invoice. Those two are slow, a few seconds each.',
		'If the backend finishes everything before it answers, you just stare at a spinning wheel. Plenty of people give up and close the tab, and the shop loses the sale.',
		'The fix is a <b>queue</b>, a waiting line for work. The backend saves the order, drops the slow work into the queue as small tickets called <b>jobs</b>, and answers you right away.',
		'Behind the scenes a separate program called a <b>worker</b> takes jobs from the queue one by one and does them. Your email still arrives, a few seconds later, and you never had to wait for it.',
		'[ingat] Answer first, work later. Like a busy café, the cashier takes your order and hands you a number, and the barista makes your coffee while you sit down.',
		'At rush hour the tickets pile up faster than one worker can finish them. So shops simply add more workers, and they all pull from the same queue.',
		'[fyi] Same word, different world. Routers have queues too, lines of packets waiting for a busy link. See [[bandwidth management|netlab/router-queue]].',
		'Watch the rush hour queue drain by itself. Want it to go faster? Add a worker.'
	],
	reactions: {
		w2: 'Two workers now, pulling from the same line. The queue shrinks noticeably faster.',
		w3: 'Three workers, and the pile clears fast. Big shops add and remove workers the same way they add servers.',
		w1: 'Back to one worker. Nothing gets lost, it just takes longer to empty the line.'
	},
	steps: [
		{
			title: 'Slow work',
			body: 'Saving the order is quick. Sending an <b>email</b> and making a <b>PDF</b> takes seconds.'
		},
		{
			title: 'The long wait',
			body: 'Doing it all <b>before answering</b> makes the visitor wait for work they do not even need to see.'
		},
		{
			title: 'Queue',
			body: 'A <b>waiting line for work</b>. Each piece of slow work becomes a ticket, called a job.'
		},
		{
			title: 'Worker',
			body: 'A separate program that <b>takes jobs one by one</b> from the queue and does them in the background.'
		},
		{
			title: 'Answer first, work later',
			tag: 'Make it stick',
			body: '<b>Answer first, work later.</b> The cashier takes orders, the barista makes them.'
		},
		{
			title: 'More workers',
			body: 'Several workers <b>share one queue</b>. More workers, and the line empties faster.'
		},
		{
			title: 'Router queues',
			tag: 'Side note',
			body: 'Packets waiting at a busy router form a queue too. <b>Same idea</b>, different place.'
		},
		{
			title: 'Rush hour',
			body: 'Every visitor still gets an <b>instant answer</b>. Only the queue grows, and the workers drain it.'
		}
	],
	product: 'Nimbus Cap',
	phone: { idle: 'Cart ready', waiting: 'Processing', done: 'Order placed' },
	waited: 'Waited {s} s',
	decimal: '.',
	tasks: { save: 'Save order', email: 'Email receipt', pdf: 'PDF invoice' },
	fast: 'fast',
	slow: 'slow',
	queued: 'queued',
	backendLabel: 'Backend',
	queueLabel: 'Queue',
	workerLabel: 'Worker',
	addBtn: 'Add a worker',
	resetBtn: 'Back to one worker'
};
