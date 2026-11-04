import type { LessonText } from '../../types';

export interface MacText extends LessonText {
	/** What the side panel says, one entry per beat of `intro`. */
	steps: { title: string; body: string; tag?: string }[];
	roomLabel: string; // the office LAN the devices share
	names: { you: string; printer: string; tv: string; phone: string };
	officeLabel: string; // the office network in the memory trick scene
	cafeLabel: string; // the cafe network in the memory trick scene
	shout: string; // template with {ip}, the ARP question bubble
	itsMe: string; // the printer answering
	silence: string; // shown when nobody owns the address
	printed: string; // tag on the printer once the page comes out
	tableTitle: string; // the laptop's ARP table
	ipHead: string;
	macHead: string;
	ghostBtn: string; // template with {ip}, the optional question on the last beat
}
