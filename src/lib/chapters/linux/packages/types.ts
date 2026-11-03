import type { LinuxLabText } from '$lib/components/stages/linux/text';

export interface PackagesText extends LinuxLabText {
	// missions, in order: apt update, apt install nginx, nginx -v, open the welcome page
	storeLabel: string; // the package repository card
	serverLabel: string; // under the server rack
	openBtn: string; // opens nimbus.com in the browser card
	reloadBtn: string; // the same button after the first visit
	browserIdle: string; // the browser card before any visit
	offlineTitle: string; // shown when nothing answers on port 80
	offlineSub: string;
	// Muted "#" lines the terminal prints to help
	hintSudo: string;
	hintApt: string;
	hintVersion: string; // template with {name}
	hintCurl: string;
}
