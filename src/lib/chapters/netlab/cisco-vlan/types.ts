import type { CiscoLabText } from '$lib/components/stages/ciscolab/text';

export interface CiscoVlanText extends CiscoLabText {
	apLabel: string; // the guest WiFi access point on Fa0/8
	newLabel: string; // the new staff laptop on Fa0/4 (your turn)
	heard: string; // under a device that received the guest's broadcast
}
