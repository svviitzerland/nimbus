import type { LessonText } from '../../types';

export interface ProtocolsText extends LessonText {
	/** One side panel step per beat, in the same order as `intro`. */
	steps: { title: string; body: string; tag?: string }[];
	laptopLabel: string;
	serverLabel: string; // the nimbus.com server building
	serverSub: string; // its address
	/** The four doors, in order HTTP (80), HTTPS (443), SSH (22), DNS (53). `use` is a tiny caption. */
	doors: { name: string; use: string }[];
	knockHint: string; // shown on the last beat, invites a tap on a door
	doorAria: string; // template with {name} and {port}
}
