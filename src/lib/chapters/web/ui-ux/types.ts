import type { LessonText } from '../../types';

export interface UiUxText extends LessonText {
	/** The little job the learner does in both shops. */
	task: string;
	shopA: string;
	shopB: string;
	product: string;
	/** Money template, {n} is the amount. */
	money: string;
	qty: string;
	shipping: string;
	total: string;
	/** Shop A, the one that looks fine but is hard to use. */
	a: {
		cancel: string;
		next: string;
		confirmQ: string;
		yes: string;
		no: string;
		feeNote: string;
		pay: string;
	};
	/** Shop B, same look, easy to use. */
	b: { pay: string; free: string; back: string };
	cancelled: string;
	paid: string;
	again: string;
	/** Template with {n}. */
	taps: string;
	whyBtn: string;
	whyLabel: string;
	whyPoints: string[];
}
