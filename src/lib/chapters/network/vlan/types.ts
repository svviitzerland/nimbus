import type { LessonText } from '../../types';

export interface VlanText extends LessonText {
	/** One side panel step per beat, in the same order as `intro`. */
	steps: { title: string; body: string; tag?: string }[];
	switchLabel: string; // the physical switch
	routerLabel: string; // the router that joins two VLANs, shown on one beat
	payrollLabel: string; // the payroll server
	financeTag: string; // name of the finance group (VLAN 10)
	guestTag: string; // name of the guest group (VLAN 20)
	blockedTag: string; // badge where the switch stops a packet
	checkedTag: string; // badge on the router while it checks a packet
	paintBtn: string; // optional play, moves the first guest into finance
	unpaintBtn: string; // moves it back
}
