import type { LessonText } from '../../types';

export interface MacText extends LessonText {
	roomLabel: string; // the office LAN the devices share
	youLabel: string; // your laptop
	names: { printer: string; tv: string; phone: string; laptop: string };
	ipWord: string; // small caption before an IP on a device card
	macWord: string; // small caption before a MAC on a device card
	shout: string; // template with {ip}, the ARP question bubble
	itsMe: string; // the owner answering
	notMe: string; // everyone else shrugging
	printed: string; // tag on the printer once the page comes out
	askBtn: string; // template with {ip}
	printBtn: string;
	moreLabel: string; // heading over the extra questions once printing works
	askTv: string; // template with {ip}
	askNobody: string; // template with {ip}
	tableTitle: string; // the laptop's ARP table
	tableEmpty: string;
	ipHead: string;
	macHead: string;
	frameLabel: string; // caption on the print job travelling straight to one MAC
	notes: {
		idle: string;
		shouting: string;
		answered: string;
		printing: string;
		printed: string;
		cached: string;
		nobody: string;
	};
}
