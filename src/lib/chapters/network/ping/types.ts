import type { LessonText } from '../../types';

export interface PingText extends LessonText {
	missionsLabel: string; // heading of the mission checklist
	missions: string[]; // two labels, in order: ping, traceroute
	hintBtn: string; // chip that types the mission command for you
	doneNote: string; // shown once both missions are done
	inputLabel: string; // aria label of the command field
	// Muted "#" lines the terminal prints to help
	termHint: string;
	hintUnknownCmd: string;
	hintNeedHost: string;
	didYouMean: string; // template with {word}
	hintTimeout: string;
	hintStars: string;
	routeLabel: string; // heading over the hop list
	youLabel: string; // the first row, your laptop
	/** Every stop between your laptop and nimbus.com, in order. The last one is the server. */
	hops: { name: string; place: string }[];
	hiddenHop: string; // a hop ping cannot see
	quietTag: string; // tag on the hop that did not answer
	roundTrip: string; // template with {ms}
}
