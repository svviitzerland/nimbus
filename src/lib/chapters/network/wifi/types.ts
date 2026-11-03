import type { LessonText } from '../../types';

export interface WifiText extends LessonText {
	routerLabel: string;
	phoneLabel: string;
	neighbourLabel: string; // template with {n}, the neighbour's router and its channel
	/** Room names on the house plan, in order: living room, kitchen, bedroom, study, garden. */
	rooms: string[];
	bandLabel: string; // heading over the band toggle
	bands: { b24: { name: string; sub: string }; b5: { name: string; sub: string } };
	channelLabel: string; // heading over the channel picker
	channel5Note: string; // shown instead of the picker on 5 GHz
	dragHint: string; // how to move the phone
	noSignal: string;
	walls: { none: string; one: string; many: string }; // many is a template with {n}
	/** Three small goals shown as a checklist, in order: lose 5 GHz, save it with 2.4, clash. */
	goals: string[];
}
