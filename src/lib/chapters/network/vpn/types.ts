import type { LessonText } from '../../types';

export interface VpnText extends LessonText {
	vpnLabel: string; // label next to the VPN switch
	onLabel: string; // switch state when on
	offLabel: string; // switch state when off
	openBtn: string; // sends a request to the office server
	youLabel: string; // the laptop at the cafe
	youSub: string; // small caption under it
	officeLabel: string; // the server at the office
	officeSub: string; // small caption under it
	cafeWifi: string; // label on the open path between them
	tunnelLabel: string; // label on the tunnel once the VPN is on
	snooperLabel: string; // the stranger on the same cafe WiFi
	snooperIdle: string; // what the snooper panel says before anything passes
	seenAsLabel: string; // "the office sees you as"
	seenCafe: string; // where the request seems to come from without a VPN
	seenOffice: string; // where it seems to come from through the VPN
	blockedTag: string; // tag on the office gate when refused
	okTag: string; // tag on the office gate when let in
	noteIdle: string;
	noteOn: string;
	noteBlocked: string;
	noteOk: string;
}
