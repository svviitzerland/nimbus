import type { LessonText } from '../../types';

export interface QosText extends LessonText {
	/** One side panel step per beat, in the same order as `intro`. */
	steps: { title: string; body: string; tag?: string }[];
	/** Traffic names, in order: video call, game, download. */
	flows: string[];
	routerLabel: string; // caption on the router's waiting line
	lineLabel: string; // the narrow office line out to the internet
	qosOn: string; // small chip while QoS is on
	qosOff: string; // small chip while QoS is off
	callStatus: string; // heading of the call status card
	smooth: string;
	stutter: string;
	offBtn: string; // optional play, switches QoS off
	onBtn: string; // switches it back on
}
