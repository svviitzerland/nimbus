import type { LessonText } from '../../types';
import type { GuideStepText } from '$lib/components/stages/netguide/types';

export interface WifiText extends LessonText {
	/** The side panel, one step per beat (same length as intro). */
	steps: GuideStepText[];
	routerLabel: string;
	neighbourLabel: string; // the neighbour's router, shown with the channels
	/** Room names on the plan, in order: living room, kitchen, study, bedroom, garden. */
	rooms: string[];
	bands: { b24: string; b5: string }; // names in the signal meter
	noSignal: string; // shown in the meter when a band is gone
	laneLabel: string; // heading over the channel lanes
	clashTag: string; // two routers in one lane
	clearTag: string; // your router in its own lane
	toInternet: string; // the cable leaving the house
	tapHint: string; // shown over the picture on the last beat
}
