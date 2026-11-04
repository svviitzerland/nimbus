import type { LinuxGuideText } from '$lib/components/stages/linux/text';

export interface ServicesText extends LinuxGuideText {
	serverLabel: string; // under the server rack
	bootLabel: string; // next to the "starts at boot" switch
	siteUp: string; // inside the browser while the app runs
	siteDown: string;
	/** The app's state, in the chip under the picture. */
	states: { active: string; inactive: string; dead: string; restarting: string };
	rule: string; // rule of thumb line on the memory beat
	// Muted "#" lines the terminal prints to help
	hintSudo: string;
	hintSystemctl: string;
}
