import type { LessonText } from '../../types';

export type DevicePart = 'modem' | 'router' | 'switch' | 'ap';

export interface DevicesText extends LessonText {
	/** Each box, its short name and a few words on its job. */
	parts: Record<DevicePart, { name: string; job: string }>;
	trayLabel: string; // heading over the boxes still on the shelf
	internetLabel: string; // the provider's line at the top
	pcLabel: string; // template with {n}
	phoneLabel: string;
	status: { online: string; local: string; offline: string };
	pickHint: string; // nothing picked yet
	placeHint: string; // template with {name}, a box is picked
	builtNote: string; // everything is in place
	brokenNote: string; // template with {name}, a box was pulled out
}
