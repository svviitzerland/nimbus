import type { CiscoLabText } from '$lib/components/stages/ciscolab/text';

export interface CiscoNatText extends CiscoLabText {
	tagFrom: string; // template with {ip}, the packet's sender
	tagTo: string; // template with {ip}, the reply's receiver
	tagDropped: string; // the packet label when the ISP throws it away
	insideTag: string; // tag under the port marked ip nat inside
	outsideTag: string; // tag under the port marked ip nat outside
	tableTitle: string; // the little NAT table under the drawing
	thLocal: string;
	thGlobal: string;
	tableEmpty: string;
}
