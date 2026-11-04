import type { LessonText } from '../../types';
import type { GuideStepText } from '$lib/components/stages/netguide/types';

export type LanWanLevel = 'lan' | 'wan' | 'net';

export interface LanWanText extends LessonText {
	/** The side panel, one step per beat (same length as intro). */
	steps: GuideStepText[];
	/** Short names of the three zoom levels, used on the zoom buttons and the map tags. */
	levels: Record<LanWanLevel, string>;
	zoomLabel: string; // heading over the zoom buttons on the last beat
	switchLabel: string; // the box in the middle of the room
	hqLabel: string; // the head office, which holds the room
	branchLabel: string; // template with {n}
	/** The networks of the world level, in order. The first one is your own company. */
	nets: string[];
}
