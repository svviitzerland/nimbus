import type { LessonText } from '../../types';
import type { GuideStepText } from '$lib/components/stages/netguide/types';

export interface IpAddressText extends LessonText {
	/** The side panel, one step per beat (same length as intro). */
	steps: GuideStepText[];
	internetLabel: string; // under the cloud
	neighbourLabel: string; // the small house next door
	/** The addresses, kept the same in every language so the copy can quote them. */
	ips: { phone: string; laptop: string; routerIn: string; routerOut: string };
	streetTag: string; // under the plaque on the roof, "house number"
	roomTag: string; // over the room chips, "room numbers"
	sendLabel: string; // heading over the two send buttons
	lostTag: string; // where a letter to a private address gives up
	hitTag: string; // on the laptop once the letter arrives
}
