import type { CiscoLabText } from '$lib/components/stages/ciscolab/text';

export interface CiscoAclText extends CiscoLabText {
	targets: { game: string; web: string; router: string }; // where each test packet goes
	allowed: string; // verdict pill, let through
	blocked: string; // verdict pill, stopped
	waiting: string; // pill before a test ran
	wantAllow: string; // shown when a packet is blocked but should get through
	wantBlock: string; // shown when a packet gets through but should be blocked
	implicitNote: string; // next to the invisible deny any at the bottom of a list
	on100: string; // where list 100 is applied
	on10: string; // where list 10 is applied
}
