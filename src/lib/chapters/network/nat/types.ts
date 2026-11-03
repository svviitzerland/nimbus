import type { LessonText } from '../../types';

export interface NatText extends LessonText {
	openLabel: string; // heading over the phone buttons
	allBtn: string; // send from all three phones at once
	phoneLabel: string; // template with {n}, the phone letter
	strangerBtn: string; // an outsider tries to reach a device inside
	routerLabel: string;
	publicLabel: string; // caption next to the router public IP
	privateLabel: string; // caption next to the phones private IPs
	serverLabel: string; // nimbus.com
	strangerLabel: string;
	from: string; // template with {ip}
	to: string; // template with {ip}
	port: string; // template with {n}
	loaded: string; // tag on a phone once its page arrives
	dropped: string; // tag when the router throws a packet away
	tableTitle: string;
	tableEmpty: string;
	insideHead: string;
	outsideHead: string;
	notes: {
		idle: string;
		rewriteOut: string;
		atServer: string;
		rewriteBack: string;
		delivered: string;
		stranger: string;
	};
}
