import type { LessonText } from '../../types';

export type BackendStepId = 'login' | 'stock' | 'save' | 'email';

export interface BackendWhatText extends LessonText {
	/** Caption under the phone. */
	frontLabel: string;
	/** Caption over the backend box. */
	backLabel: string;
	/** Small line under the backend caption. */
	backSub: string;
	/** The product sitting in the cart. */
	product: string;
	price: string;
	/** Switch between a logged in and a logged out shopper. */
	loggedIn: string;
	loggedOut: string;
	placeOrder: string;
	nextStep: string;
	again: string;
	/** What each backend station does, a short title and a line of detail. */
	steps: Record<BackendStepId, { title: string; detail: string }>;
	/** What the station says when the shopper is not logged in. */
	loginFail: string;
	/** Labels for the side actors. */
	dbLabel: string;
	mailLabel: string;
	/** The phone screen in each state. */
	phone: { idle: string; waiting: string; done: string; rejected: string; inbox: string };
}
