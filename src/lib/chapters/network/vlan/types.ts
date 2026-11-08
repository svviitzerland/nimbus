import type { LessonText } from '../../types';

export interface VlanText extends LessonText {
	switchLabel: string; // the physical switch in the middle
	goalTitle: string; // heading of the goal card
	goal: string; // what the learner should achieve
	portHint: string; // tap a port to change its VLAN
	pingHint: string; // tap two devices to test
	pickTarget: string; // template with {name}, shown after picking the first device
	/** VLAN names, in order: default (1), finance (10), guest (20). */
	vlans: string[];
	portAria: string; // template with {n} and {vlan}
	/** The six devices, first three are finance, last three are guests. */
	devices: string[];
	financeTag: string; // small group label over the finance row
	guestTag: string; // small group label over the guest row
	reachOk: string; // template with {a} and {b}
	reachNo: string; // template with {a} and {b}
	resetBtn: string;
	solvedNote: string; // shown once the goal is met
}
