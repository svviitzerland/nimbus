import type { RouterLabText } from '$lib/components/stages/routerlab/text';

export interface RouterIpText extends RouterLabText {
	// Muted "#" lines the terminal prints next to real output
	hintBound: string; // explains "bound" in the lease list
}
