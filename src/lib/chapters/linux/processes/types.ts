import type { LinuxGuideText } from '$lib/components/stages/linux/text';

export interface ProcessesText extends LinuxGuideText {
	serverLabel: string; // under the server rack
	cpuLabel: string; // next to the CPU meter
	ramLabel: string; // next to the RAM meter
	listTitle: string; // over the process list in the picture
	bgLabel: string; // small tag on a process running in the background
	stuckLabel: string; // small tag on a process that ignored a polite kill
	rule: string; // rule of thumb line on the memory beat
	// Muted "#" lines the terminal prints to help
	hintSudo: string;
	hintKill: string;
	hintTop: string; // after the top or htop snapshot, how a real one is left
}
