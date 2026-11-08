import type { LessonText } from '../../types';

export interface SubnetText extends LessonText {
	/** The three planning tasks, in order. They ask for 50, 12, and 200 devices per room. */
	missions: string[];
	missionLabel: string; // template with {n} and {total}
	allDone: string; // shown once every plan is done
	checkBtn: string; // locks in the current /number for the plan
	smaller: string; // accessible label for the minus button
	bigger: string; // accessible label for the plus button
	status: {
		ok: string;
		small: string; // template with {need} and {fit}
		waste: string;
	};
	roomsLabel: string;
	sizeLabel: string; // addresses per room
	usableLabel: string; // devices per room
	locked: string; // template with {n}, bits locked as the room name
	free: string; // template with {n}, bits free for devices
	maskLabel: string;
	hallLabel: string; // caption over the 256 address grid
	tapHint: string;
	roomTitle: string; // template with {n} and {total}
	rangeLabel: string;
	range: string; // template with {a} and {b}
	nameLabel: string; // the network address
	shoutLabel: string; // the broadcast address
	devicesLabel: string; // the usable range
	legendUse: string;
	legendRes: string;
}
