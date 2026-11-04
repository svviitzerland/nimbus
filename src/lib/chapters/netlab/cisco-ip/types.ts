import type { CiscoLabText } from '$lib/components/stages/ciscolab/text';

export interface CiscoIpText extends CiscoLabText {
	tagAsk: string; // label on the packet a laptop sends when it asks for an address
	capDark: string; // caption while GigabitEthernet0/1 is switched off
	capLit: string; // caption once the port is up but nobody asked yet
	capWaiting: string; // caption while the laptops wait for an address
	capLeased: string; // caption once the laptops got their addresses
}
