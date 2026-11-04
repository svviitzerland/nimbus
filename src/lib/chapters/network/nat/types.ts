import type { LessonText } from '../../types';

export interface NatText extends LessonText {
	/** What the side panel says, one entry per beat of `intro`. */
	steps: { title: string; body: string; tag?: string }[];
	homeLabel: string; // the house the phones live in
	phoneLabel: string; // template with {n}, the phone letter
	routerLabel: string;
	frontDesk: string; // tag on the router on the memory trick beat
	publicLabel: string; // caption next to the router public IP
	privateLabel: string; // caption next to the phones private IPs
	serverLabel: string; // nimbus.com
	strangerLabel: string;
	from: string; // template with {ip}
	to: string; // template with {ip}
	port: string; // template with {n}, the port number chip
	loaded: string; // tag on a phone once its page arrives
	dropped: string; // tag when the router throws a packet away
	tableTitle: string;
	insideHead: string;
	outsideHead: string;
	strangerBtn: string; // optional play, an outsider tries to reach a device inside
}
