import type { UiUxText } from './types';

export const en: UiUxText = {
	title: 'UI and UX',
	intro: [
		'Think of your favourite app. Part of why you like it is how it <b>looks</b>, and part of it is how <b>easy</b> it is to get things done. Those are two different jobs with two different names.',
		'<b>UI</b> stands for user interface. It is everything you see and touch, the colours, the fonts, the buttons, the spacing. If an app were a car, UI would be the paint, the seats, and the dashboard.',
		'<b>UX</b> stands for user experience. It is how it feels to actually use the thing. Can you find the button you need? Does it do what you expected? Do you finish without getting annoyed? In the car, UX is how it feels to drive.',
		'[fyi] UX is not only about screens. Ever pulled a door that should have been pushed? People call those "Norman doors", after Don Norman, the designer who made the term user experience popular in the 1990s.',
		'A beautiful page can still be painful to use, and a plain page can feel effortless. Good products need both, and in the [[next lesson|web/design-to-code]] you will see how a design turns into real [[CSS|web/css]].',
		'[ingat] <b>UI is the interface, UX is the experience of using it.</b> Button labels, step order, price clarity, and system feedback all affect that experience.',
		'Here are two nimbus.com shops that look almost the same. Your job is simple, buy one Nim mug in each shop. Count how many taps it takes, and notice how each one makes you feel.'
	],
	reactions: {
		trap: 'The order was cancelled. Unclear buttons and questions make actions easy to confuse. Those UI decisions affect UX.',
		paidA:
			'You got the mug, but it took a while, and a surprise shipping fee popped up at the very end. Nobody likes that. Now try the other shop.',
		paidB:
			'One tap, and you knew the full price before paying. The other shop is still waiting, give it a try too.',
		both: 'Both shops use the same colors and product, but their checkout flows differ. Labels, step count, and when prices appear affect ease of use.',
		why: '[fyi] Shops that hide costs until the last step lose a lot of buyers. Surprise fees are one of the most common reasons people abandon a cart online.'
	},
	task: 'Buy one Nim mug',
	shopA: 'Shop A',
	shopB: 'Shop B',
	product: 'Nim mug',
	money: '${n}',
	qty: 'Qty 1',
	shipping: 'Shipping',
	total: 'Total',
	a: {
		cancel: 'Cancel',
		next: 'Proceed',
		confirmQ: 'Do you want to cancel your order?',
		yes: 'Yes',
		no: 'No',
		feeNote: 'A handling fee was added',
		pay: 'Submit'
	},
	b: { pay: 'Pay {total}', free: 'Free shipping, nothing else to add', back: 'Keep shopping' },
	cancelled: 'Order cancelled',
	paid: 'Mug on its way',
	again: 'Try again',
	taps: '{n} taps',
	whyBtn: 'What made the difference?',
	whyLabel: 'Differences in the checkout flow',
	whyPoints: [
		'Shop A had two buttons that looked the same, Shop B had one clear main action.',
		'Shop A said "Proceed" and "Submit", Shop B said exactly what happens, "Pay $12".',
		'Shop A asked a confusing question where "No" meant go ahead.',
		'Shop A hid a fee until the end, Shop B showed the full price from the start.'
	]
};
