import type { LessonText } from '../../types';

/** One part of the picture, explained in the side panel. */
export type GuideStep = { title: string; body: string; tag?: string };

export interface VpnText extends LessonText {
	/** Side panel, one entry per part of the story (seven). */
	steps: GuideStep[];
	cafeLabel: string; // the cafe area on the left
	youLabel: string; // your laptop
	officeLabel: string; // the office building on the right
	serverLabel: string; // the payroll server inside it
	internetLabel: string; // the cloud between them
	tunnelLabel: string; // label over the tunnel
	snooperLabel: string; // the stranger on the same cafe WiFi
	peekPlain: string; // what the stranger reads without a VPN
	peekIdle: string; // what his screen says before anything passes
	doorShut: string; // tag on the office door when it refuses
	doorOpen: string; // tag on the office door when it lets you in
	vpnLabel: string; // label on the optional switch
	onLabel: string;
	offLabel: string;
}
