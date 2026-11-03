import type { LessonText } from '../../types';

/** One of the three main parts, drawn as a card inside the opened laptop. */
export interface HardwarePart {
	label: string; // e.g. "CPU"
	sub: string; // the everyday picture, e.g. "the cook, does the thinking"
	spec: string; // a typical size printed on a shop label, e.g. "8 GB"
}

export interface HardwareText extends LessonText {
	/** Number formatting for the step counter, e.g. "id-ID" or "en-US". */
	locale: string;
	cpu: HardwarePart;
	ram: HardwarePart;
	storage: HardwarePart;
	gameName: string; // the game the learner loads and plays
	otherFiles: string[]; // other things that live in storage, never moved
	powerOn: string; // power light caption while plugged in
	powerOff: string; // power light caption once the plug is pulled
	loadBtn: string;
	runBtn: string;
	unplugBtn: string;
	powerBtn: string;
	ramEmpty: string; // shown in RAM while nothing is loaded
	loadingTag: string; // shown on the game while it travels into RAM
	cpuIdle: string;
	cpuBusy: string;
	cpuOff: string;
	steps: string; // template with {n}, the CPU's running step counter
	keptTag: string; // small tag on storage after the power cut, the files are still there
	notes: {
		idle: string;
		loading: string;
		loaded: string;
		running: string;
		off: string;
		back: string;
	};
}
