import type { RouterLabText } from '$lib/components/stages/routerlab/text';

export interface RouterQueueText extends RouterLabText {
	lineLabel: string; // heading over the bars, the 20 Mbps office line
	/** What each person is doing, in the order Sari, Dewi, Budi. */
	roles: [string, string, string];
	// Muted "#" lines the terminal prints next to real output
	hintBudi: string; // after torch, names the biggest user
}
