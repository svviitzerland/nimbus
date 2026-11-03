import type { LinuxLabText } from '$lib/components/stages/linux/text';

export interface ServicesText extends LinuxLabText {
	// missions, in order: status, start, crash and come back, start at boot then reboot
	crashBtn: string; // kills the app on purpose
	rebootBtn: string; // restarts the whole server
	serverLabel: string; // under the server rack
	bootLabel: string; // "starts at boot" row in the systemd card
	restartsLabel: string; // how many times systemd revived the app
	yes: string;
	no: string;
	visitorsLabel: string; // over the uptime strip
	siteUp: string;
	siteDown: string;
	states: { active: string; inactive: string; dead: string; restarting: string; booting: string };
	// Muted "#" lines the terminal prints to help
	hintSudo: string;
	hintSystemctl: string;
	hintUnit: string;
	hintKill: string;
}
