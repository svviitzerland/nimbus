import type { CiscoLabText } from '$lib/components/stages/ciscolab/text';

export interface CiscoIntroText extends CiscoLabText {
	modes: { look: string; boss: string; change: string; port: string }; // captions of the mode ladder
	portsCaption: string; // under the router on the physical ports beat
	logicalCaption: string; // under the router on the logical ports beat
	ramTitle: string; // the running-config box
	ramSub: string;
	nvramTitle: string; // the startup-config box
	nvramSub: string;
	unsaved: string; // badge while running and startup differ
	saved: string; // badge once they match
}
