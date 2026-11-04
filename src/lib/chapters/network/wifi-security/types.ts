import type { LessonText } from '../../types';

/** One part of the picture, explained in the side panel. */
export type GuideStep = { title: string; body: string; tag?: string };

export interface WifiSecurityText extends LessonText {
	/** Side panel, one entry per part of the story (seven). */
	steps: GuideStep[];
	homeLabel: string; // over the house
	routerLabel: string; // under the router
	laptopLabel: string;
	tvLabel: string;
	guestLabel: string; // the guest network room
	snooperLabel: string; // the stranger outside
	modes: { open: string; wpa2: string; wpa3: string };
	saferLabel: string; // arrow over the Open, WPA2, WPA3 scale
	pickLabel: string; // aria label of the optional picker
	/** Two short lines on the stranger's screen for each situation. */
	snoop: {
		idle: string[];
		listen: string[];
		open: string[];
		wpa2: string[];
		wpa3: string[];
	};
}
