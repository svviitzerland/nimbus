import type { LinuxGuideText } from '$lib/components/stages/linux/text';

export interface PackagesText extends LinuxGuideText {
	storeLabel: string; // under the package shop
	serverLabel: string; // under the server rack
	netLabel: string; // over the road between them
	rule: string; // rule of thumb line on the memory beat
	// Muted "#" lines the terminal prints to help
	hintSudo: string;
	hintApt: string;
}
