import type { LessonText } from '../../types';

export interface DynamicRoutingText extends LessonText {
	/** One side panel step per beat, in the same order as `intro`. */
	steps: { title: string; body: string; tag?: string }[];
	// Act one, a small company network.
	officeLabel: string; // the router on the office side
	dcLabel: string; // the router on the data centre side
	brokenTag: string; // badge on the cut cable
	// Act two, the Facebook story.
	phoneLabel: string;
	providerLabel: string; // your internet provider's router
	fbLabel: string; // the Facebook network
	dnsLabel: string; // Facebook's DNS servers
	fbDcLabel: string; // Facebook's data centres
	mapTitle: string; // heading of the provider's little map card
	mapKnown: string; // the line it learned over BGP
	mapGone: string; // shown once the announcement is withdrawn
	announce: string; // text of the announcement travelling out of Facebook
	lostTag: string; // badge when nobody knows the way
	pullBtn: string; // optional play, withdraws the announcement
	backBtn: string; // announces again
}
