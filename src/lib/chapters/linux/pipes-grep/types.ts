import type { LinuxGuideText } from '$lib/components/stages/linux/text';

export interface PipesGrepText extends LinuxGuideText {
	logLabel: string; // under the log file drawing
	linesLabel: string; // template with {n}, result under a box that printed lines
	nanoTitle: string; // title bar of the nano drawing
	/** What Nim writes into todo.txt with nano, also shown in the drawing. */
	nanoLines: string[];
	nanoSave: string; // footer of the nano drawing, the save key
	nanoExit: string; // footer of the nano drawing, the exit key
	rule: string; // rule of thumb line on the memory beat
	// Muted "#" lines the terminal prints to help
	hintNano: string;
	hintPipe: string;
}
