import type { RouterLabText } from '$lib/components/stages/routerlab/text';

export interface RouterNatText extends RouterLabText {
	// missions, in order: first try, masquerade rule, try again, connection table
	openBtn: string; // template with {name}, the button that opens nimbus.com on a laptop
	busy: string; // the button while a packet is on its way
	serverLabel: string; // the far server, nimbus.com
	tagFrom: string; // template with {ip}, the packet's sender label
	tagTo: string; // template with {ip}, the reply's receiver label
	tagDropped: string; // the packet label when the ISP throws it away
	capIdle: string; // caption under the drawing before any test
	capFail: string; // template with {name}, after a failed test
	capOk: string; // template with {name}, after a page load
	// Muted "#" lines the terminal prints to help after a command
	hintChain: string;
	hintOut: string;
	hintAction: string;
	hintNeeds: string; // template with {keys}
	hintSrcnat: string; // explains the s flag in the connection table
	hintNoConn: string;
	hintTryAgain: string; // after the rule is added, invites testing again
}
