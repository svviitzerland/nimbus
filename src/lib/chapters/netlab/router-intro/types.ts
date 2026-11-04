import type { RouterLabText } from '$lib/components/stages/routerlab/text';

export interface RouterIntroText extends RouterLabText {
	laptopLabel: string; // the office laptop on ether2
	// Muted "#" lines the terminal prints next to real output
	hintRunning: string; // explains the R flag
	hintDynamic: string; // explains the D flag
}
