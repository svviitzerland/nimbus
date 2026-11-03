import type { LessonText } from '../../types';

export interface LogsText extends LessonText {
	ticketLabel: string; // small heading on the support ticket
	ticket: string; // what the buyer reported
	/** The two ways to look, shown as tabs. */
	modes: string[];
	fleetLabel: string; // heading over the twenty servers
	loginsTag: string; // template with {n} logins and {m} minutes
	pickServer: string; // nudge to tap a server
	searchLabel: string; // label for the search box
	searchPlaceholder: string;
	quickLabel: string; // heading over the quick search chips
	resultsTag: string; // template with {n} shown and {t} total
	noResults: string;
	tapHint: string; // tap the line that looks wrong
	foundTag: string; // shown on the server once the bad line is found
	noteHand: string;
	noteHandFound: string;
	noteCentral: string;
	noteFound: string;
}
