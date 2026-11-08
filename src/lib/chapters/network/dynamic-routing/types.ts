import type { LessonText } from '../../types';

export interface DynamicRoutingText extends LessonText {
	/** Short names for the two acts, shown in the step row at the top. */
	acts: string[];
	actLabel: string; // template with {n}
	nextAct: string; // moves on to the BGP act
	ospf: {
		/** Router names, in order: start, left, right, lower left, end. */
		routers: string[];
		startTag: string; // small tag under the start router, where the office is
		endTag: string; // small tag under the end router, where the server is
		cutHint: string; // explains the cost chips on each link
		pathLabel: string; // heading before the current path
		costLabel: string; // template with {n}, the total cost of the path
		noPath: string; // shown when no road is left
		flooding: string; // shown while routers tell each other about the change
		restoreBtn: string; // puts every link back
		cutAria: string; // template with {a} and {b}, aria label for a link chip
	};
	bgp: {
		phoneLabel: string;
		ispLabel: string;
		netLabel: string; // the rest of the internet in between
		fbLabel: string; // the Facebook network box
		dnsLabel: string; // Facebook's DNS servers
		dcLabel: string; // Facebook's data centres
		tableTitle: string; // heading of the ISP's BGP table
		routeEntry: string; // the line the ISP learns over BGP
		withdrawn: string; // tag once that line is pulled
		tryBtn: string; // the phone opens facebook.com
		tryOk: string;
		tryFail: string;
		/** One button per moment of the outage, pressed in order. */
		steps: { btn: string; time: string; note: string }[];
		startNote: string; // shown before the first moment
	};
}
