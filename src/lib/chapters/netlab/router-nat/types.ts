import type { RouterLabText } from '$lib/components/stages/routerlab/text';

export interface RouterNatText extends RouterLabText {
	serverLabel: string; // the far server, nimbus.com
	tagFrom: string; // template with {ip}, the packet's sender label
	tagTo: string; // template with {ip}, the reply's receiver label
	tagDropped: string; // the packet label when the ISP throws it away
	// Muted "#" lines the terminal prints next to real output
	hintPublic: string; // after the address list, points at the one public address
	hintSrcnat: string; // explains the s flag in the connection table
}
