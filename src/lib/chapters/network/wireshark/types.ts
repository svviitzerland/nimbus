import type { LessonText } from '../../types';

export interface WiresharkText extends LessonText {
	captureBtn: string; // starts the capture
	againBtn: string; // captures the page load again
	capturing: string; // status while packets are arriving
	captured: string; // template with {n}, status once the capture is done
	filterLabel: string; // label over the protocol filter chips
	filterAll: string; // the chip that shows every packet
	colNo: string; // packet list column headings
	colProto: string;
	colInfo: string;
	idleHint: string; // empty list before the capture starts
	pickHint: string; // shown until a packet is opened
	layerLabel: string; // template with {n}, the layer badge
	/** Layer names keyed by their number in the Layers lesson. */
	layerNames: { 1: string; 2: string; 3: string; 4: string; 7: string };
	/** One plain sentence per captured packet, in capture order (nine packets). */
	packetNotes: string[];
}
