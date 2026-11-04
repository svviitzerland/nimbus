import type { LessonText } from '../../types';

/** One part of the picture, explained in the side panel. */
export type GuideStep = { title: string; body: string; tag?: string };

export interface WiresharkText extends LessonText {
	/** Side panel, one entry per part of the story (five). */
	steps: GuideStep[];
	capturing: string; // title bar of the capture window
	colNo: string; // packet list column headings
	colProto: string;
	colInfo: string;
	/** Names of the wrappings, from the outside in. */
	layerNames: { frame: string; ip: string; port: string; content: string };
	lockedLabel: string; // shown next to encrypted content
	packetTitle: string; // template with {n}, panel title when the learner opens a packet
	/** What sits in the middle of each of the nine packets, empty when it is encrypted. */
	contents: string[];
	/** One plain sentence per packet, in capture order (nine). */
	packetNotes: string[];
}
