import type { LessonText } from '../../types';

export interface SubnetText extends LessonText {
	/** What the side panel says, one entry per beat of `intro`. */
	steps: { title: string; body: string; tag?: string }[];
	buildingLabel: string; // accessible name of the building drawing
	oneRoom: string; // template with {size}, caption when the whole building is one room
	rooms: string; // template with {n} and {size}
	roomsSingle: string; // template with {n}, when every room is a single address
	/** The cheat sheet, one line per common size, in the order /32, /30, /24, /16, /8. */
	cheat: { size: string; note: string }[];
	cheatTitle: string;
	ruleLine: string; // the rule of thumb printed on the cheat sheet
	campus16: string; // caption under the zoomed out view, /16
	campus8: string; // second caption, /8
	nameLabel: string; // first address of a room, its name
	shoutLabel: string; // last address of a room, the broadcast
	publicLabel: string; // a VPC public subnet
	privateLabel: string; // a VPC private subnet
	smaller: string; // accessible label for the minus button
	bigger: string; // accessible label for the plus button
	thousands: string; // thousands separator for this language
	maskTitle: string; // over the mask drawing
	fixedLabel: string; // under the 255 parts, the fixed part of the address
	freeLabel: string; // under the 0 part, the windows inside the room
	sameLabel: string; // between 255.255.255.0 and /24
}
