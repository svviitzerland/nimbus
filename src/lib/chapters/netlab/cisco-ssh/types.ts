import type { CiscoLabText } from '$lib/components/stages/ciscolab/text';

export interface CiscoSshText extends CiscoLabText {
	spyLabel: string; // the eavesdropper laptop on the office switch
	captureTitle: string; // heading of what the eavesdropper sees
	captureEmpty: string; // before any login was captured
	captureOpen: string; // verdict when the password is readable (Telnet)
	captureSafe: string; // verdict when it is scrambled (SSH)
}
